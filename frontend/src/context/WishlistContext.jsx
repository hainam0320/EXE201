import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [operationLoading, setOperationLoading] = useState(false);
    const { currentUser, logout } = useAuth();

    useEffect(() => {
        if (currentUser && currentUser.role === 'buyer') {
            fetchWishlist();
        } else {
            setWishlistItems([]);
            setLoading(false);
        }
    }, [currentUser]);

    const handleAuthError = (error) => {
        if (error.response && error.response.status === 401) {
            toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            logout();
            return true;
        }
        return false;
    };

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const response = await wishlistAPI.getWishlist();
            setWishlistItems(response.data.data.products || []);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            if (!handleAuthError(error)) {
                toast.error('Không thể tải danh sách yêu thích');
            }
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (productId) => {
        if (!currentUser || currentUser.role !== 'buyer') {
            toast.error('Vui lòng đăng nhập với tài khoản người mua để thêm vào yêu thích');
            return false;
        }

        try {
            setOperationLoading(true);
            const response = await wishlistAPI.addToWishlist(productId);
            setWishlistItems(response.data.data.products);
            toast.success('Đã thêm vào danh sách yêu thích');
            return true;
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            if (!handleAuthError(error)) {
                toast.error('Không thể thêm vào danh sách yêu thích');
            }
            return false;
        } finally {
            setOperationLoading(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            setOperationLoading(true);
            const response = await wishlistAPI.removeFromWishlist(productId);
            setWishlistItems(response.data.data.products);
            toast.success('Đã xóa khỏi danh sách yêu thích');
            return true;
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            if (!handleAuthError(error)) {
                toast.error('Không thể xóa khỏi danh sách yêu thích');
            }
            return false;
        } finally {
            setOperationLoading(false);
        }
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item._id === productId);
    };

    const value = {
        wishlistItems,
        loading,
        operationLoading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
}; 