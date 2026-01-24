import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { CheckCircle, Calendar, MessageCircle } from 'lucide-react';

const BuddyDashboard = () => {
  const { user } = useAuthStore();
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Xin chào, {user?.name}</h1>
            <p className="text-gray-600">Quản lý lịch trình và trạng thái hoạt động của bạn</p>
          </div>
          <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
            <span className="mr-3 text-sm font-medium text-gray-700">Trạng thái:</span>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isAvailable ? 'bg-green-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isAvailable ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`ml-3 text-sm font-bold ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
              {isAvailable ? 'Đang rảnh' : 'Đang bận'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-700">Yêu cầu mới</h3>
              <div className="bg-orange-100 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">3</div>
            <p className="text-sm text-gray-500 mt-1">Chờ xác nhận</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-700">Tin nhắn</h3>
              <div className="bg-blue-100 p-2 rounded-full">
                <MessageCircle className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">5</div>
            <p className="text-sm text-gray-500 mt-1">Chưa đọc</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-700">Thu nhập tháng</h3>
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">4.5M</div>
            <p className="text-sm text-gray-500 mt-1">VNĐ</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">Lịch trình sắp tới</h2>
          </div>
          <div className="p-6 text-center text-gray-500">
            Chưa có lịch trình nào trong hôm nay.
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuddyDashboard;
