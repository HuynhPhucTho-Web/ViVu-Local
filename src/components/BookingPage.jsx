import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Users, CreditCard, ChevronLeft } from "lucide-react";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../components/firebase";

const BookingPage = () => {
  const { buddyId } = useParams();
  const navigate = useNavigate();
  const [buddy, setBuddy] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: "",
    guests: 1,
    note: ""
  });

  useEffect(() => {
    const getBuddyInfo = async () => {
      const docRef = doc(db, "users", buddyId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setBuddy(docSnap.data());
    };
    getBuddyInfo();
  }, [buddyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Lưu yêu cầu đặt lịch vào collection 'bookings'
      await addDoc(collection(db, "bookings"), {
        buddyId,
        buddyName: buddy.name,
        ...bookingData,
        status: "pending",
        createdAt: new Date()
      });
      alert("Yêu cầu đặt lịch đã được gửi! Chờ Buddy xác nhận nhé.");
      navigate("/local-buddy");
    } catch (error) {
      console.error("Lỗi đặt lịch:", error);
    }
  };

  if (!buddy) return <div className="p-10 text-center">Đang tải thông tin...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-white border-b p-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)}><ChevronLeft /></button>
        <h1 className="font-bold text-xl">Đặt lịch với {buddy.name}</h1>
      </div>

      <div className="max-w-2xl mx-auto mt-8 px-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm border">
          <div className="space-y-6">
            {/* Chọn ngày */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar size={18} className="text-orange-500" /> Ngày đi tour
              </label>
              <input 
                type="date" required
                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500"
                onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
              />
            </div>

            {/* Số lượng khách */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Users size={18} className="text-orange-500" /> Số lượng khách
              </label>
              <input 
                type="number" min="1" required
                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500"
                value={bookingData.guests}
                onChange={(e) => setBookingData({...bookingData, guests: e.target.value})}
              />
            </div>

            {/* Ghi chú */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Ghi chú cho Buddy</label>
              <textarea 
                placeholder="Ví dụ: Tôi muốn tham quan các quán ăn địa phương..."
                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500 h-32"
                onChange={(e) => setBookingData({...bookingData, note: e.target.value})}
              />
            </div>

            <button type="submit" className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-100">
              Gửi yêu cầu đặt lịch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;