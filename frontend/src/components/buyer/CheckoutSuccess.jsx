import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const CheckoutSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Đặt hàng thành công!</h2>
      {order ? (
        <>
          <div className="mb-2">Mã đơn hàng: <b>{order._id}</b></div>
          <div className="mb-2">Tổng tiền: <b>{order.totalAmount.toLocaleString('vi-VN')}₫</b></div>
          {order.qrCodeUrl && order.paymentMethod !== 'COD' && (
            <div className="mt-4">
              <div className="mb-2">Quét mã QR để thanh toán:</div>
              <img src={order.qrCodeUrl} alt="QR code" className="w-40 h-40 object-contain border mx-auto" />
            </div>
          )}
        </>
      ) : (
        <div>Không tìm thấy thông tin đơn hàng.</div>
      )}
      <Link to="/order-history" className="block mt-6 text-center bg-pink-600 text-white py-2 rounded hover:bg-pink-700">Xem lịch sử đơn hàng</Link>
    </div>
  );
};

export default CheckoutSuccess; 