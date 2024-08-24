import {asyncHandler} from "../utility/asynchandler.js";
import {ApiError} from "../utility/ApiError.js";
import { Category } from "../models/category.models.js";
import { ApiResponse } from "../utility/ApiResponce.js";
import { User } from "../models/user.models.js";

export const addCategory = asyncHandler(async(req, res) =>{
    const { categoryName } = req.body;
    if (!categoryName) {
        throw new ApiError(400, " Category of Product is required");
    }
    const userId = req.user?._id; 
    const user = User.findById(userId);
    if (!user) {
        throw new ApiError(400, "invalid admin");
    }

    const exitedCategory =await Category.findOne({categoryName});
    if (exitedCategory) {
        throw new ApiError(400, "Category already exists");
    }
    const category = Category.create({
        categoryName,
        user: userId,
    })
    // await category.save();

    return res.status(200).json(new ApiResponse(201, category, "Category added succefully"));
});