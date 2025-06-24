import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from './context/AuthContext';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
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
import SellerApproval from './components/admin/SellerApproval';
import NotFoundScreen from './components/common/NotFoundScreen';
import Wishlist from './page/Wishlist';
import Profile from './page/Profile';
import BlogList from './page/BlogList';
import BlogDetail from './page/BlogDetail';
import ShopList from './components/shop/ShopList';
import ShopDetail from './components/shop/ShopDetail';
import ShopForm from './components/shop/ShopForm';
import PrivateRoute from './components/common/PrivateRoute';
import Checkout from './components/buyer/Checkout';
import OrderHistory from './components/buyer/OrderHistory';
import CheckoutSuccess from './components/buyer/CheckoutSuccess';
import AboutMe from './page/AboutMe';


// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function AppRoutes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/about" element={<AboutMe />} />

          
          {/* Protected Routes */}
          <Route 
            path="/change-password" 
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/wishlist" 
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <Wishlist />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute>
                <CartScreen />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/seller/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <SellerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/seller-approval" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SellerApproval />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<NotFoundScreen />} />

          {/* Public Routes */}
          <Route path="/shops" element={<ShopList />} />
          <Route path="/shops/:id" element={<ShopDetail />} />

          {/* Protected Routes */}
          <Route
            path="/seller/shop/create"
            element={
              <PrivateRoute roles={['seller']}>
                <ShopForm mode="create" />
              </PrivateRoute>
            }
          />
          <Route
            path="/seller/shop/edit"
            element={
              <PrivateRoute roles={['seller']}>
                <ShopForm mode="edit" />
              </PrivateRoute>
            }
          />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/order-history" 
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <OrderHistory />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/checkout/success"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <CheckoutSuccess />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default AppRoutes; 