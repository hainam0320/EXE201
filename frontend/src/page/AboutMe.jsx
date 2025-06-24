import React from 'react';

const AboutMe = () => {
  return (
    <div className="bg-pink-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-pink-600">Về Hoa Muse</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-pink-500">Giới thiệu</h2>
            <p className="text-gray-700 leading-relaxed">
              Chào mừng bạn đến với Hoa Muse – Chúng tôi là một website bán hoa trực tuyến đóng vai trò trung gian, 
              giúp người mua và người bán hoa dễ dàng tìm thấy nhau. Với Hoa Muse, bạn có thể chọn hoa theo màu sắc 
              yêu thích, chủ đề mong muốn, và nhanh chóng tìm được bó hoa phù hợp cho từng chủ đề mà bạn cần – từ 
              sinh nhật, kỷ niệm cho đến những lời cảm ơn hay động viên nhẹ nhàng.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Còn nếu bạn là người bán, Hoa Muse là nơi giúp bạn quản lý đơn hàng dễ dàng, giới thiệu cửa hàng hoa 
              của mình đến với đúng khách hàng bạn mong muốn.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-pink-500">Tầm nhìn</h2>
            <p className="text-gray-700 leading-relaxed">
              Hoa Muse mong muốn trở thành người bạn đồng hành đáng tin cậy, kết nối người mua và người bán trên một 
              nền tảng thân thiện, nơi việc chọn – tặng – và kinh doanh hoa trở nên dễ dàng và tiện lợi nhất cho tất 
              cả mọi người.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutMe; 