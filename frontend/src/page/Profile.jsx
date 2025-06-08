import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import api from '../services/api';

const Profile = () => {
    const { currentUser, login } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        userName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await api.get('/auth/profile');
                const userData = response.data.user;
                setFormData({
                    userName: userData.userName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || '',
                    phone: userData.phone || ''
                });
            } catch (error) {
                console.error('Error fetching profile:', error);
                setError('Không thể tải thông tin người dùng');
            }
        };

        fetchUserProfile();
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await api.put('/auth/profile', formData);
            setSuccess('Cập nhật thông tin thành công!');
            setIsEditing(false);
            
            // Cập nhật thông tin user trong context
            login({
                ...currentUser,
                name: formData.userName
            });

            setTimeout(() => {
                setSuccess('');
            }, 3000);
        } catch (error) {
            console.error('Update profile error:', error);
            setError(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
                        >
                            Chỉnh sửa
                        </button>
                    )}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
                        <div className="w-32 h-32 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                            <User className="w-16 h-16 text-pink-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {formData.userName} {formData.lastName}
                        </h2>
                        <p className="text-gray-600">{currentUser?.role}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên
                            </label>
                            <input
                                type="text"
                                name="userName"
                                value={formData.userName}
                                onChange={handleInputChange}
                                disabled={!isEditing || loading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Họ
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                disabled={!isEditing || loading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={!isEditing || loading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                disabled={!isEditing || loading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100"
                                required
                            />
                        </div>

                        {isEditing && (
                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`flex-1 py-2 px-4 rounded-md text-white transition-colors ${
                                        loading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-pink-600 hover:bg-pink-700'
                                    }`}
                                >
                                    {loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    disabled={loading}
                                    className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Hủy
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tùy chọn bảo mật</h3>
                    <Link
                        to="/change-password"
                        className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Đổi mật khẩu
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Profile; 