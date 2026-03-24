import mongoose from "mongoose";

import { Expense } from "../../models/expense.model";
import { Budget } from "../../models/budget.model";

export const createExpense = async (
    userId: string,
    data: any
) => {
    const { amount, category, note, date } = data;

    const expenseDate = new Date(date);

    // ✅ create expense
    const expense = await Expense.create({
        userId,
        amount,
        category,
        note,
        date: expenseDate
    });

    // ✅ get month & year
    const month = expenseDate.getMonth() + 1;
    const year = expenseDate.getFullYear();

    // ✅ find budget
    const budget = await Budget.findOne({
        userId,
        month,
        year
    });

    let warning = null;

    if (budget) {
        // ✅ calculate total spent in that month
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

        // 🚨 compare
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
    const { category, startDate, endDate, page = 1, limit = 10 } = query;

    const filter: any = { userId };

    if (category) filter.category = category;

    if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [expenses, total] = await Promise.all([
        Expense.find(filter)
            .sort({ date: -1 })
            .skip(skip)
            .limit(Number(limit)),
        Expense.countDocuments(filter)
    ]);

    return {
        data: expenses,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit)
        }
    };
};
export const getExpenseSummary = async (
    userId: string,
    month: number,
    year: number
) => {
    // start and end date of month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const result = await mongoose.model("Expense").aggregate([
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
            $group: {
                _id: "$category",
                total: { $sum: "$amount" }
            }
        }
    ]);

    // transform result
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
    expenseId: string,
    data: any
) => {
    const expense = await Expense.findOneAndUpdate(
        { _id: expenseId, userId },
        data,
        { new: true }
    );

    if (!expense) throw new Error("Expense not found");

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
            $group: {
                _id: "$category",
                total: { $sum: "$amount" },
                count: { $sum: 1 }
            }
        }
    ]);

    // total spent
    const totalSpent = result.reduce((acc, item) => acc + item.total, 0);

    // top category
    const topCategory =
        result.sort((a, b) => b.total - a.total)[0]?._id || null;

    return {
        totalSpent,
        categoryBreakdown: result.map((r) => ({
            category: r._id,
            total: r.total
        })),
        topCategory,
        averageExpense: result.length
            ? totalSpent / result.reduce((a, b) => a + b.count, 0)
            : 0
    };
};
