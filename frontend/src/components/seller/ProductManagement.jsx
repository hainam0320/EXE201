import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AddProductForm from './AddProductForm';

const API_URL = 'http://localhost:9999/api';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const result = await response.json();
      if (result.success) {
        setProducts(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Có lỗi xảy ra khi tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = (newProduct) => {
    setProducts(prevProducts => [...prevProducts, newProduct]);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

    try {
      // TODO: Thêm token xác thực vào header
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      const result = await response.json();
      if (result.success) {
        setProducts(products.filter(product => product._id !== productId));
      } else {
        throw new Error(result.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Có lỗi xảy ra khi xóa sản phẩm');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Đang tải...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Quản lý sản phẩm</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Chưa có sản phẩm nào. Hãy thêm sản phẩm mới!
        </div>
      ) : (
        <div className="space-y-4">
          {products.map(product => (
            <div key={product._id} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-16 h-16 object-cover rounded"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-gray-600">{Number(product.price).toLocaleString('vi-VN')}₫</p>
                  <p className="text-sm text-gray-500">Kho: {product.stock}</p>
                  {product.description && (
                    <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                  onClick={() => {
                    alert('Chức năng sửa sản phẩm đang được phát triển');
                  }}
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  className="p-2 text-red-600 hover:bg-red-100 rounded"
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddForm && (
        <AddProductForm
          onAdd={handleAddProduct}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

export default ProductManagement;
