import React from 'react';

const AboutMe = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section - Matching Home page banner height */}
      <div className="relative h-[500px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-[url('/public/banners/501218654_676615968685898_5488618290692746123_n.jpg')] bg-cover bg-center bg-no-repeat"
        />
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
      
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid gap-8 md:gap-12">
          {/* Introduction Section */}
          <section 
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300 animate-slide-up"
          >
            <h2 className="text-2xl font-semibold mb-6 text-pink-600 flex items-center">
              <span className="inline-block w-8 h-8 mr-3 bg-pink-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1.323l-3.954 1.582A1 1 0 004 6.868V16a1 1 0 001 1h10a1 1 0 001-1V6.868a1 1 0 00-1.046-.963L11 4.323V3a1 1 0 00-1-1zM5.5 7.5a.5.5 0 01.5-.5h8a.5.5 0 010 1H6a.5.5 0 01-.5-.5zm0 4a.5.5 0 01.5-.5h8a.5.5 0 010 1H6a.5.5 0 01-.5-.5z" clipRule="evenodd" />
                </svg>
              </span>
              Giới thiệu
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p className="text-lg">
                Chào mừng bạn đến với Hoa Muse – Chúng tôi là một website bán hoa trực tuyến đóng vai trò trung gian, 
                giúp người mua và người bán hoa dễ dàng tìm thấy nhau.
              </p>
              <p>
                Với Hoa Muse, bạn có thể chọn hoa theo màu sắc yêu thích, chủ đề mong muốn, và nhanh chóng tìm được 
                bó hoa phù hợp cho từng chủ đề mà bạn cần – từ sinh nhật, kỷ niệm cho đến những lời cảm ơn hay 
                động viên nhẹ nhàng.
              </p>
              <p>
                Còn nếu bạn là người bán, Hoa Muse là nơi giúp bạn quản lý đơn hàng dễ dàng, giới thiệu cửa hàng hoa 
                của mình đến với đúng khách hàng bạn mong muốn.
              </p>
            </div>
          </section>

          {/* Vision Section */}
          <section 
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300 animate-slide-up-delay"
          >
            <h2 className="text-2xl font-semibold mb-6 text-pink-600 flex items-center">
              <span className="inline-block w-8 h-8 mr-3 bg-pink-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </span>
              Tầm nhìn
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Hoa Muse mong muốn trở thành người bạn đồng hành đáng tin cậy, kết nối người mua và người bán trên một 
              nền tảng thân thiện, nơi việc chọn – tặng – và kinh doanh hoa trở nên dễ dàng và tiện lợi nhất cho tất 
              cả mọi người.
            </p>
          </section>

          {/* Features Grid */}
          <section 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up-delay-2"
          >
            {/* Feature 1 */}
            <div className="bg-pink-50 rounded-xl p-6 text-center hover:bg-pink-100 transition-colors duration-300">
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-pink-600 mb-2">Giao hàng nhanh chóng</h3>
              <p className="text-gray-600">Đảm bảo hoa tươi đến tay người nhận</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-pink-50 rounded-xl p-6 text-center hover:bg-pink-100 transition-colors duration-300">
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-pink-600 mb-2">Chất lượng đảm bảo</h3>
              <p className="text-gray-600">Cam kết hoa tươi, đẹp</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-pink-50 rounded-xl p-6 text-center hover:bg-pink-100 transition-colors duration-300">
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-pink-600 mb-2">Hỗ trợ 24/7</h3>
              <p className="text-gray-600">Luôn sẵn sàng phục vụ bạn</p>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }

        .animate-slide-up-delay {
          animation: slideUp 0.6s ease-out 0.2s forwards;
          opacity: 0;
        }

        .animate-slide-up-delay-2 {
          animation: slideUp 0.6s ease-out 0.4s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default AboutMe; 