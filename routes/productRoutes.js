import upload from "../middleware/multer.js";
import Product from "../model/Product.js";
import express from "express";
import cloudinary from "../utils/cloudinary.js";
import slugify from "slugify";
import streamfier from "streamifier"

const router = express.Router();

const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "KeraFlour Products" }, (error, result) => {
            if (result) resolve(result);
            else reject(error);
        });
        streamfier.createReadStream(fileBuffer).pipe(stream);
    });
};

// Get all products

router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Get a single product by slug

router.get("/:slug", async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

//  Create a new product

router.post("/", upload.single("image"), async (req, res) => {
    try {
        let imageData = {};
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            imageData = { image: result.secure_url, cloudinaryId: result.public_id };
        }

        const { name, pricePerKg } = req.body;
        const slug = slugify(name, { lower: true });

        const product = new Product({ name, pricePerKg, slug, ...imageData });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: "Invalid product data", error });
    }
});

// Update a product by slug

router.put("/:slug", upload.single("image"), async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });
        if (!product) return res.status(404).json({ message: "Product not found" });

        if (req.file) {
            if (product.cloudinaryId) {
                await cloudinary.uploader.destroy(product.cloudinaryId);
            }
            const result = await uploadToCloudinary(req.file.buffer);
            product.image = result.secure_url;
            product.cloudinaryId = result.public_id;
        }

        if (req.body.name) {
            product.name = req.body.name;
            product.slug = slugify(req.body.name, { lower: true });
        }

        product.pricePerKg = req.body.pricePerKg || product.pricePerKg;

        await product.save();
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: "Invalid product data", error });
    }
});

//  Delete a product by slug

router.delete("/:slug", async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });
        if (!product) return res.status(404).json({ message: "Product not found" });

        if (product.cloudinaryId) {
            await cloudinary.uploader.destroy(product.cloudinaryId);
        }

        await product.deleteOne();
        res.json({ message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

export default router;
