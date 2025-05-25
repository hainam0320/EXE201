import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { mockCategories } from '../data/mockData';

const Shop = ({ products, onAddToCart, onViewDetail }) => {
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [priceRange, setPriceRange] = useState([0, 2000000]);
    const [selectedCategory, setSelectedCategory] = useState('');
  
    const applyFilters = () => {
      let filtered = products.filter(product => 
        product.price >= priceRange[0] && product.price <= priceRange[1]
      );
      
      if (selectedCategory) {
        filtered = filtered.filter(product => product.category === selectedCategory);
      }
      
      setFilteredProducts(filtered);
    };
  
    useEffect(() => {
      applyFilters();
      // eslint-disable-next-line
    }, [priceRange, selectedCategory, products]);
  
    return (
      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div className="w-64 bg-white p-6 rounded-lg shadow-md h-fit">
          <h3 className="font-bold text-lg mb-4 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Bộ lọc
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Tất cả</option>
                {mockCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Khoảng giá: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}₫
              </label>
              <input
                type="range"
                min="0"
                max="2000000"
                step="50000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
            </div>
          </div>
        </div>
  
        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Tất cả sản phẩm</h2>
            <span className="text-gray-600">{filteredProducts.length} sản phẩm</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart}
                onViewDetail={onViewDetail}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

export default Shop;