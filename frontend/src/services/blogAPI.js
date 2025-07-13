import axios from '../utils/axios';

const API_URL = 'http://103.90.224.148:9999/api';

// Helper function to get headers with token
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const blogAPI = {
  getAll: async (page = 1, limit = 10, categoryId = null) => {
    try {
      let url = `${API_URL}/blogs?page=${page}&limit=${limit}`;
      if (categoryId) {
        url += `&category=${categoryId}`;
      }
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching blogs:', error.response?.data || error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/blogs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog:', error.response?.data || error.message);
      throw error;
    }
  },

  getCategories: async () => {
    try {
      const response = await axios.get(`${API_URL}/blogs/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error.response?.data || error.message);
      throw error;
    }
  },

  create: async (blogData) => {
    try {
      const response = await axios.post(`${API_URL}/blogs`, blogData, { 
        headers: getHeaders() 
      });
      return response.data;
    } catch (error) {
      console.error('Error creating blog:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id, blogData) => {
    try {
      const response = await axios.put(`${API_URL}/blogs/${id}`, blogData, { 
        headers: getHeaders() 
      });
      return response.data;
    } catch (error) {
      console.error('Error updating blog:', error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/blogs/${id}`, { 
        headers: getHeaders() 
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting blog:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default blogAPI; 