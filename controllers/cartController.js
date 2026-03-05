import Cart from "../model/Cart.js";
import Product from "../model/Product.js";

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
}

function formatCart(cart) {
  const items = (cart.items || []).map((item) => ({
    product: item.product.toString(),
    name: item.name,
    image: item.image,
    slug: item.slug,
    pricePerKg: item.pricePerKg,
    quantityKg: item.quantityKg,
  }));
  const totalAmount = items.reduce(
    (a, b) => a + b.pricePerKg * b.quantityKg,
    0,
  );
  return { items, totalAmount };
}

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    return res.json(formatCart(cart));
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId, quantityKg } = req.body;
    if (!productId || !quantityKg || quantityKg <= 0) {
      return res
        .status(400)
        .json({ message: "productId and positive quantityKg are required" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const cart = await getOrCreateCart(req.user.id);
    const idx = cart.items.findIndex(
      (it) => it.product.toString() === productId,
    );

    if (idx > -1) {
      cart.items[idx].quantityKg += Number(quantityKg);
      cart.items[idx].name = product.name;
      cart.items[idx].image = product.image;
      cart.items[idx].slug = product.slug;
      cart.items[idx].pricePerKg = product.pricePerKg;
    } else {
      cart.items.push({
        product: product._id,
        quantityKg: Number(quantityKg),
        name: product.name,
        image: product.image,
        slug: product.slug,
        pricePerKg: product.pricePerKg,
      });
    }

    await cart.save();
    return res.json(formatCart(cart));
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e?.message });
  }
};

// @desc    Update item quantity
// @route   PATCH /api/cart/items/:productId
// @access  Private
export const updateCartItem = async (req, res) => {
  try {
    const { quantityKg } = req.body;
    const { productId } = req.params;
    if (quantityKg == null || quantityKg < 0) {
      return res.status(400).json({ message: "quantityKg must be >= 0" });
    }

    const cart = await getOrCreateCart(req.user.id);
    const idx = cart.items.findIndex(
      (it) => it.product.toString() === productId,
    );
    if (idx === -1)
      return res.status(404).json({ message: "Item not in cart" });

    if (quantityKg === 0) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].quantityKg = Number(quantityKg);
    }

    await cart.save();
    return res.json(formatCart(cart));
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e?.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:productId
// @access  Private
export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await getOrCreateCart(req.user.id);
    cart.items = cart.items.filter((it) => it.product.toString() !== productId);
    await cart.save();
    return res.json(formatCart(cart));
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e?.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    cart.items = [];
    await cart.save();
    return res.json(formatCart(cart));
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e?.message });
  }
};
