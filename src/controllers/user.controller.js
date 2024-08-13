import { asyncHandler } from "../utility/asyncHandler.js";
import {ApiError} from "../utility/ApiError.js"
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utility/ApiResponce.js";



const generateAccessTokenAndRefreshToken = async (userId) => {
   try {
       const user = await User.findById(userId);

       if (!user) {
           throw new ApiError(404, "User not found");
       }

       const accessToken = user.generateAccessToken();
       const refreshToken = user.generateRefreshToken();

       if (!accessToken || !refreshToken) {
           throw new ApiError(500, "Token generation failed");
       }

       console.log("Generated Tokens:", { accessToken, refreshToken });

       user.refreshToken = refreshToken;
       await user.save({ validateBeforeSave: false });

       console.log("User after saving:", user);

       return { accessToken, refreshToken };
   } 
   catch (error) {
       console.error("Error during token generation:", error);
       throw new ApiError(500, "Something went wrong while generating access and refresh tokens", error.errors);
   }
};



const registerUser = asyncHandler(async (req, res) => {
   // step-1
   const {username,fullName,email, password}=req.body;   
   // step-2
   if ([username, fullName, email, password].some(field => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }
   // step-3
   const existingUser = await User.findOne({
      $or: [{username}, {email}]
   });
   // step-4
   if (existingUser) {
      throw new ApiError(409, "user is already exist")
   }
   // step-5
   const user = await User.create({
      username,
      fullName,
      email,
      password,
   })
   // step-6
   const createdUser = await User.findById((user)._id).select(
      "-password -refreshToken"
   )
   // step-7
   if (!createdUser) {
      throw new ApiError(500, "Error while registering")
   }
   return res.status(201).json(
      new ApiResponse(200, createdUser, "User registered succefully")
   )
});

const loginUser = asyncHandler(async(req, res) => {
   // step-1
   const {username, email, password} = req.body;
   // step-2
   if (!username && !email) {
      throw new ApiError(400, "Username and Email is required");
   }
   // step-3
   const user = await User.findOne({
      $or: [{username}, {email}]
   });
   // step-4
   if (!user) {
      throw new ApiError(404,"User is not existed");
   }
   // step-5
   const isPasswordValid = await user.isPasswordCorrect(password);
   // step-6
   if (!isPasswordValid) {
      throw new ApiError(401, "invailid Password");
   }
   // step-7
   const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

   const options = {
      httpOnly: true,
      secure: true
   }
   
   return res
   .status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", refreshToken, options)
   .json(
      new ApiResponse(
         200,
         {
            user: loggedInUser, accessToken, refreshToken,
         },
         "User logged In Successfully"
      )
   );
});

const loggOutUser = asyncHandler(async(req, res) =>{
   await User.findByIdAndUpdate(
      req.user._id,
      {
         $unset: {
            refreshToken: 1
         }
      },
      {
         new: true
      }
   )
   const options = {
      httpOnly: true,
      secure: true
   }

   return res
   .status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json(new ApiResponse(200,{}, "User logged Out"));

});



export {
   registerUser,
   loginUser,
   loggOutUser
};


