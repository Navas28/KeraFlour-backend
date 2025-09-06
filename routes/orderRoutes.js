import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import Order from "../model/Order.js";

const router = express.Router();

// create new order

router.post("/", authenticate, async (req, res) => {
    try {
        const order = new Order({
            user: req.user.id || req.user._id,
            ...req.body,
        });
        const saveOrder = await order.save();
        res.status(201).json(saveOrder);
    } catch (error) {
        console.error("Order creation error:", error);
        res.status(400).json({ message: "Order creation failed", error });
    }
});

// get all orders

router.get("/", authenticate, async (req, res) => {
    try {
        const orders = await Order.find().populate("user", "name email");
        res.json(orders);
    } catch (error) {
        console.error("get orders error:", error);
        res.status(500).json({ message: "Failed to fetch order", error });
    }
});

// get order by id

router.get("/:id", authenticate, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("items.product")
        if(!order) return res.status(404).json({ message: "Order not found" });

        if(order.user.toString() !== req.user.id.toString()){
            return res.status(404).json({message: "Forbidden"})
        }
        res.json(order)
    } catch (error) {
          console.error("Error getting order", error);
    res.status(500).json({ message: "Server error", error: error.message });
    }
})

// get logged in user orders

router.get("/my", authenticate, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        console.error("get logged user orders error:", error);
        res.status(500).json({ message: "Failed to fetch user orders", error });
    }
});

// update order status

router.put("/:id/status", authenticate, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        order.status = status;
        await order.save();

        res.json(order);
    } catch (error) {
        console.error("update order error:", error);
        res.status(500).json({ message: "Failed to update order", error });
    }
});
export default router;
