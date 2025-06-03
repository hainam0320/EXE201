const randomString = require("randomstring");
const Blog = require("../model/blogModel");
const fs = require("fs");

const mongoose = require('mongoose'); // Đảm bảo bạn đã import mongoose

const createBlog = async (req, res) => {
  try {
    const { title, description, content, category, image, tags } = req.body;
    const userId = req.user._id;

    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Chỉ admin mới có quyền tạo blog!" });
    }

    if (!title || !description || !content || !category || !image) {
      return res.status(400).json({ message: "Vui lòng nhập đủ thông tin!" });
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "ID danh mục không hợp lệ!" });
    }

    const newBlog = new Blog({
      title,
      description,
      content,
      category,
      image,
      userId,
      tags: tags || []
    });

    await newBlog.save();

    return res.status(201).json({
      message: "Tạo blog thành công!",
      blog: newBlog
    });
  } catch (error) {
    console.error("Lỗi khi tạo blog:", error);
    return res.status(500).json({ message: "Lỗi server!" });
  }
};

// Get all blogs with pagination
const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find()
      .populate('category', 'name')
      .populate('userId', 'userName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments();

    res.json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting blogs:', error);
    res.status(500).json({
      success: false,
      error: 'Error getting blogs'
    });
  }
};

// Get blog by ID
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('category', 'name')
      .populate('userId', 'userName');

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    // Increment view count
    blog.viewCount += 1;
    await blog.save();

    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Error getting blog:', error);
    res.status(500).json({
      success: false,
      error: 'Error getting blog'
    });
  }
};

// Lấy blog theo danh mục
const getBlogsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "ID danh mục không hợp lệ!" });
    }

    const blogs = await Blog.find({ 
      category: categoryId,
      status: 'published'
    })
    .populate("category", "name")
    .populate("userId", "userName")
    .sort({ createdAt: -1 });

    return res.status(200).json({ blogs });
  } catch (error) {
    console.error("Lỗi khi lấy blog theo danh mục:", error);
    return res.status(500).json({ message: "Lỗi server!" });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    // Check if user is owner
    if (blog.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    res.json({
      success: true,
      data: updatedBlog
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating blog'
    });
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    // Check if user is owner
    if (blog.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }

    await Blog.deleteOne({ _id: req.params.id });

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting blog'
    });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogsByCategory,
  updateBlog,
  deleteBlog
};
