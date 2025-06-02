import React, { useState } from 'react';
import { ShoppingCart, Heart, User, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = ({ setCurrentScreen }) => {
  const { currentUser, logout } = useAuth();
  const { cartItems } = useCart();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setCurrentScreen('login');
    setShowMenu(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 
              className="text-2xl font-bold text-pink-600 cursor-pointer"
              onClick={() => setCurrentScreen('home')}
            >
              🌸 HoaMuse
            </h1>
          </div>

          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => setCurrentScreen('home')}
              className="text-gray-700 hover:text-pink-600 transition-colors"
            >
              Trang chủ
            </button>
            <button 
              onClick={() => setCurrentScreen('shop')}
              className="text-gray-700 hover:text-pink-600 transition-colors"
            >
              Sản phẩm
            </button>
            {currentUser?.role === 'seller' && (
              <button 
                onClick={() => setCurrentScreen('seller-dashboard')}
                className="text-gray-700 hover:text-pink-600 transition-colors"
              >
                Quản lý
              </button>
            )}
            {currentUser?.role === 'admin' && (
              <button 
                onClick={() => setCurrentScreen('admin-dashboard')}
                className="text-gray-700 hover:text-pink-600 transition-colors"
              >
                Admin
              </button>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <button onClick={() => setCurrentScreen('search')} className="p-2 hover:bg-gray-100 rounded-full">
              <Search className="h-5 w-5" />
            </button>
            
            {currentUser && currentUser.role === 'buyer' && (
              <>
                <button 
                  onClick={() => setCurrentScreen('wishlist')}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Heart className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setCurrentScreen('cart')}
                  className="p-2 hover:bg-gray-100 rounded-full relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </button>
              </>
            )}

            {currentUser ? (
              <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden md:block">{currentUser.name}</span>
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <button 
                      onClick={() => {setCurrentScreen('profile'); setShowMenu(false);}}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Hồ sơ cá nhân
                    </button>
                    {currentUser.role === 'buyer' && (
                      <button 
                        onClick={() => {setCurrentScreen('order-history'); setShowMenu(false);}}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Lịch sử đơn hàng
                      </button>
                    )}
                    <button 
                      onClick={() => {setCurrentScreen('change-password'); setShowMenu(false);}}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Đổi mật khẩu
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-2">
                <button 
                  onClick={() => setCurrentScreen('login')}
                  className="px-4 py-2 text-pink-600 border border-pink-600 rounded-md hover:bg-pink-50 transition-colors"
                >
                  Đăng nhập
                </button>
                <button 
                  onClick={() => setCurrentScreen('register')}
                  className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
                >
                  Đăng ký
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;