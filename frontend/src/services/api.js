import axios from '../utils/axios';

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
  login: (data) => api.post('/auth/login', data),
  register: (data) => {
    const formData = new FormData();
    
    // Thêm các trường thông tin cơ bản
    Object.keys(data).forEach(key => {
      if (key !== 'logo' && key !== 'coverImage' && key !== 'receipt') {
        formData.append(key, data[key]);
      }
    });
    
    // Thêm các file nếu có
    if (data.logo) {
      formData.append('logo', data.logo);
    }
    if (data.coverImage) {
      formData.append('coverImage', data.coverImage);
    }
    if (data.receipt) {
      formData.append('receipt', data.receipt);
    }

    return api.post('/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  logout: () => api.post('/auth/logout'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  getPendingSellers: () => api.get('/auth/pending-sellers'),
  approveSellerRequest: (userId, action) => api.put(`/auth/approve-seller/${userId}`, { action }),
  getDashboardStats: () => api.get('/auth/dashboard-stats'),
  getAllUsers: () => api.get('/auth/users'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  blockUser: (userId) => api.put(`/auth/users/${userId}/block`),
  unblockUser: (userId) => api.put(`/auth/users/${userId}/unblock`),
  getPremiumInfo: () => api.get('/auth/premium-info'),
  renewPremium: (formData) => api.post('/auth/renew-premium', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
};

export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (product) => api.post('/products', product),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`),
  search: (keyword) => api.get(`/products/search?keyword=${keyword}`),
  getFeatured: () => api.get('/products/featured'),
  getByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
  getByCategories: (categoryIds) => {
    const query = categoryIds.join(',');
    return api.get(`/products/categories?categories=${query}`);
  },
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
  getMyOrders: () => api.get('/orders/my-orders'),
  getSellerOrders: () => api.get('/orders/seller-orders'),
  getAllOrders: () => api.get('/orders'),
  markPaid: (id) => api.post(`/orders/${id}/paid`),
  getByUser: (userId) => api.get(`/orders/user/${userId}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  updatePaymentStatus: (id, paymentStatus) => api.put(`/orders/${id}/payment-status`, { paymentStatus }),
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