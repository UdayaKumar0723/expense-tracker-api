import Redis from "ioredis";
import { logger } from "../utils/logger";

export const redis = new Redis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: 3,
    reconnectOnError: () => true
});

redis.on("connect", () => logger.info("✅ Redis Connected"));
redis.on("error", (err) => logger.error("❌ Redis Error:", err));