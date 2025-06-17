// utils/axios.js
import axios from 'axios';

// Tạo một instance của Axios
const instance = axios.create({
  baseURL: 'http://103.90.224.148:9999', // ⚠️ Thay đổi nếu backend chạy port khác
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// ✅ Interceptor request: Tự động thêm token nếu có
instance.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Lỗi khi thêm token vào header:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor response: Tự động xử lý lỗi 401
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Token hết hạn hoặc không hợp lệ. Đang đăng xuất...');
      localStorage.removeItem('token');
      window.location.href = '/login'; // ⚠️ Điều hướng về trang login
    }
    return Promise.reject(error);
  }
);

export default instance;
