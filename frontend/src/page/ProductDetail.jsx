import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';

const ProductDetail = ({ product, onAddToCart }) => {
    if (!product) return <div>Không tìm thấy sản phẩm</div>;
  
    return (
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center mb-4">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="ml-1 text-lg">{product.rating}</span>
              <span className="ml-2 text-gray-600">({product.reviews} đánh giá)</span>
            </div>
            <p className="text-gray-600 mb-6">{product.description}</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between">
                <span className="font-medium">Người bán:</span>
                <span>{product.seller}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Danh mục:</span>
                <span>{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Tồn kho:</span>
                <span>{product.stock} sản phẩm</span>
              </div>
            </div>
  
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl font-bold text-pink-600">
                {product.price.toLocaleString('vi-VN')}₫
              </span>
            </div>
  
            <button 
              onClick={() => onAddToCart(product)}
              className="w-full bg-pink-600 text-white py-3 rounded-md hover:bg-pink-700 transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Thêm vào giỏ hàng</span>
            </button>
          </div>
        </div>
      </div>
    );
  };
  
export default ProductDetail;
  