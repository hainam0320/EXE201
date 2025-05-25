import React, { useState } from 'react';
import { BarChart3, Package, ShoppingCart, Plus, Edit, Trash2 } from 'lucide-react';
import mockProducts from '../../data/mockProducts';

const SellerDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
  
    const tabs = [
      { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
      { id: 'products', label: 'Sản phẩm', icon: Package },
      { id: 'orders', label: 'Đơn hàng', icon: ShoppingCart },
    ];
  
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard Người bán</h1>
        
        {/* Tabs */}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold">Tổng doanh thu</h3>
                  <p className="text-3xl font-bold">15,500,000₫</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold">Đơn hàng</h3>
                  <p className="text-3xl font-bold">45</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold">Sản phẩm</h3>
                  <p className="text-3xl font-bold">12</p>
                </div>
              </div>
            )}
  
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Quản lý sản phẩm</h2>
                  <button className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Thêm sản phẩm</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {mockProducts.map(product => (
                    <div key={product.id} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-gray-600">{product.price.toLocaleString('vi-VN')}₫</p>
                          <p className="text-sm text-gray-500">Kho: {product.stock}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-100 rounded">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
  
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Đơn hàng nhận được</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map(orderId => (
                    <div key={orderId} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">Đơn hàng #00{orderId}</h3>
                          <p className="text-gray-600">Khách hàng: Nguyễn Văn A</p>
                          <p className="text-sm text-gray-500">Ngày đặt: 23/05/2025</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-pink-600">299,000₫</p>
                          <select className="mt-2 px-3 py-1 border rounded-md text-sm">
                            <option>Chờ xử lý</option>
                            <option>Đang giao</option>
                            <option>Hoàn tất</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

export default SellerDashboard;