import { Customer } from "../models/customer/customer.models.js";
import { ApiError } from "../utility/ApiError";
import { asyncHandler } from "../utility/asyncHandler";
import jwt from "jsonwebtoken";


export const verifyJwt = asyncHandler(async(req, _, next) =>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Access token is missing or invalid");
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const customer = await Customer.findById(decodedToken._id).select("-otp -refreshToken");
        if (!customer) {
            throw new ApiError(401, "Invalid Access Token");
        }
    
        req.customer = customer;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});