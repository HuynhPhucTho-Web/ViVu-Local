import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle } from 'lucide-react';

const RegisterBuddy = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    languages: '',
    experience: '',
    certificates: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save application to localStorage
    const applications = JSON.parse(localStorage.getItem('buddy_applications') || '[]');
    const newApp = {
      id: Date.now(),
      ...formData,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem('buddy_applications', JSON.stringify([...applications, newApp]));

    alert('Hồ sơ của bạn đã được gửi! Admin sẽ xem xét và liên hệ lại sớm.');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Đăng ký trở thành Local Buddy</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chia sẻ niềm đam mê du lịch, kiếm thêm thu nhập và kết nối với những người bạn mới từ khắp nơi trên thế giới.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-orange-500 px-8 py-6 text-white">
            <div className="flex items-center">
              <Shield className="h-8 w-8 mr-3" />
              <div>
                <h2 className="text-xl font-bold">Thông tin đăng ký</h2>
                <p className="text-orange-100 text-sm">Vui lòng điền đầy đủ và chính xác thông tin</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Khu vực hoạt động</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hội An, Đà Nẵng..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngôn ngữ thành thạo</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Tiếng Việt, Tiếng Anh, Tiếng Hàn..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                value={formData.languages}
                onChange={e => setFormData({...formData, languages: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kinh nghiệm dẫn tour</label>
              <textarea
                rows={3}
                required
                placeholder="Mô tả ngắn gọn về kinh nghiệm của bạn..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                value={formData.experience}
                onChange={e => setFormData({...formData, experience: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chứng chỉ / Bằng cấp (nếu có)</label>
              <textarea
                rows={3}
                placeholder="Liệt kê các chứng chỉ hướng dẫn viên, ngoại ngữ..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                value={formData.certificates}
                onChange={e => setFormData({...formData, certificates: e.target.value})}
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
              <p className="text-sm text-gray-600">
                Bằng việc gửi đơn đăng ký, bạn đồng ý với các điều khoản và quy tắc ứng xử của cộng đồng ViVuLocal.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-orange-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition shadow-lg"
              >
                Gửi hồ sơ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterBuddy;
