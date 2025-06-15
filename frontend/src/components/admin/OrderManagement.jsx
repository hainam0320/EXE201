import React, { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';

const ORDER_STATUSES = {
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy'
};

const PAYMENT_STATUSES = {
  unpaid: 'Chưa thanh toán',
  paid: 'Đã thanh toán',
  failed: 'Thanh toán thất bại',
  refunded: 'Đã hoàn tiền'
};

const PAYMENT_METHODS = {
  COD: 'Thanh toán khi nhận hàng',
  momo: 'Ví MoMo',
  zalopay: 'Ví ZaloPay',
  credit_card: 'Thẻ tín dụng'
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAllOrders();
      if (response.data.success) {
        console.log('Orders data:', response.data.data);
        setOrders(response.data.data);
      } else {
        setError('Không thể lấy danh sách đơn hàng');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Không thể lấy danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await orderAPI.updateStatus(orderId, newStatus);
      if (response.data.success) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    try {
      const response = await orderAPI.updatePaymentStatus(orderId, newPaymentStatus);
      if (response.data.success) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, paymentStatus: newPaymentStatus } : order
        ));
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-green-600';
      case 'unpaid':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      case 'refunded':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return <div className="text-center py-4">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-4">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Quản lý đơn hàng</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Chưa có đơn hàng nào.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Đơn hàng #{order._id}</h3>
                  <p className="text-gray-600">
                    Khách hàng: {order.buyer ? order.buyer.name : 'Không có thông tin'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Địa chỉ: {order.deliveryAddress?.addressLine}, {order.deliveryAddress?.ward}, {order.deliveryAddress?.district}, {order.deliveryAddress?.city}
                    </p>
                    <p className="text-sm text-gray-600">SĐT: {order.deliveryAddress?.phone}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm">
                      <span className="font-medium">Phương thức thanh toán:</span>{' '}
                      {PAYMENT_METHODS[order.paymentMethod] || order.paymentMethod}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Trạng thái thanh toán:</span>{' '}
                      <span className={getPaymentStatusColor(order.paymentStatus)}>
                        {PAYMENT_STATUSES[order.paymentStatus] || order.paymentStatus}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-pink-600">
                    {order.totalAmount?.toLocaleString('vi-VN')}₫
                  </p>
                  <select
                    className="mt-2 px-3 py-1 border rounded-md text-sm"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    {Object.entries(ORDER_STATUSES).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <select
                    className="mt-2 ml-2 px-3 py-1 border rounded-md text-sm"
                    value={order.paymentStatus}
                    onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                  >
                    {Object.entries(PAYMENT_STATUSES).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-4 border-t border-gray-200 pt-4">
                <h4 className="font-medium mb-2">Sản phẩm:</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <div>
                        <span>{item.product?.name} x{item.quantity}</span>
                        <span className="ml-2 text-gray-500">
                          (Shop: {item.shop?.name})
                        </span>
                      </div>
                      <span>{item.totalPrice?.toLocaleString('vi-VN')}₫</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderManagement; 