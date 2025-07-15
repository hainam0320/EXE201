import React from 'react';
import { Facebook, Instagram, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-pink-50 to-rose-50 border-t border-pink-100 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & slogan */}
        <div>
          <div className="flex items-center mb-4">
            <img 
              src="/hoamuse.jpg" 
              alt="HoaMuse Logo" 
              className="h-56 w-auto object-contain py-1"
            />
          </div>
          <p className="text-gray-600 text-sm">
            Mang vẻ đẹp của hoa đến mọi không gian, 
            tạo nên những khoảnh khắc đáng nhớ trong cuộc sống của bạn.
          </p>
        </div>
        {/* Liên kết nhanh */}
        <div>
          <h3 className="font-semibold mb-3 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Liên kết nhanh</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <a href="#" className="hover:text-pink-600 transition-colors duration-300 flex items-center">
                <span className="h-1 w-1 bg-pink-400 rounded-full mr-2"></span>
                Trang chủ
              </a>
            </li>
            <li>
              <a href="shop" className="hover:text-pink-600 transition-colors duration-300 flex items-center">
                <span className="h-1 w-1 bg-pink-400 rounded-full mr-2"></span>
                Sản phẩm
              </a>
            </li>
            <li>
              <a href="about" className="hover:text-pink-600 transition-colors duration-300 flex items-center">
                <span className="h-1 w-1 bg-pink-400 rounded-full mr-2"></span>
                Giới thiệu
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/profile.php?id=100090125010846" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-colors duration-300 flex items-center">
                <span className="h-1 w-1 bg-pink-400 rounded-full mr-2"></span>
                Liên hệ
              </a>
            </li>
          </ul>
        </div>
        {/* Thông tin liên hệ */}
        <div>
          <h3 className="font-semibold mb-3 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Liên hệ</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center hover:text-pink-600 transition-colors duration-300 cursor-pointer">
              <div className="p-2 bg-white rounded-full shadow-sm mr-2">
                <Phone className="h-4 w-4 text-pink-500" />
              </div>
              0388552961
            </li>
            <li className="flex items-center hover:text-pink-600 transition-colors duration-300 cursor-pointer">
              <div className="p-2 bg-white rounded-full shadow-sm mr-2">
                <Mail className="h-4 w-4 text-pink-500" />
              </div>
              HoaMuse@gmail.com
            </li>
            <li className="flex items-center hover:text-pink-600 transition-colors duration-300 cursor-pointer">
              <div className="p-2 bg-white rounded-full shadow-sm mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              Đại học FPT Hà Nội
            </li>
          </ul>
        </div>
        {/* Mạng xã hội */}
        <div>
          <h3 className="font-semibold mb-3 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Kết nối với chúng tôi</h3>
          <div className="flex space-x-4">
            <a 
              href="https://www.facebook.com/profile.php?id=100090125010846" 
              className="p-3 rounded-full bg-white shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <Facebook className="h-5 w-5 text-pink-500 group-hover:text-pink-600" />
            </a>
            <a 
              href="#" 
              className="p-3 rounded-full bg-white shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <Instagram className="h-5 w-5 text-pink-500 group-hover:text-pink-600" />
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Theo dõi chúng tôi để nhận những thông tin mới nhất về sản phẩm và khuyến mãi!
          </p>
        </div>
      </div>
      <div className="border-t border-pink-100 text-center py-4 text-gray-600 text-sm bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          &copy; {new Date().getFullYear()} HoaMuse. Thiết kế với 
          <span className="text-pink-500 mx-1">♥</span> 
          bởi HoaMuse Team
        </div>
      </div>
    </footer>
  );
};

export default Footer;
