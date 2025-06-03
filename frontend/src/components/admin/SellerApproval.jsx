import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { Check, X, Clock, User, Mail, Phone, Calendar } from 'lucide-react';

const SellerApproval = () => {
    const navigate = useNavigate();
    const [pendingSellers, setPendingSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchPendingSellers();
    }, []);

    const fetchPendingSellers = async () => {
        try {
            setLoading(true);
            const response = await authAPI.getPendingSellers();
            setPendingSellers(response.data.users);
        } catch (error) {
            console.error('Error fetching pending sellers:', error);
            setError('Không thể tải danh sách chờ duyệt');
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (userId, action) => {
        try {
            console.log('=== HANDLE APPROVAL ===');
            console.log('userId:', userId);
            console.log('action:', action);
            console.log('token:', localStorage.getItem('token'));
            
            setActionLoading(prev => ({ ...prev, [userId]: true }));
            setError('');
            setSuccess('');

            const response = await authAPI.approveSellerRequest(userId, action);
            console.log('API Response:', response);
            
            if (action === 'approve') {
                setSuccess(`Đã duyệt tài khoản seller thành công!`);
            } else {
                setSuccess(`Đã từ chối yêu cầu seller!`);
            }

            // Refresh danh sách
            await fetchPendingSellers();
        } catch (error) {
            console.error('Error handling approval:', error);
            console.error('Error details:', {
                response: error.response,
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Có lỗi xảy ra khi xử lý yêu cầu');
            }
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
                                                        {seller.userName} {seller.lastName}
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