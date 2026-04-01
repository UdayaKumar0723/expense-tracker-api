export type CreateExpenseDTO = {
    amount: number;
    categoryId: string;
    note?: string;
    date: string;
};
export type GetExpensesQuery = {
    categoryId?: string;
    startDate?: string;
    endDate?: string;
};