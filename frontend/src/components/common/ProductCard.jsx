import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

const ProductCard = ({ product, onAddToCart }) => {
  const { currentUser } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  if (!product) return null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      // Redirect to login or show login modal
      return;
    }

    const productId = product._id;
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  return (
    <Link 
      to={`/product/${product._id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Product Image */}
      <div className="aspect-w-1 aspect-h-1 w-full">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-pink-600">
            {product.price?.toLocaleString()}₫
          </span>
          
          <div className="flex space-x-2">
            <button
              onClick={handleToggleWishlist}
              className={`p-2 transition-colors ${
                isInWishlist(product._id)
                  ? 'text-pink-600'
                  : 'text-gray-600 hover:text-pink-600'
              }`}
              title={isInWishlist(product._id) ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
            >
              <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleAddToCart}
              className="p-2 text-gray-600 hover:text-pink-600 transition-colors"
              title="Thêm vào giỏ hàng"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {product.category && (
          <div className="text-sm text-gray-500">
            {product.category.name}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;