import jwt from "jsonwebtoken";

import { User } from "../../models/user.model";
import { RegisterDTO } from "./auth.dto";
import { LoginDTO } from "./auth.dto";

export const registerUser = async (data: RegisterDTO) => {
    const { name, email, password } = data;

    // check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("User already exists");
    }

    // create user (password auto hashed)
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

    // find user
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid credentials");
    }

    // compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    // generate token
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