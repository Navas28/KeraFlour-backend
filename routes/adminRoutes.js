import express from "express";
import {
  getMillConfigs,
  createOrUpdateConfig,
  deleteConfig,
} from "../controllers/configController.js";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/mill-config", authenticate, authorizeAdmin, getMillConfigs);
router.post("/mill-config", authenticate, authorizeAdmin, createOrUpdateConfig);
router.delete("/mill-config/:id", authenticate, authorizeAdmin, deleteConfig);

import {
  updateMachineStatus,
  getMachineStatuses as getAdminMachineStatuses,
} from "../controllers/machineStatusController.js";
router.get(
  "/machine-status",
  authenticate,
  authorizeAdmin,
  getAdminMachineStatuses,
);
router.post(
  "/machine-status",
  authenticate,
  authorizeAdmin,
  updateMachineStatus,
);

export default router;
