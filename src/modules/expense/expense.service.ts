import mongoose from "mongoose";

import { Expense } from "../../models/expense.model";
import { Budget } from "../../models/budget.model";
import { Category } from "../../models/category.model";

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
                    date: {
                        $gte: startDate,
                        $lte: endDate
                    }
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
    const filter: any = {
        userId: new mongoose.Types.ObjectId(userId)
    };
    // Filter by month & year
    if (month && year) {
        const startDate = new Date(Number(year), Number(month) - 1, 1);
        const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);
        filter.date = {
            $gte: startDate,
            $lte: endDate
        };
    }
    const skip = (Number(page) - 1) * Number(limit);
    // Fetch expenses
    const expenses = await Expense.find(filter)
        .populate("categoryId", "name")
        .sort({ date: -1 })
        .skip(skip)
        .limit(Number(limit));
    // Total count (for pagination)
    const total = await Expense.countDocuments(filter);
    return {
        total,
        page: Number(page),
        limit: Number(limit),
        data: expenses
    };
};
export const getExpenseSummary = async (
    userId: string,
    month: number,
    year: number
) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    const result = await Expense.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
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

    return { total, byCategory };
};
export const updateExpense = async (
    userId: string,
    id: string,
    data: any
) => {
    const { categoryId } = data;
    // Validate category if provided
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
    return expense;
};

export const getAnalytics = async (
    userId: string,
    month: number,
    year: number
) => {
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
    return {
        totalSpent,
        categoryBreakdown: result.map((r) => ({
            category: r._id,
            total: r.total
        })),
        topCategory,
        averageExpense: totalCount ? totalSpent / totalCount : 0
    };
};
