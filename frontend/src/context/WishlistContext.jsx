import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (currentUser) {
            fetchWishlist();
        } else {
            setWishlistItems([]);
            setLoading(false);
        }
    }, [currentUser]);

    const fetchWishlist = async () => {
        try {
            const response = await wishlistAPI.getWishlist();
            setWishlistItems(response.data.data.products || []);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            toast.error('Không thể tải danh sách yêu thích');
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (productId) => {
        try {
            const response = await wishlistAPI.addToWishlist(productId);
            setWishlistItems(response.data.data.products);
            toast.success('Đã thêm vào danh sách yêu thích');
            return true;
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            toast.error('Không thể thêm vào danh sách yêu thích');
            return false;
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const response = await wishlistAPI.removeFromWishlist(productId);
            setWishlistItems(response.data.data.products);
            toast.success('Đã xóa khỏi danh sách yêu thích');
            return true;
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            toast.error('Không thể xóa khỏi danh sách yêu thích');
            return false;
        }
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item._id === productId);
    };

    const value = {
        wishlistItems,
        loading,
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