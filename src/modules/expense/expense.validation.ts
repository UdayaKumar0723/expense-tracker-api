import { z } from "zod";

export const createExpenseSchema = z.object({
    amount: z.number().describe("Amount is required"),
    categoryId: z.string().describe("CategoryId is required"),
    note: z.string().optional(),
    date: z.string().describe("Date is required")
});