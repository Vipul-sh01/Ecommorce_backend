import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number,
        required: true,
    },
    unitItem: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    items: {
        type: [orderItemSchema]
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    payment: {
        type: Number,
        required: true,
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User.address"
    }
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);
