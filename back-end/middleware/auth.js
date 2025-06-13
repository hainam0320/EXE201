const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

exports.protect = async (req, res, next) => {
    try {
        console.log('=== PROTECT MIDDLEWARE ===');
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            console.log('Token:', token);
        }
        if (!token) {
            console.log('No token found');
            return res.status(401).json({ success: false, error: 'No token' });
        }
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log('Decoded:', decoded);
        } catch (err) {
            console.log('JWT verify error:', err);
            return res.status(401).json({ success: false, error: 'Invalid token' });
        }
        const user = await User.findById(decoded.id);
        if (!user) {
            console.log('User not found in DB');
            return res.status(401).json({ success: false, error: 'User not found' });
        }
        console.log('User from DB:', user);
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        console.log('=== AUTHORIZE MIDDLEWARE ===');
        console.log('Required roles:', roles);
        if (!req.user) {
            console.log('No req.user found');
            return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
        }
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