const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require('../controller/cartController');

// All routes are protected (require authentication)
router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.put('/update', protect, updateCartItem);
router.delete('/item/:productId', protect, removeFromCart);
router.delete('/clear', protect, clearCart);

module.exports = router; 