import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { CheckCircle, Calendar, MessageCircle, Wallet, UserCircle, Settings } from 'lucide-react';
import BookingList from '../components/buddy/BookingList';
import BuddyWallet from '../components/buddy/BuddyWallet';
import BuddyProfileEdit from '../components/buddy/BuddyProfileEdit';

const BuddyDashboard = () => {
  const { user } = useAuthStore();
  const [isAvailable, setIsAvailable] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings'); // bookings, wallet, profile

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Top Banner */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Xin chào, {user?.name} <span className="text-sm font-normal bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Local Buddy</span>
            </h1>
            <p className="text-gray-500 text-sm">Cùng tạo nên những trải nghiệm tuyệt vời cho du khách</p>
          </div>
          
          <div className="flex items-center bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 shadow-inner">
            <span className="mr-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái:</span>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className={`ml-3 text-sm font-bold ${isAvailable ? 'text-green-600' : 'text-gray-400'}`}>
              {isAvailable ? 'Sẵn sàng đón khách' : 'Đang nghỉ ngơi'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard icon={<Calendar className="text-orange-600"/>} label="Yêu cầu mới" value="3" color="bg-orange-50" />
            <StatCard icon={<MessageCircle className="text-blue-600"/>} label="Tin nhắn" value="5" color="bg-blue-50" />
            <StatCard icon={<Wallet className="text-green-600"/>} label="Ví (VNĐ)" value="4.5M" color="bg-green-50" />
            <StatCard icon={<CheckCircle className="text-purple-600"/>} label="Đã hoàn thành" value="12" color="bg-purple-50" />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Menu */}
          <div className="w-full md:w-64 space-y-2">
            <MenuBtn active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} icon={<Calendar size={20}/>} label="Quản lý lịch đặt" />
            <MenuBtn active={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} icon={<Wallet size={20}/>} label="Ví thu nhập" />
            <MenuBtn active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<UserCircle size={20}/>} label="Hồ sơ cá nhân" />
          </div>

          {/* Dynamic Component Rendering */}
          <div className="flex-1">
            {activeTab === 'bookings' && <BookingList />}
            {activeTab === 'wallet' && <BuddyWallet />}
            {activeTab === 'profile' && <BuddyProfileEdit />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components nội bộ để code sạch hơn
const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
    <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>{icon}</div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
  </div>
);

const MenuBtn = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${active ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-100'}`}
  >
    {icon} {label}
  </button>
);

export default BuddyDashboard;