import { Request, Response } from "express";
import * as dashboardService from "./dashboard.service";
import { successResponse } from "../../utils/response";

export const getDashboard = async (req: Request, res: Response) => {
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
        const data = await dashboardService.getDashboardData(
            userId,
            month,
            year
        );
        res.json(successResponse(data, "Dashboard fetched successfully"));
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};