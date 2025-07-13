import React, { useEffect, useState } from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { cartAPI } from '../../services/api'; // ✅ Dùng đúng cartAPI
import { useNavigate } from 'react-router-dom';

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart();
      if (response.data.success) {
        setCartItems(response.data.data);
        setTotal(response.data.total);
      }
    } catch (err) {
      console.error('❌ Lỗi khi lấy giỏ hàng:', err);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await cartAPI.updateCartItem(productId, newQuantity);
      fetchCart();
    } catch (err) {
      console.error('❌ Lỗi khi cập nhật số lượng:', err);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await cartAPI.removeFromCart(productId);
      fetchCart();
    } catch (err) {
      console.error('❌ Lỗi khi xóa sản phẩm:', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Giỏ hàng</h2>
    

      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Giỏ hàng trống</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.productId._id}
              className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4"
            >
              <img
                src={item.productId.image}
                alt={item.productId.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.productId.name}</h3>
                <p className="text-pink-600 font-bold">
                  {item.productId.price.toLocaleString('vi-VN')}₫
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    handleQuantityChange(item.productId._id, item.quantity - 1)
                  }
                  className="w-8 h-8 flex items-center justify-center border rounded"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() =>
                    handleQuantityChange(item.productId._id, item.quantity + 1)
                  }
                  className="w-8 h-8 flex items-center justify-center border rounded"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleRemove(item.productId._id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Tổng cộng:</span>
              <span className="text-pink-600">
                {total.toLocaleString('vi-VN')}₫
              </span>
            </div>
            <button
              className="w-full mt-4 bg-pink-600 text-white py-3 rounded-md hover:bg-pink-700 transition-colors"
              onClick={() => navigate('/checkout')}
            >
              Thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;
