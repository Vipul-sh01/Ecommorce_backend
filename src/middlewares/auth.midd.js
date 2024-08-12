import { User } from "../models/user.models";
import { ApiError } from "../utility/ApiError";
import { asyncHandler } from "../utility/asyncHandler";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async(req, _, next) =>{
    try {
        const token = req.cookie?.accessToken || req.header("Authorization")?.replace("Bearer ", " ");
    
        if (!token) {
            throw new ApiError(401, "Unauthorised requast");
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = User.findById(decodedToken?._id).select("-password -refreshToken");
    
        if (!user) {
            throw new ApiError(401, "Invalid Acceses Token");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(402, error?.message || "Invalid Acceses Token");
    }
});