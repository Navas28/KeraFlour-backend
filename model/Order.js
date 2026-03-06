import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity cannot be less than 1kg"],
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "delivered", "cancelled"],
      default: "pending",
    },
    pickupMethod: {
      type: String,
      enum: ["store_pickup", "delivery"],
      default: "store_pickup",
    },
    notes: {
      type: String,
    },
    slotDate: {
      type: String, // Format: YYYY-MM-DD
    },
    slotTime: {
      type: String, // Format: "10:00 AM - 11:00 AM" (or similar)
    },
    estimatedMinutes: {
      type: Number,
    },
    machineType: {
      type: String,
      enum: ["grain", "spice"],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
