import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import shopService from '../../services/shopService';

const API_URL = 'http://103.90.224.148:9999/api';

const ShopDetail = () => {
    const { id } = useParams();
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    useEffect(() => {
        fetchShopDetails();
        fetchShopProducts();
    }, [id]);

    const fetchShopDetails = async () => {
        try {
            setLoading(true);
            const response = await shopService.getShop(id);
            setShop(response.data);
        } catch (error) {
            setError(error.message || 'Có lỗi xảy ra khi tải thông tin cửa hàng');
        } finally {
            setLoading(false);
        }
    };

    const fetchShopProducts = async () => {
        try {
            setLoadingProducts(true);
            const res = await fetch(`${API_URL}/shops/${id}/products`);
            const data = await res.json();
            if (data.success) {
                setProducts(data.data);
            } else {
                setProducts([]);
            }
        } catch (err) {
            setProducts([]);
        } finally {
            setLoadingProducts(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Đang tải...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600 py-8">{error}</div>;
    }

    if (!shop) {
        return <div className="text-center py-8">Không tìm thấy cửa hàng</div>;
    }

    // Xử lý đường dẫn logo và coverImage an toàn
    const BACKEND_URL = 'http://103.90.224.148:9999';
    const logoUrl = shop.logo
      ? (shop.logo.startsWith('/uploads/') ? BACKEND_URL + shop.logo : shop.logo)
      : '/placeholder-image.jpg';
    const coverUrl = shop.coverImage
      ? (shop.coverImage.startsWith('/uploads/') ? BACKEND_URL + shop.coverImage : shop.coverImage)
      : '/placeholder-cover.jpg';

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Cover Image */}
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8">
                <img
                    src={coverUrl}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center">
                        <img
                            src={logoUrl}
                            alt={`${shop.name} logo`}
                            className="w-24 h-24 rounded-full border-4 border-white object-cover bg-white mr-6"
                        />
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{shop.name}</h1>
                            <div className="flex items-center text-sm">
                                <span className="flex items-center">
                                    ⭐ {shop.rating.toFixed(1)}
                                </span>
                                <span className="mx-2">•</span>
                                <span>{shop.totalReviews} đánh giá</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shop Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    {/* Description */}
                    <section className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Giới thiệu</h2>
                        <p className="text-gray-600">{shop.description}</p>
                    </section>

                    {/* Categories */}
                    <section className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Danh mục sản phẩm</h2>
                        <div className="flex flex-wrap gap-2">
                            {shop.categories.map(category => (
                                <span
                                    key={category}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Contact Info */}
                <div>
                    <section className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Thông tin liên hệ</h2>
                        <div className="space-y-4">
                            {shop.contact.email && (
                                <div>
                                    <h3 className="font-medium text-gray-700">Email:</h3>
                                    <p className="text-gray-600">{shop.contact.email}</p>
                                </div>
                            )}
                            {shop.contact.phone && (
                                <div>
                                    <h3 className="font-medium text-gray-700">Số điện thoại:</h3>
                                    <p className="text-gray-600">{shop.contact.phone}</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Address */}
                    <section className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Địa chỉ</h2>
                        <div className="space-y-2 text-gray-600">
                            {shop.address.street && <p>{shop.address.street}</p>}
                            {shop.address.city && <p>{shop.address.city}</p>}
                            {shop.address.state && <p>{shop.address.state}</p>}
                            {shop.address.country && <p>{shop.address.country}</p>}
                            {shop.address.zipCode && <p>Mã bưu chính: {shop.address.zipCode}</p>}
                        </div>
                    </section>
                </div>
            </div>

            {/* Sản phẩm của shop */}
            <section className="bg-white rounded-lg shadow-md p-6 mt-8">
                <h2 className="text-xl font-semibold mb-4">Tất cả sản phẩm của shop</h2>
                {loadingProducts ? (
                    <div>Đang tải sản phẩm...</div>
                ) : products.length === 0 ? (
                    <div>Shop chưa có sản phẩm nào.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(product => (
                            <div key={product._id} className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-32 h-32 object-cover rounded mb-2"
                                    onError={e => { e.target.src = '/placeholder-image.jpg'; }}
                                />
                                <h3 className="font-semibold text-center">{product.name}</h3>
                                <p className="text-pink-600 font-bold">{Number(product.price).toLocaleString('vi-VN')}₫</p>
                                <Link to={`/product/${product._id}`} className="mt-2 text-blue-600 hover:underline">Xem chi tiết</Link>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default ShopDetail; 