import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, Package, ShoppingCart, Clock, CheckCircle, XCircle, BookOpen, Lock, Unlock } from 'lucide-react';
import { authAPI } from '../../services/api';
import BlogManagement from './BlogManagement';
import OrderManagement from './OrderManagement';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [pendingCount, setPendingCount] = useState(0);
    const [dashboardStats, setDashboardStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalRevenue: 0,
        newUsersToday: 0,
        newUsersLast30Days: 0,
        usersByRole: {},
        usersByStatus: {},
        pendingSellers: 0,
        premiumUsers: 0
    });
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchPendingCount();
        fetchDashboardStats();
    }, []);

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        }
    }, [activeTab]);

    const fetchPendingCount = async () => {
        try {
            const response = await authAPI.getPendingSellers();
            setPendingCount(response.data.count);
        } catch (error) {
            console.error('Error fetching pending count:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDashboardStats = async () => {
        try {
            setStatsLoading(true);
            const response = await authAPI.getDashboardStats();
            if (response.data.success) {
                setDashboardStats(response.data.data);
                setPendingCount(response.data.data.pendingSellers);
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setStatsLoading(false);
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            setUsersLoading(true);
            const response = await authAPI.getAllUsers();
            setUsers(response.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        } finally {
            setUsersLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Hoạt động' },
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Chờ duyệt' },
            blocked: { bg: 'bg-red-100', text: 'text-red-800', label: 'Bị khóa' },
            rejected: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Bị từ chối' }
        };
        
        const config = statusConfig[status] || statusConfig.active;
        return (
            <span className={`px-2 py-1 ${config.bg} ${config.text} rounded-full text-xs`}>
                {config.label}
            </span>
        );
    };

    const getPremiumBadge = (user) => {
        if (!user.isPremium) return null;
        return (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs ml-2">
                Premium
            </span>
        );
    };

    const getRoleDisplay = (user) => {
        if (user.role === 'admin') return 'Admin';
        if (user.role === 'seller') return 'Seller';
        if (user.role === 'buyer') return 'Buyer';
        if (user.requestedRole === 'seller') return 'User (Yêu cầu Seller)';
        return 'User';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };
  
    const tabs = [
      { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
      { id: 'users', label: 'Người dùng', icon: Users },
      { id: 'products', label: 'Sản phẩm', icon: Package },
      { id: 'orders', label: 'Đơn hàng', icon: ShoppingCart },
      { id: 'blogs', label: 'Quản lý Blog', icon: BookOpen },
    ];
  
    const handleBlockUser = async (userId) => {
        try {
            setActionLoading(userId);
            const response = await authAPI.blockUser(userId);
            // Update only the specific user in the list
            setUsers(users.map(user => 
                user._id === userId 
                    ? { ...user, status: 'blocked' }
                    : user
            ));
        } catch (error) {
            console.error('Error blocking user:', error);
            alert('Có lỗi xảy ra khi khóa tài khoản');
        } finally {
            setActionLoading(null);
        }
    };

    const handleUnblockUser = async (userId) => {
        try {
            setActionLoading(userId);
            const response = await authAPI.unblockUser(userId);
            // Update only the specific user in the list
            setUsers(users.map(user => 
                user._id === userId 
                    ? { ...user, status: 'active' }
                    : user
            ));
        } catch (error) {
            console.error('Error unblocking user:', error);
            alert('Có lỗi xảy ra khi mở khóa tài khoản');
        } finally {
            setActionLoading(null);
        }
    };

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
  
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                    <h3 className="text-lg font-semibold">Tổng người dùng</h3>
                    <p className="text-3xl font-bold">
                      {statsLoading ? '...' : dashboardStats.totalUsers.toLocaleString()}
                    </p>
                    <p className="text-sm opacity-75 mt-1">
                      +{statsLoading ? '...' : dashboardStats.newUsersToday} hôm nay
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                    <h3 className="text-lg font-semibold">Tổng đơn hàng</h3>
                    <p className="text-3xl font-bold">
                      {statsLoading ? '...' : dashboardStats.totalOrders.toLocaleString()}
                    </p>
                    <p className="text-sm opacity-75 mt-1">Tất cả đơn hàng</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                    <h3 className="text-lg font-semibold">Tổng sản phẩm</h3>
                    <p className="text-3xl font-bold">
                      {statsLoading ? '...' : dashboardStats.totalProducts.toLocaleString()}
                    </p>
                    <p className="text-sm opacity-75 mt-1">Sản phẩm hoạt động</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
                    <h3 className="text-lg font-semibold">Doanh thu</h3>
                    <p className="text-3xl font-bold">
                      {statsLoading ? '...' : formatCurrency(dashboardStats.totalRevenue)}
                    </p>
                    <p className="text-sm opacity-75 mt-1">Tổng doanh thu</p>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống kê người dùng</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Người dùng mới (30 ngày):</span>
                        <span className="font-semibold">
                          {statsLoading ? '...' : dashboardStats.newUsersLast30Days}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tài khoản Premium:</span>
                        <span className="font-semibold">
                          {statsLoading ? '...' : (dashboardStats.premiumUsers || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sellers:</span>
                        <span className="font-semibold">
                          {statsLoading ? '...' : (dashboardStats.usersByRole.seller || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Buyers:</span>
                        <span className="font-semibold">
                          {statsLoading ? '...' : (dashboardStats.usersByRole.buyer || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Trạng thái tài khoản</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hoạt động:</span>
                        <span className="font-semibold text-green-600">
                          {statsLoading ? '...' : (dashboardStats.usersByStatus.active || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Chờ duyệt:</span>
                        <span className="font-semibold text-yellow-600">
                          {statsLoading ? '...' : (dashboardStats.usersByStatus.pending || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bị khóa:</span>
                        <span className="font-semibold text-red-600">
                          {statsLoading ? '...' : (dashboardStats.usersByStatus.blocked || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Hoạt động gần đây</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Đăng ký hôm nay:</span>
                        <span className="font-semibold text-blue-600">
                          {statsLoading ? '...' : dashboardStats.newUsersToday}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Yêu cầu seller:</span>
                        <span className="font-semibold text-orange-600">
                          {statsLoading ? '...' : dashboardStats.pendingSellers}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Hành động nhanh</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Seller Approval Card */}
                    <div className="bg-white border-2 border-yellow-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Clock className="h-8 w-8 text-yellow-600 mr-3" />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">Phê duyệt Seller</h3>
                            <p className="text-sm text-gray-600">Duyệt tài khoản người bán</p>
                          </div>
                        </div>
                        {!loading && pendingCount > 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {pendingCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        {loading ? 'Đang tải...' : 
                         pendingCount > 0 ? `${pendingCount} yêu cầu đang chờ xử lý` : 
                         'Không có yêu cầu nào'}
                      </p>
                      <button
                        onClick={() => navigate('/admin/seller-approval')}
                        className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors"
                      >
                        Xem yêu cầu
                      </button>
                    </div>

                    {/* User Management Card */}
                    <div className="bg-white border-2 border-blue-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-4">
                        <Users className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">Quản lý người dùng</h3>
                          <p className="text-sm text-gray-600">Xem và quản lý tài khoản</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Quản lý tất cả {statsLoading ? '...' : dashboardStats.totalUsers} người dùng trong hệ thống
                      </p>
                      <button
                        onClick={() => setActiveTab('users')}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Quản lý users
                      </button>
                    </div>

                    {/* Reports Card */}
                    <div className="bg-white border-2 border-green-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-4">
                        <BarChart3 className="h-8 w-8 text-green-600 mr-3" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">Báo cáo</h3>
                          <p className="text-sm text-gray-600">Xem thống kê hệ thống</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Phân tích dữ liệu và hiệu suất
                      </p>
                      <button 
                        onClick={fetchDashboardStats}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                      >
                        {statsLoading ? 'Đang tải...' : 'Làm mới dữ liệu'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pending Sellers Card */}
                {pendingCount > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="h-6 w-6 text-yellow-600 mr-2" />
                        <h3 className="text-lg font-semibold text-yellow-800">
                          Yêu cầu seller chờ duyệt
                        </h3>
                      </div>
                      <button
                        onClick={() => navigate('/admin/seller-approval')}
                        className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200"
                      >
                        Xem {pendingCount} yêu cầu →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
  
            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Quản lý người dùng</h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={fetchUsers}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {usersLoading ? 'Đang tải...' : 'Làm mới'}
                    </button>
                    <button
                      onClick={() => navigate('/admin/seller-approval')}
                      className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Phê duyệt Seller ({pendingCount})
                    </button>
                  </div>
                </div>
                
                {/* User Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800">Tổng người dùng</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {statsLoading ? '...' : dashboardStats.totalUsers}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800">Buyers</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {statsLoading ? '...' : (dashboardStats.usersByRole.buyer || 0)}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-800">Sellers</h3>
                    <p className="text-2xl font-bold text-purple-600">
                      {statsLoading ? '...' : (dashboardStats.usersByRole.seller || 0)}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-800">Chờ duyệt</h3>
                    <p className="text-2xl font-bold text-yellow-600">
                      {statsLoading ? '...' : dashboardStats.pendingSellers}
                    </p>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  {usersLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                      <span className="ml-3 text-gray-600">Đang tải danh sách người dùng...</span>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Không có người dùng nào trong hệ thống</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full table-auto">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.userName || 'Chưa cập nhật'}
                                  </div>
                                  {user.lastName && (
                                    <div className="text-sm text-gray-500">{user.lastName}</div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{user.email}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {user.phone || 'Chưa cập nhật'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{getRoleDisplay(user)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(user.status)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(user.createdAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  {user.role !== 'admin' && (
                                    user.status === 'blocked' ? (
                                      <button
                                        onClick={() => handleUnblockUser(user._id)}
                                        disabled={actionLoading === user._id}
                                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                      >
                                        {actionLoading === user._id ? (
                                          <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Đang xử lý...
                                          </span>
                                        ) : (
                                          <>
                                            <Unlock className="h-4 w-4 mr-1" />
                                            Mở khóa
                                          </>
                                        )}
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleBlockUser(user._id)}
                                        disabled={actionLoading === user._id}
                                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                      >
                                        {actionLoading === user._id ? (
                                          <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Đang xử lý...
                                          </span>
                                        ) : (
                                          <>
                                            <Lock className="h-4 w-4 mr-1" />
                                            Khóa
                                          </>
                                        )}
                                      </button>
                                    )
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Quản lý sản phẩm</h2>
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Chức năng quản lý sản phẩm sẽ được phát triển.</p>
                  <p className="text-sm text-gray-500">
                    Hiện tại có {statsLoading ? '...' : dashboardStats.totalProducts} sản phẩm trong hệ thống
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <OrderManagement />
            )}

            {activeTab === 'blogs' && (
              <BlogManagement />
            )}
          </div>
        </div>
      </div>
    );
  };

export default AdminDashboard;