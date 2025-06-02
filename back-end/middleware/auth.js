const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

exports.protect = async (req, res, next) => {
    try {
        console.log('=== PROTECT MIDDLEWARE ===');
        console.log('Headers:', req.headers);
        let token;

        // Check if token exists in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            console.log('Token found:', token);
        }

        if (!token) {
            console.log('No token found in request');
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this route'
            });
        }

        try {
            // Verify token
            console.log('Verifying token...');
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log('Token decoded:', decoded);
            
            const user = await User.findById(decoded.id);
            console.log('User found:', {
                id: user._id,
                email: user.email,
                role: user.role,
                isAdmin: user.isAdmin
            });
            
            req.user = user;
            next();
        } catch (err) {
            console.error('Token verification error:', err);
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this route'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        console.log('=== AUTHORIZE MIDDLEWARE ===');
        console.log('Required roles:', roles);
        console.log('User:', {
            id: req.user._id,
            role: req.user.role,
            isAdmin: req.user.isAdmin
        });
        
        // Cho phép truy cập nếu user là admin
        if (req.user.isAdmin) {
            console.log('User is admin, access granted');
            return next();
        }
        
        // Nếu không phải admin, kiểm tra role
        if (!roles.includes(req.user.role)) {
            console.log('Access denied: Invalid role');
            return res.status(403).json({
                success: false,
                error: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        console.log('Access granted: Valid role');
        next();
    };
}; 