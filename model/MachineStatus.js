import mongoose from "mongoose";

const machineStatusSchema = new mongoose.Schema(
  {
    machineType: {
      type: String,
      enum: ["grain", "spice"],
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["free", "busy", "maintenance"],
      default: "free",
    },
    message: {
      type: String,
      default: "",
    },
    estimatedFreeAt: {
      type: Date,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.model("MachineStatus", machineStatusSchema);
