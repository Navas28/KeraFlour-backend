import Stripe from "stripe";
import Order from "../model/Order.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Initiate Stripe checkout
// @route   POST /api/payments/stripe-checkout
// @access  Private
export const stripeCheckout = async (req, res) => {
  try {
    const { orderData } = req.body;

    const MINIMUM_AMOUNT_INR = 50;
    const totalToCharge = Math.max(orderData.totalAmount, MINIMUM_AMOUNT_INR);
    const amountInPaise = Math.round(totalToCharge * 100);

    const newOrder = await Order.create({
      user: req.user.id,
      ...orderData,
      totalAmount: totalToCharge,
      paymentStatus: "pending",
      status: "pending",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "KeraFlour Order" },
            unit_amount: amountInPaise,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: { orderId: newOrder._id.toString() },
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    res.status(500).json({ message: "Payment initiation failed" });
  }
};

// @desc    Retrieve Stripe session
// @route   GET /api/payments/stripe-session/:id
// @access  Private
export const stripeSession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id);

    const orderId = session.metadata?.orderId;

    if (session.payment_status === "paid" && orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        status: "confirmed",
      });
    }

    res.json(session);
  } catch (error) {
    console.error("failed to fetch stripe session", error);
    res
      .status(500)
      .json({ message: "Failed to fetch stripe session", error: error });
  }
};
