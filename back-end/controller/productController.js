// Controller: controllers/productController.js
const mongoose = require('mongoose');
const Product = require('../model/productModel');
const Shop = require('../model/shopModel');
const { validationResult } = require('express-validator');

// --- Utility function ---
const getValidImageUrl = (image) => {
    if (Array.isArray(image)) image = image[0];
    if (!image || typeof image !== 'string' || !/^https?:\/\//.test(image)) {
        return 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300';
    }
    return image;
};

// --- Get all products ---
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('category', 'name')
            .populate('shop', 'name')
            .sort({ createdAt: -1 })
            .lean();

        const validProducts = products.map(product => ({
            ...product,
            image: getValidImageUrl(product.image)
        }));

        return res.status(200).json({
            success: true,
            count: validProducts.length,
            data: validProducts
        });
    } catch (error) {
        console.error('getAllProducts error:', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch products' });
    }
};

// --- Get single product ---
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name')
            .populate('shop', 'name');

        if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

        const productData = product.toObject();
        productData.image = getValidImageUrl(product.image);

        res.status(200).json({ success: true, data: productData });
    } catch (error) {
        console.error('getProduct error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// --- Get current user's products ---
exports.getMyProducts = async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner: req.user._id });
        if (!shop) return res.status(200).json({ success: true, data: [] });

        const products = await Product.find({ shop: shop._id })
            .populate('category', 'name');

        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// --- Create new product ---
exports.createProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
        const shop = await Shop.findOne({ owner: req.user._id });
        if (!shop) return res.status(400).json({ success: false, error: 'Bạn chưa có cửa hàng' });

        // Parse category
        let category = req.body.category;
if (typeof category === 'string') {
    category = category.split(',').map(id => id.trim());
}
if (Array.isArray(category)) {
    category = category.map(id => new mongoose.Types.ObjectId(id));
}

        // Check required fields
        const { name, price, stock, description } = req.body;
        if (!name || !price || !stock || !category || !category.length) {
            return res.status(400).json({ success: false, error: 'Vui lòng nhập đầy đủ thông tin sản phẩm' });
        }

        // Parse image
        let image = '';
        if (req.file) {
            image = `${process.env.BASE_URL}/uploads/${req.file.filename}`;
        } else if (req.body.image && typeof req.body.image === 'string') {
            image = req.body.image;
        } else {
            image = 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300';
        }

        // Tạo sản phẩm
        const productData = {
            name,
            price,
            stock,
            description,
            image,
            category,
            shop: shop._id,
        };

        const product = await Product.create(productData);
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        console.error('createProduct error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// --- Update product ---
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

        const image = req.file ? `${process.env.BASE_URL}/uploads/${req.file.filename}` : req.body.image || product.image;

        let category = req.body.category;
        if (typeof category === 'string') {
            category = category.split(',').map(id => id.trim());
        }

        const updated = await Product.findByIdAndUpdate(req.params.id, {
            ...req.body,
            image,
            category
        }, { new: true, runValidators: true });

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        console.error('updateProduct error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// --- Delete product ---
exports.deleteProduct = async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner: req.user._id });
        if (!shop) return res.status(403).json({ success: false, error: 'Bạn chưa có cửa hàng' });

        const product = await Product.findOne({ _id: req.params.id, shop: shop._id });
        if (!product) return res.status(404).json({ success: false, error: 'Không tìm thấy sản phẩm hoặc bạn không có quyền xóa' });

        await product.deleteOne();
        res.json({ success: true, message: 'Đã xóa sản phẩm' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// --- Search products ---
exports.searchProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword ? {
            name: { $regex: req.query.keyword, $options: 'i' }
        } : {};

        const products = await Product.find(keyword).populate('category', 'name');
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// --- Get featured products ---
exports.getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('category', 'name')
            .sort({ rating: -1, createdAt: -1 })
            .limit(6)
            .lean();

        const validProducts = products.map(p => ({ ...p, image: getValidImageUrl(p.image) }));

        return res.status(200).json({ success: true, count: validProducts.length, data: validProducts });
    } catch (error) {
        console.error('getFeaturedProducts error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// --- Get products by single category ---
exports.getProductsByCategory = async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.categoryId })
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .lean();

        const validProducts = products.map(p => ({ ...p, image: getValidImageUrl(p.image) }));

        res.status(200).json({ success: true, count: validProducts.length, data: validProducts });
    } catch (error) {
        console.error('getProductsByCategory error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// --- Get products by multiple categories ---
exports.getProductsByCategories = async (req, res) => {
    try {
        const categories = req.query.categories?.split(',').filter(Boolean) || [];

        const filter = categories.length > 0 ? { category: { $in: categories } } : {};

        const products = await Product.find(filter)
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .lean();

        const validProducts = products.map(p => ({ ...p, image: getValidImageUrl(p.image) }));

        res.status(200).json({ success: true, count: validProducts.length, data: validProducts });
    } catch (error) {
        console.error('getProductsByCategories error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// --- Update all product images with fallback ---
exports.updateAllProductImages = async (req, res) => {
    try {
        const fallback = 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300';

        const result = await Product.updateMany(
            {
                $or: [
                    { image: { $type: 'array' } },
                    { image: { $exists: false } },
                    { image: null },
                    { image: '' }
                ]
            },
            { $set: { image: fallback } }
        );

        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error('updateAllProductImages error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// --- Get products by shopId (public) ---
exports.getProductsByShop = async (req, res) => {
    try {
        const shopId = req.params.id;
        if (!shopId) return res.status(400).json({ success: false, error: 'Thiếu shopId' });

        const products = await Product.find({ shop: shopId })
            .populate('category', 'name')
            .populate('shop', 'name');

        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
