import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import shopService from '../../services/shopService';

const ShopList = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        search: '',
        category: '',
        sort: ''
    });
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchShops();
    }, [filters]);

    const fetchShops = async () => {
        try {
            setLoading(true);
            const response = await shopService.getAllShops(filters);
            setShops(response.data);
            setTotalPages(response.totalPages);
        } catch (error) {
            setError(error.message || 'Có lỗi xảy ra khi tải danh sách cửa hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setFilters(prev => ({
            ...prev,
            search: e.target.value,
            page: 1
        }));
    };

    const handleCategoryChange = (e) => {
        setFilters(prev => ({
            ...prev,
            category: e.target.value,
            page: 1
        }));
    };

    const handleSortChange = (e) => {
        setFilters(prev => ({
            ...prev,
            sort: e.target.value,
            page: 1
        }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    if (loading) {
        return <div className="text-center py-8">Đang tải...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600 py-8">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Filters */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm cửa hàng..."
                    value={filters.search}
                    onChange={handleSearch}
                    className="p-2 border rounded"
                />
                <select
                    value={filters.category}
                    onChange={handleCategoryChange}
                    className="p-2 border rounded"
                >
                    <option value="">Tất cả danh mục</option>
                    <option value="electronics">Điện tử</option>
                    <option value="fashion">Thời trang</option>
                    <option value="food">Thực phẩm</option>
                    <option value="beauty">Làm đẹp</option>
                    <option value="home">Đồ gia dụng</option>
                </select>
                <select
                    value={filters.sort}
                    onChange={handleSortChange}
                    className="p-2 border rounded"
                >
                    <option value="">Sắp xếp theo</option>
                    <option value="rating">Đánh giá</option>
                    <option value="newest">Mới nhất</option>
                </select>
            </div>

            {/* Shop Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shops.map(shop => (
                    <Link
                        key={shop._id}
                        to={`/shops/${shop._id}`}
                        className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        <div className="relative h-48">
                            <img
                                src={shop.coverImage}
                                alt={shop.name}
                                className="w-full h-full object-cover"
                            />
                            <img
                                src={shop.logo}
                                alt={`${shop.name} logo`}
                                className="absolute bottom-0 left-4 transform translate-y-1/2 w-20 h-20 rounded-full border-4 border-white object-cover bg-white"
                            />
                        </div>
                        <div className="p-4 pt-12">
                            <h3 className="text-xl font-semibold mb-2">{shop.name}</h3>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                {shop.description}
                            </p>
                            <div className="flex items-center text-sm text-gray-500">
                                <span className="flex items-center">
                                    ⭐ {shop.rating.toFixed(1)}
                                </span>
                                <span className="mx-2">•</span>
                                <span>{shop.totalReviews} đánh giá</span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {shop.categories.map(category => (
                                    <span
                                        key={category}
                                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                    >
                                        {category}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                    <button
                        onClick={() => handlePageChange(filters.page - 1)}
                        disabled={filters.page === 1}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                        Trước
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-4 py-2 border rounded ${
                                filters.page === i + 1 ? 'bg-blue-600 text-white' : ''
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(filters.page + 1)}
                        disabled={filters.page === totalPages}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                        Sau
                    </button>
                </div>
            )}
        </div>
    );
};

export default ShopList; 