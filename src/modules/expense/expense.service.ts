import mongoose from "mongoose";
import { Parser } from "json2csv";

import { Expense } from "../../models/expense.model";
import { Budget } from "../../models/budget.model";
import { Category } from "../../models/category.model";
import { redis } from "../../config/redis";

export const createExpense = async (
    userId: string,
    data: any
) => {
    const { amount, categoryId, note, date } = data;
    const expenseDate = new Date(date);
    const category = await Category.findOne({
        _id: categoryId,
        userId
    });
    if (!category) {
        throw new Error("Invalid category");
    }
    const expense = await Expense.create({
        userId,
        amount,
        categoryId,
        note,
        date: expenseDate
    });
    const month = expenseDate.getMonth() + 1;
    const year = expenseDate.getFullYear();
    const budget = await Budget.findOne({
        userId,
        month,
        year
    });

    let warning = null;

    if (budget) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const result = await Expense.aggregate([
            {
                $match: {
                    userId: expense.userId,
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);

        const totalSpent = result[0]?.total || 0;
        if (totalSpent > budget.amount) {
            warning = "Budget exceeded";
        }
    }
    /* CACHE INVALIDATION */
    await redis.del(`dashboard:${userId}:${month}:${year}`);
    await redis.del(`analytics:${userId}:${month}:${year}`);
    await redis.del(`summary:${userId}:${month}:${year}`);

    const keys = await redis.keys(`expenses:${userId}:*`);
    if (keys.length) await redis.del(keys);

    return {
        expense,
        warning
    };
};
export const getExpenses = async (
    userId: string,
    query: any
) => {
    const { page = 1, limit = 10, month, year } = query;
    const cacheKey = `expenses:${userId}:${page}:${limit}:${month || "all"}:${year || "all"}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
        return JSON.parse(cached);
    }
    const filter: any = {
        userId: new mongoose.Types.ObjectId(userId)
    };

    if (month && year) {
        const startDate = new Date(Number(year), Number(month) - 1, 1);
        const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);

        filter.date = { $gte: startDate, $lte: endDate };
    }
    const skip = (Number(page) - 1) * Number(limit);
    const expenses = await Expense.find(filter)
        .populate("categoryId", "name")
        .sort({ date: -1 })
        .skip(skip)
        .limit(Number(limit));
    const total = await Expense.countDocuments(filter);
    const result = {
        total,
        page: Number(page),
        limit: Number(limit),
        data: expenses
    };
    await redis.set(cacheKey, JSON.stringify(result), "EX", 300);
    return result;
};
export const getExpenseSummary = async (
    userId: string,
    month: number,
    year: number
) => {
    const cacheKey = `summary:${userId}:${month}:${year}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
        return JSON.parse(cached);
    }
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    const result = await Expense.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "category"
            }
        },
        { $unwind: "$category" },
        {
            $group: {
                _id: "$category.name",
                total: { $sum: "$amount" }
            }
        }
    ]);
    let total = 0;
    const byCategory: Record<string, number> = {};
    result.forEach((item: any) => {
        byCategory[item._id] = item.total;
        total += item.total;
    });

    const finalResult = { total, byCategory };

    await redis.set(cacheKey, JSON.stringify(finalResult), "EX", 300);

    return finalResult;
};
export const updateExpense = async (
    userId: string,
    id: string,
    data: any
) => {
    const { categoryId } = data;
    if (categoryId) {
        const category = await Category.findOne({
            _id: categoryId,
            userId
        });

        if (!category) {
            throw new Error("Invalid category");
        }
    }
    const expense = await Expense.findOneAndUpdate(
        { _id: id, userId },
        data,
        { new: true }
    ).populate("categoryId", "name");
    if (!expense) {
        throw new Error("Expense not found");
    }
    const expenseDate = expense.date;
    const month = new Date(expenseDate).getMonth() + 1;
    const year = new Date(expenseDate).getFullYear();

    /* CACHE INVALIDATION */
    await redis.del(`dashboard:${userId}:${month}:${year}`);
    await redis.del(`analytics:${userId}:${month}:${year}`);
    await redis.del(`summary:${userId}:${month}:${year}`);

    const keys = await redis.keys(`expenses:${userId}:*`);
    if (keys.length) await redis.del(keys);

    return expense;
};
export const deleteExpense = async (
    userId: string,
    expenseId: string
) => {
    const expense = await Expense.findOneAndDelete({
        _id: expenseId,
        userId
    });
    if (!expense) throw new Error("Expense not found");

    const expenseDate = expense.date;
    const month = new Date(expenseDate).getMonth() + 1;
    const year = new Date(expenseDate).getFullYear();

    /* CACHE INVALIDATION */
    await redis.del(`dashboard:${userId}:${month}:${year}`);
    await redis.del(`analytics:${userId}:${month}:${year}`);
    await redis.del(`summary:${userId}:${month}:${year}`);

    const keys = await redis.keys(`expenses:${userId}:*`);
    if (keys.length) await redis.del(keys);

    return expense;
};

export const getAnalytics = async (
    userId: string,
    month: number,
    year: number
) => {
    const cacheKey = `analytics:${userId}:${month}:${year}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
        return JSON.parse(cached);
    }
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    const result = await Expense.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "category"
            }
        },
        { $unwind: "$category" },
        {
            $group: {
                _id: "$category.name",
                total: { $sum: "$amount" },
                count: { $sum: 1 }
            }
        }
    ]);
    const totalSpent = result.reduce((acc, item) => acc + item.total, 0);
    const topCategory =
        result.sort((a, b) => b.total - a.total)[0]?._id || null;

    const totalCount = result.reduce((acc, item) => acc + item.count, 0);
    const finalResult = {
        totalSpent,
        categoryBreakdown: result.map((r) => ({
            category: r._id,
            total: r.total
        })),
        topCategory,
        averageExpense: totalCount
            ? totalSpent / totalCount
            : 0
    };
    await redis.set(cacheKey, JSON.stringify(finalResult), "EX", 300);
    return finalResult;
};
export const exportExpenses = async (
    userId: string,
    query: any
) => {
    const { month, year } = query;
    const filter: any = { userId };
    if (month && year) {
        const startDate = new Date(Number(year), Number(month) - 1, 1);
        const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);
        filter.date = { $gte: startDate, $lte: endDate };
    }
    const expenses = await Expense.find(filter)
        .populate("categoryId", "name")
        .sort({ date: -1 });

    const formatted = expenses.map((exp: any) => ({
        amount: exp.amount,
        category: exp.categoryId?.name,
        note: exp.note,
        date: exp.date
    }));
    const parser = new Parser({
        fields: ["amount", "category", "note", "date"]
    });
    return parser.parse(formatted);
};