const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    logo: {
        type: String,
        default: 'default-shop-logo.png'
    },
    coverImage: {
        type: String,
        default: 'default-shop-cover.png'
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    },
    contact: {
        email: String,
        phone: String
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'suspended'],
        default: 'pending'
    },
    categories: [{
        type: String
    }],
    rating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware để tự động cập nhật updatedAt
shopSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Shop = mongoose.model('Shop', shopSchema);
module.exports = Shop;