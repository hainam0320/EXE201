import axios from '../utils/axios';
import { API_URL } from '../config';


const shopService = {
    // Lấy danh sách cửa hàng
    getAllShops: async (params) => {
        try {
            const response = await axios.get(`${API_URL}/api/shops`, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Lấy thông tin một cửa hàng
    getShop: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/api/shops/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Lấy thông tin cửa hàng của người bán hiện tại
    getMyShop: async () => {
        try {
            const response = await axios.get(`${API_URL}/api/shops/my/shop`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Tạo cửa hàng mới
    createShop: async (shopData) => {
        try {
            const formData = new FormData();
            
            // Thêm thông tin cơ bản
            formData.append('name', shopData.name);
            formData.append('description', shopData.description);
            
            // Thêm địa chỉ
            if (shopData.address) {
                Object.keys(shopData.address).forEach(key => {
                    formData.append(`address[${key}]`, shopData.address[key]);
                });
            }
            
            // Thêm thông tin liên hệ
            if (shopData.contact) {
                Object.keys(shopData.contact).forEach(key => {
                    formData.append(`contact[${key}]`, shopData.contact[key]);
                });
            }
            
            // Thêm danh mục
            if (shopData.categories) {
                shopData.categories.forEach(category => {
                    formData.append('categories[]', category);
                });
            }
            
            // Thêm files
            if (shopData.logo) {
                formData.append('logo', shopData.logo);
            }
            if (shopData.coverImage) {
                formData.append('coverImage', shopData.coverImage);
            }

            const response = await axios.post(`${API_URL}/api/shops`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Cập nhật cửa hàng
    updateShop: async (shopData) => {
        try {
            const formData = new FormData();
            
            // Thêm thông tin cần cập nhật
            if (shopData.name) formData.append('name', shopData.name);
            if (shopData.description) formData.append('description', shopData.description);
            
            // Cập nhật địa chỉ
            if (shopData.address) {
                Object.keys(shopData.address).forEach(key => {
                    if (shopData.address[key]) {
                        formData.append(`address[${key}]`, shopData.address[key]);
                    }
                });
            }
            
            // Cập nhật thông tin liên hệ
            if (shopData.contact) {
                Object.keys(shopData.contact).forEach(key => {
                    if (shopData.contact[key]) {
                        formData.append(`contact[${key}]`, shopData.contact[key]);
                    }
                });
            }
            
            // Cập nhật danh mục
            if (shopData.categories) {
                shopData.categories.forEach(category => {
                    formData.append('categories[]', category);
                });
            }
            
            // Cập nhật files
            if (shopData.logo) {
                formData.append('logo', shopData.logo);
            }
            if (shopData.coverImage) {
                formData.append('coverImage', shopData.coverImage);
            }

            const response = await axios.patch(`${API_URL}/api/shops/my/shop`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Xóa cửa hàng
    deleteShop: async () => {
        try {
            const response = await axios.delete(`${API_URL}/api/shops/my/shop`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default shopService; 