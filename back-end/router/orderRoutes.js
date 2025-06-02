const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getAllOrders,
    getUserOrders,
    getOrder,
    createOrder,
    updateOrderStatus,
    cancelOrder
} = require('../controller/orderController');

// Protected routes (User)
router.get('/my-orders', protect, getUserOrders);
router.post('/', protect, createOrder);
router.post('/:id/cancel', protect, cancelOrder);

// Protected routes (Admin only)
router.get('/', protect, authorize('admin'), getAllOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router; 