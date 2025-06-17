import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { cartAPI } from '../../services/api'; 
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

const ProductCard = ({ product, onAddToCart, onViewDetail }) => {
  const { currentUser } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const handleAddToCart = async (e) => {
    e.preventDefault();

    try {
      const response = await cartAPI.addToCart(product._id, 1);
      if (response.data.success) {
        alert('✅ Đã thêm vào giỏ hàng');
        onAddToCart && onAddToCart(product);
      } else {
        alert('❌ Lỗi: ' + (response.data.message || 'Không thể thêm sản phẩm'));
      }
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      alert('❌ Đã xảy ra lỗi khi thêm vào giỏ hàng');
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      // Có thể chuyển hướng login hoặc show modal
      alert('Vui lòng đăng nhập để sử dụng chức năng yêu thích');
      return;
    }

    const productId = product._id;
    try {
      if (isInWishlist(productId)) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật yêu thích:', error);
    }
  };

  return (
    <Link 
      to={`/product/${product._id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Product Image */}
      <div className="aspect-w-1 aspect-h-1 w-full">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
          {product.name}
        </h3>

        {/* Hiển thị tên shop */}
        {product.shop && (
          <div className="text-sm text-blue-600 font-medium">
            Shop: <Link to={`/shops/${product.shop._id}`}>{product.shop.name}</Link>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-pink-600">
            {product.price?.toLocaleString()}₫
          </span>

          <div className="flex space-x-2">
            <button
              onClick={handleAddToCart}
              className="p-2 text-gray-600 hover:text-pink-600 transition-colors"
              title="Thêm vào giỏ hàng"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                onViewDetail && onViewDetail(product._id);
              }}
              className="p-2 text-gray-600 hover:text-pink-600 transition-colors"
              title="Xem chi tiết"
            >
              <Eye className="w-5 h-5" />
            </button>

            <button
              onClick={handleToggleWishlist}
              className={`p-2 transition-colors ${
                isInWishlist(product._id)
                  ? 'text-pink-600'
                  : 'text-gray-600 hover:text-pink-600'
              }`}
              title={isInWishlist(product._id) ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
            >
              <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {product.category && (
          <div className="text-sm text-gray-500">
            {product.category.name}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
