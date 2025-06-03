import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from './AppRoutes';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './page/Home';
import Login from './page/Login';
import Register from './page/Register';
import ForgotPassword from './page/ForgotPassword';
import ResetPassword from './page/ResetPassword';
import ChangePassword from './page/ChangePassword';
import Profile from './page/Profile';
import Shop from './page/Shop';
import ProductDetail from './page/ProductDetail';
import CartScreen from './components/buyer/Cart';
import Wishlist from './page/Wishlist';
import SellerDashboard from './components/seller/SellerDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import SellerApproval from './components/admin/SellerApproval';
import NotFoundScreen from './components/common/NotFoundScreen';


// Protected Route Component




function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CartProvider>
          <WishlistProvider>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
            <AppRoutes />
          </WishlistProvider>
        </CartProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;