import jwt from "jsonwebtoken";

import { User } from "../../models/user.model";
import { RegisterDTO, LoginDTO } from "./auth.dto";

export const registerUser = async (data: RegisterDTO) => {
    const { name, email, password } = data;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const user = await User.create({
        name,
        email,
        password
    });
    return {
        id: user._id,
        name: user.name,
        email: user.email
    };
};
export const loginUser = async (data: LoginDTO) => {
    const { email, password } = data;
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Invalid credentials");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
    );
    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    };
};