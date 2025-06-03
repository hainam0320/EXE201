// AppContent.js
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ChangePassword from "./components/ChangePassword";
import Shop from "./components/Shop";
import ProductDetail from "./components/ProductDetail";
import CartScreen from "./components/CartScreen";
import SellerDashboard from "./components/SellerDashboard";
import AdminDashboard from "./components/AdminDashboard";
import SellerApproval from "./components/SellerApproval";
import NotFoundScreen from "./components/NotFoundScreen";
import { useAuth } from "./contexts/AuthContext";
import api from "./services/api";

function AppContent() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [resetToken, setResetToken] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const action = urlParams.get("action");

    if (action === "reset-password" && token) {
      setResetToken(token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (token && userId) {
        try {
          const response = await api.get("/auth/profile");
          const userData = response.data.user;

          const user = {
            id: userData._id,
            name: userData.userName,
            email: userData.email,
            role: userData.role || (userData.isAdmin ? "admin" : "buyer"),
            isAdmin: userData.isAdmin,
          };
          login(user);
        } catch (error) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
        }
      }

      setIsLoading(false);
    };

    checkSession();
  }, [login]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword token={resetToken} />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/seller-approval" element={<SellerApproval />} />
          <Route path="*" element={<NotFoundScreen />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default AppContent;
