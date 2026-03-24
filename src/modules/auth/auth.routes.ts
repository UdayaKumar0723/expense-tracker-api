import express from "express";
import { register, login } from "./auth.controller";
import { validate } from "../../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "./auth.validation";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

router.post("/auth/register", validate(registerSchema), register);
router.post("/auth/login", validate(loginSchema), login);

router.get("/auth/me", authMiddleware, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

export default router;