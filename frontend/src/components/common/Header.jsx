import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Heart, User, Search, Crown, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI, authAPI } from '../../services/api';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const { cartItems } = useCart();
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [premiumInfo, setPremiumInfo] = useState(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSearch = async () => {
      if (searchTerm.trim()) {
        try {
          const res = await productAPI.search(searchTerm);
          setSearchResults(res.data.data || []);
        } catch (error) {
          console.error('Search error:', error);
        }
      } else {
        setSearchResults([]);
      }
    };
    const debounce = setTimeout(fetchSearch, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  useEffect(() => {
    const fetchPremiumInfo = async () => {
      if (currentUser?.role === 'seller') {
        try {
          const response = await authAPI.getPremiumInfo();
          setPremiumInfo(response.data);
          if (response.data.isBlocked) {
            alert("Tài khoản của bạn đã bị khóa do hết hạn Premium. Vui lòng liên hệ admin để được hỗ trợ.");
            handleLogout();
          }
        } catch (error) {
          console.error('Error fetching premium info:', error);
        }
      }
    };
    fetchPremiumInfo();
  }, [currentUser]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (currentUser?.role === 'seller') {
        try {
          const response = await authAPI.getPremiumInfo();
          setPremiumInfo(response.data);
          if (response.data.isBlocked) {
            alert("Tài khoản của bạn đã bị khóa do hết hạn Premium. Vui lòng liên hệ admin để được hỗ trợ.");
            handleLogout();
          }
        } catch (error) {
          console.error('Error checking premium status:', error);
        }
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
      setShowSearch(false);
      setSearchTerm('');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      setShowMenu(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-gradient-to-r from-pink-50 to-rose-50 shadow-sm sticky top-0 z-50 border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link 
              to="/"
              className="flex items-center"
            >
              <img 
                src="/hoamuse.jpg" 
                alt="HoaMuse Logo" 
                className="h-56 w-auto object-contain py-1"
              />
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">Trang chủ</Link>
            <Link to="/shop" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">Sản phẩm</Link>
            <Link to="/blog" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">Blog</Link>
            {currentUser?.role === 'seller' && <Link to="/seller/dashboard" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">Quản lý</Link>}
            {currentUser?.role === 'admin' && <Link to="/admin/dashboard" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">Admin</Link>}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="relative" ref={searchRef}>
              <button onClick={() => setShowSearch(!showSearch)} className="p-2 hover:bg-pink-100/50 rounded-full transition-colors">
                <Search className="h-5 w-5 text-gray-600 hover:text-pink-600" />
              </button>
              {showSearch && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl p-4 z-50 border border-pink-100">
                  <form onSubmit={handleSearch} className="flex items-center space-x-2">
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Tìm kiếm hoa..."
                      className="flex-1 px-4 py-2 border border-pink-200 rounded-full focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                      autoFocus
                    />
                    <button type="submit" className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-sm hover:shadow">
                      <Search className="h-5 w-5" />
                    </button>
                  </form>
                  {searchResults.length > 0 && (
                    <div className="mt-4 max-h-96 overflow-y-auto">
                      {searchResults.map((product) => (
                        <div
                          key={product._id}
                          onClick={() => {
                            navigate(`/product/${product._id}`);
                            setShowSearch(false);
                            setSearchTerm('');
                          }}
                          className="flex items-center p-2 space-x-4 hover:bg-pink-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300';
                            }}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-medium text-gray-800">{product.name}</h4>
                            <p className="text-sm text-pink-600">
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              }).format(product.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {currentUser && (
              <Link to="/wishlist" className="p-2 hover:bg-pink-100/50 rounded-full transition-colors">
                <Heart className="h-5 w-5 text-gray-600 hover:text-pink-600" />
              </Link>
            )}

            {currentUser?.role === 'buyer' && (
              <Link to="/cart" className="relative p-2 hover:bg-pink-100/50 rounded-full transition-colors">
                <ShoppingCart className="h-5 w-5 text-gray-600 hover:text-pink-600" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            )}

            {currentUser ? (
              <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)} 
                  className="flex items-center space-x-2 p-2 hover:bg-pink-100/50 rounded-full transition-colors"
                >
                  <User className="h-5 w-5 text-gray-600 hover:text-pink-600" />
                  <span className="hidden md:block text-gray-700 hover:text-pink-600">{currentUser.name}</span>
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-pink-100">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors" onClick={() => setShowMenu(false)}>Hồ sơ cá nhân</Link>
                    {currentUser.role === 'buyer' && (
                      <Link to="/order-history" className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors" onClick={() => setShowMenu(false)}>Lịch sử đơn hàng</Link>
                    )}
                    {currentUser.role === 'seller' && (
                      <>
                        {premiumInfo && premiumInfo.isPremium ? (
                          <div className="px-4 py-2 text-sm bg-yellow-50/50">
                            <div className="flex items-center space-x-2 text-yellow-700">
                              <Crown className="h-4 w-4" />
                              <span className="font-medium">Premium</span>
                            </div>
                            <div className="text-yellow-600 text-xs mt-1">
                              Còn {premiumInfo.remainingDays} ngày
                            </div>
                            {premiumInfo.remainingDays <= 5 && (
                              <div className="flex items-center space-x-1 text-red-600 text-xs mt-1">
                                <AlertTriangle className="h-3 w-3" />
                                <span>Sắp hết hạn!</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="px-4 py-2 text-sm bg-red-50/50">
                            <div className="flex items-center space-x-2 text-red-700">
                              <AlertTriangle className="h-4 w-4" />
                              <span className="font-medium">Premium hết hạn</span>
                            </div>
                            <div className="text-red-600 text-xs mt-1">
                              Tài khoản sẽ bị khóa
                            </div>
                          </div>
                        )}
                        <Link to="/seller/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors" onClick={() => setShowMenu(false)}>Quản lý sản phẩm</Link>
                        <Link to="/seller/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors" onClick={() => setShowMenu(false)}>Đơn hàng bán</Link>
                      </>
                    )}
                    {currentUser.role === 'admin' && (
                      <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors" onClick={() => setShowMenu(false)}>Admin Dashboard</Link>
                    )}
                    <Link to="/change-password" className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors" onClick={() => setShowMenu(false)}>Đổi mật khẩu</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors">Đăng xuất</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-2">
                <Link to="/login" className="px-4 py-2 border border-pink-500 text-pink-600 rounded-full hover:bg-pink-50 transition-colors">Đăng nhập</Link>
                <Link to="/register" className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-sm hover:shadow">Đăng ký</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
