import { Budget } from "../../models/budget.model";
import { redis } from "../../config/redis";

export const setBudget = async (
    userId: string,
    data: { amount: number; month: number; year: number }
) => {
    const { amount, month, year } = data;

    const budget = await Budget.findOneAndUpdate(
        { userId, month, year },
        { amount },
        { new: true, upsert: true }
    );
    /* CACHE INVALIDATION */
    await redis.del(`budget:${userId}:${month}:${year}`);
    await redis.del(`dashboard:${userId}:${month}:${year}`);
    await redis.del(`analytics:${userId}:${month}:${year}`);
    await redis.del(`summary:${userId}:${month}:${year}`);

    return budget;
};

export const getBudget = async (
    userId: string,
    month: number,
    year: number
) => {
    const cacheKey = `budget:${userId}:${month}:${year}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
        return JSON.parse(cached);
    }
    const budget = await Budget.findOne({
        userId,
        month,
        year
    });
    // CACHE (5 mins)
    await redis.set(cacheKey, JSON.stringify(budget), "EX", 300);

    return budget;
};