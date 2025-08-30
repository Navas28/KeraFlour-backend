import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
});

export default mongoose.model.User || mongoose.model("User", userSchema);
