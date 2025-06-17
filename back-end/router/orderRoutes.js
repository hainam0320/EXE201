const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const orderController = require('../controller/orderController');
const upload = require('../middleware/upload');

// Buyer
router.get('/my-orders', protect, orderController.getUserOrders);
router.post('/', protect, orderController.createOrder);
router.post('/:id/paid', protect, orderController.markOrderPaid);
router.post('/:id/bill-image', protect, upload.single('billImage'), orderController.uploadBillImage);

// Seller
router.get('/seller-orders', protect, authorize('seller'), orderController.getSellerOrders);
router.put('/:id/seller-status', protect, authorize('seller'), orderController.updateSellerOrderStatus);

// Protected routes (Admin only)
router.get('/', protect, authorize('admin'), orderController.getAllOrders);
router.get('/:id', protect, orderController.getOrder);
router.put('/:id/status', protect, authorize('admin'), orderController.updateOrderStatus);
router.put('/:id/payment-status', protect, authorize('admin'), orderController.updatePaymentStatus);

module.exports = router; 