import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const ResetPassword = ({ setCurrentScreen, token }) => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Kiểm tra nếu không có token, chuyển về trang login
        if (!token) {
            setError('Token không hợp lệ hoặc đã hết hạn.');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validate password confirmation
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            setLoading(false);
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            setLoading(false);
            return;
        }

        try {
            const response = await authAPI.resetPassword(token, formData.password);
            setSuccess('Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập...');
            
            // Chuyển về trang login sau 2 giây
            setTimeout(() => {
                setCurrentScreen('login');
            }, 2000);
        } catch (error) {
            console.error('Reset password error:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Có lỗi xảy ra. Token có thể đã hết hạn.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Nếu không có token, hiển thị thông báo lỗi
    if (!token) {
        return (
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-red-600">Lỗi</h2>
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
                    Token không hợp lệ hoặc đã hết hạn.
                </div>
                <button 
                    onClick={() => setCurrentScreen('forgot-password')}
                    className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 transition-colors"
                >
                    Gửi lại link đặt lại mật khẩu
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Đặt lại mật khẩu</h2>
            
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

            <div className="mb-6 text-sm text-gray-600 text-center">
                Nhập mật khẩu mới của bạn.
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                        disabled={loading}
                        placeholder="Nhập mật khẩu mới"
                        minLength="6"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                        disabled={loading}
                        placeholder="Xác nhận mật khẩu mới"
                        minLength="6"
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 rounded-md transition-colors ${
                        loading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-pink-600 hover:bg-pink-700'
                    } text-white`}
                >
                    {loading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button 
                    onClick={() => setCurrentScreen('login')}
                    className="text-pink-600 hover:underline text-sm"
                    disabled={loading}
                >
                    ← Quay lại đăng nhập
                </button>
            </div>
        </div>
    );
};

export default ResetPassword; 