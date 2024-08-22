import { asyncHandler } from '../utility/asyncHandler.js';
import { Customer } from "../models/customer/customer.models.js"; 
import twilio from "twilio";
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponce.js"; 


const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const otpSend = asyncHandler(async (req, res) => {
    const { mobileNumber } = req.body;
    
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = Date.now() + 10 * 60 * 1000; 

    // const otpString = otp.toString();
    // const hashedOtp = await bcrypt.hash(otpString, 10);
    
    const existingCustomer = await Customer.findOne({ mobileNumber }); 

    if (existingCustomer) {
        throw new ApiError(400, "User already exists");
    }

    const customer = new Customer({ 
        mobileNumber,
        otp,
        // otp: hashedOtp,
        otpExpires
    });
    await customer.save();
    try {
        await client.messages.create({
            body: `Your verification code is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: mobileNumber
        })
        .then(message => console.log(message.sid))
        .catch(error => console.error('Error sending OTP via Twilio:', error));
    } catch (error) {
        throw new ApiError(500, "Failed to send OTP");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "OTP sent successfully"));
});

const otpVerify = asyncHandler(async (req, res) => {
    const { otp } = req.body;
    
    const customer = await Customer.findOne({ otpExpires: { $gt: Date.now() } });
    if (!customer) {
        throw new ApiError(400, "OTP has expired.");
    }

    const isOtpValid = await customer.isOtpCorrect(otp);
    
    if (!isOtpValid) {
        throw new ApiError(400, "Invalid OTP");
    }

    customer.otp = undefined;
    customer.otpExpires = undefined;
    await customer.save({ validateBeforeSave: false });
    const { otp: removedOtp, otpExpires, ...customerWithoutOtp } = customer.toObject();
    return res
        .status(200)
        .json(new ApiResponse(200, customerWithoutOtp, "OTP verified successfully"));
});


export { 
    otpSend,
    otpVerify
};
