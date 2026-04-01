import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
    userId: mongoose.Types.ObjectId;
    amount: number;
    categoryId: mongoose.Types.ObjectId;
    note?: string;
    date: Date;
}

const expenseSchema = new Schema<IExpense>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        note: {
            type: String
        },
        date: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Expense = mongoose.model<IExpense>(
    "Expense",
    expenseSchema
);