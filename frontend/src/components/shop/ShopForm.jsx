import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import shopService from '../../services/shopService';

const ShopForm = ({ initialData, mode = 'create' }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: {
            street: '',
            city: '',
            state: '',
            country: '',
            zipCode: ''
        },
        contact: {
            email: '',
            phone: ''
        },
        categories: [],
        logo: null,
        coverImage: null
    });
    const [previewLogo, setPreviewLogo] = useState(null);
    const [previewCover, setPreviewCover] = useState(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                logo: null,
                coverImage: null
            });
            setPreviewLogo(initialData.logo);
            setPreviewCover(initialData.coverImage);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));

            // Tạo preview
            const reader = new FileReader();
            reader.onloadend = () => {
                if (name === 'logo') {
                    setPreviewLogo(reader.result);
                } else {
                    setPreviewCover(reader.result);
                }
            };
            reader.readAsDataURL(files[0]);
        }
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        if (!formData.categories.includes(value)) {
            setFormData(prev => ({
                ...prev,
                categories: [...prev.categories, value]
            }));
        }
    };

    const removeCategory = (category) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.filter(c => c !== category)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === 'create') {
                await shopService.createShop(formData);
                toast.success('Tạo cửa hàng thành công!');
                navigate('/seller/dashboard');
            } else {
                await shopService.updateShop(formData);
                toast.success('Cập nhật cửa hàng thành công!');
            }
        } catch (error) {
            // Lấy status code từ nhiều nguồn
            const status = error?.status || error?.response?.status || error?.statusCode;
            if (status === 401) {
                // Nếu là 401, chuyển về login
                window.location.href = '/login';
            } else {
                // Các lỗi khác chỉ báo lỗi, không logout
                toast.error(error.message || error.error || 'Có lỗi xảy ra');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">
                {mode === 'create' ? 'Tạo cửa hàng mới' : 'Cập nhật cửa hàng'}
            </h2>

            {/* Thông tin cơ bản */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block mb-1">Tên cửa hàng *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Mô tả *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>
            </div>

            {/* Địa chỉ */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Địa chỉ</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1">Đường</label>
                        <input
                            type="text"
                            name="address.street"
                            value={formData.address.street}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Thành phố</label>
                        <input
                            type="text"
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Tỉnh/Thành</label>
                        <input
                            type="text"
                            name="address.state"
                            value={formData.address.state}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Quốc gia</label>
                        <input
                            type="text"
                            name="address.country"
                            value={formData.address.country}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Mã bưu chính</label>
                        <input
                            type="text"
                            name="address.zipCode"
                            value={formData.address.zipCode}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>
            </div>

            {/* Thông tin liên hệ */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Thông tin liên hệ</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1">Email</label>
                        <input
                            type="email"
                            name="contact.email"
                            value={formData.contact.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Số điện thoại</label>
                        <input
                            type="tel"
                            name="contact.phone"
                            value={formData.contact.phone}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>
            </div>

            {/* Danh mục */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Danh mục</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                    {formData.categories.map(category => (
                        <span
                            key={category}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center"
                        >
                            {category}
                            <button
                                type="button"
                                onClick={() => removeCategory(category)}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
                <select
                    onChange={handleCategoryChange}
                    className="w-full p-2 border rounded"
                >
                    <option value="">Chọn danh mục...</option>
                    <option value="electronics">Điện tử</option>
                    <option value="fashion">Thời trang</option>
                    <option value="food">Thực phẩm</option>
                    <option value="beauty">Làm đẹp</option>
                    <option value="home">Đồ gia dụng</option>
                </select>
            </div>

            {/* Hình ảnh */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Hình ảnh</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1">Logo</label>
                        <input
                            type="file"
                            name="logo"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="w-full p-2 border rounded"
                        />
                        {previewLogo && (
                            <img
                                src={previewLogo}
                                alt="Logo preview"
                                className="mt-2 w-32 h-32 object-cover rounded"
                            />
                        )}
                    </div>
                    <div>
                        <label className="block mb-1">Ảnh bìa</label>
                        <input
                            type="file"
                            name="coverImage"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="w-full p-2 border rounded"
                        />
                        {previewCover && (
                            <img
                                src={previewCover}
                                alt="Cover preview"
                                className="mt-2 w-full h-32 object-cover rounded"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Nút submit */}
            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 border rounded hover:bg-gray-100"
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                >
                    {loading ? 'Đang xử lý...' : mode === 'create' ? 'Tạo cửa hàng' : 'Cập nhật'}
                </button>
            </div>
        </form>
    );
};

export default ShopForm; 