const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Hash Password
exports.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Compare Password
exports.comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT Token
exports.generateToken = async (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
    );
}; 