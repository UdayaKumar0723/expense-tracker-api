import express from "express";
import { createExpense, getExpenses, getSummary, updateExpense, deleteExpense, getAnalytics } from "./expense.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createExpenseSchema } from "./expense.validation";

const router = express.Router();

router.post(
    "/expenses",
    authMiddleware,
    validate(createExpenseSchema),
    createExpense
);

router.get(
    "/expenses",
    authMiddleware,
    getExpenses
);

router.get(
    "/expenses/summary",
    authMiddleware,
    getSummary
);

router.get(
    "/expenses/analytics",
    authMiddleware,
    getAnalytics
);

router.patch("/expenses/:id", authMiddleware, updateExpense);
router.delete("/expenses/:id", authMiddleware, deleteExpense);

export default router;