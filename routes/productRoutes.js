import express from "express";
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:slug", getProductBySlug);
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  upload.single("image"),
  createProduct,
);
router.put(
  "/:slug",
  authenticate,
  authorizeAdmin,
  upload.single("image"),
  updateProduct,
);
router.delete("/:slug", authenticate, authorizeAdmin, deleteProduct);

export default router;
