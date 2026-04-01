import { Request, Response } from "express";
import * as categoryService from "./category.service";
import { successResponse } from "../../utils/response";

export const createCategory = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { name } = req.body;
        const category = await categoryService.createCategory(userId, name);
        res.status(201).json(
            successResponse(category, "Category created successfully")
        );
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};
export const getCategories = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;
        const categories = await categoryService.getCategories(userId);
        res.json(successResponse(categories, "Categories fetched"));
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};
export const updateCategory = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params;
        const { name } = req.body;
        const category = await categoryService.updateCategory(userId, id, name);
        res.json(successResponse(category, "Category updated"));
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};
export const deleteCategory = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params;
        await categoryService.deleteCategory(userId, id);
        res.json(successResponse(null, "Category deleted"));
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};