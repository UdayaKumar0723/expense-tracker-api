import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

// TypeScript interface
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    comparePassword(password: string): Promise<boolean>;
}

// Schema
const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            minLength: 5,
            required: true
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (this: IUser) {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (
    password: string
) {
    return bcrypt.compare(password, this.password);
};

// Model
export const User = mongoose.model<IUser>("User", userSchema);