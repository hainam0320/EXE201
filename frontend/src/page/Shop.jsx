import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import { productAPI, categoryAPI } from '../services/api';

const GROUPS = {
  'Loại hoa': [
    '6845e8b04d0277c562e9084d', // Hoa Hồng
    '6845e8fa4d0277c562e90853', // Hoa Cúc
    '684ed420e40fef3a84665b33', // Hoa Lan
    '684ed437e40fef3a84665b35', // Tú Cầu
    '684ed64be40fef3a84665b37', // Hoa Ly
  ],
  'Màu sắc': [
    '684ed3f4e40fef3a84665b31', // Màu đỏ
    '684ed6d8e40fef3a84665b39', // Màu Trắng
    '684ed777e40fef3a84665b3b', // Màu Vàng
    '684ed7abe40fef3a84665b3d', // Màu tím
  ]
};

const groupCategories = (categories) => {
  const grouped = {};
  Object.entries(GROUPS).forEach(([groupName, ids]) => {
    grouped[groupName] = categories.filter(cat => ids.includes(cat._id));
  });
  return grouped;
};

const Shop = React.memo(({ onAddToCart }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productAPI.getAll(),
          categoryAPI.getAll()
        ]);

        const productsData = productsRes?.data?.data || [];
        const categoriesData = categoriesRes?.data?.data || [];

        if (isMounted) {
          setProducts(productsData);
          setFilteredProducts(productsData);
          setCategories(categoriesData);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError('Có lỗi xảy ra khi tải dữ liệu');
          setProducts([]);
          setFilteredProducts([]);
          setCategories([]);
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const applyFilters = useCallback(() => {
    if (!Array.isArray(products)) {
      setFilteredProducts([]);
      return;
    }

    try {
      let filtered = [...products];

      filtered = filtered.filter(product => {
        const price = Number(product?.price) || 0;
        return price >= priceRange[0] && price <= priceRange[1];
      });

      if (selectedCategories.length > 0) {
        filtered = filtered.filter(product => {
          const categoryArray = Array.isArray(product?.category) ? product.category : [product.category];
          const categoryIds = categoryArray.map(cat => (typeof cat === 'string' ? cat : cat?._id));
          return categoryIds.some(id => selectedCategories.includes(id));
        });
      }

      setFilteredProducts(filtered);
    } catch (error) {
      console.error('Error in applyFilters:', error);
      setFilteredProducts([]);
    }
  }, [products, priceRange, selectedCategories]);

  useEffect(() => {
    applyFilters();
  }, [selectedCategories, priceRange, applyFilters]);

  const memoizedCategories = useMemo(() => Array.isArray(categories) ? categories : [], [categories]);
  const groupedCategories = useMemo(() => groupCategories(memoizedCategories), [memoizedCategories]);
  const memoizedFilteredProducts = useMemo(() => Array.isArray(filteredProducts) ? filteredProducts : [], [filteredProducts]);

  const handleViewDetail = (productId) => {
    navigate(`/products/${productId}`);
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

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-64 bg-white p-6 rounded-lg shadow-md h-fit">
        <h3 className="font-bold text-lg mb-4 flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Bộ lọc
        </h3>

        <div className="space-y-6">
          {/* Danh mục chia nhóm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {Object.entries(groupedCategories).map(([groupName, groupCats]) => (
                <div key={groupName}>
                  <h4 className="text-sm font-semibold text-gray-800 mb-1">{groupName}</h4>
                  {groupCats.map(category => (
                    <label key={category._id} className="flex items-center space-x-2 pl-2">
                      <input
                        type="checkbox"
                        value={category._id}
                        checked={selectedCategories.includes(category._id)}
                        onChange={(e) => {
                          const id = e.target.value;
                          setSelectedCategories(prev =>
                            e.target.checked
                              ? [...prev, id]
                              : prev.filter(c => c !== id)
                          );
                        }}
                        className="accent-pink-600"
                      />
                      <span>{category.name || 'Danh mục không tên'}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Khoảng giá */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Khoảng giá: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}₫
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="2000000"
                step="50000"
                value={priceRange[1]}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value);
                  setPriceRange([priceRange[0], newValue]);
                }}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>0₫</span>
                <span>2,000,000₫</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedCategories([]);
              setPriceRange([0, 2000000]);
            }}
            className="w-full px-4 py-2 text-sm text-pink-600 border border-pink-600 rounded-md hover:bg-pink-50 transition-colors"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Tất cả sản phẩm</h2>
          <span className="text-gray-600">{memoizedFilteredProducts.length} sản phẩm</span>
        </div>

        {memoizedFilteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memoizedFilteredProducts.map(product => (
              <ProductCard 
                key={product?._id || Math.random()} 
                product={product} 
                onAddToCart={onAddToCart}
                onViewDetail={() => handleViewDetail(product._id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            Không tìm thấy sản phẩm nào phù hợp với bộ lọc
          </div>
        )}
      </div>
    </div>
  );
});

export default Shop;
