import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import PremiumRenewal from '../components/seller/PremiumRenewal';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPremiumRenewal, setShowPremiumRenewal] = useState(false);

    const handleLogin = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
        const response = await authAPI.login({ email, password });
        const { token, userId, userName, role, isAdmin } = response.data;

        // Lưu token vào localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);

        // Tạo user object dựa trên response từ server
        const user = {
          id: userId,
          name: userName,
          email,
          role: role || (isAdmin ? 'admin' : 'buyer'),
          isAdmin
        };

        login(user);
        navigate('/');
      } catch (error) {
        console.error('Login error:', error);
        if (error.response && error.response.data) {
          const errorData = error.response.data;
          
          // Xử lý trường hợp tài khoản pending
          if (errorData.status === 'pending') {
            const roleText = errorData.requestedRole === 'seller' ? 'người bán' : 'người mua';
            setError(`Tài khoản ${roleText} của bạn đang chờ admin phê duyệt. Vui lòng đợi hoặc liên hệ admin.`);
          } 
          // Xử lý trường hợp tài khoản seller hết hạn premium
          else if (errorData.status === 'blocked' && errorData.needPremiumRenewal && errorData.role === 'seller') {
            setError('Tài khoản của bạn đã bị khóa do hết hạn Premium. Vui lòng gia hạn Premium để tiếp tục sử dụng.');
            setShowPremiumRenewal(true);
          }
          else if (errorData.message) {
            setError(errorData.message);
          } else {
            setError('Đăng nhập thất bại. Vui lòng thử lại.');
          }
        } else {
          setError('Đăng nhập thất bại. Vui lòng thử lại.');
        }
      } finally {
        setLoading(false);
      }
    };

    const handleRenewalSuccess = () => {
      setShowPremiumRenewal(false);
      setError('Yêu cầu gia hạn Premium đã được gửi. Vui lòng đợi admin phê duyệt.');
    };

    return (
      <>
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
                disabled={loading}
              />
            </div>
            
            <div className="text-right">
              <Link 
                to="/forgot-password"
                className="text-sm text-pink-600 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md transition-colors ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-pink-600 hover:bg-pink-700'
              } text-white`}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
          <p className="text-center mt-4 text-sm text-gray-600">
            Chưa có tài khoản? 
            <Link 
              to="/register"
              className="text-pink-600 hover:underline ml-1"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>

        {showPremiumRenewal && (
          <PremiumRenewal
            email={email}
            onRenewalSuccess={handleRenewalSuccess}
            onCancel={() => setShowPremiumRenewal(false)}
          />
        )}
      </>
    );
  };

export default Login;