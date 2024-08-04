import { asyncHandler } from "../utility/asyncHandler.js";
import {ApiError} from "../utility/ApiError.js"
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utility/ApiResponce.js";

const registerUser = asyncHandler(async (req, res) => {
   // step-1
   const {username,fullName,email, password}=req.body;   
   // step-2
   if ([username, fullName, email, password].some(field => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }
   // step-3
   const existingUser =await User.findOne({
      $or: [{username}, {email}]
   });
   // step-4
   if (existingUser) {
      throw new ApiError(409, "user is already exist")
   }
   // step-6
   const user =await User.create({
      username,
      fullName,
      email,
      password,
   })
   // step-7
   const createdUser = await User.findById((user)._id).select(
      "-password -refreshToken"
   )
   // step-8
   if (!createdUser) {
      throw new ApiError(500, "Error while registering")
   }
   return res.status(201).json(
      new ApiResponse(200, createdUser, "User registered succefully")
   )
});

export { registerUser };
