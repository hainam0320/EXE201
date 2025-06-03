const Wishlist = require('../model/wishlistModel');
const Product = require('../model/productModel');

// Get user's wishlist
exports.getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id })
            .populate('products', 'name price image');

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user._id, products: [] });
        }

        res.status(200).json({
            success: true,
            data: wishlist
        });
    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        // Validate product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Sản phẩm không tồn tại'
            });
        }

        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            // Create new wishlist if it doesn't exist
            wishlist = await Wishlist.create({
                user: req.user._id,
                products: [productId]
            });
        } else {
            // Check if product already exists in wishlist
            if (!wishlist.products.includes(productId)) {
                wishlist.products.push(productId);
                await wishlist.save();
            }
        }

        // Populate product details
        wishlist = await wishlist.populate('products', 'name price image');

        res.status(200).json({
            success: true,
            data: wishlist
        });
    } catch (error) {
        console.error('Add to wishlist error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                error: 'Wishlist không tồn tại'
            });
        }

        // Remove product from wishlist
        wishlist.products = wishlist.products.filter(
            product => product.toString() !== productId
        );

        await wishlist.save();

        // Populate product details
        wishlist = await wishlist.populate('products', 'name price image');

        res.status(200).json({
            success: true,
            data: wishlist
        });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Check if product is in wishlist
exports.checkWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        
        const wishlist = await Wishlist.findOne({ user: req.user._id });
        
        if (!wishlist) {
            return res.status(200).json({
                success: true,
                isInWishlist: false
            });
        }

        const isInWishlist = wishlist.products.includes(productId);

        res.status(200).json({
            success: true,
            isInWishlist
        });
    } catch (error) {
        console.error('Check wishlist error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}; 