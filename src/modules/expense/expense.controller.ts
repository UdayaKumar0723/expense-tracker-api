import { Request, Response } from "express";
import * as expenseService from "./expense.service";
import { GetExpensesQuery } from "./expense.dto";
import { successResponse } from "../../utils/response";

export const createExpense = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user!.userId;
        const result = await expenseService.createExpense(
            userId,
            req.body
        );
        res.status(201).json(
            successResponse(
                {
                    expense: result.expense,
                    warning: result.warning || null
                },
                "Expense created successfully"
            )
        );
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getExpenses = async (
    req: Request<{}, {}, {}, GetExpensesQuery>,
    res: Response
) => {
    try {
        const userId = req.user!.userId;
        const expenses = await expenseService.getExpenses(
            userId,
            req.query
        );
        res.json(
            successResponse(expenses, "Expenses fetched successfully")
        );
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getSummary = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;
        const month = Number(req.query.month);
        const year = Number(req.query.year);
        if (!month || !year) {
            return res.status(400).json({
                success: false,
                message: "month and year are required"
            });
        }
        const summary = await expenseService.getExpenseSummary(
            userId,
            month,
            year
        );
        res.json(
            successResponse(summary, "Summary fetched successfully")
        );
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
export const updateExpense = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params;
        const expense = await expenseService.updateExpense(
            userId,
            id,
            req.body
        );
        res.json(
            successResponse(expense, "Expense updated successfully")
        );
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
export const deleteExpense = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params;
        await expenseService.deleteExpense(userId, id);
        res.json(
            successResponse(null, "Expense deleted successfully")
        );
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getAnalytics = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;
        const month = Number(req.query.month);
        const year = Number(req.query.year);
        if (!month || !year) {
            return res.status(400).json({
                success: false,
                message: "month and year are required"
            });
        }
        const data = await expenseService.getAnalytics(
            userId,
            month,
            year
        );
        res.json(
            successResponse(data, "Analytics fetched successfully")
        );
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
export const exportExpenses = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;
        const csv = await expenseService.exportExpenses(
            userId,
            req.query
        );
        res.header("Content-Type", "text/csv");
        res.attachment("expenses.csv");
        return res.send(csv);
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};