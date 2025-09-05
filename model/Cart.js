import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
    {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantityKg: { type: Number, default: 1 },

        name: String,
        image: String,
        slug: String,
        pricePerKg: Number,
    },
    { _id: false }
);
const cartSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
        items: [cartItemSchema],
    },
    { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
