const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const orderController = require('../controller/orderController');

// Buyer
router.get('/my-orders', protect, orderController.getUserOrders);
router.post('/', protect, orderController.createOrder);
router.post('/:id/paid', protect, orderController.markOrderPaid);

// Seller
router.get('/seller-orders', protect, authorize('seller'), orderController.getSellerOrders);

// Protected routes (Admin only)
router.get('/', protect, authorize('admin'), orderController.getAllOrders);
router.get('/:id', protect, orderController.getOrder);
router.put('/:id/status', protect, authorize('admin'), orderController.updateOrderStatus);

module.exports = router; 