import React from 'react';
import ProductCard from '../components/common/ProductCard';
import { mockProducts, mockCategories } from '../data/mockData';

const Home = ({ onViewDetail }) => {
  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-20 px-4 rounded-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Hoa Tươi Đẹp Nhất
          </h1>
          <p className="text-xl mb-8">
            Gửi gắm yêu thương qua từng cánh hoa
          </p>
          <button className="bg-white text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Khám phá ngay
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-8">Danh mục hoa</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {mockCategories.map((category, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-2">🌸</div>
              <h3 className="font-semibold">{category}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8">Sản phẩm nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onViewDetail={onViewDetail}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;