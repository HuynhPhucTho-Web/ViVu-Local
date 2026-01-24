import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Trash2, ArrowRight } from 'lucide-react';

const SavedPlans = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('vivulocal_plans');
    if (saved) {
      setPlans(JSON.parse(saved));
    }
  }, []);

  const deletePlan = (id) => {
    const newPlans = plans.filter(p => p.id !== id);
    setPlans(newPlans);
    localStorage.setItem('vivulocal_plans', JSON.stringify(newPlans));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kế hoạch đã lưu</h1>
          <Link to="/planner" className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition">
            + Tạo kế hoạch mới
          </Link>
        </div>

        {plans.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Chưa có kế hoạch nào</h3>
            <p className="text-gray-500 mb-6">Hãy tạo kế hoạch chuyến đi đầu tiên của bạn ngay hôm nay!</p>
            <Link to="/planner" className="text-orange-500 font-bold hover:underline">
              Lập kế hoạch ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map(plan => (
              <div key={plan.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition border border-gray-100">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <MapPin className="h-5 w-5 text-orange-500 mr-2" />
                        {plan.destination}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Đã lưu: {new Date(plan.date).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <button 
                      onClick={() => deletePlan(plan.id)}
                      className="text-gray-400 hover:text-red-500 transition"
                      title="Xóa kế hoạch"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-xs text-gray-500 block">Thời gian</span>
                      <span className="font-bold text-gray-900">{plan.days} ngày</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-xs text-gray-500 block">Ngân sách</span>
                      <span className="font-bold text-gray-900">
                        {plan.budget === 'low' ? 'Tiết kiệm' : plan.budget === 'medium' ? 'Trung bình' : 'Sang trọng'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <span className="text-xs text-gray-500 block mb-2">Sở thích</span>
                    <div className="flex flex-wrap gap-2">
                      {plan.interests.map((interest, idx) => (
                        <span key={idx} className="bg-orange-50 text-orange-700 text-xs px-2 py-1 rounded">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-500">Tổng chi phí dự kiến</span>
                      <p className="text-xl font-bold text-orange-600">{plan.totalCost.toLocaleString()}đ</p>
                    </div>
                    <button className="flex items-center text-gray-900 font-bold hover:text-orange-500 transition">
                      Xem chi tiết <ArrowRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPlans;
