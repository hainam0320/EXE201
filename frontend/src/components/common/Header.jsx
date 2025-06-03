import React, { useState } from 'react';
import { ShoppingCart, Heart, User, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const { cartItems } = useCart();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowMenu(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link 
              to="/"
              className="text-2xl font-bold text-pink-600"
            >
              🌸 HoaMuse
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/"
              className="text-gray-700 hover:text-pink-600 transition-colors"
            >
              Trang chủ
            </Link>
            <Link 
              to="/shop"
              className="text-gray-700 hover:text-pink-600 transition-colors"
            >
              Sản phẩm
            </Link>
            {currentUser?.role === 'seller' && (
              <Link 
                to="/seller/dashboard"
                className="text-gray-700 hover:text-pink-600 transition-colors"
              >
                Quản lý
              </Link>
            )}
            {currentUser?.role === 'admin' && (
              <Link 
                to="/admin/dashboard"
                className="text-gray-700 hover:text-pink-600 transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/search')} className="p-2 hover:bg-gray-100 rounded-full">
              <Search className="h-5 w-5" />
            </button>
            
            {currentUser && currentUser.role === 'buyer' && (
              <>
                <Link 
                  to="/wishlist"
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Heart className="h-5 w-5" />
                </Link>
                <Link 
                  to="/cart"
                  className="p-2 hover:bg-gray-100 rounded-full relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
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
                    <Link 
                      to="/profile"
                      onClick={() => setShowMenu(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Hồ sơ cá nhân
                    </Link>
                    {currentUser.role === 'buyer' && (
                      <Link 
                        to="/order-history"
                        onClick={() => setShowMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Lịch sử đơn hàng
                      </Link>
                    )}
                    {currentUser.role === 'seller' && (
                      <>
                        <Link 
                          to="/seller/dashboard"
                          onClick={() => setShowMenu(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          Dashboard bán hàng
                        </Link>
                        <Link 
                          to="/seller/products"
                          onClick={() => setShowMenu(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          Quản lý sản phẩm
                        </Link>
                        <Link 
                          to="/seller/orders"
                          onClick={() => setShowMenu(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          Đơn hàng bán
                        </Link>
                      </>
                    )}
                    {currentUser.role === 'admin' && (
                      <Link 
                        to="/admin/dashboard"
                        onClick={() => setShowMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link 
                      to="/change-password"
                      onClick={() => setShowMenu(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Đổi mật khẩu
                    </Link>
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
                <Link 
                  to="/login"
                  className="px-4 py-2 text-pink-600 border border-pink-600 rounded-md hover:bg-pink-50 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/register"
                  className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;