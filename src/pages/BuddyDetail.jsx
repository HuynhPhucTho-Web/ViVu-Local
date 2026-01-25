import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Shield, MessageCircle, Phone, Mail, CheckCircle, ArrowLeft, Clock, Calendar, Loader2 } from 'lucide-react';
// 1. Import Firebase
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../components/firebase'; 
import BookingModal from '../components/BookingModal';

const BuddyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  // 2. Quản lý state dữ liệu thật
  const [buddy, setBuddy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuddyDetail = async () => {
      try {
        // Truy vấn trực tiếp vào document của User này trong collection 'users'
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBuddy({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("Không tìm thấy Buddy này!");
        }
      } catch (error) {
        console.error("Lỗi lấy chi tiết Buddy:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuddyDetail();
  }, [id]);

  const handleChat = () => {
    navigate(`/chat/${id}`);
  };

  // 3. Xử lý trạng thái Loading
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
        <p className="text-gray-500 font-medium">Đang tải hồ sơ Buddy...</p>
      </div>
    );
  }

  // 4. Xử lý khi không tìm thấy dữ liệu
  if (!buddy) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Ối! Không tìm thấy Buddy</h2>
        <p className="text-gray-500 mb-6">Hồ sơ này có thể đã bị xóa hoặc không tồn tại.</p>
        <Link to="/buddy" className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/buddy" className="inline-flex items-center text-gray-500 hover:text-orange-500 mb-6 font-medium transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại danh sách
        </Link>

        <div className="bg-white rounded-[32px] shadow-xl overflow-hidden border border-gray-100">
          <div className="md:flex">
            {/* Left Column */}
            <div className="md:w-1/3 bg-slate-900 text-white p-8 text-center relative">
              <div className="relative inline-block mb-6">
                <img 
                  // Xử lý ảnh đại diện thật hoặc mặc định
                  src={buddy.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(buddy.name || 'B')}&background=random`} 
                  alt={buddy.name} 
                  className="w-40 h-40 rounded-full object-cover border-4 border-orange-500 mx-auto shadow-2xl"
                />
                <div className="absolute bottom-2 right-2 bg-green-500 p-1.5 rounded-full border-2 border-slate-900 shadow-lg">
                  <Shield className="h-4 w-4 text-white" />
                </div>
              </div>
              
              <h1 className="text-2xl font-black mb-2 tracking-tight">
                {buddy.name || buddy.email?.split('@')[0]}
              </h1>
              <div className="flex items-center justify-center text-gray-400 mb-4 font-medium">
                <MapPin className="h-4 w-4 mr-1 text-orange-500" /> {buddy.location || 'Chưa cập nhật'}
              </div>

              {/* Status Badge */}
              <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 ${
                buddy.status === 'available' 
                  ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
                  : 'bg-red-500/10 text-red-400 border border-red-500/30'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 animate-pulse ${
                  buddy.status === 'available' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                {buddy.status === 'available' ? 'Đang sẵn sàng' : 'Đang có tour'}
              </div>

              <div className="grid grid-cols-3 gap-2 mb-8 border-t border-white/10 pt-6">
                <div>
                  <div className="text-xl font-black text-orange-500">{buddy.rating || '5.0'}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold">Sao</div>
                </div>
                <div className="border-x border-white/10">
                  <div className="text-xl font-black text-white">{buddy.reviews || 0}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold">Review</div>
                </div>
                <div>
                  <div className="text-xl font-black text-white">3+</div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold">Năm Exp</div>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleChat}
                  className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center active:scale-95"
                >
                  <MessageCircle className="h-5 w-5 mr-2" /> CHAT NGAY
                </button>
                <button 
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full bg-white/5 text-white py-4 rounded-2xl font-black hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center active:scale-95"
                >
                  <Calendar className="h-5 w-5 mr-2" /> ĐẶT LỊCH
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div className="md:w-2/3 p-10">
              <div className="mb-10">
                <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Giới thiệu bản thân</h2>
                <p className="text-gray-700 leading-relaxed text-lg italic">
                  "{buddy.bio || 'Xin chào! Mình là một người đam mê du lịch và rất am hiểu về văn hóa, ẩm thực tại địa phương. Hãy để mình dẫn bạn đi khám phá những điều thú vị nhé!'}"
                </p>
              </div>

              {buddy.status === 'busy' && (
                <div className="mb-10 bg-red-50 border border-red-100 rounded-[24px] p-6 flex items-start">
                  <Clock className="h-6 w-6 text-red-500 mr-4 mt-0.5" />
                  <div>
                    <h3 className="font-black text-red-800 uppercase text-sm tracking-tight mb-1">Hiện đang bận dẫn đoàn</h3>
                    <p className="text-sm text-red-600/80 font-medium leading-relaxed">
                      Buddy dự kiến sẽ hoàn thành tour vào khung giờ tới. Bạn có thể nhắn tin đặt lịch trước để giữ chỗ!
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="bg-gray-50 p-6 rounded-[24px]">
                  <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-3">Thế mạnh của mình</h3>
                  <p className="text-gray-700 font-bold">{buddy.specialty || 'Văn hóa & Ẩm thực bản địa'}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-[24px]">
                  <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-3">Ngôn ngữ</h3>
                  <div className="flex gap-2 flex-wrap">
                    {(buddy.languages || ["Tiếng Việt"]).map((lang, idx) => (
                      <span key={idx} className="bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-600 shadow-sm">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-10">
                <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Thông tin liên hệ trực tiếp</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center p-5 border border-gray-100 rounded-[20px] hover:border-orange-500 hover:shadow-md transition-all cursor-pointer group">
                    <div className="bg-orange-50 p-3 rounded-full mr-4 group-hover:bg-orange-500 group-hover:text-white transition-all">
                      <Phone className="h-5 w-5 text-orange-600 group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase">Số điện thoại</p>
                      <p className="font-bold text-gray-900">{buddy.phone || '090x.xxx.xxx'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-5 border border-gray-100 rounded-[20px] hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group">
                    <div className="bg-blue-50 p-3 rounded-full mr-4 group-hover:bg-blue-500 group-hover:text-white transition-all">
                      <Mail className="h-5 w-5 text-blue-600 group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase">Địa chỉ Email</p>
                      <p className="font-bold text-gray-900 truncate max-w-[150px]">{buddy.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 bg-amber-50 p-5 rounded-[24px] flex items-start border border-amber-100">
                  <CheckCircle className="h-6 w-6 text-amber-600 mr-4 mt-0.5" />
                  <p className="text-sm text-amber-900 font-medium leading-relaxed">
                    Hồ sơ này đã được **ViVuLocal Verified**. Chúng mình đã xác minh CCCD/Hộ chiếu và các chứng chỉ liên quan để đảm bảo an toàn cho chuyến đi của bạn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        buddyName={buddy.name || buddy.email?.split('@')[0]}
        price={buddy.price || "Thỏa thuận"}
      />
    </div>
  );
};

export default BuddyDetail;