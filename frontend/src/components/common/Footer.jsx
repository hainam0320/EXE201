import React from 'react';
import { Facebook, Instagram, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & slogan */}
        <div>
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-2">🌸</span>
            <span className="text-2xl font-bold text-pink-600">HoaMuse</span>
          </div>
          <p className="text-gray-600">Gửi gắm yêu thương qua từng cánh hoa.</p>
        </div>
        {/* Liên kết nhanh */}
        <div>
          <h3 className="font-semibold mb-3 text-pink-600">Liên kết nhanh</h3>
          <ul className="space-y-2 text-gray-700">
            <li><a href="#" className="hover:text-pink-600 transition-colors">Trang chủ</a></li>
            <li><a href="#" className="hover:text-pink-600 transition-colors">Sản phẩm</a></li>
            <li><a href="#" className="hover:text-pink-600 transition-colors">Giới thiệu</a></li>
            <li><a href="#" className="hover:text-pink-600 transition-colors">Liên hệ</a></li>
          </ul>
        </div>
        {/* Thông tin liên hệ */}
        <div>
          <h3 className="font-semibold mb-3 text-pink-600">Liên hệ</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center"><Phone className="h-4 w-4 mr-2" /> 0123 456 789</li>
            <li className="flex items-center"><Mail className="h-4 w-4 mr-2" /> HoaMuse@gmail.com</li>
            <li>Đại học FPT Hà Nội</li>
          </ul>
        </div>
        {/* Mạng xã hội */}
        <div>
          <h3 className="font-semibold mb-3 text-pink-600">Kết nối với chúng tôi</h3>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/profile.php?id=100090125010846" className="p-2 rounded-full bg-pink-50 hover:bg-pink-100 transition-colors"><Facebook className="h-5 w-5 text-pink-600" /></a>
            <a href="#" className="p-2 rounded-full bg-pink-50 hover:bg-pink-100 transition-colors"><Instagram className="h-5 w-5 text-pink-600" /></a>
          </div>
        </div>
      </div>
      <div className="border-t text-center py-4 text-gray-500 text-sm bg-gray-50">
        &copy; {new Date().getFullYear()} HoaMuse. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
