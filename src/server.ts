import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { logger } from "./utils/logger";

const startServer = async () => {
    await connectDB(env.MONGO_URI);

    app.listen(env.PORT, () => {
        logger.info(`Server running on port ${env.PORT}`);
    });
};

startServer();