const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Blog = require('../model/blogModel');
const CategoryBlog = require('../model/categoryBlogModel');

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await CategoryBlog.find({ status: 'active' }).lean();
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error getting categories'
    });
  }
});

// Get all blogs with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    
    // Add status filter if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Add category filter if provided
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Execute query with pagination
    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .populate('category', 'name')
        .populate('author', 'name email')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments(query)
    ]);

    // Send response
    res.json({
      success: true,
      data: blogs,
      pagination: {
        current: page,
        pageSize: limit,
        total
      }
    });
  } catch (error) {
    console.error('Error getting blogs:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error getting blogs'
    });
  }
});

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('category', 'name')
      .populate('author', 'name email')
      .lean();
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Error getting blog:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error getting blog'
    });
  }
});

// Create blog (protected)
router.post('/', protect, async (req, res) => {
  try {
    const blog = await Blog.create({
      ...req.body,
      author: req.user._id
    });

    const populatedBlog = await Blog.findById(blog._id)
      .populate('category', 'name')
      .populate('author', 'name email')
      .lean();

    res.status(201).json({
      success: true,
      data: populatedBlog
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error creating blog'
    });
  }
});

// Update blog (protected)
router.put('/:id', protect, async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    // Check if user is author or admin
    if (blog.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this blog'
      });
    }

    blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    )
    .populate('category', 'name')
    .populate('author', 'name email')
    .lean();

    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error updating blog'
    });
  }
});

// Delete blog (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    // Check if user is author or admin
    if (blog.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this blog'
      });
    }

    await blog.deleteOne();
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error deleting blog'
    });
  }
});

module.exports = router; 