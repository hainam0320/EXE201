const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    userRegister,
    userLogin,
    forgetPassword,
    resetPassword,
    changePassword,
    getProfile,
    updateProfile,
    getAllUsers,
    updateUserRole,
    approveSellerRequest,
    getPendingSellerRequests,
    getDashboardStats
} = require('../controller/userController');

// Public routes
router.post('/register', userRegister);
router.post('/login', userLogin);
router.post('/forget-password', forgetPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// Admin routes
router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/users/:id/role', protect, authorize('admin'), updateUserRole);
router.get('/pending-sellers', protect, authorize('admin'), getPendingSellerRequests);
router.put('/approve-seller/:userId', protect, authorize('admin'), approveSellerRequest);
router.get('/dashboard-stats', protect, authorize('admin'), getDashboardStats);

module.exports = router; 