const randomString = require("randomstring");
const Blog = require("../model/blogModel");
const fs = require("fs");

const mongoose = require('mongoose'); // Đảm bảo bạn đã import mongoose

const createBlog = async (req, res) => {
  try {
    const { title, description, category, image } = req.body;
    const userId = req.user._id;

    if (!title || !description || !category || !image) {
      return res.status(400).json({ message: "Vui lòng nhập đủ thông tin!" });
    }

    // Kiểm tra xem ID danh mục có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "ID danh mục không hợp lệ!" });
    }

    const newBlog = new Blog({
      title,
      description,
      category: category, // Giả sử chuỗi category là một ObjectId hợp lệ, Mongoose sẽ tự xử lý
      image,
      userId: userId,
    });

    await newBlog.save();

    return res.status(201).json({
      message: "Tạo blog thành công!",
      blog: newBlog,
    });
  } catch (error) {
    console.error("Lỗi khi tạo blog:", error);
    return res.status(500).json({ message: "Lỗi server!" });
  }
};
// this is only for test purpose ------------------->
const params = (req, res) => {
  const { id } = req.params;
  console.log(id);
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID blog từ request params
    const userId = req.user._id; // Lấy userId từ middleware (đã xác thực)

    // ✅ 1. Kiểm tra blog có tồn tại không
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Không tìm thấy blog!" });
    }

    // ✅ 2. Kiểm tra quyền xóa (chỉ admin hoặc chủ bài viết)
    if (blog.userId.toString() !== userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Bạn không có quyền xóa blog này!" });
    }

    // ✅ 3. Xóa blog khỏi database
    await Blog.findByIdAndDelete(id);

    return res.status(200).json({ message: "Xóa blog thành công!" });
  } catch (error) {
    console.error("❌ Lỗi khi xóa blog:", error);
    return res.status(500).json({ message: "Lỗi server!" });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("category", "name").populate("userId", "userName");
    if (!blogs) {
      return res.status(400).send({ message: "Blogs not found" });
    }

    return res.status(200).send({ message: "Blogs found", blogs });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

const getUserBlogs = async (req, res) => {
  try {
    const { userId } = req.params;

    // Tìm tất cả blog của user dựa trên userId
    const blogs = await Blog.find({ userId: userId })
      .populate("category", "name") // Lấy thông tin tên danh mục
      .populate("userId", "userName"); // Lấy thông tin userName của tác giả

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ message: "Người dùng chưa có bài viết nào.", data: blogs });
    }

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy blog của user!", error: error.message });
  }
};

const blogUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, image } = req.body;
    const userId = req.user._id;

    console.log("--- Bắt đầu cập nhật blog ---");
    console.log("ID blog nhận được:", id);
    console.log("Dữ liệu nhận được:", { title, description, category, image });
    console.log("User ID từ token:", userId);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Lỗi: ID blog không hợp lệ!");
      return res.status(400).json({ message: "ID blog không hợp lệ!" });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      console.log("Lỗi: Không tìm thấy blog!");
      return res.status(404).json({ message: "Không tìm thấy blog!" });
    }

    console.log("Blog tìm thấy:", blog);

    // Kiểm tra blog tồn tại trước khi truy cập userId
    if (blog) {
      console.log("Blog User ID:", blog.userId.toString());
      if (blog.userId.toString() !== userId.toString() && !req.user.isAdmin) {
        console.log("Lỗi: Không có quyền chỉnh sửa!");
        return res.status(403).json({ message: "Bạn không có quyền chỉnh sửa blog này!" });
      }
    } else {
      // Trường hợp này đã được xử lý ở trên (lỗi 404), nhưng để chắc chắn
      return;
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        console.log("Lỗi: ID danh mục không hợp lệ!", category);
        return res.status(400).json({ message: "ID danh mục không hợp lệ!" });
      }
      updateData.category = category;
    }
    if (image) updateData.image = image;

    console.log("Dữ liệu cập nhật:", updateData);

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate("category", "name").populate("userId", "userName");

    console.log("Blog đã cập nhật:", updatedBlog);

    return res.status(200).json({ message: "Cập nhật blog thành công!", blog: updatedBlog });

  } catch (error) {
    console.error("Lỗi khi cập nhật blog:", error);
    return res.status(500).json({ message: "Lỗi server khi cập nhật blog!", error: error.message });
  } finally {
    console.log("--- Kết thúc cập nhật blog ---");
  }
};


const getBlogsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    console.log("Received categoryId:", categoryId);

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).send({ message: "Invalid Category ID" });
    }

    console.log("Searching for blogs with categoryId:", categoryId);
    const blogs = await Blog.find({ category: categoryId });
    console.log("Found blogs:", blogs);

    return res.status(200).send({ message: "Blogs found", blogs });
  } catch (error) {
    console.error("Error fetching blogs by category:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
};
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("category", "name")
      .populate("userId", "userName");
    if (!blog) {
      return res.status(400).send({ message: "Blog not found" });
    }

    return res.status(200).send({ message: "Blog found", blog });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

const getBlogCountByDay = async (req, res) => {
  try {
    const dailyCounts = await Blog.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }, // Sắp xếp theo ngày
      },
    ]);

    res.status(200).json(dailyCounts);
  } catch (error) {
    console.error('Lỗi khi lấy số lượng blog theo ngày:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
const getBlogCount = async (req, res) => {
  try {
    const count = await Blog.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Lỗi khi lấy số lượng blog:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
module.exports = {
  createBlog,
  params,
  deleteBlog,
  getAllBlogs,
  getUserBlogs,
  blogUpdate,
  getBlogsByCategory,
  getBlogById,
  getBlogCountByDay,
  getBlogCount
};
