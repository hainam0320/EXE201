const userRegister = async (req, res) => {
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

const userLogin = async (req, res) => {
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

    // ✅ Tạo token
    const token = await generateToken(isUser._id);

    // ✅ Trả về thêm userId và userName để frontend có thể lưu
    return res.status(200).send({ 
      message: "User login successfully", 
      token, 
      userId: isUser._id, // 📌 Thêm userId
      userName: isUser.userName, // 📌 Thêm userName (nếu cần)
      isAdmin: isUser.isAdmin
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};



const forgetPassword = async (req, res) => {
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

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`; // Sửa lại link

    const receiver = {
      from: process.env.MY_GMAIL,
      to: email,
      subject: "Password Reset Request",
      text: `Click on this link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(receiver);

    return res.status(200).send({ message: "Password reset link sent successfully to your email" });
  } catch (error) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};


const resetPassword = async (req, res) => {
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

const changePassword = async (req, res) => {
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
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(400).json([]); // ✅ Trả về mảng rỗng thay vì object
    }

    return res.status(200).json(users); // ✅ Trả về danh sách người dùng trực tiếp
  } catch (error) {
    return res.status(500).json([]); // ✅ Tránh lỗi frontend nếu API lỗi
  }
};
const getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.userId;

    const user = await User.findById(userId).select("-password"); // Không trả về password
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "User profile retrieved", user });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.userId;

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
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUser = req.user; // Lấy user đang thực hiện request

    // Chỉ cho phép userId đặc biệt có thể thay đổi quyền người khác
    if (requestingUser._id.toString() !== "67e384ee6c5b22c35962fd78") {
      return res.status(403).json({ message: "Bạn không có quyền thay đổi quyền người dùng!" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    // Ngăn chặn tự hạ quyền chính mình
    if (user._id.toString() === "67e384ee6c5b22c35962fd78") {
      return res.status(400).json({ message: "Không thể thay đổi quyền của chính bạn!" });
    }

    // Chuyển đổi quyền (User <-> Admin)
    user.isAdmin = !user.isAdmin;
    await user.save();

    res.json({ message: "Cập nhật quyền thành công!", user });
  } catch (error) {
    console.error("Lỗi cập nhật quyền:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};

module.exports = {
  userRegister,
  userLogin,
  forgetPassword,
  resetPassword,
  changePassword,
  getAllUsers,
  getProfile,
  updateProfile,
  updateUserRole
};
