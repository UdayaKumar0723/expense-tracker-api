import mongoose from "mongoose";
import { logger } from "../utils/logger";

export const connectDB = async (uri: string) => {
    try {
        await mongoose.connect(uri);
        logger.info("✅ MongoDB connected");
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error(`❌ MongoDB connection failed: ${error.message}`);
        } else {
            logger.error("❌ MongoDB connection failed: Unknown error");
        }
        process.exit(1); // exit app
    }
};