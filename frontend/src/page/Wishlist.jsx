import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Wishlist = () => {
    const { wishlistItems, loading, operationLoading, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { currentUser } = useAuth();

    if (!currentUser || currentUser.role !== 'buyer') {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-12">
                    <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Đăng nhập để xem danh sách yêu thích</h2>
                    <p className="text-gray-500 mb-4">Vui lòng đăng nhập với tài khoản người mua để sử dụng tính năng này</p>
                    <Link
                        to="/login"
                        className="inline-block bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 transition-colors"
                    >
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Danh sách yêu thích</h1>
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
                </div>
            </div>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Danh sách yêu thích</h1>
                <div className="text-center py-12">
                    <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-4">Bạn chưa có sản phẩm nào trong danh sách yêu thích</p>
                    <Link
                        to="/shop"
                        className="inline-block bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 transition-colors"
                    >
                        Khám phá sản phẩm
                    </Link>
                </div>
            </div>
        );
    }

    const handleAddToCart = async (product) => {
        const success = await addToCart(product);
        if (success) {
            await removeFromWishlist(product._id);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Danh sách yêu thích</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map(product => (
                    <div 
                        key={product._id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                        <Link to={`/product/${product._id}`}>
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                                }}
                            />
                        </Link>

                        <div className="p-4 space-y-2">
                            <Link 
                                to={`/product/${product._id}`}
                                className="block"
                            >
                                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 hover:text-pink-600 transition-colors">
                                    {product.name}
                                </h3>
                            </Link>

                            <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-pink-600">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(product.price)}
                                </span>
                                
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="p-2 text-gray-600 hover:text-pink-600 transition-colors disabled:opacity-50"
                                        disabled={operationLoading}
                                        title="Thêm vào giỏ hàng"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                    </button>

                                    <button
                                        onClick={() => removeFromWishlist(product._id)}
                                        className="p-2 text-gray-600 hover:text-pink-600 transition-colors disabled:opacity-50"
                                        disabled={operationLoading}
                                        title="Xóa khỏi danh sách yêu thích"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {product.category && (
                                <div className="text-sm text-gray-500">
                                    {product.category.name}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist; 