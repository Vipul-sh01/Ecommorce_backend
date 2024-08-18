import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
  }
}, { timestamps: true });

customerSchema.pre("save", async function(next) {
  if (!this.isModified("otp")) return next();
  this.otp = await bcrypt.hash(this.otp, 10);
  next();
});

customerSchema.methods.isOtpCurrect = async function(otp) {
  return await bcrypt.compare(otp.toString(), this.otp);
};

export const Customer = mongoose.model("Customer", customerSchema);