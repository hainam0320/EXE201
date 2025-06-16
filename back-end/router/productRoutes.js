const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getFeaturedProducts,
    getProductsByCategory,
    updateAllProductImages,
    getMyProducts,
    getProductsByCategories
} = require('../controller/productController');

// Public routes
router.get('/my', protect, authorize('seller'), getMyProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/categories', getProductsByCategories);
router.get('/search', searchProducts);
router.get('/', getAllProducts);
router.get('/:id', getProduct);

// Seller routes
router.post('/', protect, authorize('seller'), upload.single('image'), createProduct);
router.put('/:id', upload.single('image'), updateProduct);
router.delete('/:id', protect, authorize('seller'), deleteProduct);
router.post('/update-images', updateAllProductImages);

module.exports = router; 