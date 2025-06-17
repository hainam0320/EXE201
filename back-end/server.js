const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const routes = require('./router');
const connectDB = require('./router/db');
const multer = require('multer');

require('dotenv').config();


const app = express();

// Set BASE_URL for uploads if not set in env
if (!process.env.BASE_URL) {
    process.env.BASE_URL = 'http://103.90.224.148:9999';
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors());

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    if (req.file) {
        console.log('Uploaded file:', req.file);
    }
    next();
});

// Routes
app.use(routes);

// Error handling middleware (should be after routes)
app.use((err, req, res, next) => {
    console.error('Error:', err);
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            error: 'File upload error: ' + err.message
        });
    }
    res.status(500).json({
        success: false,
        error: err.message || 'Something went wrong!'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Database connection
connectDB()
    .then(() => {
        const PORT = process.env.PORT || 9999;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`BASE_URL is set to ${process.env.BASE_URL}`);
        });
    })
    .catch(error => {
        console.error('Failed to connect to database:', error);
        process.exit(1);
    });