const User = require('../model/userModel');

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
        // Mock data cho orders và products (sẽ thay thế khi có model tương ứng)
        totalOrders: 0,
        totalProducts: 0,
        totalRevenue: 0
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