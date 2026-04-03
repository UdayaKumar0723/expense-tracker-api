import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100,
    message: {
        success: false,
        message: "Too many requests, please try again later"
    },
    standardHeaders: true,
    legacyHeaders: false
});

// AUTH LIMIT (STRICT)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // prevent brute force
    message: {
        success: false,
        message: "Too many login attempts, try again later"
    }
});