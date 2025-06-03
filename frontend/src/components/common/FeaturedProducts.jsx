import React, { useState, useEffect } from 'react';
import { productAPI } from '../../services/api';
import ProductCard from './ProductCard';

const FeaturedProducts = ({ onAddToCart, onViewDetail }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const response = await productAPI.getFeatured();
                const featuredProducts = response?.data?.data || [];
                setProducts(featuredProducts);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching featured products:', error);
                setError('Failed to load featured products');
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-600">
                {error}
            </div>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Sản phẩm nổi bật</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        onAddToCart={onAddToCart}
                        onViewDetail={onViewDetail}
                    />
                ))}
            </div>
        </div>
    );
};

export default FeaturedProducts; 