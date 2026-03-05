import Product from "../model/Product.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/uploadHelper.js";
import slugify from "slugify";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const createProduct = async (req, res) => {
  try {
    let imageData = {};
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "KeraFlour Products",
      );
      imageData = {
        image: result.secure_url,
        cloudinaryId: result.public_id,
      };
    }

    const { name, pricePerKg, grindingTimePerKg } = req.body;
    const slug = slugify(name, { lower: true });

    const product = new Product({
      name,
      pricePerKg,
      grindingTimePerKg,
      slug,
      ...imageData,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "Invalid product data", error });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.file) {
      if (product.cloudinaryId) {
        await deleteFromCloudinary(product.cloudinaryId);
      }
      const result = await uploadToCloudinary(
        req.file.buffer,
        "KeraFlour Products",
      );
      product.image = result.secure_url;
      product.cloudinaryId = result.public_id;
    }

    if (req.body.name) {
      product.name = req.body.name;
      product.slug = slugify(req.body.name, { lower: true });
    }

    product.pricePerKg = req.body.pricePerKg || product.pricePerKg;
    product.grindingTimePerKg =
      req.body.grindingTimePerKg || product.grindingTimePerKg;

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "Invalid product data", error });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.cloudinaryId) {
      await deleteFromCloudinary(product.cloudinaryId);
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
