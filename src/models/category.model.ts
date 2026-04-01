import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    createdAt: Date;
}

const categorySchema = new Schema<ICategory>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        }
    },
    { timestamps: true }
);

// Prevent duplicate categories per user
categorySchema.index({ userId: 1, name: 1 }, { unique: true });

export const Category = mongoose.model<ICategory>(
    "Category",
    categorySchema
);