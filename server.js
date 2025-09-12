import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/payementRoutes.js";

dotenv.config();
const app = express();

app.use(
    cors({
        origin: ["http://localhost:3000", "https://keraflour.vercel.app"],
        credentials: true,
    })
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDb connected"))
    .catch((error) => console.error(error));

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
