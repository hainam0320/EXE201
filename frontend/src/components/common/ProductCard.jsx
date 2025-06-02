import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product, onViewDetail }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    alert('Đã thêm sản phẩm vào giỏ hàng!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-48 object-cover cursor-pointer"
        onClick={() => onViewDetail(product)}
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 cursor-pointer hover:text-pink-600" 
            onClick={() => onViewDetail(product)}>
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
        
        {/* Rating */}
        <div className="flex items-center mb-2">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm text-gray-600 ml-1">
            {product.rating} ({product.reviews} đánh giá)
          </span>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-pink-600">
            {product.price.toLocaleString('vi-VN')}₫
          </span>
          <button 
            onClick={handleAddToCart}
            className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors flex items-center space-x-1"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Thêm</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;