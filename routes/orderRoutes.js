import express from "express";
import {
  createOrder,
  getOrders,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createOrder);
router.get("/", authenticate, getOrders);
router.get("/my", authenticate, getMyOrders);
router.get("/all", authenticate, getAllOrders);
router.get("/:id", authenticate, getOrderById);
router.put("/:id/status", authenticate, updateOrderStatus);

export default router;
