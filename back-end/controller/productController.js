const Product = require('../model/productModel');
const Shop = require('../model/shopModel');
const { validationResult } = require('express-validator');

// Get all products (public, không phân biệt shop)
exports.getAllProducts = async (req, res) => {
    try {
        console.log('Fetching all products...');
        
        const products = await Product.find()
            .populate('category', 'name')
            .populate('shop', 'name')
            .sort({ createdAt: -1 })
            .lean();

        console.log(`Found ${products.length} products`);
        
        // Log first product for debugging
        if (products.length > 0) {
            console.log('Sample product data:', {
                id: products[0]._id,
                name: products[0].name,
                image: products[0].image,
                hasImage: !!products[0].image,
                imageType: typeof products[0].image
            });
        }

        // Xử lý ảnh cho tất cả sản phẩm
        const validProducts = products.map(product => {
            let imageUrl = product.image;
            if (Array.isArray(imageUrl)) {
                imageUrl = imageUrl[0];
            }
            if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.match(/^https?:\/\/.+/)) {
                imageUrl = 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300';
            }
            return {
                ...product,
                image: imageUrl
            };
        });

        return res.status(200).json({
            success: true,
            count: validProducts.length,
            data: validProducts
        });
    } catch (error) {
        console.error('Error in getAllProducts:', error);
        console.error('Stack trace:', error.stack);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch products'
        });
    }
};

// Get single product
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name')
            .populate('shop', 'name');
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        // Xử lý ảnh
        let imageUrl = product.image;
        if (Array.isArray(imageUrl)) {
            imageUrl = imageUrl[0];
        }
        if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.match(/^https?:\/\/.+/)) {
            imageUrl = 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300';
        }

        // Trả về sản phẩm với ảnh đã xử lý
        const productData = product.toObject();
        productData.image = imageUrl;

        res.status(200).json({
            success: true,
            data: productData
        });
    } catch (error) {
        console.error('Error in getProduct:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Get products of current seller's shop
exports.getMyProducts = async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner: req.user._id });
        if (!shop) {
            // Nếu seller chưa có shop, trả về mảng rỗng (không lỗi)
            return res.status(200).json({ success: true, data: [] });
        }
        const products = await Product.find({ shop: shop._id }).populate('category', 'name');
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message || 'Server Error' });
    }
};

// Create new product (seller only)
exports.createProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
        const shop = await Shop.findOne({ owner: req.user._id });
        if (!shop) return res.status(400).json({ success: false, error: 'Bạn chưa có cửa hàng' });
        let imageUrl = null;
        if (req.file) {
            imageUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;
        }
        const productData = {
            ...req.body,
            image: imageUrl || req.body.image,
            shop: shop._id
        };
        const product = await Product.create(productData);
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        // Xử lý file ảnh nếu có
        let imageUrl = product.image; // Giữ nguyên ảnh cũ nếu không có file mới
        if (req.file) {
            imageUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;
        } else if (req.body.image) {
            imageUrl = req.body.image; // Sử dụng URL từ body nếu có
        }

        const productData = {
            ...req.body,
            image: imageUrl
        };

        product = await Product.findByIdAndUpdate(req.params.id, productData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Delete product (seller only, chỉ xóa sản phẩm thuộc shop của mình)
exports.deleteProduct = async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner: req.user._id });
        if (!shop) return res.status(403).json({ success: false, error: 'Bạn chưa có cửa hàng' });
        const product = await Product.findOne({ _id: req.params.id, shop: shop._id });
        if (!product) return res.status(404).json({ success: false, error: 'Không tìm thấy sản phẩm hoặc bạn không có quyền xóa' });
        await product.deleteOne();
        res.json({ success: true, message: 'Đã xóa sản phẩm' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message || 'Server Error' });
    }
};

// Search products
exports.searchProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i'
                }
            }
            : {};

        const products = await Product.find({ ...keyword })
            .populate('category', 'name');

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('category', 'name')
            .sort({ rating: -1, createdAt: -1 })
            .limit(6)
            .lean();

        console.log(`Found ${products.length} featured products`);

        // Xử lý ảnh cho tất cả sản phẩm
        const validProducts = products.map(product => {
            let imageUrl = product.image;
            if (Array.isArray(imageUrl)) {
                imageUrl = imageUrl[0];
            }
            if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.match(/^https?:\/\/.+/)) {
                imageUrl = 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300';
            }
            return {
                ...product,
                image: imageUrl
            };
        });

        return res.status(200).json({
            success: true,
            count: validProducts.length,
            data: validProducts
        });
    } catch (error) {
        console.error('Error in getFeaturedProducts:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch featured products'
        });
    }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        console.log('Fetching products for category:', categoryId);

        const products = await Product.find({ category: categoryId })
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .lean();

        console.log(`Found ${products.length} products in category ${categoryId}`);

        // Xử lý ảnh cho tất cả sản phẩm
        const validProducts = products.map(product => {
            let imageUrl = product.image;
            if (Array.isArray(imageUrl)) {
                imageUrl = imageUrl[0];
            }
            if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.match(/^https?:\/\/.+/)) {
                imageUrl = 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300';
            }
            return {
                ...product,
                image: imageUrl
            };
        });

        return res.status(200).json({
            success: true,
            count: validProducts.length,
            data: validProducts
        });
    } catch (error) {
        console.error('Error in getProductsByCategory:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch products by category'
        });
    }
};

// Update all product images
exports.updateAllProductImages = async (req, res) => {
    try {
        const defaultImage = 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300';
        
        const result = await Product.updateMany(
            { $or: [
                { image: { $type: "array" } },
                { image: { $exists: false } },
                { image: null },
                { image: "" }
            ]},
            { $set: { image: defaultImage } }
        );

        console.log('Update result:', result);

        res.status(200).json({
            success: true,
            message: 'Updated all product images',
            result: result
        });
    } catch (error) {
        console.error('Error updating product images:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Get products by shopId (public, buyer xem sản phẩm của từng shop)
exports.getProductsByShop = async (req, res) => {
    try {
        const shopId = req.params.id; // Sửa lại đúng tên param
        if (!shopId) {
            return res.status(400).json({ success: false, error: 'Thiếu shopId' });
        }
        const products = await Product.find({ shop: shopId })
            .populate('category', 'name')
            .populate('shop', 'name');
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message || 'Server Error' });
    }
};