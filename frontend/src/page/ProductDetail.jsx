import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productAPI, cartAPI } from '../services/api';
import { ArrowLeft, ShoppingCart, Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';  // Đường dẫn tùy dự án
import { useAuth } from '../context/AuthContext';

const ProductDetail = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { currentUser } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getById(id);

        if (response?.data?.success && response?.data?.data) {
          let productData = response.data.data;
          let imageUrl = productData.image;

          if (Array.isArray(imageUrl)) imageUrl = imageUrl[0];

          const isValidUrl = (url) => {
            try {
              new URL(url);
              return url.match(/^https?:\/\/.+/);
            } catch {
              return false;
            }
          };

          if (!imageUrl || !isValidUrl(imageUrl)) {
            imageUrl = 'https://cdn.pixabay.com/photo/2015/04/19/08/32/rose-729509_1280.jpg';
          }

          setProduct({ ...productData, image: imageUrl });
        } else {
          setError('Dữ liệu sản phẩm không hợp lệ');
        }
      } catch (err) {
        setError('Không thể tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductDetail();
    else {
      setError('ID sản phẩm không hợp lệ');
      setLoading(false);
    }
  }, [id]);

  // Thêm vào giỏ hàng: gọi API
  const handleAddToCart = async () => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }
    if (!product) return;

    try {
      const response = await cartAPI.addToCart(product._id, quantity);
      if (response.data.success) {
        alert('✅ Đã thêm vào giỏ hàng');
        onAddToCart && onAddToCart(product, quantity);
      } else {
        alert('❌ Lỗi: ' + (response.data.message || 'Không thể thêm sản phẩm'));
      }
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      alert('❌ Đã xảy ra lỗi khi thêm vào giỏ hàng');
    }
  };

  // Toggle yêu thích
  const handleToggleWishlist = async () => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để sử dụng chức năng yêu thích');
      return;
    }
    if (!product) return;

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-10">
        Không tìm thấy sản phẩm
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-pink-600 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Quay lại
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="rounded-lg overflow-hidden shadow-lg relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[500px] object-cover"
            onError={(e) => {
              e.target.src = 'https://cdn.pixabay.com/photo/2015/04/19/08/32/rose-729509_1280.jpg';
            }}
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.name || 'Không có tên'}</h1>
          
          <div className="text-2xl font-semibold text-pink-600">
            {(product.price || 0).toLocaleString()}₫
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Mô tả sản phẩm</h3>
            <p className="text-gray-600">{product.description || 'Chưa có mô tả'}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Thông tin chi tiết</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col space-y-2">
                <span className="text-gray-600">Danh mục:</span>
                <span>{product.category?.name || 'Chưa phân loại'}</span>
              </div>
              <div className="flex flex-col space-y-2">
                <span className="text-gray-600">Tình trạng:</span>
                <span>{product.status ? 'Còn hàng' : 'Hết hàng'}</span>
              </div>
              {/* Hiển thị tên shop */}
              {product.shop && (
                <div className="flex flex-col space-y-2">
                  <span className="text-gray-600">Shop:</span>
                  <span>
                    <Link to={`/shops/${product.shop._id}`} className="text-blue-600 font-medium hover:underline">
                      {product.shop.name}
                    </Link>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Số lượng */}
            <div className="flex items-center border rounded-md">
              <button
                className="px-4 py-2 text-gray-600 hover:text-pink-600"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center border-x py-2"
              />
              <button
                className="px-4 py-2 text-gray-600 hover:text-pink-600"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>

            {/* Thêm vào giỏ hàng */}
            <button
              onClick={handleAddToCart}
              className="flex items-center space-x-2 bg-pink-600 text-white px-6 py-3 rounded-md hover:bg-pink-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Thêm vào giỏ hàng</span>
            </button>

            {/* Nút yêu thích */}
            <button
              onClick={handleToggleWishlist}
              className={`p-3 rounded-md transition-colors border ${
                isInWishlist(product._id)
                  ? 'text-pink-600 border-pink-600'
                  : 'text-gray-600 border-gray-300 hover:text-pink-600 hover:border-pink-600'
              }`}
              title={isInWishlist(product._id) ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
            >
              <Heart
                className={`w-6 h-6 ${isInWishlist(product._id) ? 'fill-current' : ''}`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
