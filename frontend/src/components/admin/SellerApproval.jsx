import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { Check, X, Clock, User, Mail, Phone, Calendar } from 'lucide-react';

// Modal component để hiển thị ảnh phóng to
const ImageModal = ({ imageUrl, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-75 flex items-center justify-center p-4" 
            onClick={onClose}
            style={{ backdropFilter: 'blur(5px)' }}
        >
            <div 
                className="relative bg-white rounded-lg p-2 max-w-[90vw] max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 text-white hover:text-gray-300"
                >
                    <X className="h-8 w-8" />
                </button>
                <img
                    src={imageUrl}
                    alt="Hóa đơn chi tiết"
                    className="max-w-full max-h-[85vh] object-contain"
                />
            </div>
        </div>
    );
};

const SellerApproval = () => {
    const navigate = useNavigate();
    const [pendingSellers, setPendingSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetchPendingSellers();
    }, []);

    const fetchPendingSellers = async () => {
        try {
            setLoading(true);
            const response = await authAPI.getPendingSellers();
            console.log('Pending sellers data:', response.data);
            setPendingSellers(response.data.users || []);
        } catch (error) {
            console.error('Error fetching pending sellers:', error);
            setError('Không thể tải danh sách chờ duyệt');
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (userId, action) => {
        try {
            setActionLoading(prev => ({ ...prev, [userId]: true }));
            setError('');
            setSuccess('');

            const response = await authAPI.approveSellerRequest(userId, action);
            
            if (action === 'approve') {
                setSuccess(`Đã duyệt tài khoản seller thành công!`);
            } else {
                setSuccess(`Đã từ chối yêu cầu seller!`);
            }

            await fetchPendingSellers();
        } catch (error) {
            console.error('Error handling approval:', error);
            setError(error.response?.data?.message || 'Có lỗi xảy ra khi xử lý yêu cầu');
        } finally {
            setActionLoading(prev => ({ ...prev, [userId]: false }));
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Hàm xử lý khi click vào ảnh
    const handleImageClick = (imageUrl) => {
        console.log('Clicked image URL:', imageUrl); // Debug log
        if (imageUrl) {
            // Xử lý đường dẫn ảnh
            const baseUrl = process.env.REACT_APP_API_URL || 'http://103.90.224.148:9999';
            const normalizedPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
            const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${normalizedPath}`;
            console.log('Full image URL:', fullImageUrl); // Debug log
            setSelectedImage(fullImageUrl);
        }
    };

    const getRequestTypeText = (user) => {
        if (user.requestType === 'premium_renewal') {
            return 'Gia hạn Premium';
        }
        return 'Đăng ký Seller';
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Modal hiển thị ảnh */}
            <ImageModal
                imageUrl={selectedImage}
                isOpen={!!selectedImage}
                onClose={() => setSelectedImage(null)}
            />
            
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                        <Clock className="h-6 w-6 text-pink-600 mr-2" />
                        Phê duyệt tài khoản Seller
                    </h1>
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        ← Quay lại Dashboard
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                        {success}
                    </div>
                )}

                <div className="mb-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Tổng cộng: <span className="font-semibold">{pendingSellers.length}</span> yêu cầu chờ xử lý
                    </div>
                    <button
                        onClick={fetchPendingSellers}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                        🔄 Làm mới
                    </button>
                </div>

                {pendingSellers.length === 0 ? (
                    <div className="text-center py-12">
                        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Không có yêu cầu nào
                        </h3>
                        <p className="text-gray-500">
                            Hiện tại không có yêu cầu seller nào cần phê duyệt.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thông tin người dùng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Liên hệ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày đăng ký
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Hóa đơn
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pendingSellers.map((seller) => (
                                    <tr key={seller._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                                                        <User className="h-5 w-5 text-pink-600" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {getRequestTypeText(seller)} - {seller.userName} {seller.lastName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ID: {seller._id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                <div className="flex items-center mb-1">
                                                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                                                    {seller.email}
                                                </div>
                                                <div className="flex items-center">
                                                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                                    {seller.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                                {formatDate(seller.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {seller.receipt ? (
                                                <div 
                                                    className="relative group cursor-pointer"
                                                    onClick={() => handleImageClick(seller.receipt)}
                                                >
                                                    <div className="h-20 w-20 rounded overflow-hidden">
                                                        <img
                                                            src={`${process.env.REACT_APP_API_URL || 'http://103.90.224.148:9999'}${seller.receipt.startsWith('/') ? '' : '/'}${seller.receipt}`}
                                                            alt="Hóa đơn"
                                                            className="h-full w-full object-cover transition-transform transform group-hover:scale-105"
                                                        />
                                                    </div>
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded"></div>
                                                    <div className="absolute bottom-0 left-0 right-0 p-1 bg-black bg-opacity-50 text-white text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity rounded-b">
                                                        Click để xem
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-red-500 text-sm">Chưa có hóa đơn</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                <Clock className="h-3 w-3 mr-1" />
                                                Chờ duyệt Seller
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => handleApproval(seller._id, 'approve')}
                                                    disabled={actionLoading[seller._id]}
                                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                                >
                                                    <Check className="h-4 w-4 mr-1" />
                                                    {actionLoading[seller._id] ? 'Đang xử lý...' : 'Duyệt'}
                                                </button>
                                                <button
                                                    onClick={() => handleApproval(seller._id, 'reject')}
                                                    disabled={actionLoading[seller._id]}
                                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                                >
                                                    <X className="h-4 w-4 mr-1" />
                                                    {actionLoading[seller._id] ? 'Đang xử lý...' : 'Từ chối'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerApproval; 