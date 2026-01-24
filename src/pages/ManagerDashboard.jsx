import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../components/firebase';
import { useAuthStore } from '../store/authStore';
import { Plus, Clock, CheckCircle, LayoutDashboard, MapPinned, MessageSquare, Wallet, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import ManagerStats from '../components/manager/ManagerStats';
import ManagerReviews from '../components/manager/ManagerReviews';

const ManagerDashboard = () => {
  const { user } = useAuthStore();
  const [myDestinations, setMyDestinations] = useState([]);
  const [activeTab, setActiveTab] = useState('list'); // list, stats, reviews

  useEffect(() => {
    const fetchMyData = async () => {
      const q = query(collection(db, "destinations"), where("managerId", "==", user.id));
      const querySnapshot = await getDocs(q);
      setMyDestinations(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchMyData();
  }, [user.id]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar dành cho Manager */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-2">
        <div className="mb-8 px-2">
          <h2 className="text-xl font-black text-orange-500 tracking-tight">VIVU PARTNER</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase">Khu du lịch & Đối tác</p>
        </div>
        
        <nav className="space-y-1">
          <SidebarItem active={activeTab === 'list'} onClick={() => setActiveTab('list')} icon={<MapPinned size={20}/>} label="Điểm đến của tôi" />
          <SidebarItem active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} icon={<TrendingUp size={20}/>} label="Thống kê hiệu quả" />
          <SidebarItem active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} icon={<MessageSquare size={20}/>} label="Phản hồi khách hàng" />
          <SidebarItem active={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} icon={<Wallet size={20}/>} label="Doanh thu/Hợp đồng" />
        </nav>

        <div className="mt-auto p-4 bg-orange-50 rounded-2xl">
          <p className="text-xs text-orange-700 font-medium text-center">Bạn cần hỗ trợ quảng bá khu du lịch?</p>
          <button className="w-full mt-2 py-2 bg-white text-orange-600 text-xs font-bold rounded-xl border border-orange-200 shadow-sm">Liên hệ Admin</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Bảng điều khiển đối tác</h1>
            <p className="text-sm text-gray-500">Chào mừng {user?.name}, quản lý hiệu quả khu du lịch của bạn.</p>
          </div>
          <Link to="/partner/create" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-orange-200 transition-all active:scale-95">
            <Plus size={20} /> Đăng ký khu mới
          </Link>
        </header>

        {/* Render nội dung theo Tab */}
        {activeTab === 'list' && (
          <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {myDestinations.length > 0 ? (
              myDestinations.map(dest => (
                <DestinationCard key={dest.id} dest={dest} />
              ))
            ) : (
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center">
                <p className="text-gray-400 font-medium">Bạn chưa có khu du lịch nào được đăng ký.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && <ManagerStats destinations={myDestinations} />}
        {activeTab === 'reviews' && <ManagerReviews />}
      </main>
    </div>
  );
};

// Component con nội bộ
const SidebarItem = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${active ? 'bg-orange-500 text-white shadow-md shadow-orange-100' : 'text-gray-500 hover:bg-gray-100'}`}>
    {icon} {label}
  </button>
);

const DestinationCard = ({ dest }) => (
  <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow">
    <div className="flex flex-col md:flex-row items-center gap-6 w-full">
      <img src={dest.image} className="w-full md:w-32 h-24 object-cover rounded-2xl shadow-inner" alt={dest.title} />
      <div className="flex-1 text-center md:text-left">
        <h3 className="font-black text-xl text-gray-800">{dest.title}</h3>
        <p className="text-gray-400 text-sm font-medium">{dest.location}</p>
        <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-3">
          {dest.status === 'pending' ? (
            <span className="text-orange-600 flex items-center gap-1.5 text-[11px] font-black bg-orange-50 px-3 py-1 rounded-full border border-orange-100 uppercase tracking-tighter">
              <Clock size={12} /> Đang chờ duyệt
            </span>
          ) : (
            <span className="text-green-600 flex items-center gap-1.5 text-[11px] font-black bg-green-50 px-3 py-1 rounded-full border border-green-100 uppercase tracking-tighter">
              <CheckCircle size={12} /> Đang hiển thị
            </span>
          )}
          <span className="bg-gray-50 text-gray-500 text-[11px] font-black px-3 py-1 rounded-full border border-gray-100 uppercase tracking-tighter">
            Lượt xem: {dest.views || 0}
          </span>
        </div>
      </div>
    </div>
    <div className="flex gap-2 w-full md:w-auto">
      <button className="flex-1 md:w-32 py-2.5 bg-gray-50 text-gray-600 font-bold rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">Sửa</button>
      <button className="flex-1 md:w-32 py-2.5 bg-blue-50 text-blue-600 font-bold rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">Chi tiết</button>
    </div>
  </div>
);

export default ManagerDashboard;