import auth from "./auth.swagger.json";
import expense from "./expense.swagger.json";
import budget from "./budget.swagger.json";

export const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "Expense Tracker API",
        version: "1.0.0",
        description: "Production-ready API documentation"
    },
    servers: [
        {
            url: "https://expense-tracker-api-7ntp.onrender.com",
            description: "Production server"
        },
        {
            url: "http://localhost:3000",
            description: "Local server"
        }
    ],

    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        },

        // 🔥 COMMON SCHEMAS (VERY IMPORTANT)
        schemas: {
            Expense: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    amount: { type: "number" },
                    category: { type: "string" },
                    note: { type: "string" },
                    date: { type: "string" }
                }
            },

            Budget: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    amount: { type: "number" },
                    month: { type: "number" },
                    year: { type: "number" }
                }
            },

            User: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    email: { type: "string" }
                }
            },
            Analytics: {
                type: "object",
                properties: {
                    totalSpent: { type: "number" },
                    categoryBreakdown: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                category: { type: "string" },
                                total: { type: "number" }
                            }
                        }
                    },
                    topCategory: { type: "string" },
                    averageExpense: { type: "number" }
                }
            }
        }
    },

    paths: {
        ...auth.paths,
        ...expense.paths,
        ...budget.paths
    }
};