const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword, generateToken } = require('../utils/authHelper');
const nodemailer = require('nodemailer');

exports.userRegister = async (req, res) => {
  try {
    const { userName, lastName, email, phone, password } = req.body;

    if (!userName || !lastName || !email || !phone || !password) {
      return res
        .status(400)
        .send({ message: "Please provide all require fields" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .send({ message: "User already register. Please login" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      userName,
      lastName,
      email,
      phone,
      password: hashedPassword,
    });

    return res
      .status(201)
      .send({ message: "User register successfully", newUser });
  } catch (error) {
    return res.status(500).send({ message: "Something went wrong" });
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
