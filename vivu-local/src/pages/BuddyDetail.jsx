import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Shield, MessageCircle, Phone, Mail, CheckCircle, ArrowLeft, Clock, Calendar } from 'lucide-react';
import { buddies } from '../data/mockData';
import BookingModal from '../components/BookingModal';

const BuddyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const buddy = buddies.find(b => b.id === Number(id));

  if (!buddy) {
    return <div className="text-center py-20">Không tìm thấy Buddy</div>;
  }

  const handleChat = () => {
    navigate(`/chat/${buddy.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/buddy" className="inline-flex items-center text-gray-500 hover:text-orange-500 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại danh sách
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Left Column: Profile Image & Basic Info */}
            <div className="md:w-1/3 bg-gray-900 text-white p-8 text-center relative">
              <div className="relative inline-block mb-6">
                <img 
                  src={buddy.image} 
                  alt={buddy.name} 
                  className="w-40 h-40 rounded-full object-cover border-4 border-orange-500 mx-auto"
                />
                <div className="absolute bottom-2 right-2 bg-green-500 p-1.5 rounded-full border-2 border-gray-900">
                  <Shield className="h-4 w-4 text-white" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold mb-2">{buddy.name}</h1>
              <div className="flex items-center justify-center text-gray-400 mb-4">
                <MapPin className="h-4 w-4 mr-1" /> {buddy.location}
              </div>

              {/* Status Badge */}
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mb-6 ${
                buddy.status === 'available' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/50'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  buddy.status === 'available' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                {buddy.status === 'available' ? 'Đang rảnh' : 'Đang bận'}
              </div>

              <div className="flex justify-center gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">{buddy.rating}</div>
                  <div className="text-xs text-gray-400">Đánh giá</div>
                </div>
                <div className="w-px bg-gray-700"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{buddy.reviews}</div>
                  <div className="text-xs text-gray-400">Lượt review</div>
                </div>
                <div className="w-px bg-gray-700"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">3+</div>
                  <div className="text-xs text-gray-400">Năm kinh nghiệm</div>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleChat}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition flex items-center justify-center"
                >
                  <MessageCircle className="h-5 w-5 mr-2" /> Chat ngay
                </button>
                <button 
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full bg-white/10 text-white py-3 rounded-lg font-bold hover:bg-white/20 transition flex items-center justify-center"
                >
                  <Calendar className="h-5 w-5 mr-2" /> Đặt lịch
                </button>
                <div className="text-xs text-gray-500 mt-2">
                  Phản hồi trung bình trong 5 phút
                </div>
              </div>
            </div>

            {/* Right Column: Details & Contact */}
            <div className="md:w-2/3 p-8">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Giới thiệu</h2>
                <p className="text-gray-600 leading-relaxed">"{buddy.bio}"</p>
              </div>

              {buddy.status === 'busy' && (
                <div className="mb-8 bg-red-50 border border-red-100 rounded-xl p-4 flex items-start">
                  <Clock className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-red-800">Buddy đang có tour</h3>
                    <p className="text-sm text-red-600">
                      Dự kiến kết thúc vào lúc {new Date(buddy.busyUntil).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}.
                      Bạn vẫn có thể nhắn tin hoặc đặt lịch trước cho khung giờ sau đó.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">Thế mạnh</h3>
                  <p className="text-gray-600">{buddy.specialty}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">Ngôn ngữ</h3>
                  <div className="flex gap-2">
                    {buddy.languages.map((lang, idx) => (
                      <span key={idx} className="bg-white border border-gray-200 px-2 py-1 rounded text-sm text-gray-600">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t pt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin liên hệ</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center p-4 border rounded-xl hover:border-orange-500 transition cursor-pointer group">
                    <div className="bg-orange-100 p-3 rounded-full mr-4 group-hover:bg-orange-200 transition">
                      <Phone className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Số điện thoại</p>
                      <p className="font-bold text-gray-900">{buddy.contact?.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 border rounded-xl hover:border-orange-500 transition cursor-pointer group">
                    <div className="bg-blue-100 p-3 rounded-full mr-4 group-hover:bg-blue-200 transition">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-bold text-gray-900">{buddy.contact?.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 bg-yellow-50 p-4 rounded-xl flex items-start">
                  <CheckCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                  <p className="text-sm text-yellow-800">
                    Buddy này đã được ViVuLocal xác minh danh tính và chứng chỉ hành nghề. Bạn có thể yên tâm đặt lịch.
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
        buddyName={buddy.name}
        price={buddy.price}
      />
    </div>
  );
};

export default BuddyDetail;
