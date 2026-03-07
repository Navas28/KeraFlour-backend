import express from "express";
import {
  getMachineStatuses,
  getMillAvailability,
} from "../controllers/machineStatusController.js";

const router = express.Router();

// Public routes for mobile app
router.get("/status", getMachineStatuses);
router.get("/availability", getMillAvailability);

export default router;
