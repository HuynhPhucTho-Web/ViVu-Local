import { useState } from "react";
import { X, Calendar, Clock, User } from "lucide-react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../components/firebase";

const BookingModal = ({ isOpen, onClose, buddyName, price }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(2);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "bookings"), {
        buddyName,
        price,
        date,
        time,
        duration,
        note,
        status: "pending",
        createdAt: Timestamp.now()
      });

      alert("✅ Đặt lịch thành công! Chờ Buddy xác nhận.");
      onClose();
    } catch (error) {
      console.error(error);
      alert("❌ Có lỗi xảy ra, thử lại sau!");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-orange-500 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Đặt lịch Buddy</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Buddy info */}
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <User className="text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Đặt lịch với</p>
              <h3 className="font-bold">{buddyName}</h3>
              <p className="text-orange-600">{price}</p>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-sm font-medium">Ngày đi</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="date"
                required
                className="w-full pl-10 py-2 border rounded-lg"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* Time + Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Giờ bắt đầu</label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="time"
                  required
                  className="w-full pl-10 py-2 border rounded-lg"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Thời lượng (giờ)</label>
              <input
                type="number"
                min={1}
                max={12}
                className="w-full py-2 border rounded-lg px-3"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="text-sm font-medium">Ghi chú</label>
            <textarea
              rows={3}
              className="w-full border rounded-lg p-3"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800"
          >
            {loading ? "Đang gửi..." : "Xác nhận đặt lịch"}
          </button>

          <p className="text-xs text-center text-gray-500">
            Chưa trừ tiền – Buddy sẽ xác nhận trong 30 phút
          </p>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
