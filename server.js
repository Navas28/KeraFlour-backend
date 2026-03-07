import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import machineStatusRoutes from "./routes/machineStatusRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import corsOptions from "./config/cors.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import { globalLimiter } from "./middleware/rateLimiter.js";

connectDB();

const app = express();

app.use(globalLimiter);
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/machines", machineStatusRoutes);
app.use("/api/admin", adminRoutes);

app.listen(process.env.PORT || 2000, () => {
  console.log(`Server running on port ${process.env.PORT || 2000}`);
});
