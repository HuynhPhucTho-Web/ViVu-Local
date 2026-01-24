import { useEffect, useState } from "react";
import { Star, MessageCircle, MapPin, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../components/firebase";

const LocalBuddy = () => {
  const [buddies, setBuddies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuddies = async () => {
      try {
        const snapshot = await getDocs(collection(db, "buddies"));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBuddies(data);
      } catch (err) {
        console.error("Lỗi tải buddy:", err);
      }
      setLoading(false);
    };

    fetchBuddies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Đang tải danh sách Buddy...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Tìm Người Dẫn Đường (Local Buddy)
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kết nối với người bản địa am hiểu địa phương để có trải nghiệm trọn vẹn nhất.
          </p>
        </div>

        {/* Buddy list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {buddies.map(buddy => (
            <Link
              key={buddy.id}
              to={`/buddy/${buddy.id}`}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition border block group"
            >
              <div className="p-6">
                
                {/* Top */}
                <div className="flex justify-between mb-6">
                  <div className="flex items-center">
                    <div className="relative">
                      <img
                        src={buddy.image}
                        alt={buddy.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-orange-100 mr-4"
                      />
                      <span
                        className={`absolute bottom-0 right-4 w-4 h-4 rounded-full border-2 border-white ${
                          buddy.status === "available"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold group-hover:text-orange-500">
                        {buddy.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {buddy.location}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="font-bold text-yellow-700">
                        {buddy.rating}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {buddy.reviews} đánh giá
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div
                  className={`mb-4 px-3 py-2 rounded-lg text-xs flex items-center ${
                    buddy.status === "available"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {buddy.status === "available" ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-2" />
                      Đang rảnh – Có thể nhận tour
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 mr-2" />
                      Bận đến{" "}
                      {new Date(buddy.busyUntil).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-3 mb-6">
                  <div>
                    <span className="text-xs font-bold text-gray-400">
                      THẾ MẠNH
                    </span>
                    <p className="font-medium">{buddy.specialty}</p>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-gray-400">
                      NGÔN NGỮ
                    </span>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {buddy.languages?.map((lang, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 text-xs px-2 py-1 rounded"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <span className="text-xs text-gray-400">Giá tham khảo</span>
                    <p className="text-orange-600 font-bold text-lg">
                      {buddy.price}
                    </p>
                  </div>

                  <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-gray-800">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Liên hệ
                  </button>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocalBuddy;
