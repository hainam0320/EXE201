import React, { useState, useRef } from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

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
          alt="QR Code phóng to"
          className="max-w-full max-h-[85vh] object-contain"
        />
      </div>
    </div>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    userName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
    hasPaid: false
  });

  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra định dạng file
      if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
        setError('Vui lòng chỉ upload file ảnh (jpeg, jpg, png, gif)');
        fileInputRef.current.value = '';
        return;
      }
      
      // Kiểm tra kích thước file
      if (file.size > 5 * 1024 * 1024) {
        setError('Kích thước file không được vượt quá 5MB');
        fileInputRef.current.value = '';
        return;
      }
      
      setReceipt(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setLoading(false);
      return;
    }

    if (formData.role === 'seller') {
      if (!formData.hasPaid) {
        setError('Vui lòng chuyển khoản và xác nhận đã thanh toán để tiếp tục.');
        setLoading(false);
        return;
      }
      if (!receipt) {
        setError('Vui lòng upload hóa đơn thanh toán');
        setLoading(false);
        return;
      }
    }

    try {
      const { confirmPassword, hasPaid, ...registerData } = formData;
      const dataToSend = { ...registerData };
      
      if (receipt) {
        dataToSend.receipt = receipt;
      }

      const response = await authAPI.register(dataToSend);

      setSuccess(response.data.message);

      if (response.data.needsApproval) {
        setTimeout(() => {
          navigate('/login');
        }, 4000);
      } else {
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Đăng ký thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <ImageModal
        imageUrl="/qrcode.jpg"
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
      />

      <h2 className="text-2xl font-bold text-center mb-6">Đăng ký</h2>

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

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Họ</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Loại tài khoản</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            disabled={loading}
          >
            <option value="buyer">Người mua</option>
            <option value="seller">Người bán</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Người mua: Mua sắm hoa và sản phẩm | Người bán: Bán hoa và quản lý shop
          </p>
        </div>

        {formData.role === 'seller' && (
          <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-md">
            <p className="text-sm text-gray-700 mb-2">
              Vui lòng chuyển khoản 100.000đ để kích hoạt tài khoản người bán:
            </p>
            <div className="relative group cursor-pointer" onClick={() => setShowQRModal(true)}>
              <img
                src="/qrcode.jpg"
                alt="QR chuyển khoản"
                className="w-48 h-48 mx-auto mb-2 transition-transform transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded"></div>
              <div className="absolute bottom-2 left-0 right-0 p-1 bg-black bg-opacity-50 text-white text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity">
                Click để phóng to
              </div>
            </div>
            <p className="text-center text-sm text-gray-500 mb-2">
              Nội dung chuyển khoản: <strong>{formData.phone || 'SĐT_đăng_ký'}</strong>
            </p>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload ảnh hóa đơn chuyển khoản
              </label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="w-full"
              />
            </div>
            <label className="flex items-center text-sm mt-2">
              <input
                type="checkbox"
                name="hasPaid"
                checked={formData.hasPaid}
                onChange={handleInputChange}
                className="mr-2"
                disabled={loading}
              />
              Tôi đã chuyển khoản và đính kèm hóa đơn
            </label>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md transition-colors ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'
          } text-white`}
        >
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
      </form>

      <p className="text-center mt-4 text-sm text-gray-600">
        Đã có tài khoản?{' '}
        <button
          onClick={() => !loading && navigate('/login')}
          className="text-pink-600 hover:underline ml-1"
        >
          Đăng nhập
        </button>
      </p>
    </div>
  );
};

export default Register;
