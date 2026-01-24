import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold text-orange-500 mb-4">ViVuLocal</h3>
            <p className="text-gray-400 text-sm">
              Đi như người bản địa, trải nghiệm như người bản xứ. Kết nối bạn với những trải nghiệm chân thực nhất tại Việt Nam.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Khám phá</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-orange-500">Điểm đến nổi bật</a></li>
              <li><a href="#" className="hover:text-orange-500">Review ẩm thực</a></li>
              <li><a href="#" className="hover:text-orange-500">Văn hóa địa phương</a></li>
              <li><a href="#" className="hover:text-orange-500">Lịch trình mẫu</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-orange-500">Trung tâm trợ giúp</a></li>
              <li><a href="#" className="hover:text-orange-500">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-orange-500">Điều khoản sử dụng</a></li>
              <li><a href="#" className="hover:text-orange-500">Đăng ký làm Local Buddy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center"><Phone className="h-4 w-4 mr-2" /> 1900 1234</li>
              <li className="flex items-center"><Mail className="h-4 w-4 mr-2" /> support@vivulocal.vn</li>
              <li className="flex space-x-4 mt-4">
                <a href="#" className="hover:text-orange-500"><Facebook className="h-5 w-5" /></a>
                <a href="#" className="hover:text-orange-500"><Instagram className="h-5 w-5" /></a>
                <a href="#" className="hover:text-orange-500"><Twitter className="h-5 w-5" /></a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} ViVuLocal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
