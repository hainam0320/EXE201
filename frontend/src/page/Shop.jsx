import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import { productAPI, categoryAPI } from '../services/api';

const Shop = React.memo(({ onAddToCart }) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 2000000]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      let isMounted = true;

      const fetchData = async () => {
        try {
          console.log('Fetching shop data...');
          const [productsRes, categoriesRes] = await Promise.all([
            productAPI.getAll(),
            categoryAPI.getAll()
          ]);
          
          console.log('Raw products response:', productsRes?.data);
          console.log('Raw categories response:', categoriesRes?.data);

          if (isMounted) {
            // Validate and process products data
            const productsData = productsRes?.data?.data || [];
            const validProducts = Array.isArray(productsData) ? productsData : [];
            
            // Validate and process categories data
            const categoriesData = categoriesRes?.data?.data || [];
            const validCategories = Array.isArray(categoriesData) ? categoriesData : [];

            console.log('Sample product structure:', validProducts[0]);
            console.log('Sample category structure:', validCategories[0]);

            setProducts(validProducts);
            setFilteredProducts(validProducts);
            setCategories(validCategories);
            setLoading(false);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
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
      console.log('Starting filter process...');
      console.log('Current state:', {
        totalProducts: products.length,
        selectedCategory,
        priceRange
      });

      if (!Array.isArray(products)) {
        console.log('Products is not an array, setting filtered products to empty array');
        setFilteredProducts([]);
        return;
      }

      try {
        let filtered = [...products];

        // Filter by price
        filtered = filtered.filter(product => {
          const price = Number(product?.price) || 0;
          const isInRange = price >= priceRange[0] && price <= priceRange[1];
          return isInRange;
        });

        // Filter by category
        if (selectedCategory) {
          console.log('Filtering by category:', selectedCategory);
          filtered = filtered.filter(product => {
            // Check both populated and unpopulated category fields
            const categoryId = product?.category?._id || product?.category;
            
            console.log('Product category check:', {
              productId: product?._id,
              productName: product?.name,
              rawCategory: product?.category,
              extractedCategoryId: categoryId,
              selectedCategory,
              isMatch: categoryId === selectedCategory
            });
            
            return categoryId === selectedCategory;
          });
        }

        console.log('Final filtered products:', {
          count: filtered.length,
          products: filtered.map(p => ({
            id: p._id,
            name: p.name,
            categoryId: p.category?._id || p.category
          }))
        });
        
        setFilteredProducts(filtered);
      } catch (error) {
        console.error('Error in applyFilters:', error);
        setFilteredProducts([]);
      }
    }, [products, priceRange, selectedCategory]);

    // Áp dụng filter khi các điều kiện thay đổi
    useEffect(() => {
      applyFilters();
    }, [selectedCategory, priceRange, applyFilters]);

    const memoizedCategories = useMemo(() => 
      Array.isArray(categories) ? categories : [], 
      [categories]
    );

    const memoizedFilteredProducts = useMemo(() => 
      Array.isArray(filteredProducts) ? filteredProducts : [], 
      [filteredProducts]
    );

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
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 bg-white p-6 rounded-lg shadow-md h-fit">
          <h3 className="font-bold text-lg mb-4 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Bộ lọc
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
              <select 
                value={selectedCategory}
                onChange={(e) => {
                  console.log('Selected category:', e.target.value);
                  setSelectedCategory(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Tất cả</option>
                {memoizedCategories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name || 'Danh mục không tên'}
                  </option>
                ))}
              </select>
            </div>
            
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
                    console.log('New price range:', [priceRange[0], newValue]);
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

            {/* Reset Filters Button */}
            <button
              onClick={() => {
                setSelectedCategory('');
                setPriceRange([0, 2000000]);
              }}
              className="w-full px-4 py-2 text-sm text-pink-600 border border-pink-600 rounded-md hover:bg-pink-50 transition-colors"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        </div>
  
        {/* Products Grid */}
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