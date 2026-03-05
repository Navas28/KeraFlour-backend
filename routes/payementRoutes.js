import express from "express";
import {
  stripeCheckout,
  stripeSession,
} from "../controllers/paymentController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/stripe-checkout", authenticate, stripeCheckout);
router.get("/stripe-session/:id", authenticate, stripeSession);

export default router;
