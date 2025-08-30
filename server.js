import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import { authenticate, authorizeAdmin } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.get("/api/admin/data", authenticate, authorizeAdmin, (req, res) => {
    res.json({ secredData: "Only admins can see this" });
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDb connected"))
    .catch((error) => console.error(error));

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
