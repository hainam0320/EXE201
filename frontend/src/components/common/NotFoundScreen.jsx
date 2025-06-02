import React from 'react';

const NotFoundScreen = ({ setCurrentScreen }) => {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🌸</div>
        <h1 className="text-4xl font-bold mb-4">404 - Không tìm thấy trang</h1>
        <p className="text-gray-600 mb-8">Trang bạn tìm kiếm không tồn tại.</p>
        <button 
          className="bg-pink-600 text-white px-6 py-3 rounded-md hover:bg-pink-700 transition-colors"
          onClick={() => setCurrentScreen && setCurrentScreen('home')}
        >
          Về trang chủ
        </button>
      </div>
    );
  };

export default NotFoundScreen;