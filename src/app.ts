import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");
import authRoutes from "./modules/auth/auth.routes";
import expenseRoutes from "./modules/expense/expense.routes";
import budgetRoutes from "./modules/budget/budget.routes";

import { errorHandler } from "./middlewares/error.middleware";
import { swaggerDocument } from "./docs";
import categoryRoutes from "./modules/category/category.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import reportRoutes from "./modules/report/report.routes";
import { apiLimiter, authLimiter } from "./middlewares/rateLimit";
import { requestLogger } from "./middlewares/logger.middleware";

const app = express();

// security
app.use(helmet());
app.use(cors());

// body parser
app.use(express.json());

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// logging
app.use(requestLogger);

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

app.use("/api", apiLimiter);

// Routes
app.use("/api", authRoutes);
app.use("/api", expenseRoutes);
app.use("/api", budgetRoutes);
app.use("/api", categoryRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", reportRoutes);

app.use(errorHandler);

export default app;