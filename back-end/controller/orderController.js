const Order = require('../model/orderModel');
const Product = require('../model/productModel');
const Shop = require('../model/shopModel');
const { validationResult } = require('express-validator');


// Get all orders (Admin)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('buyer', 'name email')
            .populate('items.product', 'name price')
            .populate('items.shop', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('Error in getAllOrders:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user._id })
            .populate('items.product')
            .populate('items.shop')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get seller orders
exports.getSellerOrders = async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner: req.user._id });
        if (!shop) return res.status(404).json({ success: false, message: 'Bạn chưa có cửa hàng' });
        const orders = await Order.find({ 'items.shop': shop._id })
            .populate('items.product')
            .populate('items.shop')
            .sort({ createdAt: -1 });
        // Lọc chỉ sản phẩm thuộc shop này
        const filteredOrders = orders.map(order => {
            const filteredItems = order.items.filter(item => item.shop.equals(shop._id));
            return { ...order.toObject(), items: filteredItems };
        });
        res.status(200).json({ success: true, data: filteredOrders });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get single order
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.product', 'name price image');

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Check if the user is authorized to view this order
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this order'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Create new order
exports.createOrder = async (req, res) => {
    console.log('Order body:', req.body);
    console.log('Order user:', req.user);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    try {
        const { items, deliveryAddress, paymentMethod, notes } = req.body;
        // Tính tổng tiền
        let totalProductAmount = 0;
        let totalAmount = 0;
        let deliveryFee = 0; // Có thể tính động
        for (const item of items) {
            totalProductAmount += item.totalPrice;
        }
        totalAmount = totalProductAmount + deliveryFee;
        // Nếu không phải COD thì trả về ảnh QR cố định
        let qrCodeUrl = '';
        if (paymentMethod !== 'COD') {
            qrCodeUrl = '/qrcode.jpg'; // Đường dẫn public của frontend
        }
        const order = await Order.create({
            buyer: req.user._id,
            items,
            deliveryAddress,
            paymentMethod,
            notes,
            totalProductAmount,
            totalAmount,
            deliveryFee,
            qrCodeUrl
        });
        res.status(201).json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update order status (Admin)
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        order.status = req.body.status;
        await order.save();

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Check if user is authorized to cancel this order
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to cancel this order'
            });
        }

        // Check if order can be cancelled
        if (order.status !== 'pending') {
            return res.status(400).json({
                success: false,
                error: 'Order cannot be cancelled at this stage'
            });
        }

        order.status = 'cancelled';
        await order.save();

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Mark order as paid
exports.markOrderPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        order.paymentStatus = 'unpaid';
        order.status = 'pending';
        await order.save();
        res.status(200).json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update payment status (Admin)
exports.updatePaymentStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }
        order.paymentStatus = req.body.paymentStatus;
        await order.save();
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Upload bill image for order
exports.uploadBillImage = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // Lưu URL ảnh bill vào order
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    order.billImage = fileUrl;
    order.paymentStatus = 'unpaid';
    await order.save();
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update order status (Seller)
exports.updateSellerOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Kiểm tra xem đơn hàng có thuộc shop của seller không
        const shop = await Shop.findOne({ owner: req.user._id });
        if (!shop) {
            return res.status(404).json({
                success: false,
                message: 'Shop not found'
            });
        }

        const hasShopItems = order.items.some(item => item.shop.equals(shop._id));
        if (!hasShopItems) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this order'
            });
        }

        // Cập nhật trạng thái
        order.status = req.body.status;
        await order.save();

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error in updateSellerOrderStatus:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
}; 