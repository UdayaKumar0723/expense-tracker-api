import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";

import authRoutes from "./modules/auth/auth.routes";
import expenseRoutes from "./modules/expense/expense.routes";
import budgetRoutes from "./modules/budget/budget.routes";

import { errorHandler } from "./middlewares/error.middleware";
import { swaggerDocument } from "./docs";

const app = express();

// security
app.use(helmet());
app.use(cors());

app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100
    })
);

// body parser
app.use(express.json());

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api", authRoutes);
app.use("/api", expenseRoutes);
app.use("/api", budgetRoutes);

// error handler (last)
app.use(errorHandler);

export default app;