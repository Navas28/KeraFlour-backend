import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  deleteOrder,
  deleteMultipleOrders,
} from "../controllers/orderController.js";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// User routes
router.post("/", authenticate, createOrder);
router.get("/my", authenticate, getMyOrders);
router.get("/:orderId", authenticate, getOrderById);
router.delete("/bulk", authenticate, deleteMultipleOrders);
router.delete("/:orderId", authenticate, deleteOrder);

// Admin routes
router.get("/", authenticate, authorizeAdmin, getAllOrders);
router.patch(
  "/:orderId/status",
  authenticate,
  authorizeAdmin,
  updateOrderStatus,
);

export default router;
