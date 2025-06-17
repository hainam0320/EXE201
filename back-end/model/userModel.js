const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'buyer', 'seller', 'admin'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['active', 'pending', 'blocked', 'rejected'],
        default: 'active'
    },
    requestedRole: {
        type: String,
        enum: ['buyer', 'seller', null],
        default: null
    },
    receipt: {
        type: String,
        default: null
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    premiumStartDate: {
        type: Date,
        default: null
    },
    requestType: {
        type: String,
        enum: ['registration', 'premium_renewal', null],
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);    