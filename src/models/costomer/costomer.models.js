import mongoose from "mongoose";

const costomerSchema = new mongoose.Schema({
  mobileNumber: { 
    type: String, 
    required: true, 
    unique: true 
},
  otp: { 
    type: String, 
    required: true 
},
  otpExpires: { 
    type: Date, 
    required: false 
},
  isVerified: { 
    type: Boolean, 
    default: false 
},
},{timestamps: true})

export const Costomer = mongoose.model("Costomer", costomerSchema);