import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { setBudgetSchema } from "./budget.validation";
import { setBudget, getBudget } from "./budget.controller";

const router = express.Router();

router.post(
    "/budget",
    authMiddleware,
    validate(setBudgetSchema),
    setBudget
);

router.get(
    "/budget",
    authMiddleware,
    getBudget
);

export default router;