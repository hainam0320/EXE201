import React, { useState, useEffect } from 'react';

const API_URL = 'http://103.90.224.148:9999/api';

const AddProductForm = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    image: null,
    category: [], // Thêm category
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]); // Danh sách category

  // Lấy danh mục từ server
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        setCategories(data.data || []);
      } catch (err) {
        console.error('Lỗi khi tải danh mục:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      category: checked 
        ? [...prev.category, value]
        : prev.category.filter(cat => cat !== value)
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Vui lòng đăng nhập để thêm sản phẩm');

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('description', formData.description);
      formData.category.forEach(cat => formDataToSend.append('category', cat));
      if (formData.image) formDataToSend.append('image', formData.image);

      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataToSend
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Thêm sản phẩm thất bại');

      alert('Thêm sản phẩm thành công!');
      onAdd(result.data);
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Thêm sản phẩm mới</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Các trường thông tin sản phẩm */}
          <input name="name" required placeholder="Tên sản phẩm" value={formData.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          <input name="price" required type="number" placeholder="Giá" value={formData.price} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          <input name="stock" required type="number" placeholder="Tồn kho" value={formData.stock} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          <textarea name="description" placeholder="Mô tả" value={formData.description} onChange={handleChange} className="w-full border rounded px-3 py-2" />

          {/* Chọn danh mục */}
          <div>
            <label className="block mb-1 font-medium">Chọn danh mục</label>
            <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
              {categories.map(cat => (
                <label key={cat._id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    value={cat._id}
                    checked={formData.category.includes(cat._id)}
                    onChange={handleCategoryChange}
                    className="rounded text-pink-600 focus:ring-pink-500"
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Upload ảnh */}
          <div>
            <label className="block mb-1 font-medium">Ảnh sản phẩm</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {preview && <img src={preview} alt="preview" className="mt-2 h-24 w-24 object-cover rounded" />}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onClose} className="text-gray-600 hover:text-black">Hủy</button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Đang thêm...' : 'Thêm sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
