export type SetBudgetDTO = {
    amount: number;
    month: number;
    year: number;
};

export type GetBudgetQuery = {
    month: string;
    year: string;
};