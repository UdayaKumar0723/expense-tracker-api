import mongoose, { Schema, Document } from "mongoose";

export interface IBudget extends Document {
    userId: mongoose.Types.ObjectId;
    month: number;
    year: number;
    amount: number;
}

const budgetSchema = new Schema<IBudget>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        month: {
            type: Number,
            required: true
        },
        year: {
            type: Number,
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

export const Budget = mongoose.model<IBudget>(
    "Budget",
    budgetSchema
);