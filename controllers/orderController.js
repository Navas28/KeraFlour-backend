import Order from "../model/Order.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      addOn,
      deliveryAddress,
      pickupAddress,
      addOnCharge,
      slotDate,
      slotTime,
      paymentMethod,
      totalAmount,
    } = req.body;

    // Basic validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }
    if (!slotDate || !slotTime) {
      return res.status(400).json({ message: "Slot date/time required" });
    }
    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method required" });
    }

    // Address validation
    if (addOn === "delivery" && !deliveryAddress) {
      return res.status(400).json({ message: "Delivery address required" });
    }
    if (addOn === "pickup" && !pickupAddress) {
      return res.status(400).json({ message: "Pickup address required" });
    }
    if (addOn === "both" && (!deliveryAddress || !pickupAddress)) {
      return res.status(400).json({ message: "Both addresses required" });
    }

    const order = new Order({
      user: req.user.id,
      items,
      addOn,
      deliveryAddress: deliveryAddress || undefined,
      pickupAddress: pickupAddress || undefined,
      addOnCharge: addOnCharge || 0,
      slotDate: new Date(slotDate),
      slotTime,
      paymentMethod,
      totalAmount,
      paymentStatus: req.body.paymentStatus || "pending",
      status: req.body.status || "pending",
    });
    const saved = await order.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(400).json({ message: "Order creation failed", error });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (error) {
    console.error("get orders error:", error);
    res.status(500).json({ message: "Failed to fetch order", error });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      "user",
      "name email",
    );
    res.json(orders);
  } catch (error) {
    console.error("get logged user orders error:", error);
    res.status(500).json({ message: "Failed to fetch user orders", error });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders/all
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price");

    res.json(
      orders.map((order) => ({
        _id: order._id.toString(),
        user: order.user,
        items: order.items,
        addOn: order.addOn,
        deliveryAddress: order.deliveryAddress,
        pickupAddress: order.pickupAddress,
        addOnCharge: order.addOnCharge,
        slotDate: order.slotDate,
        slotTime: order.slotTime,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      })),
    );
  } catch (error) {
    console.error("get all orders error:", error);
    res.status(500).json({ message: "Failed to fetch all orders", error });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error getting order", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.status = status;

    if (order.paymentMethod === "COD") {
      if (status === "confirmed" || status === "delivered") {
        order.paymentStatus = "paid";
      } else if (status === "pending" || status === "canceled") {
        order.paymentStatus = "pending";
      }
    }

    await order.save();
    res.json(order);
  } catch (error) {
    console.error("update order error:", error);
    res.status(500).json({ message: "Failed to update order", error });
  }
};
