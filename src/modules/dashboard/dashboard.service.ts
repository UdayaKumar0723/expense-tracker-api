import mongoose from "mongoose";

import { Expense } from "../../models/expense.model";
import { Budget } from "../../models/budget.model";
import { redis } from "../../config/redis";

export const getDashboardData = async (
    userId: string,
    month: number,
    year: number
) => {
    const cacheKey = `dashboard:${userId}:${month}:${year}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    }
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    // Total + Category Breakdown
    const analytics = await Expense.aggregate([
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
    const totalSpent = analytics.reduce((sum, i) => sum + i.total, 0);
    const topCategories = analytics
        .sort((a, b) => b.total - a.total)
        .slice(0, 3)
        .map((i) => ({
            category: i._id,
            total: i.total
        }));
    // Budget
    const budget = await Budget.findOne({
        userId,
        month,
        year
    });
    const budgetAmount = budget?.amount || null;
    let remaining = null;
    if (budgetAmount !== null) {
        remaining = budgetAmount - totalSpent;
    }
    // Recent Expenses
    const recentExpenses = await Expense.find({
        userId,
        date: { $gte: startDate, $lte: endDate }
    })
        .populate("categoryId", "name")
        .sort({ date: -1 })
        .limit(5);
    // Insights
    let insight = "Good spending 👍";
    if (budgetAmount === null) {
        insight = "No budget set";
    } else if (totalSpent > budgetAmount) {
        insight = "⚠️ Budget exceeded!";
    } else if (totalSpent > budgetAmount * 0.8) {
        insight = "⚠️ Near budget limit";
    }
    const result = {
        totalSpent,
        budget: budgetAmount,
        remaining,
        topCategories,
        recentExpenses,
        insight
    };
    await redis.set(cacheKey, JSON.stringify(result), "EX", 300);
    return result;
};