import { asyncHandler } from '../utility/asyncHandler.js';
import { Costomer } from "../models/costomer/costomer.models.js";
import twilio from "twilio";
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponce.js" 

const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const otpSend = asyncHandler(async (req, res) => {
    const { mobileNumber } = req.body;
    console.log("Mobile Number:", mobileNumber);
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; 

    const existingCostomer = await Costomer.findOne({ mobileNumber });
    if(existingCostomer){
        throw new ApiError(400, "User is exist");
    }

    const costomer = new Costomer({
        mobileNumber,
        otp,
        otpExpires
    });
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


const otpVerify = asyncHandler(async(req, res) =>{
    const {mobileNumber,otp } = req.body;
    
    const costomer = await Costomer.findOne({ mobileNumber });
    if (!costomer) {
        throw new ApiError(400, "Customer not found");
    }

    if (costomer.otp !== otp) { 
        throw new ApiError(400, "Invalid OTP");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, costomer, "OTP verified successfully"));
})

export { 
    otpSend,
    otpVerify
 };
