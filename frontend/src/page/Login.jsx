import React, { useState } from 'react';

const Login = ({ setCurrentUser, setCurrentScreen }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('buyer');
  
    const handleLogin = (e) => {
      e.preventDefault();
      // Mock login
      const user = {
        id: 1,
        name: role === 'admin' ? 'Admin' : role === 'seller' ? 'Người bán' : 'Khách hàng',
        email,
        role
      };
      setCurrentUser(user);
      setCurrentScreen('home');
    };
  
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
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
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="buyer">Người mua</option>
              <option value="seller">Người bán</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 transition-colors"
          >
            Đăng nhập
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          Chưa có tài khoản? 
          <button 
            onClick={() => setCurrentScreen('register')}
            className="text-pink-600 hover:underline ml-1"
          >
            Đăng ký ngay
          </button>
        </p>
      </div>
    );
  };

export default Login;