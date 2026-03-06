import express from "express";
import {
  signup,
  login,
  getMe,
  logout,
  changePassword,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);
router.put("/change-password", authenticate, changePassword);

export default router;
