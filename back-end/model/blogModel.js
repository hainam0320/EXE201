const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    content: {
        type: String,
        required: [true, 'Please add content']
    },
    image: {
        type: String,
        default: 'no-photo.jpg'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CategoryBlog',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: [String], // Tags để phân loại bài viết
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'published'
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Middleware để tự động cập nhật updatedAt
blogSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Blog', blogSchema);