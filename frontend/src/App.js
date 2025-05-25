import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/common/Header';
import Home from './page/Home';
import Login from './page/Login';
import Register from './page/Register';
import Shop from './page/Shop';
import ProductDetail from './page/ProductDetail';
import CartScreen from './components/buyer/Cart';
import SellerDashboard from './components/seller/SellerDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import NotFoundScreen from './components/common/NotFoundScreen';
import Footer from './components/common/Footer';
import mockProducts from './data/mockProducts';
// Import các component khác...

function AppContent() {
  const { currentUser, login, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);

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
        return <Home onViewDetail={viewProductDetail} />;
      case 'login':
        return <Login setCurrentScreen={setCurrentScreen} setCurrentUser={login} />;
      case 'register':
        return <Register setCurrentScreen={setCurrentScreen} />;
      case 'shop':
        return <Shop
          products={mockProducts}
          onViewDetail={viewProductDetail}
          setCurrentScreen={setCurrentScreen}
        />;
      case 'product-detail':
        return (
          <ProductDetail
            product={selectedProduct}
            onAddToCart={handleAddToCart}
          />
        );
      case 'cart':
        return <CartScreen cartItems={cartItems} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />;
      case 'seller-dashboard':
        return currentUser?.role === 'seller' ? <SellerDashboard /> : <NotFoundScreen setCurrentScreen={setCurrentScreen} />;
      case 'admin-dashboard':
        return currentUser?.role === 'admin' ? <AdminDashboard /> : <NotFoundScreen setCurrentScreen={setCurrentScreen} />;
      case 'not-found':
        return <NotFoundScreen setCurrentScreen={setCurrentScreen} />;
      default:
        return <NotFoundScreen setCurrentScreen={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header setCurrentScreen={setCurrentScreen} currentUser={currentUser} setCurrentUser={login} cartItems={cartItems} />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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