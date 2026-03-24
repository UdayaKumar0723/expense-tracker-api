import { z } from "zod";

export const setBudgetSchema = z.object({
    amount: z.number().positive(),
    month: z.number().min(1).max(12),
    year: z.number().min(2000)
});