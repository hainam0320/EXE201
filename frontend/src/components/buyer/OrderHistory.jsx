import React, { useEffect, useState } from 'react';
import { orderAPI } from '../../services/api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [billFile, setBillFile] = useState(null);
  const [billPreview, setBillPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const PAYMENT_STATUS_LABELS = {
    unpaid: 'Chưa thanh toán',
    paid: 'Đã thanh toán',
    refunded: 'Đã hoàn tiền',
    failed: 'Thanh toán thất bại'
  };
  const PAYMENT_STATUS_COLORS = {
    unpaid: 'text-yellow-600',
    paid: 'text-green-600',
    refunded: 'text-blue-600',
    failed: 'text-red-600'
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderAPI.getMyOrders();
        if (res.data.success) {
          console.log('Orders data:', res.data.data);
          setOrders(res.data.data);
        } else {
          setError('Không thể lấy lịch sử đơn hàng');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Không thể lấy lịch sử đơn hàng');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBillFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBillPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadBill = async () => {
    if (!billFile) {
      alert('Vui lòng chọn ảnh bill thanh toán!');
      return;
    }
    setUploading(true);
    try {
      await orderAPI.uploadBillImage(selectedOrder._id, billFile);
      // Cập nhật lại danh sách đơn hàng
      const res = await orderAPI.getMyOrders();
      if (res.data.success) {
        setOrders(res.data.data);
      }
      setSelectedOrder(null);
      setBillFile(null);
      setBillPreview(null);
    } catch (err) {
      alert('Có lỗi khi upload ảnh bill!');
    } finally {
      setUploading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }
    try {
      const res = await orderAPI.cancelOrder(selectedOrder._id);
      if (res.data.success) {
        // Cập nhật lại danh sách đơn hàng
        const updatedOrders = await orderAPI.getMyOrders();
        if (updatedOrders.data.success) {
          setOrders(updatedOrders.data.data);
        }
        setSelectedOrder(null);
      }
    } catch (err) {
      alert('Có lỗi khi hủy đơn hàng!');
    }
  };

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
            <div 
              key={order._id} 
              className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => {
                console.log('Selected order:', order);
                setSelectedOrder(order);
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-semibold">Mã đơn hàng:</span> {order._id}
                </div>
               
              </div>
              <div className="mb-2">
                <span className="font-semibold">Thanh toán:</span>{' '}
                <span className={PAYMENT_STATUS_COLORS[order.paymentStatus] || 'text-gray-600'}>
                  {PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus}
                </span>
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
            </div>
          ))}
        </div>
      )}

      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">Chi tiết đơn hàng #{selectedOrder._id}</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setSelectedOrder(null);
                  setBillFile(null);
                  setBillPreview(null);
                }}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="font-semibold">Trạng thái:</span> <span className="text-pink-600">{selectedOrder.status}</span>
              </div>
              <div>
                <span className="font-semibold">Thanh toán:</span>{' '}
                <span className={PAYMENT_STATUS_COLORS[selectedOrder.paymentStatus] || 'text-gray-600'}>
                  {PAYMENT_STATUS_LABELS[selectedOrder.paymentStatus] || selectedOrder.paymentStatus}
                </span>
              </div>
              <div>
                <span className="font-semibold">Tổng tiền:</span> <span className="text-pink-600">{selectedOrder.totalAmount.toLocaleString('vi-VN')}₫</span>
              </div>

              {/* Phần QR code và Bill */}
              <div className="flex flex-wrap gap-4 mt-4">
                {selectedOrder.paymentStatus !== 'paid' && (
                  <div>
                    <span className="font-semibold block mb-1">Quét mã QR để thanh toán:</span>
                    <img 
                      src={selectedOrder.qrCodeUrl} 
                      alt="QR code" 
                      className="w-40 h-40 object-contain border cursor-pointer hover:opacity-90"
                      onClick={() => setShowQRModal(true)}
                    />
                  </div>
                )}
                <div>
                  <span className="font-semibold block mb-1">Ảnh bill thanh toán:</span>
                  {selectedOrder.billImage ? (
                    <img 
                      src={selectedOrder.billImage} 
                      alt="Bill" 
                      className="w-40 h-40 object-contain border"
                    />
                  ) : (
                    <div className="w-40 h-40 border border-dashed flex items-center justify-center text-gray-500">
                      Chưa có ảnh bill
                    </div>
                  )}
                  {selectedOrder.paymentStatus !== 'paid' && (
                    <div className="mt-2">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        className="text-sm"
                      />
                      {billPreview && (
                        <div className="mt-2">
                          <img 
                            src={billPreview} 
                            alt="Bill preview" 
                            className="w-40 h-40 object-contain border"
                          />
                        </div>
                      )}
                      <button
                        className="mt-2 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 disabled:opacity-60"
                        onClick={handleUploadBill}
                        disabled={!billFile || uploading}
                      >
                        {uploading ? 'Đang upload...' : 'Upload bill'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Nút hủy đơn hàng */}
              {selectedOrder.status === 'pending' && (
                <div className="mt-4">
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={handleCancelOrder}
                  >
                    Hủy đơn hàng
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal phóng to QR code */}
      {showQRModal && selectedOrder?.qrCodeUrl && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowQRModal(false)}
        >
          <div className="bg-white p-4 rounded-lg max-w-2xl max-h-[90vh] overflow-auto">
            <img 
              src={selectedOrder.qrCodeUrl} 
              alt="QR code" 
              className="w-full h-auto object-contain"
            />
            <button 
              className="mt-4 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
              onClick={() => setShowQRModal(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
