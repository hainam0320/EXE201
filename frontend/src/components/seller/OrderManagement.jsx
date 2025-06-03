import React, { useState, useEffect } from 'react';

const ORDER_STATUSES = {
  PENDING: 'Chờ xử lý',
  SHIPPING: 'Đang giao',
  COMPLETED: 'Hoàn tất',
  CANCELLED: 'Đã hủy'
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/seller/orders');
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/seller/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Đang tải...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Đơn hàng nhận được</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Chưa có đơn hàng nào.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Đơn hàng #{order.orderNumber}</h3>
                  <p className="text-gray-600">Khách hàng: {order.customerName}</p>
                  <p className="text-sm text-gray-500">
                    Ngày đặt: {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                  </p>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Địa chỉ: {order.shippingAddress}</p>
                    <p className="text-sm text-gray-600">SĐT: {order.phoneNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-pink-600">
                    {order.totalAmount.toLocaleString('vi-VN')}₫
                  </p>
                  <select
                    className="mt-2 px-3 py-1 border rounded-md text-sm"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    {Object.entries(ORDER_STATUSES).map(([value, label]) => (
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
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.productName} x{item.quantity}</span>
                      <span>{item.price.toLocaleString('vi-VN')}₫</span>
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
