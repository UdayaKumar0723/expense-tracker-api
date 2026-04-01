import { Category } from "../../models/category.model";

export const createCategory = async (userId: string, name: string) => {
    return await Category.create({ userId, name });
};

export const getCategories = async (userId: string) => {
    return await Category.find({ userId });
};

export const updateCategory = async (
    userId: string,
    id: string,
    name: string
) => {
    return await Category.findOneAndUpdate(
        { _id: id, userId },
        { name },
        { new: true }
    );
};

export const deleteCategory = async (userId: string, id: string) => {
    return await Category.findOneAndDelete({ _id: id, userId });
};