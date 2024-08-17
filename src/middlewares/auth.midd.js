import { User } from "../models/user.models.js";
import { ApiError } from "../utility/ApiError.js";
import { asyncHandler } from '../utility/asyncHandler.js'
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        // console.log("Cookies:", req.cookies);
        // // console.log("Authorization Header:", req.header("Authorization"));
        // console.log(token);
        if (!token) {
            throw new ApiError(401, "Access token is missing or invalid")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
});

export { verifyJWT };
