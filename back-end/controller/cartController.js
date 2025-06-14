const Cart = require('../model/cartModel');
const Product = require('../model/productModel');

// Get current user's cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId', 'name price image shop');

    if (!cart) {
      return res.status(200).json({ success: true, data: [], total: 0 });
    }

    let total = 0;
    cart.products.forEach(item => {
      total += item.quantity * (item.productId.price || 0);
    });

    res.status(200).json({ success: true, data: cart.products, total });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Add a product to cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({ userId: req.user.id, products: [] });
    }

    const itemIndex = cart.products.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.products[itemIndex].quantity += quantity || 1;
    } else {
      cart.products.push({ productId, quantity: quantity || 1 });
    }

    await cart.save();
    res.status(200).json({ success: true, message: 'Added to cart' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update quantity of product in cart
exports.updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.products.find(item => item.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    item.quantity = quantity;
    await cart.save();
    res.status(200).json({ success: true, message: 'Cart item updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Remove an item from cart
exports.removeFromCart = async (req, res) => {
  const productId = req.params.productId;
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.products = cart.products.filter(item => item.productId.toString() !== productId);
    await cart.save();
    res.status(200).json({ success: true, message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Clear all items in cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.products = [];
    await cart.save();
    res.status(200).json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
