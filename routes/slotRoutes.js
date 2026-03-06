import express from "express";
import { getAvailableSlots } from "../controllers/slotController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/available", authenticate, getAvailableSlots);

export default router;
