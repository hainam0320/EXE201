const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/uploadMiddleware');
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
    getDashboardStats,
    blockUser,
    unblockUser,
    getPremiumInfo,
    renewPremium
} = require('../controller/userController');

// Public routes
router.post('/register', upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
    { name: 'receipt', maxCount: 1 }
]), handleUploadError, userRegister);
router.post('/login', userLogin);
router.post('/forget-password', forgetPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/renew-premium', upload.fields([
    { name: 'receipt', maxCount: 1 }
]), handleUploadError, renewPremium);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/premium-info', protect, getPremiumInfo);

// Admin routes
router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/users/:id/role', protect, authorize('admin'), updateUserRole);
router.get('/pending-sellers', protect, authorize('admin'), getPendingSellerRequests);
router.put('/approve-seller/:userId', protect, authorize('admin'), approveSellerRequest);
router.get('/dashboard-stats', protect, authorize('admin'), getDashboardStats);
router.put('/users/:userId/block', protect, authorize('admin'), blockUser);
router.put('/users/:userId/unblock', protect, authorize('admin'), unblockUser);

module.exports = router; 