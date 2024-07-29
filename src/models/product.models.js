import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    productImage: {
        type: String,
    },
    stock: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);
