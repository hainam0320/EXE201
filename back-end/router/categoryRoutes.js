const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getAllCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controller/categoryController');

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategory);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), createCategory);
router.put('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router; 