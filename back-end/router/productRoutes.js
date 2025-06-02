const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts
} = require('../controller/productController');

// Public routes
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/:id', getProduct);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router; 