import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import blogAPI from '../../services/blogAPI';
import uploadAPI from '../../services/uploadAPI';
import { useAuth } from '../../context/AuthContext';

const { Option } = Select;
const { TextArea } = Input;

const TINYMCE_API_KEY = 'u3o3npyty31gt4aw5c3z881w2ch9af91z38164s030l8unb6';

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const { currentUser } = useAuth();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const fetchBlogs = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await blogAPI.getAll(page, pageSize);
      if (response.success) {
        setBlogs(response.data || []);
        setPagination({
          ...pagination,
          current: page,
          total: response.pagination?.total || 0
        });
      } else {
        message.error('Không thể tải danh sách blog');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      message.error('Lỗi khi tải danh sách blog');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await blogAPI.getCategories();
      if (response.success) {
        setCategories(response.data || []);
      } else {
        message.error('Không thể tải danh mục');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      message.error('Lỗi khi tải danh mục');
    }
  };

  useEffect(() => {
    fetchBlogs(pagination.current, pagination.pageSize);
    fetchCategories();
  }, []);

  const handleTableChange = (newPagination) => {
    fetchBlogs(newPagination.current, newPagination.pageSize);
  };

  const handleCreate = () => {
    form.resetFields();
    setContent('');
    setImageUrl('');
    setEditingId(null);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      category: record.category?._id,
      tags: record.tags,
      status: record.status
    });
    setContent(record.content || '');
    setImageUrl(record.image || '');
    setEditingId(record._id);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await blogAPI.delete(id);
      if (response.success) {
        message.success('Xóa blog thành công');
        fetchBlogs(pagination.current, pagination.pageSize);
      } else {
        message.error('Không thể xóa blog');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      message.error('Lỗi khi xóa blog');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const blogData = {
        ...values,
        content: content,
        image: imageUrl,
        author: currentUser._id
      };

      let response;
      if (editingId) {
        response = await blogAPI.update(editingId, blogData);
      } else {
        response = await blogAPI.create(blogData);
      }

      if (response.success) {
        message.success(editingId ? 'Cập nhật blog thành công' : 'Tạo blog mới thành công');
        setModalVisible(false);
        fetchBlogs(pagination.current, pagination.pageSize);
      } else {
        message.error('Không thể lưu blog');
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      message.error('Lỗi khi lưu blog');
    }
  };

  const handleUpload = async (file) => {
    try {
      const response = await uploadAPI.uploadFile(file);
      
      if (response.success && response.url) {
        setImageUrl(response.url);
        message.success('Tải ảnh lên thành công');
        return response.url;
      } else {
        message.error('Không thể tải ảnh lên');
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Lỗi khi tải ảnh lên');
      return null;
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const url = await handleUpload(file);
        if (url) {
          onSuccess();
        } else {
          onError(new Error('Upload failed'));
        }
      } catch (error) {
        onError(error);
      }
    }
  };

  const editorConfig = {
    height: 500,
    menubar: true,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount'
    ],
    toolbar:
      'undo redo | formatselect | bold italic backcolor | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | removeformat | image | help',
    images_upload_handler: async function (blobInfo, progress) {
      try {
        const response = await uploadAPI.uploadFile(blobInfo.blob());
        if (response.success && response.url) {
          return response.url;
        }
        throw new Error('Upload failed');
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
    },
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Ảnh đại diện',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        <img 
          src={image || 'https://via.placeholder.com/50x50?text=No+Image'} 
          alt="thumbnail" 
          style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/50x50?text=Error';
          }}
        />
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: ['category', 'name'],
      key: 'category',
      render: (text, record) => record.category?.name || 'Không có danh mục',
    },
    {
      title: 'Lượt xem',
      dataIndex: 'views',
      key: 'views',
      defaultSortOrder: 'descend',
      sorter: (a, b) => (a.views || 0) - (b.views || 0),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`px-2 py-1 rounded ${
          status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {status === 'published' ? 'Đã đăng' : 'Nháp'}
        </span>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
      defaultSortOrder: 'descend',
      sorter: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <div className="space-x-2">
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý Blog</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleCreate}
        >
          Thêm mới
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={blogs} 
        rowKey="_id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />

      <Modal
        title={editingId ? "Sửa blog" : "Thêm blog mới"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả ngắn"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Ảnh đại diện">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
            </Upload>
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt="preview" 
                style={{ marginTop: 8, maxWidth: 200 }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/200x200?text=Error';
                }}
              />
            )}
          </Form.Item>

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select>
              {categories.map(category => (
                <Option key={category._id} value={category._id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            initialValue="published"
          >
            <Select>
              <Option value="published">Đăng ngay</Option>
              <Option value="draft">Lưu nháp</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="tags"
            label="Tags"
          >
            <Select mode="tags" style={{ width: '100%' }} placeholder="Nhập tags">
              {/* Tags will be dynamically added */}
            </Select>
          </Form.Item>

          <Form.Item label="Nội dung">
            <Editor
              apiKey={TINYMCE_API_KEY}
              value={content}
              onEditorChange={(content) => setContent(content)}
              init={editorConfig}
            />
          </Form.Item>

          <Form.Item className="text-right">
            <Button type="default" onClick={() => setModalVisible(false)} className="mr-2">
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {editingId ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BlogManagement; 