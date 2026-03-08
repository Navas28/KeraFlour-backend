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

import { createServer } from "http";
import { Server } from "socket.io";

connectDB();

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: corsOptions,
});

app.use(globalLimiter);
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("KeraFlour Backend is Live 🚀");
});

app.use("/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/machines", machineStatusRoutes);
app.use("/api/admin", adminRoutes);

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

const PORT = process.env.PORT || 2000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
