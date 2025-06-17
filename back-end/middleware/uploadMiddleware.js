const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục uploads và uploads/receipts nếu chưa tồn tại
const uploadDir = 'uploads';
const receiptsDir = path.join(uploadDir, 'receipts');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
if (!fs.existsSync(receiptsDir)) {
    fs.mkdirSync(receiptsDir);
}

// Cấu hình storage cho multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Kiểm tra loại file để lưu vào thư mục phù hợp
        if (file.fieldname === 'receipt') {
            cb(null, receiptsDir);
        } else {
            cb(null, uploadDir);
        }
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Kiểm tra loại file
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    }
    cb(new Error('Chỉ cho phép upload file ảnh (jpeg, jpg, png, gif)!'));
};

// Cấu hình multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5, // Giới hạn file 5MB
        files: 3 // Giới hạn số lượng file
    }
});

// Middleware xử lý lỗi upload
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'Kích thước file không được vượt quá 5MB'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Không thể upload quá 3 file'
            });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Field không hợp lệ'
            });
        }
        return res.status(400).json({
            success: false,
            message: 'Lỗi khi upload file'
        });
    }
    
    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next();
};

module.exports = { upload, handleUploadError }; 