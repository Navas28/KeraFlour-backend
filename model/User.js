import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: {type: String},
    role: { type: String, enum: ["user", "admin"], default: "user" },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
