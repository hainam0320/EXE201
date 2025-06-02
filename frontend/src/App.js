import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/common/Header';
import Home from './page/Home';
import Login from './page/Login';
import Register from './page/Register';
import ForgotPassword from './page/ForgotPassword';
import ResetPassword from './page/ResetPassword';
import ChangePassword from './page/ChangePassword';
import Shop from './page/Shop';
import ProductDetail from './page/ProductDetail';
import CartScreen from './components/buyer/Cart';
import SellerDashboard from './components/seller/SellerDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import NotFoundScreen from './components/common/NotFoundScreen';
import Footer from './components/common/Footer';
import mockProducts from './data/mockProducts';
import api from './services/api';
// Import các component khác...

function AppContent() {
  const { currentUser, login } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resetToken, setResetToken] = useState(null);

  // Kiểm tra URL cho reset password token
  useEffect(() => {
    const checkUrlForResetToken = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const action = urlParams.get('action');
      
      if (action === 'reset-password' && token) {
        setResetToken(token);
        setCurrentScreen('reset-password');
        // Xóa token khỏi URL để bảo mật
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    checkUrlForResetToken();
  }, []);

  // Kiểm tra session khi app khởi động
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (token && userId) {
        try {
          // Gọi API để verify token và lấy thông tin user
          const response = await api.get('/auth/profile');
          const userData = response.data.user;
          
          const user = {
            id: userData._id,
            name: userData.userName,
            email: userData.email,
            role: userData.isAdmin ? 'admin' : 'buyer',
            isAdmin: userData.isAdmin
          };
          
          login(user);
        } catch (error) {
          console.error('Session verification failed:', error);
          // Token không hợp lệ, xóa khỏi localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, [login]);

  // Hiển thị loading khi đang kiểm tra session
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  const viewProductDetail = (product) => {
    setSelectedProduct(product);
    setCurrentScreen('product-detail');
  };

  // Mock handleAddToCart
  const handleAddToCart = (product) => {
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
    // Thêm logic thêm vào giỏ hàng thực tế nếu cần
  };

  // Mock updateQuantity và removeFromCart cho CartScreen
  const updateQuantity = (productId, newQuantity) => {
    setCartItems(cartItems.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };
  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Home setCurrentScreen={setCurrentScreen} viewProductDetail={viewProductDetail} />;
      case 'login':
        return <Login setCurrentScreen={setCurrentScreen} />;
      case 'register':
        return <Register setCurrentScreen={setCurrentScreen} />;
      case 'forgot-password':
        return <ForgotPassword setCurrentScreen={setCurrentScreen} />;
      case 'reset-password':
        return <ResetPassword setCurrentScreen={setCurrentScreen} token={resetToken} />;
      case 'change-password':
        return <ChangePassword setCurrentScreen={setCurrentScreen} />;
      case 'shop':
        return <Shop setCurrentScreen={setCurrentScreen} viewProductDetail={viewProductDetail} />;
      case 'product-detail':
        return <ProductDetail product={selectedProduct} setCurrentScreen={setCurrentScreen} handleAddToCart={handleAddToCart} />;
      case 'cart':
        return <CartScreen cartItems={cartItems} updateQuantity={updateQuantity} removeFromCart={removeFromCart} setCurrentScreen={setCurrentScreen} />;
      case 'seller-dashboard':
        return <SellerDashboard setCurrentScreen={setCurrentScreen} />;
      case 'admin-dashboard':
        return <AdminDashboard setCurrentScreen={setCurrentScreen} />;
      default:
        return <NotFoundScreen setCurrentScreen={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header setCurrentScreen={setCurrentScreen} />
      <main className="flex-grow">
        {renderScreen()}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;