import express from "express";
import { getDashboard } from "./dashboard.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

router.get("/dashboard", authMiddleware, getDashboard);

export default router;