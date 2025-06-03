import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductDetail = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        console.log('Fetching product details for ID:', id);
        setLoading(true);
        const response = await productAPI.getById(id);
        console.log('Full API Response:', JSON.stringify(response, null, 2));
        
        if (response?.data?.success && response?.data?.data) {
          const productData = response.data.data;
          console.log('Product data to be set:', JSON.stringify(productData, null, 2));
          
          // Kiểm tra và xử lý URL ảnh
          let imageUrl = productData.image;
          console.log('Original image URL:', imageUrl);
          
          if (Array.isArray(imageUrl)) {
            console.log('Image is an array, getting first element');
            imageUrl = imageUrl[0];
          }
          
          // Kiểm tra URL hợp lệ
          const isValidUrl = (url) => {
            try {
              new URL(url);
              return url.match(/^https?:\/\/.+/);
            } catch {
              return false;
            }
          };

          console.log('Checking if URL is valid:', imageUrl);
          if (!imageUrl || !isValidUrl(imageUrl)) {
            console.log('URL is not valid, using default image');
            imageUrl = 'https://cdn.pixabay.com/photo/2015/04/19/08/32/rose-729509_1280.jpg';
          }
          
          const finalProduct = {
            ...productData,
            image: imageUrl
          };
          console.log('Final product data:', JSON.stringify(finalProduct, null, 2));
          setProduct(finalProduct);
        } else {
          console.error('Invalid response structure:', response);
          setError('Dữ liệu sản phẩm không hợp lệ');
        }
      } catch (err) {
        console.error('Error details:', err);
        setError('Không thể tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetail();
    } else {
      console.error('No product ID provided');
      setError('ID sản phẩm không hợp lệ');
      setLoading(false);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product && onAddToCart) {
      onAddToCart(product, quantity);
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

  console.log('Rendering product:', product);

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
              console.error('Image failed to load:', product.image);
              e.target.src = 'https://cdn.pixabay.com/photo/2015/04/19/08/32/rose-729509_1280.jpg';
            }}
            onLoad={() => console.log('Image loaded successfully:', product.image)}
          />
          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
            </div>
          )}
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
            </div>
          </div>

          <div className="flex items-center space-x-4">
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

            <button
              onClick={handleAddToCart}
              className="flex items-center space-x-2 bg-pink-600 text-white px-6 py-3 rounded-md hover:bg-pink-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Thêm vào giỏ hàng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
  