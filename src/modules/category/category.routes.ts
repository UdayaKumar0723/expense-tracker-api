import express from "express";
import {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
} from "./category.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

router.post("/categories", authMiddleware, createCategory);
router.get("/categories", authMiddleware, getCategories);
router.patch("/categories/:id", authMiddleware, updateCategory);
router.delete("/categories/:id", authMiddleware, deleteCategory);

export default router;