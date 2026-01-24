import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../components/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthStore } from '../store/authStore';
import { Briefcase, Building2, Phone, Mail, FileText, Send, CheckCircle2, ArrowLeft } from 'lucide-react';

const RegisterPartner = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'Khu du lịch', // Hoặc Khách sạn, Nhà hàng
    representativeName: user?.name || '',
    phone: '',
    email: user?.email || '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Lưu yêu cầu đăng ký vào collection riêng để Admin duyệt
      await addDoc(collection(db, "partner_requests"), {
        ...formData,
        userId: user.id,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      
      setIsSuccess(true);
      // Sau 3 giây tự động về trang chủ
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      console.error("Lỗi đăng ký đối tác:", error);
      alert("Đã có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="text-center animate-bounce-in">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-black text-gray-800">Yêu cầu đã gửi!</h2>
          <p className="text-gray-500 mt-2">Admin sẽ xem xét hồ sơ của bạn và phản hồi qua email.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-black text-gray-800 uppercase">Hợp tác cùng ViVuLocal</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="mb-8 text-center">
            <div className="inline-block p-4 bg-orange-100 rounded-2xl text-orange-600 mb-4">
              <Briefcase size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Trở thành Đối tác Quản lý</h2>
            <p className="text-gray-500 mt-2">Đưa khu du lịch của bạn tiếp cận hàng ngàn khách du lịch mỗi ngày</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Building2 size={16} className="text-orange-500" /> Tên doanh nghiệp / Khu du lịch
              </label>
              <input 
                required
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                placeholder="VD: Khu Du Lịch Mỹ Khánh"
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Phone size={16} className="text-orange-500" /> Số điện thoại liên hệ
                </label>
                <input 
                  required
                  type="tel"
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                  placeholder="09xx xxx xxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Mail size={16} className="text-orange-500" /> Email kinh doanh
                </label>
                <input 
                  required
                  type="email"
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <FileText size={16} className="text-orange-500" /> Giới thiệu ngắn gọn về đơn vị
              </label>
              <textarea 
                rows={4}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 font-medium resize-none"
                placeholder="Nêu mong muốn hợp tác và các dịch vụ bạn đang cung cấp..."
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gray-900 hover:bg-black text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {loading ? "ĐANG GỬI..." : (
                <>
                  GỬI YÊU CẦU HỢP TÁC <Send size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPartner;