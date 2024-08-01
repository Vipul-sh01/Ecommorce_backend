import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const AddressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'User Name Required'],
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
    },
    address: {
        type: [AddressSchema]
    },
}, { timestamps: true });

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password, 10)
    next();
});

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
)
};
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this_id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
)
}
export const User = mongoose.model("User", userSchema);
