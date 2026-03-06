import mongoose from "mongoose";

const millConfigSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["weekly_schedule", "holiday"],
      required: true,
    },
    // For weekly_schedule: 0 (Sunday) to 6 (Saturday)
    // For holiday: null
    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6,
    },
    // For holiday: YYYY-MM-DD
    date: {
      type: String,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
    // Support partial closing (e.g. 10:00 to 14:00 only)
    openTime: {
      type: String, // "10:00"
      default: "10:00",
    },
    closeTime: {
      type: String, // "18:00"
      default: "18:00",
    },
    // Apply to specific machine only
    machineType: {
      type: String,
      enum: ["grain", "spice", "both"],
      default: "both",
    },
    reason: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("MillConfig", millConfigSchema);
