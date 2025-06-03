import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Pagination, Select, Spin, message } from 'antd';
import { Link, useSearchParams } from 'react-router-dom';
import blogAPI from '../services/blogAPI';

const { Option } = Select;

const BlogList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || null);
  const [loading, setLoading] = useState(true);
  const pageSize = 9;

  useEffect(() => {
    fetchData();
  }, [currentPage, selectedCategory]);

  useEffect(() => {
    // Sync URL with selected category
    if (selectedCategory) {
      setSearchParams({ category: selectedCategory });
    } else {
      setSearchParams({});
    }
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [blogsRes, categoriesRes] = await Promise.all([
        blogAPI.getAll(currentPage, pageSize, selectedCategory),
        blogAPI.getCategories()
      ]);

      if (blogsRes.success) {
        setBlogs(blogsRes.data || []);
        setTotal(blogsRes.pagination?.total || 0);
      } else {
        message.error('Không thể tải danh sách blog');
      }

      if (categoriesRes.success) {
        setCategories(categoriesRes.data || []);
      } else {
        message.error('Không thể tải danh mục');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">Blog</h1>
        <div className="flex justify-end mb-4">
          <Select
            style={{ width: 200 }}
            placeholder="Chọn danh mục"
            onChange={handleCategoryChange}
            allowClear
            value={selectedCategory}
          >
            {categories.map((category) => (
              <Option key={category._id} value={category._id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          Không có bài viết nào
        </div>
      ) : (
        <>
          <Row gutter={[24, 24]}>
            {blogs.map((blog) => (
              <Col key={blog._id} xs={24} sm={12} md={8}>
                <Link to={`/blog/${blog._id}`}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={blog.title}
                        src={blog.image}
                        className="h-48 w-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=HoaMuse';
                        }}
                      />
                    }
                    className="h-full"
                  >
                    <Card.Meta
                      title={blog.title}
                      description={
                        <div>
                          <p className="text-gray-600 line-clamp-2">{blog.description}</p>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                            <span className="text-sm text-gray-500">
                              {blog.views || 0} lượt xem
                            </span>
                          </div>
                          {blog.category && (
                            <div className="mt-2">
                              <span className="text-xs text-blue-600">
                                {blog.category.name}
                              </span>
                            </div>
                          )}
                        </div>
                      }
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>

          <div className="mt-8 flex justify-center">
            <Pagination
              current={currentPage}
              total={total}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default BlogList; 