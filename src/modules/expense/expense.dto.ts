export type CreateExpenseDTO = {
    amount: number;
    category: string;
    note?: string;
    date: string; // coming as string from request
};
export type GetExpensesQuery = {
    category?: string;
    startDate?: string;
    endDate?: string;
};