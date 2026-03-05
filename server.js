import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/payementRoutes.js";

import corsOptions from "./config/cors.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import { globalLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

connectDB();

const app = express();

app.use(globalLimiter);
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
