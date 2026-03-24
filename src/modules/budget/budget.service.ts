import { Budget } from "../../models/budget.model";

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

    return budget;
};

export const getBudget = async (
    userId: string,
    month: number,
    year: number
) => {
    const budget = await Budget.findOne({
        userId,
        month,
        year
    });

    return budget;
};