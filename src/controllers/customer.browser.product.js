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
        if (query) filter.title = new RegExp(query, 'i');
    
    
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
        const { query, category, priceFrom, priceTo, isInStock, sortBy = 'createdAt', sortType = 'desc' } = req.query;

        // Initialize filters
        const filter = [];

        // Text-based search on product name and description
        if (query) {
            filter.push({
                $search: {
                    index: 'default', // Assuming a default text index is used
                    text: {
                        query: query,
                        path: ['name', 'description'],
                    },
                },
            });
        }

        // Filter by category
        if (category) {
            filter.push({ $match: { category } });
        }

        // Filter by price range
        if (priceFrom || priceTo) {
            filter.push({
                $match: {
                    price: {
                        ...(priceFrom && { $gte: Number(priceFrom) }),
                        ...(priceTo && { $lte: Number(priceTo) }),
                    },
                },
            });
        }

        // Filter by stock status
        if (isInStock !== undefined) {
            filter.push({
                $match: {
                    stock: isInStock === 'true' ? { $gt: 0 } : { $eq: 0 },
                },
            });
        }

        // Sorting
        filter.push({
            $sort: { [sortBy]: sortType === 'asc' ? 1 : -1 },
        });

        // Project the fields to include in the response
        filter.push({
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                price: 1,
                category: 1,
                stock: 1,
                createdAt: 1,
            },
        });

        // Execute the aggregation pipeline
        const products = await Product.aggregate(filter);

        // Return the total count of products found and the products themselves
        const total = products.length;

        res.status(200).json(new ApiResponse(200, products, { total }, "Search results for products"));
    } catch (error) {
        throw new ApiError(500, "Internal Error");
    }
});
