import React, { useEffect, useState } from 'react';
import { orderAPI } from '../../services/api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderAPI.getMyOrders();
        if (res.data.success) {
          setOrders(res.data.data);
        } else {
          setError('Không thể lấy lịch sử đơn hàng');
        }
      } catch (err) {
        setError('Không thể lấy lịch sử đơn hàng');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-8">Đang tải...</div>;
  if (error) return <div className="text-center text-red-600 py-8">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h2>
      {orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Bạn chưa có đơn hàng nào.</div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-semibold">Mã đơn hàng:</span> {order._id}
                </div>
                <div>
                  <span className="font-semibold">Trạng thái:</span> <span className="text-pink-600">{order.status}</span>
                </div>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Thanh toán:</span> {order.paymentStatus === 'paid' ? <span className="text-green-600">Đã thanh toán</span> : <span className="text-yellow-600">Chưa thanh toán</span>}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Tổng tiền:</span> <span className="text-pink-600">{order.totalAmount.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Sản phẩm:</span>
                <ul className="list-disc ml-6">
                  {order.items.map(item => (
                    <li key={item.product?._id || item.name} className="flex items-center space-x-2 mb-1">
                      {item.product?.image && (
                        <img src={item.product.image} alt={item.name} className="w-10 h-10 object-cover rounded border" />
                      )}
                      <span>{item.name} x {item.quantity} ({item.totalPrice.toLocaleString('vi-VN')}₫)</span>
                    </li>
                  ))}
                </ul>
              </div>
              {order.qrCodeUrl && order.paymentStatus !== 'paid' && (
                <div className="mt-4">
                  <span className="font-semibold block mb-1">Quét mã QR để thanh toán:</span>
                  <img src={order.qrCodeUrl} alt="QR code" className="w-40 h-40 object-contain border mx-auto" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
