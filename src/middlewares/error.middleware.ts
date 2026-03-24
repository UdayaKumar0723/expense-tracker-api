import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { errorResponse } from "../utils/response";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error(err.message);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json(
        errorResponse(err.message || "Internal Server Error")
    );
};