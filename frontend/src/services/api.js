import axios from 'axios';

const API_BASE_URL = 'http://localhost:9999/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forget-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  changePassword: (data) => api.put('/auth/change-password', data),
  getPendingSellers: () => api.get('/auth/pending-sellers'),
  approveSellerRequest: (userId, action) => api.put(`/auth/approve-seller/${userId}`, { action }),
  getDashboardStats: () => api.get('/auth/dashboard-stats'),
  getAllUsers: () => api.get('/auth/users'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (product) => api.post('/products', product),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`),
  search: (keyword) => api.get(`/products/search?keyword=${keyword}`),
  getFeatured: () => api.get('/products/featured'),
  getByCategory: (categoryId) => api.get(`/products/category/${categoryId}`)
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (category) => api.post('/categories', category),
  update: (id, category) => api.put(`/categories/${id}`, category),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const orderAPI = {
  create: (order) => api.post('/orders', order),
  getByUser: (userId) => api.get(`/orders/user/${userId}`),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post('/wishlist', { productId }),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
  checkWishlist: (productId) => api.get(`/wishlist/check/${productId}`)
};
export const cartAPI = {
  // Thêm sản phẩm vào giỏ hàng
  addToCart: (productId, quantity = 1) => {
    return api.post('/cart/add', { productId, quantity });
  },

  // Lấy giỏ hàng hiện tại của user
  getCart: () => {
    return api.get('/cart');
  },

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateCartItem: (productId, quantity) => {
    return api.put('/cart/update', { productId, quantity });
  },

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart: (productId) => {
    return api.delete(`/cart/item/${productId}`);
  },

  // Xóa sạch giỏ hàng
  clearCart: () => {
    return api.delete('/cart/clear');
  },
};

export default api;