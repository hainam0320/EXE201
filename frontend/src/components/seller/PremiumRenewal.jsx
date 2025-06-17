import React, { useState } from 'react';
import { authAPI } from '../../services/api';

const PremiumRenewal = ({ email, onRenewalSuccess, onCancel }) => {
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.includes('image')) {
                setError('Vui lòng chỉ upload file ảnh');
                return;
            }
            setReceipt(file);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!receipt) {
            setError('Vui lòng upload hóa đơn thanh toán');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('receipt', receipt);
        formData.append('email', email);

        try {
            await authAPI.renewPremium(formData);
            onRenewalSuccess();
        } catch (error) {
            console.error('Premium renewal error:', error);
            setError(error.response?.data?.message || 'Có lỗi xảy ra khi gia hạn Premium');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">Gia hạn Premium</h3>
                
                <div className="mb-6">
                    <p className="text-gray-700 mb-4">
                        Để gia hạn Premium, vui lòng thực hiện các bước sau:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                        <li>Quét mã QR bên dưới để thanh toán</li>
                        <li>Chụp ảnh hóa đơn thanh toán</li>
                        <li>Upload ảnh hóa đơn và bấm xác nhận</li>
                    </ol>
                </div>

                <div className="mb-6">
                    <img 
                        src="/qrcode.jpg" 
                        alt="QR Code thanh toán" 
                        className="mx-auto max-w-[200px]"
                    />
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Upload hóa đơn thanh toán
                        </label>
                        <input
                            type="file"
                            name="receipt"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            disabled={loading}
                        />
                    </div>

                    <div className="flex space-x-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 py-2 rounded-md ${
                                loading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-pink-600 hover:bg-pink-700'
                            } text-white`}
                        >
                            {loading ? 'Đang xử lý...' : 'Xác nhận gia hạn'}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PremiumRenewal; 