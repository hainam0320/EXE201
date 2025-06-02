import React, { useState } from 'react';
import { BarChart3, Users, Package, ShoppingCart } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
  
    const tabs = [
      { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
      { id: 'users', label: 'Người dùng', icon: Users },
      { id: 'products', label: 'Sản phẩm', icon: Package },
      { id: 'orders', label: 'Đơn hàng', icon: ShoppingCart },
    ];
  
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold">Tổng người dùng</h3>
                  <p className="text-3xl font-bold">1,247</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold">Tổng đơn hàng</h3>
                  <p className="text-3xl font-bold">328</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold">Tổng sản phẩm</h3>
                  <p className="text-3xl font-bold">156</p>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold">Doanh thu</h3>
                  <p className="text-3xl font-bold">45M₫</p>
                </div>
              </div>
            )}
  
            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Quản lý người dùng</h2>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Tên</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Vai trò</th>
                        <th className="px-4 py-2 text-left">Trạng thái</th>
                        <th className="px-4 py-2 text-left">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'].map((name, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2">{name}</td>
                          <td className="px-4 py-2">user{index + 1}@email.com</td>
                          <td className="px-4 py-2">{index === 0 ? 'Seller' : 'Buyer'}</td>
                          <td className="px-4 py-2">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              Hoạt động
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <button className="text-red-600 hover:text-red-800 text-sm">
                              Khóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

export default AdminDashboard;