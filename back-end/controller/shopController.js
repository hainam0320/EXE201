const Shop = require('../model/shopModel');
const User = require('../model/userModel');
const ApiError = require('../utils/ApiError');
const path = require('path');
const Product = require('../model/productModel');

// Tạo cửa hàng mới (không dùng Cloudinary, chỉ lưu local)
exports.createShop = async (req, res, next) => {
    try {
        const { name, description, address, contact, categories } = req.body;
        // Kiểm tra xem người dùng đã có cửa hàng chưa
        const existingShop = await Shop.findOne({ owner: req.user._id });
        if (existingShop) {
            return res.status(400).json({ success: false, error: 'Bạn đã có cửa hàng rồi' });
        }
        // Lưu đường dẫn ảnh local nếu có
        let logoUrl = 'default-shop-logo.png';
        let coverImageUrl = 'default-shop-cover.png';
        if (req.files) {
            if (req.files.logo) {
                logoUrl = `/uploads/${req.files.logo[0].filename}`;
            }
            if (req.files.coverImage) {
                coverImageUrl = `/uploads/${req.files.coverImage[0].filename}`;
            }
        }
        const shop = new Shop({
            name,
            description,
            owner: req.user._id,
            logo: logoUrl,
            coverImage: coverImageUrl,
            address,
            contact,
            categories
        });
        await shop.save();
        // Cập nhật role của user thành seller
        await User.findByIdAndUpdate(req.user._id, { 
            role: 'seller',
            requestedRole: null // Xóa yêu cầu sau khi đã được chấp nhận
        });
        res.status(201).json({
            success: true,
            message: 'Tạo cửa hàng thành công',
            data: shop
        });
    } catch (error) {
        console.error('Create shop error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Lỗi khi tạo cửa hàng'
        });
    }
};

// Lấy thông tin cửa hàng
exports.getShop = async (req, res, next) => {
    try {
        const shop = await Shop.findById(req.params.id)
            .populate('owner', 'userName email');
        
        if (!shop) {
            throw new ApiError(404, 'Không tìm thấy cửa hàng');
        }

        res.status(200).json({
            success: true,
            data: shop
        });
    } catch (error) {
        console.error('Get shop error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Lỗi khi lấy thông tin cửa hàng'
        });
    }
};

// Cập nhật thông tin cửa hàng
exports.updateShop = async (req, res, next) => {
    try {
        const { name, description, address, contact, categories } = req.body;
        const shop = await Shop.findOne({ owner: req.user._id });

        if (!shop) {
            throw new ApiError(404, 'Không tìm thấy cửa hàng');
        }

        // Upload logo và ảnh bìa mới nếu có
        if (req.files) {
            if (req.files.logo) {
                const logoResult = await uploadToCloudinary(req.files.logo[0]);
                // Xóa logo cũ nếu không phải ảnh mặc định
                if (shop.logo !== 'default-shop-logo.png') {
                    await deleteFromCloudinary(shop.logo);
                }
                shop.logo = logoResult.url;
            }
            if (req.files.coverImage) {
                const coverResult = await uploadToCloudinary(req.files.coverImage[0]);
                // Xóa ảnh bìa cũ nếu không phải ảnh mặc định
                if (shop.coverImage !== 'default-shop-cover.png') {
                    await deleteFromCloudinary(shop.coverImage);
                }
                shop.coverImage = coverResult.url;
            }
        }

        // Cập nhật thông tin cửa hàng
        shop.name = name || shop.name;
        shop.description = description || shop.description;
        shop.address = address || shop.address;
        shop.contact = contact || shop.contact;
        shop.categories = categories || shop.categories;

        await shop.save();

        res.status(200).json({
            success: true,
            message: 'Cập nhật cửa hàng thành công',
            data: shop
        });
    } catch (error) {
        console.error('Update shop error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Lỗi khi cập nhật cửa hàng'
        });
    }
};

// Xóa cửa hàng
exports.deleteShop = async (req, res, next) => {
    try {
        const shop = await Shop.findOne({ owner: req.user._id });
        
        if (!shop) {
            throw new ApiError(404, 'Không tìm thấy cửa hàng');
        }

        // Xóa tất cả sản phẩm thuộc shop này
        await Product.deleteMany({ shop: shop._id });

        // Xóa ảnh trên Cloudinary (nếu còn dùng Cloudinary, nếu không thì bỏ qua)
        // if (shop.logo !== 'default-shop-logo.png') {
        //     await deleteFromCloudinary(shop.logo);
        // }
        // if (shop.coverImage !== 'default-shop-cover.png') {
        //     await deleteFromCloudinary(shop.coverImage);
        // }

        await shop.deleteOne();

        // Cập nhật role của user về user
        await User.findByIdAndUpdate(req.user._id, { role: 'user' });

        res.status(200).json({
            success: true,
            message: 'Xóa cửa hàng thành công'
        });
    } catch (error) {
        console.error('Delete shop error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Lỗi khi xóa cửa hàng'
        });
    }
};

// Lấy danh sách tất cả cửa hàng
exports.getAllShops = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, category, sort, search } = req.query;
        const query = {};

        // Tìm kiếm theo tên cửa hàng
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Lọc theo danh mục
        if (category) {
            query.categories = category;
        }

        // Chỉ hiển thị các cửa hàng đang hoạt động
        query.status = 'active';

        // Tùy chọn sắp xếp
        let sortOption = {};
        if (sort === 'rating') {
            sortOption = { rating: -1 };
        } else if (sort === 'newest') {
            sortOption = { createdAt: -1 };
        }

        const shops = await Shop.find(query)
            .populate('owner', 'userName email')
            .sort(sortOption)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Shop.countDocuments(query);

        res.status(200).json({
            success: true,
            data: shops,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error('Get all shops error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Lỗi khi lấy danh sách cửa hàng'
        });
    }
};

// Lấy thông tin cửa hàng của người bán hiện tại
exports.getMyShop = async (req, res, next) => {
    try {
        // Kiểm tra xác thực user
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                error: 'Không xác thực được người dùng'
            });
        }

        const shop = await Shop.findOne({ owner: req.user._id });

        if (!shop) {
            return res.status(404).json({
                success: false,
                error: 'Bạn chưa có cửa hàng'
            });
        }

        res.status(200).json({
            success: true,
            data: shop
        });
    } catch (error) {
        console.error('Get my shop error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Lỗi khi lấy thông tin cửa hàng'
        });
    }
}; 