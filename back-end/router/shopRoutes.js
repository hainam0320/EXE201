const express = require('express');
const router = express.Router();
const shopController = require('../controller/shopController');
const { protect, authorize } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/uploadMiddleware');

// Cấu hình upload cho logo và cover image
const shopUpload = upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]);

// ⚠️ Thêm protect vào đây để đảm bảo req.user không undefined
router.get('/my/shop', protect, authorize('seller'), shopController.getMyShop);

// Public routes
router.get('/', shopController.getAllShops);
router.get('/:id', shopController.getShop);
router.get('/:id/products', require('../controller/productController').getProductsByShop);

// Protected routes (yêu cầu đăng nhập)
router.use(protect);

// Routes cho seller
router.post('/', authorize('seller'), shopUpload, handleUploadError, shopController.createShop);
router.patch('/my/shop', authorize('seller'), shopUpload, handleUploadError, shopController.updateShop);
router.delete('/my/shop', authorize('seller'), shopController.deleteShop);

module.exports = router;
