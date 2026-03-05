import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getCart);
router.post("/items", authenticate, addToCart);
router.patch("/items/:productId", authenticate, updateCartItem);
router.delete("/items/:productId", authenticate, removeCartItem);
router.delete("/", authenticate, clearCart);

export default router;
