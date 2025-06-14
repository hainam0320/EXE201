import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI, cartAPI } from '../../services/api';

const paymentMethods = [
  { value: 'COD', label: 'Thanh toán khi nhận hàng (COD)' },
  { value: 'momo', label: 'Chuyển khoản Momo' },
  { value: 'zalopay', label: 'Chuyển khoản ZaloPay' },
  { value: 'credit_card', label: 'Thẻ tín dụng' },
];

const Checkout = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    addressLine: '',
    ward: '',
    district: '',
    city: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  React.useEffect(() => {
    // Lấy giỏ hàng từ API
    const fetchCart = async () => {
      try {
        const response = await cartAPI.getCart();
        if (response.data.success) {
          setCartItems(response.data.data);
          setTotal(response.data.total);
        }
      } catch (err) {
        setError('Không thể lấy giỏ hàng');
      }
    };
    fetchCart();
  }, []);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Validate
    if (!address.name || !address.phone || !address.addressLine || !address.city) {
      setError('Vui lòng nhập đầy đủ thông tin giao hàng');
      setLoading(false);
      return;
    }
    if (cartItems.length === 0) {
      setError('Giỏ hàng trống');
      setLoading(false);
      return;
    }
    // Chuẩn bị dữ liệu đơn hàng
    const items = cartItems.map(item => {
      let shopId = undefined;
      if (item.productId.shop) {
        shopId = typeof item.productId.shop === 'object' ? item.productId.shop._id : item.productId.shop;
      }
      if (!shopId) {
        console.error('Thiếu trường shop cho sản phẩm:', item.productId);
      }
      return {
        product: item.productId._id,
        shop: shopId,
        name: item.productId.name,
        quantity: item.quantity,
        unitPrice: item.productId.price,
        totalPrice: item.productId.price * item.quantity,
      };
    });
    try {
      const res = await orderAPI.create({
        items,
        deliveryAddress: address,
        paymentMethod,
      });
      if (res.data.success) {
        // Xóa giỏ hàng sau khi đặt hàng thành công
        await cartAPI.clearCart();
        // Chuyển sang trang hiển thị QR nếu cần
        navigate('/checkout/success', { state: { order: res.data.data } });
      } else {
        setError('Đặt hàng thất bại');
      }
    } catch (err) {
      console.error('Order error:', err, err?.response?.data);
      setError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Đặt hàng thất bại'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">Thông tin giao hàng</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input name="name" value={address.name} onChange={handleChange} placeholder="Họ tên người nhận" className="border p-2 rounded" />
          <input name="phone" value={address.phone} onChange={handleChange} placeholder="Số điện thoại" className="border p-2 rounded" />
        </div>
        <input name="addressLine" value={address.addressLine} onChange={handleChange} placeholder="Địa chỉ (số nhà, đường)" className="border p-2 rounded w-full" />
        <div className="grid grid-cols-3 gap-4">
          <input name="ward" value={address.ward} onChange={handleChange} placeholder="Phường/Xã" className="border p-2 rounded" />
          <input name="district" value={address.district} onChange={handleChange} placeholder="Quận/Huyện" className="border p-2 rounded" />
          <input name="city" value={address.city} onChange={handleChange} placeholder="Tỉnh/Thành phố" className="border p-2 rounded" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Phương thức thanh toán</label>
          <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="border p-2 rounded w-full">
            {paymentMethods.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-between items-center font-bold text-lg">
          <span>Tổng tiền:</span>
          <span className="text-pink-600">{total.toLocaleString('vi-VN')}₫</span>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-pink-600 text-white py-3 rounded-md hover:bg-pink-700 transition-colors font-semibold">
          {loading ? 'Đang xử lý...' : 'Tiếp tục & Đặt hàng'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
