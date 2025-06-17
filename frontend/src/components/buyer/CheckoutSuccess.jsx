import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { orderAPI } from '../../services/api';

const CheckoutSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;
  const [billFile, setBillFile] = useState(null);
  const [billPreview, setBillPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBillFile(file);
      // Tạo URL preview cho ảnh
      const reader = new FileReader();
      reader.onloadend = () => {
        setBillPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmPayment = async () => {
    if (!billFile) {
      setError('Vui lòng chọn ảnh bill thanh toán!');
      return;
    }
    setUploading(true);
    setError('');
    try {
      await orderAPI.uploadBillImage(order._id, billFile);
      await orderAPI.markPaid(order._id);
      setSuccess(true);
    } catch (err) {
      setError('Có lỗi khi xác nhận thanh toán.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-pink-600 mb-4">Vui lòng thanh toán trước khi nhận hàng</h2>
      {order ? (
        <>
          <div className="mb-2">Mã đơn hàng: <b>{order._id}</b></div>
          <div className="mb-2">Tổng tiền: <b>{order.totalAmount.toLocaleString('vi-VN')}₫</b></div>
          {order.qrCodeUrl && order.paymentMethod !== 'COD' && (
            <div className="mt-4 flex items-center gap-4">
              <div>
                <div className="mb-2">Quét mã QR để thanh toán:</div>
                <img 
                  src={order.qrCodeUrl} 
                  alt="QR code" 
                  className="w-40 h-40 object-contain border cursor-pointer hover:opacity-90" 
                  onClick={() => setShowQRModal(true)}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Tải ảnh bill thanh toán:</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2" />
                {billFile && (
                  <div className="mt-2">
                    <div className="text-sm mb-2">Đã chọn: {billFile.name}</div>
                    {billPreview && (
                      <img 
                        src={billPreview} 
                        alt="Bill preview" 
                        className="w-40 h-40 object-contain border mt-2"
                      />
                    )}
                  </div>
                )}
                <button
                  className="mt-4 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 disabled:opacity-60"
                  onClick={handleConfirmPayment}
                  disabled={uploading}
                >
                  {uploading ? 'Đang xác nhận...' : 'Xác nhận thanh toán'}
                </button>
                {error && <div className="text-red-500 mt-2">{error}</div>}
                {success && (
                  <div className="text-green-600 mt-2 font-semibold">
                    Đã xác nhận thanh toán! <br />
                    <button
                      className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      onClick={() => navigate('/order-history')}
                    >
                      Xem lịch sử đơn hàng
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div>Không tìm thấy thông tin đơn hàng.</div>
      )}

      {/* Modal phóng to ảnh QR */}
      {showQRModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowQRModal(false)}
        >
          <div className="bg-white p-4 rounded-lg max-w-2xl max-h-[90vh] overflow-auto">
            <img 
              src={order.qrCodeUrl} 
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

export default CheckoutSuccess; 