const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const orderRoutes = require('./orderRoutes');
const cartRoutes = require('./cartRoutes');
const blogRoutes = require('./blogRoutes');
const wishlistRoutes = require('./wishlistRoutes');
const uploadRoutes = require('./uploadRoutes');
const shopRoutes = require('./shopRoutes');

// Mount routes
router.use('/api/auth', authRoutes);
router.use('/api/products', productRoutes);
router.use('/api/categories', categoryRoutes);
router.use('/api/orders', orderRoutes);
router.use('/api/cart', cartRoutes);
router.use('/api/wishlist', wishlistRoutes);
router.use('/api/blogs', blogRoutes);
router.use('/api/upload', uploadRoutes);
router.use('/api/shops', shopRoutes);

module.exports = router; 