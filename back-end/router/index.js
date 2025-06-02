const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const orderRoutes = require('./orderRoutes');
const cartRoutes = require('./cartRoutes');

// Mount routes
router.use('/api/auth', authRoutes);
router.use('/api/products', productRoutes);
router.use('/api/categories', categoryRoutes);
router.use('/api/orders', orderRoutes);
router.use('/api/cart', cartRoutes);

module.exports = router; 