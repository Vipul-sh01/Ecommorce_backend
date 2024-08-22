import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const customerSchema = new mongoose.Schema({
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
  refreshToken: {
    type: String,
  },
}, { timestamps: true });

customerSchema.pre("save", async function(next) {
  // if (!this.isModified("otp")) return next();
  if (!this.isModified("otp") || !this.otp) return next();
  this.otp = await bcrypt.hash(this.otp, 2); 
  next();
});

customerSchema.methods.isOtpCorrect = async function(otp) {  
  return await bcrypt.compare(otp, this.otp);
};


customerSchema.methods.generateAccessToken = function() {  
  return jwt.sign({
    _id: this._id,
    mobileNumber: this.mobileNumber,
  },
  process.env.ACCESS_TOKEN_SECRET,
  {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

customerSchema.methods.generateRefreshToken = function() {  
  return jwt.sign({
    _id: this._id,
  },
  process.env.REFRESH_TOKEN_SECRET,  
  {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

export const Customer = mongoose.model("Customer", customerSchema);
