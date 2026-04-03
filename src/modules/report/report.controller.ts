import { Request, Response } from "express";
import * as reportService from "./report.service";
import { successResponse } from "../../utils/response";

export const sendReport = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { email, month, year } = req.body;
        if (!email || !month || !year) {
            return res.status(400).json({
                success: false,
                message: "email, month and year are required"
            });
        }
        const result = await reportService.sendMonthlyReport(
            userId,
            email,
            month,
            year
        );
        res.json(successResponse(result, "Email sent successfully"));
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};