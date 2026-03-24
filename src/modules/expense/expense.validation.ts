import { z } from "zod";

export const createExpenseSchema = z.object({
    amount: z.number().positive("Amount must be > 0"),
    category: z.string().min(2),
    note: z.string().optional(),
    date: z.string()
});