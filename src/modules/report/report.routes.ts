import express from "express";

import { sendReport } from "./report.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

router.post("/reports/email", authMiddleware, sendReport);

export default router;