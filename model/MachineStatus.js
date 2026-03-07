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
      enum: ["free", "busy", "packed", "maintenance"],
      default: "free",
    },
    message: {
      type: String,
      default: "",
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.model("MachineStatus", machineStatusSchema);
