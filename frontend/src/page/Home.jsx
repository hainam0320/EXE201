import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          productAPI.getFeatured(),
          categoryAPI.getAll()
        ]);

        setProducts(productsRes.data.data || []);
        setCategories(categoriesRes.data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/shop?category=${categoryId}`);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-pink-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Chào mừng đến với HoaMuse
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Khám phá bộ sưu tập hoa tươi độc đáo và xinh đẹp của chúng tôi
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-pink-600 text-white px-8 py-3 rounded-full hover:bg-pink-700 transition-colors"
          >
            Mua sắm ngay
          </button>
        </div>

        {/* Categories Section */}
        <div className="flex flex-col items-center text-center px-4">
          <h2 className="text-3xl font-bold mb-8">Danh mục hoa</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full max-w-6xl">
            {categories.map(category => (
              <div
                key={category._id}
                onClick={() => handleCategoryClick(category._id)}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer text-center"
              >
                <div className="text-4xl mb-2">🌸</div>
                <h3 className="font-semibold text-gray-800">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Products Section */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8">Sản phẩm nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div
                key={product._id}
                onClick={() => handleProductClick(product._id)}
                className="cursor-pointer"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative w-full pt-[100%]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-pink-600 font-bold">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(product.price)}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;