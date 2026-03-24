import { Request, Response } from "express";
import * as budgetService from "./budget.service";
import { SetBudgetDTO } from "./budget.dto";
import { successResponse } from "../../utils/response";

export const setBudget = async (
    req: Request<{}, {}, SetBudgetDTO>,
    res: Response
) => {
    try {
        const userId = req.user!.userId;
        const budget = await budgetService.setBudget(
            userId,
            req.body
        );
        res.json(
            successResponse(budget, "Budget set successfully")
        );
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getBudget = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { month, year } = req.query;
        if (!month || !year) {
            return res.status(400).json({
                success: false,
                message: "month and year are required"
            });
        }
        const budget = await budgetService.getBudget(
            userId,
            Number(month),
            Number(year)
        );
        res.json(
            successResponse(budget, "Budget fetched successfully")
        );
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};