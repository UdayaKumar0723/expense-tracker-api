export type CreateExpenseDTO = {
    amount: number;
    category: string;
    note?: string;
    date: string;
};
export type GetExpensesQuery = {
    category?: string;
    startDate?: string;
    endDate?: string;
};