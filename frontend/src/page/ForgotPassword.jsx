import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await authAPI.forgotPassword(email);
            setSuccess('Link đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.');
            setEmail('');
        } catch (error) {
            console.error('Forgot password error:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Có lỗi xảy ra. Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Quên mật khẩu</h2>
            
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
                Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu đến hộp thư của bạn.
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                        disabled={loading}
                        placeholder="Nhập email của bạn"
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
                    {loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
                </button>
            </form>

            <div className="mt-6 text-center space-y-2">
                <button 
                    onClick={() => navigate('/login')}
                    className="text-pink-600 hover:underline text-sm"
                    disabled={loading}
                >
                    ← Quay lại đăng nhập
                </button>
                <div className="text-sm text-gray-600">
                    Chưa có tài khoản? 
                    <button 
                        onClick={() => navigate('/register')}
                        className="text-pink-600 hover:underline ml-1"
                        disabled={loading}
                    >
                        Đăng ký ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword; 