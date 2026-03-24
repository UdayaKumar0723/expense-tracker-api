import { Request, Response } from "express";
import * as authService from "./auth.service";
import { RegisterDTO, LoginDTO } from "./auth.dto";
import { successResponse } from "../../utils/response";

export const register = async (
    req: Request<{}, {}, RegisterDTO>,
    res: Response
) => {
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json(
            successResponse(user, "User registered successfully")
        );
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const login = async (
    req: Request<{}, {}, LoginDTO>,
    res: Response
) => {
    try {
        const result = await authService.loginUser(req.body);
        res.json(
            successResponse(result, "Login successful")
        );
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};