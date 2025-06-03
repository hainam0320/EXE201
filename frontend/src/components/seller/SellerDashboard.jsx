import React, { useState, useEffect } from 'react';
import { BarChart3, Package, ShoppingCart, Plus, Edit, Trash2 } from 'lucide-react';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';

const API_URL = 'http://localhost:9999/api';

const SellerDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [dashboardStats, setDashboardStats] = useState({
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
    });
    const [loading, setLoading] = useState(true);
  
    const tabs = [
      { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
      { id: 'products', label: 'Sản phẩm', icon: Package },
      { id: 'orders', label: 'Đơn hàng', icon: ShoppingCart },
    ];
  
    useEffect(() => {
      if (activeTab === 'overview') {
        fetchDashboardStats();
      }
    }, [activeTab]);
  
    const fetchDashboardStats = async () => {
      try {
        // Fetch products count
        const productsResponse = await fetch(`${API_URL}/products`);
        const productsData = await productsResponse.json();
        
        // Fetch orders (you'll need to implement this API)
        const ordersResponse = await fetch(`${API_URL}/orders`);
        const ordersData = await ordersResponse.json();

        // Calculate total revenue from orders
        const totalRevenue = ordersData.data ? ordersData.data.reduce((sum, order) => sum + (order.totalAmount || 0), 0) : 0;

        setDashboardStats({
          totalRevenue: totalRevenue,
          totalOrders: ordersData.data ? ordersData.data.length : 0,
          totalProducts: productsData.count || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
  
    const renderTabContent = () => {
      switch (activeTab) {
        case 'overview':
          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold">Tổng doanh thu</h3>
                <p className="text-3xl font-bold">
                  {dashboardStats.totalRevenue.toLocaleString('vi-VN')}₫
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold">Đơn hàng</h3>
                <p className="text-3xl font-bold">{dashboardStats.totalOrders}</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold">Sản phẩm</h3>
                <p className="text-3xl font-bold">{dashboardStats.totalProducts}</p>
              </div>
            </div>
          );
        case 'products':
          return <ProductManagement onProductsChange={fetchDashboardStats} />;
        case 'orders':
          return <OrderManagement onOrdersChange={fetchDashboardStats} />;
        default:
          return null;
      }
    };
  
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
            {loading && activeTab === 'overview' ? (
              <div className="text-center py-4">Đang tải...</div>
            ) : (
              renderTabContent()
            )}
          </div>
        </div>
      </div>
    );
  };

export default SellerDashboard;