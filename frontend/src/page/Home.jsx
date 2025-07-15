import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentCategoryPage, setCurrentCategoryPage] = useState(0);

  // Fix cứng danh mục hoa
  const categories = [
    {
      _id: '1',
      name: 'Hoa Hồng',
      image: '/category-images/0f38196c66679b4b1e8ac6bc2093e296.jpg',
      description: 'Biểu tượng của tình yêu '
    },
    {
      _id: '2',
      name: 'Hoa Cúc',
      image: '/category-images/350K.jpg',
      description: 'Vẻ đẹp thuần khiết và tinh tế'
    },
    {
      _id: '3',
      name: 'Hoa Lan',
      image: '/category-images/e0682db6bcbfbe19f3c54d2fedf0fdfa.jpg',
      description: 'Sang trọng và quý phái'
    },
    {
      _id: '4',
      name: 'Hoa Ly',
      image: '/category-images/OIP.jpg',
      description: 'Thanh cao và kiêu sa'
    },
    {
      _id: '5',
      name: 'Hoa Tulip',
      image: '/category-images/e7c8fe56263ff961a02e.jpg',
      description: 'Tươi mới và tràn đầy sức sống'
    },
    {
      _id: '6',
      name: 'Hoa Hướng Dương',
      image: '/category-images/ha.png',
      description: 'Rực rỡ và tràn đầy năng lượng'
    },
    {
      _id: '7',
      name: 'Hoa Baby',
      image: '/category-images/bo-hoa-baby-lon_-22-04-2019-09-37-13.jpg',
      description: 'Nhẹ nhàng và tinh khôi'
    },
    {
      _id: '8',
      name: 'Hoa Cẩm Chướng',
      image: '/category-images/Bo-hoa-cam-chuong-1440x1536.jpg',
      description: 'Duyên dáng và đầy sức sống'
    }
  ];

  const banners = [
    {
      image: '/banners/501218654_676615968685898_5488618290692746123_n.jpg',
    
     
    },
    {
      image: '/banners/501218654_676615968685898_5488618290692746123_n.jpg',
   
    
    },
    {
      image: '/banners/501218654_676615968685898_5488618290692746123_n.jpg',
   
    }
  ];

  // Thêm dữ liệu fix cứng cho hoa theo mùa
  const seasonalFlowers = [
    {
      _id: '68722b492f7f7a1a4efcb10c',
      name: 'Hoa tú cầu tím mộng mơ',
      image: 'http://103.90.224.148:9999/uploads/1752312649249-510813118.webp',
      description: 'tú cầu',
      season: 'Xuân',
      price: 300000,
      discount: 0
    },
    {
      _id: '686fe4b039eff785aa7e697b',
      name: 'Hoa Cúc Vàng',
      image: 'http://103.90.224.148:9999/uploads/1752163504802-519503600.png',
      description: 'Hoa tràng trí,sự kiện',
      season: 'Hạ',
      price: 150000,
      discount: 0
    },
    {
      _id: '68722e512f7f7a1a4efcb230',
      name: 'Bó hoa hồng đỏ',
      image: 'http://103.90.224.148:9999/uploads/1752313425491-297820903.jpg',
      description: 'Hoa hồng đỏ thơm mát',
      season: 'Thu',
      price: 300000,
      discount: 0
    },
    {
      _id: '6870e55b671781b359c8d8b9',
      name: 'Lẵng hoa lan trắng cao cấp',
      image: 'http://103.90.224.148:9999/uploads/1752229211874-442203253.jpg',
      description: 'Hoa cao cấp',
      season: 'Đông',
      price: 550000,
      discount: 0
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productsRes = await productAPI.getFeatured();
        setProducts(productsRes.data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Auto-advance carousel every 5 seconds
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/shop?category=${categoryId}`);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Categories per page in the carousel
  const CATEGORIES_PER_PAGE = 4;
  
  // Calculate total pages for categories
  const totalCategoryPages = Math.ceil(categories.length / CATEGORIES_PER_PAGE);

  // Handle category navigation
  const handlePrevCategory = () => {
    setCurrentCategoryPage((prev) => 
      prev === 0 ? totalCategoryPages - 1 : prev - 1
    );
  };

  const handleNextCategory = () => {
    setCurrentCategoryPage((prev) => 
      prev === totalCategoryPages - 1 ? 0 : prev + 1
    );
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
      {/* Banner Carousel */}
      <div className="relative h-[500px] overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-500 ${
              currentBanner === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/category-images/OIP.jpg';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-4xl font-bold mb-4">{banner.title}</h2>
                <p className="text-xl">{banner.description}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                currentBanner === index ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setCurrentBanner(index)}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Categories Section */}
        <div className="flex flex-col items-center text-center px-4">
          <h2 className="text-3xl font-bold mb-8">Danh mục hoa</h2>
          <div className="relative w-full max-w-6xl">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentCategoryPage * 100}%)` }}
              >
                {Array.from({ length: totalCategoryPages }, (_, pageIndex) => (
                  <div key={pageIndex} className="flex gap-6 min-w-full">
                    {categories
                      .slice(pageIndex * CATEGORIES_PER_PAGE, (pageIndex + 1) * CATEGORIES_PER_PAGE)
                      .map(category => (
                        <div
                          key={category._id}
                          onClick={() => handleCategoryClick(category._id)}
                          className="flex-1 bg-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer overflow-hidden relative group"
                        >
                          <div className="relative h-48">
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = '/category-images/OIP.jpg';
                              }}
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-30 backdrop-blur-sm p-4 transform transition-transform duration-300">
                              <h3 className="font-semibold text-white text-center">{category.name}</h3>
                              <p className="text-white/80 text-sm mt-1">{category.description}</p>
                            </div>
                          </div>
                        </div>
                    ))}
                    {pageIndex === totalCategoryPages - 1 && 
                      Array.from({ length: CATEGORIES_PER_PAGE - (categories.length % CATEGORIES_PER_PAGE || CATEGORIES_PER_PAGE) }, (_, i) => (
                        <div key={`placeholder-${i}`} className="flex-1" />
                      ))
                    }
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <button
              onClick={handlePrevCategory}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNextCategory}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Category Dots */}
            <div className="flex justify-center mt-4 space-x-2">
              {[...Array(totalCategoryPages)].map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentCategoryPage === index ? 'bg-pink-600' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentCategoryPage(index)}
                />
              ))}
            </div>
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

        {/* Seasonal Flowers Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Hoa theo mùa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {seasonalFlowers.map(flower => (
              <div
                key={flower._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                onClick={() => handleProductClick(flower._id)}
              >
                <div className="relative">
                  <div className="relative w-full pt-[100%]">
                    <img
                      src={flower.image}
                      alt={flower.name}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/category-images/OIP.jpg';
                      }}
                    />
                  </div>
                  <div className="absolute top-4 right-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm">
                    {flower.season}
                  </div>
                  {flower.discount > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                      -{flower.discount}%
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{flower.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{flower.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-pink-600 font-bold">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(flower.price * (1 - flower.discount / 100))}
                    </span>
                    {flower.discount > 0 && (
                      <span className="text-sm text-gray-500 line-through">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(flower.price)}
                      </span>
                    )}
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