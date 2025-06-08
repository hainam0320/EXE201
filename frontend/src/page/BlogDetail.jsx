import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb, Tag, Spin, message } from 'antd';
import { Link } from 'react-router-dom';
import { EyeOutlined } from '@ant-design/icons';
import blogAPI from '../services/blogAPI';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogDetail();
  }, [id]);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getById(id);
      if (response.success) {
        setBlog(response.data);
      } else {
        setError('Không thể tải thông tin blog');
      }
    } catch (error) {
      console.error('Error fetching blog detail:', error);
      setError('Blog không tồn tại hoặc đã bị xóa');
      message.error('Không thể tải thông tin blog');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl text-gray-800 mb-4">{error || 'Blog không tồn tại'}</h1>
        <button
          onClick={() => navigate('/blog')}
          className="text-pink-600 hover:text-pink-700"
        >
          Quay lại danh sách blog
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link to="/">Trang chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/blog">Blog</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{blog.title}</Breadcrumb.Item>
      </Breadcrumb>

      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          <div className="flex items-center justify-between text-gray-600 mb-4">
            <div className="flex items-center space-x-4">
              <span>{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
              <span className="flex items-center">
                <EyeOutlined className="mr-1" />
                {blog.views || 0} lượt xem
              </span>
            </div>
            {blog.category && (
              <div>
                <Link 
                  to={`/blog?category=${blog.category._id}`} 
                  className="text-blue-600 hover:text-blue-800"
                >
                  {blog.category.name}
                </Link>
              </div>
            )}
          </div>
          <div className="aspect-w-16 aspect-h-9 mb-8">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x400?text=HoaMuse';
              }}
            />
          </div>
        </header>

        <div className="prose max-w-none mb-8">
          <p className="text-xl text-gray-700 mb-8">{blog.description}</p>
          <div 
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <footer className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <Tag key={index} color="blue">{tag}</Tag>
              ))}
            </div>
          </footer>
        )}
      </article>
    </div>
  );
};

export default BlogDetail; 