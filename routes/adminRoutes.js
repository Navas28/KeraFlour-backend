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

export default router;
