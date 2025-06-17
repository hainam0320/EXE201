const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword, generateToken } = require('../utils/authHelper');
const nodemailer = require('nodemailer');
const Order = require('../model/orderModel');
const Product = require('../model/productModel');
const { upload } = require('../middleware/uploadMiddleware');

// Sử dụng middleware upload cho route đăng ký
exports.uploadReceipt = upload.single('receipt');

exports.userRegister = async (req, res) => {
  try {
    const { userName, lastName, email, phone, password, role } = req.body;

    // Debug log để kiểm tra data nhận được
    console.log('Registration data received:', {
      userName, lastName, email, phone, 
      role: role || 'undefined',
      bodyKeys: Object.keys(req.body)
    });

    console.log('Received files:', req.files);

    // Kiểm tra các trường bắt buộc
    if (!userName || !lastName || !email || !phone || !password) {
      return res
        .status(400)
        .send({ message: "Please provide all required fields." });
    }

    // Xử lý role
    let userRole = 'user';
    let userStatus = 'active';
    let requestedRole = null;
    let isPremium = false;
    let premiumStartDate = null;

    if (role === 'buyer') {
      userRole = 'buyer';
      userStatus = 'active';
    } else if (role === 'seller') {
      // Kiểm tra đã upload hóa đơn chưa
      if (!req.files?.receipt?.[0]) {
        return res.status(400).json({ message: 'Vui lòng gửi hóa đơn thanh toán (receipt).' });
      }

      userRole = 'user';          // Tạm thời vẫn là user
      userStatus = 'pending';     // Chờ admin duyệt
      requestedRole = 'seller';   // Ghi nhận yêu cầu làm seller
      isPremium = true;          // Tự động kích hoạt premium
      premiumStartDate = new Date(); // Ngày bắt đầu premium
    }

    console.log('Final role assigned:', { userRole, userStatus, requestedRole, isPremium, premiumStartDate });

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .send({ message: "User already registered. Please login." });
    }

    // Hash mật khẩu
    const hashedPassword = await hashPassword(password);

    // Tạo người dùng mới với đường dẫn receipt nếu có
    const newUser = await User.create({
      userName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role: userRole,
      status: userStatus,
      requestedRole: requestedRole,
      receipt: req.files?.receipt?.[0] ? `/uploads/receipts/${req.files.receipt[0].filename}` : undefined,
      isPremium,
      premiumStartDate
    });

    console.log('User created:', { 
      role: newUser.role, 
      status: newUser.status, 
      requestedRole: newUser.requestedRole,
      receipt: newUser.receipt,
      isPremium: newUser.isPremium,
      premiumStartDate: newUser.premiumStartDate
    });

    // Trả về phản hồi thành công
    let message = "User registered successfully.";
    if (role === 'seller') {
      message = "Đăng ký thành công! Tài khoản người bán của bạn đang chờ admin phê duyệt.";
    } else if (role === 'buyer') {
      message = "Đăng ký thành công! Bạn có thể đăng nhập ngay.";
    }

    return res.status(201).send({ message, newUser, needsApproval: role === 'seller' });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).send({ message: "Something went wrong." });
  }
};


exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Please provide all login required fields" });
    }

    const isUser = await User.findOne({ email });

    if (!isUser) {
      return res
        .status(400)
        .send({ message: "User not found, please register" });
    }

    // Kiểm tra status của user
    if (isUser.status === 'pending') {
      return res
        .status(403)
        .send({ 
          message: "Tài khoản của bạn đang chờ phê duyệt. Vui lòng liên hệ admin.",
          status: 'pending',
          requestedRole: isUser.requestedRole
        });
    }
    if (isUser.status === 'blocked' && isUser.role === 'seller' && !isUser.isPremium) {
      return res
        .status(403)
        .send({ 
          message: "Tài khoản của bạn đã bị khóa do hết hạn Premium.",
          status: 'blocked',
          needPremiumRenewal: true,
          role: 'seller'
        });
    }

    if (isUser.status === 'blocked') {
      return res
        .status(403)
        .send({ message: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin." });
    }

    if (isUser.status === 'rejected') {
      return res
        .status(403)
        .send({ message: "Yêu cầu tài khoản của bạn đã bị từ chối. Vui lòng liên hệ admin." });
    }

    const isMatchPassword = await comparePassword(password, isUser.password);

    if (!isMatchPassword) {
      return res.status(400).send({ message: "Invalid password" });
    }

    const token = await generateToken(isUser._id);

    return res.status(200).send({ 
      message: "User login successfully", 
      token, 
      userId: isUser._id,
      userName: isUser.userName,
      role: isUser.role,
      status: isUser.status,
      isAdmin: isUser.isAdmin
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ message: "Please provide email" });
    }

    const checkUser = await User.findOne({ email });

    if (!checkUser) {
      return res.status(400).send({ message: "User not found, please register" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.MY_GMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const resetLink = `${process.env.CLIENT_URL}?action=reset-password&token=${token}`;

    const receiver = {
      from: process.env.MY_GMAIL,
      to: email,
      subject: "🌸 HoaMuse - Đặt lại mật khẩu",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ec4899;">🌸 HoaMuse</h2>
          <h3>Yêu cầu đặt lại mật khẩu</h3>
          <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
          <p>Vui lòng click vào nút bên dưới để đặt lại mật khẩu:</p>
          <a href="${resetLink}" style="display: inline-block; background-color: #ec4899; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Đặt lại mật khẩu
          </a>
          <p><strong>Lưu ý:</strong> Link này sẽ hết hạn sau 1 giờ.</p>
          <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            Email này được gửi tự động từ hệ thống HoaMuse.<br>
            Vui lòng không trả lời email này.
          </p>
        </div>
      `,
      text: `Click vào link này để đặt lại mật khẩu: ${resetLink}. Link sẽ hết hạn sau 1 giờ.`,
    };

    await transporter.sendMail(receiver);

    return res.status(200).send({ message: "Password reset link sent successfully to your email" });
  } catch (error) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).send({ message: "Please provide password" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findOne({ email: decode.email });

    const newhashPassword = await hashPassword(password);

    user.password = newhashPassword;
    await user.save();

    return res.status(200).send({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
      return res
        .status(400)
        .send({ message: "Please provide all required fields" });
    }

    const checkUser = await User.findOne({ email });

    if (!checkUser) {
      return res
        .status(400)
        .send({ message: "User not found please register" });
    }

    const isMatchPassword = await comparePassword(
      currentPassword,
      checkUser.password
    );

    if (!isMatchPassword) {
      return res
        .status(400)
        .send({ message: "Current password does not match" });
    }

    const newHashPassword = await hashPassword(newPassword);

    await User.updateOne({ email }, { password: newHashPassword });

    return res.status(200).send({ message: "Password change successfully" });
  } catch (error) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(400).json([]);
    }

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json([]);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "User profile retrieved", user });
  } catch (error) {
    console.error("Profile error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    const { userName, lastName, phone, email } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (userName) user.userName = userName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (email) user.email = email;

    await user.save();
    return res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUser = req.user;

    if (requestingUser._id.toString() !== "67e384ee6c5b22c35962fd78") {
      return res.status(403).json({ message: "Bạn không có quyền thay đổi quyền người dùng!" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    if (user._id.toString() === "67e384ee6c5b22c35962fd78") {
      return res.status(400).json({ message: "Không thể thay đổi quyền của chính bạn!" });
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    res.json({ message: "Cập nhật quyền thành công!", user });
  } catch (error) {
    console.error("Lỗi cập nhật quyền:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};

// Approve seller request
exports.approveSellerRequest = async (req, res) => {
  try {
    console.log('=== APPROVE SELLER REQUEST - DETAILED DEBUG ===');
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);
    console.log('userId:', req.params.userId);
    console.log('action:', req.body.action);

    const { userId } = req.params;
    const { action } = req.body;

    if (!userId || !action) {
      console.log('Missing required fields:', { userId, action });
      return res.status(400).json({ message: "Thiếu thông tin cần thiết!" });
    }

    console.log('Finding user with ID:', userId);
    const user = await User.findById(userId);
    
    if (!user) {
      console.log('User not found with ID:', userId);
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    console.log('User found:', {
      id: user._id,
      email: user.email,
      status: user.status,
      role: user.role,
      requestedRole: user.requestedRole,
      isPremium: user.isPremium,
      premiumStartDate: user.premiumStartDate
    });

    // Kiểm tra điều kiện hợp lệ
    const isValidRequest = user.status === 'pending' && user.requestedRole === 'seller';
    console.log('Request validation:', {
      currentStatus: user.status,
      currentRequestedRole: user.requestedRole,
      isValidRequest
    });

    if (!isValidRequest) {
      console.log('Invalid request conditions:', {
        status: user.status,
        requestedRole: user.requestedRole
      });
      return res.status(400).json({ 
        message: "Không có yêu cầu seller nào để xử lý!",
        details: {
          status: user.status,
          requestedRole: user.requestedRole
        }
      });
    }

    if (action === 'approve') {
      console.log('Starting approval process...');
      
      // Lưu trạng thái cũ để debug
      const oldState = {
        role: user.role,
        status: user.status,
        requestedRole: user.requestedRole,
        isPremium: user.isPremium,
        premiumStartDate: user.premiumStartDate
      };
      console.log('Old state:', oldState);

      // Tính số ngày premium còn lại
      const premiumDuration = 30; // 30 ngày
      const startDate = user.premiumStartDate || new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + premiumDuration);
      const remainingDays = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24));

      // Cập nhật thông tin - giữ nguyên isPremium và premiumStartDate
      const updateResult = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            role: 'seller',
            status: 'active',
            requestedRole: null,
            isPremium: true,
            premiumStartDate: user.premiumStartDate || new Date()
          }
        },
        { new: true, runValidators: true }
      );

      console.log('Update result:', updateResult);

      if (!updateResult) {
        throw new Error('Failed to update user');
      }

      return res.json({ 
        message: "Đã duyệt tài khoản seller thành công!", 
        user: updateResult,
        premiumInfo: {
          isPremium: true,
          startDate: updateResult.premiumStartDate,
          endDate: endDate,
          remainingDays: remainingDays
        }
      });
    } else if (action === 'reject') {
      console.log('Rejecting seller request...');
      const updateResult = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            status: 'rejected',
            requestedRole: null,
            isPremium: false,
            premiumStartDate: null
          }
        },
        { new: true, runValidators: true }
      );

      if (!updateResult) {
        throw new Error('Failed to update user');
      }

      return res.json({ 
        message: "Đã từ chối yêu cầu seller!", 
        user: updateResult,
        premiumInfo: {
          isPremium: false,
          remainingDays: 0
        }
      });
    } else {
      console.log('Invalid action:', action);
      return res.status(400).json({ message: "Action không hợp lệ!" });
    }
  } catch (error) {
    console.error("=== ERROR IN APPROVE SELLER ===");
    console.error("Error details:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return res.status(500).json({ 
      message: "Lỗi server!", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get pending seller requests
exports.getPendingSellerRequests = async (req, res) => {
  try {
    const pendingUsers = await User.find({ 
      status: 'pending', 
      requestedRole: 'seller' 
    }).select('-password');

    res.json({ 
      message: "Danh sách yêu cầu seller", 
      users: pendingUsers,
      count: pendingUsers.length
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách pending:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Đếm tổng số users
    const totalUsers = await User.countDocuments();
    
    // Đếm users theo role
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    
    // Đếm users theo status
    const usersByStatus = await User.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Đếm pending sellers
    const pendingSellers = await User.countDocuments({ 
      status: 'pending', 
      requestedRole: 'seller' 
    });
    
    // Users đăng ký trong 30 ngày qua
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newUsersLast30Days = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Users đăng ký hôm nay
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    // Thống kê đơn hàng và doanh thu
    const allOrders = await Order.find();
    const paidOrders = allOrders.filter(order => order.paymentStatus === 'paid');
    const totalOrders = allOrders.length;
    const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // Thống kê sản phẩm
    const totalProducts = await Product.countDocuments();

    res.json({
      success: true,
      data: {
        totalUsers,
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        usersByStatus: usersByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        pendingSellers,
        newUsersLast30Days,
        newUsersToday,
        totalOrders,
        totalProducts,
        totalRevenue
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching dashboard statistics" 
    });
  }
};
exports.blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "Không tìm thấy người dùng" });
    }

    user.status = 'blocked';
    await user.save();

    return res.status(200).send({ 
      message: "Đã khóa tài khoản thành công",
      user 
    });

  } catch (error) {
    console.error("Block user error:", error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "Không tìm thấy người dùng" });
    }

    user.status = 'active';
    await user.save();

    return res.status(200).send({ 
      message: "Đã mở khóa tài khoản thành công",
      user 
    });

  } catch (error) {
    console.error("Unblock user error:", error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

exports.getPremiumInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).send({ message: "Không tìm thấy người dùng" });
        }

        // Nếu không phải seller, không cần kiểm tra premium
        if (user.role !== 'seller') {
            return res.status(200).send({
                isPremium: false,
                message: "Tài khoản không phải là seller"
            });
        }

        // Nếu đã bị khóa, trả về thông tin
        if (user.status === 'blocked') {
            return res.status(200).send({
                isPremium: false,
                isBlocked: true,
                message: "Tài khoản đã bị khóa"
            });
        }

        if (!user.isPremium || !user.premiumStartDate) {
            // Nếu là seller nhưng không có premium, khóa tài khoản
            user.status = 'blocked';
            user.isPremium = false;
            user.premiumStartDate = null;
            await user.save();

            return res.status(200).send({
                isPremium: false,
                isBlocked: true,
                message: "Tài khoản premium đã hết hạn và đã bị khóa"
            });
        }

        // Tính số ngày còn lại (30 ngày)
        const premiumDuration = 30;
        const startDate = new Date(user.premiumStartDate);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + premiumDuration);
        
        const today = new Date();
        const remainingDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

        // Nếu hết hạn, tự động khóa tài khoản
        if (remainingDays <= 0) {
            user.isPremium = false;
            user.premiumStartDate = null;
            user.status = 'blocked';
            await user.save();

            return res.status(200).send({
                isPremium: false,
                isBlocked: true,
                message: "Tài khoản premium đã hết hạn và đã bị khóa. Vui lòng liên hệ admin để được hỗ trợ."
            });
        }

        return res.status(200).send({
            isPremium: true,
            startDate: user.premiumStartDate,
            endDate: endDate,
            remainingDays: remainingDays,
            message: `Còn ${remainingDays} ngày premium`
        });
    } catch (error) {
        console.error('Get premium info error:', error);
        return res.status(500).send({ message: "Có lỗi xảy ra khi lấy thông tin premium" });
    }
};

exports.renewPremium = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!req.files || !req.files.receipt) {
      return res
        .status(400)
        .send({ message: "Vui lòng upload hóa đơn thanh toán" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .send({ message: "Không tìm thấy người dùng" });
    }

    if (user.role !== 'seller') {
      return res
        .status(400)
        .send({ message: "Chỉ tài khoản seller mới cần gia hạn Premium" });
    }

    // Cập nhật thông tin user
    user.status = 'pending';
    user.requestedRole = 'seller';
    user.requestType = 'premium_renewal'; // Đánh dấu là yêu cầu gia hạn premium
    user.receipt = `/${req.files.receipt[0].path.replace(/\\/g, '/')}`;
    await user.save();

    return res
      .status(200)
      .send({ message: "Yêu cầu gia hạn Premium đã được gửi thành công" });

  } catch (error) {
    console.error("Premium renewal error:", error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};
