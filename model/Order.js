import mongoose from "mongoose";

const addressSubSchema = new mongoose.Schema(
    {
        place: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        pincode: { type: String, default: "" },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                name: String,
                qty: { type: Number, required: true },
                price: { type: Number, required: true },
            },
        ],
        addOn: {
            type: String,
            enum: ["delivery", "pickup", "both"],
        },
        deliveryAddress: addressSubSchema,
        pickupAddress: addressSubSchema,
        addOnCharge: {
            type: Number,
            default: 0,
        },
        slotDate: {
            type: Date,
            required: true,
        },
        slotTime: {
            type: String,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ["COD", "stripe"],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "delivered", "canceled"],
            default: "pending",
        },
    },
    { timestamps: true }
);
export default mongoose.model("Order", orderSchema);
