import { asyncHandler } from "../utility/asyncHandler.js";  
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponce.js";    
import { Customer } from "../models/customer/customer.models.js";
import { Product } from "../models/product.models.js";
import mongoose, { isValidObjectId } from "mongoose";


export const getAllProduct = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 10, query, sortBy = 'createdAt', sortType = 'desc' } = req.query;
    
        const filter = {};
        if (query) filter.name = new RegExp(query, 'i');
    
    
        const products = await Product.find(filter) 
            .sort({ [sortBy]: sortType === 'desc' ? -1 : 1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const total = await Product.countDocuments(filter);

        res.status(200).json(new ApiResponse(200, products, { total, page, limit }, "All products available"));
        
    } catch (error) {
        throw new ApiError(500, "internal Error");
    }  
});

export const searchProducts = asyncHandler(async (req, res) => {
    try {
        const { query } = req.body;

        const pipeline = [
            {
                $match: {
                    $or: [
                        { name: { $regex: query, $options: 'i' } },
                        { description: { $regex: query, $options: 'i' } }
                    ]
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    price: 1,
                    productImage:1,
                    category: 1,
                    stock: 1,
                }
            }
        ];

        const filterData = await Product.aggregate(pipeline);

        if (filterData.length === 0) {
            throw new ApiError(400, "Data not found");
        }

        res.status(200).json(new ApiResponse(200, filterData, "Successfully retrieved products"));
    } catch (error) {
        throw new ApiError(500, "Internal Error");
    }
});