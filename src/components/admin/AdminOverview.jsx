import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Users, 
  MapPin, 
  TrendingUp, 
  DollarSign, 
  UserCheck, 
  AlertCircle 
} from 'lucide-react';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBuddies: 0,
    totalDestinations: 0,
    pendingPartners: 0,
    pendingDestinations: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      // Trong thực tế, bạn nên dùng hàm count() của Firebase để tiết kiệm performance
      const usersSnap = await getDocs(collection(db, "users"));
      const destSnap = await getDocs(collection(db, "destinations"));
      const partnerReqSnap = await getDocs(collection(db, "partner_requests"));

      const users = usersSnap.docs.map(d => d.data());
      
      setStats({
        totalUsers: users.length,
        totalBuddies: users.filter(u => u.role === 'buddy').length,
        totalDestinations: destSnap.size,
        pendingPartners: partnerReqSnap.docs.filter(d => d.data().status === 'pending').length,
        pendingDestinations: destSnap.docs.filter(d => d.data().status === 'pending').length
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* 1. Hàng Thẻ Thống Kê Tổng Quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Tổng người dùng" 
          value={stats.totalUsers} 
          icon={<Users className="text-blue-600" />} 
          trend="+12% tháng này" 
          color="bg-blue-50" 
        />
        <StatCard 
          title="Địa điểm du lịch" 
          value={stats.totalDestinations} 
          icon={<MapPin className="text-orange-600" />} 
          trend="+5 điểm mới" 
          color="bg-orange-50" 
        />
        <StatCard 
          title="Local Buddies" 
          value={stats.totalBuddies} 
          icon={<UserCheck className="text-green-600" />} 
          trend="85% hoạt động" 
          color="bg-green-50" 
        />
        <StatCard 
          title="Ước tính doanh thu" 
          value="12.5M" 
          icon={<DollarSign className="text-purple-600" />} 
          trend="+2.1M tuần này" 
          color="bg-purple-50" 
        />
      </div>

      {/* 2. Phần Cảnh Báo Việc Cần Làm Ngay */}
      {(stats.pendingPartners > 0 || stats.pendingDestinations > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4 animate-pulse">
          <AlertCircle className="text-amber-600" size={24} />
          <div className="flex-1">
            <h4 className="font-bold text-amber-800 text-sm">Việc cần xử lý ngay!</h4>
            <p className="text-amber-700 text-xs">
              Bạn có {stats.pendingPartners} yêu cầu đối tác và {stats.pendingDestinations} địa điểm đang chờ duyệt.
            </p>
          </div>
          <button className="text-xs font-black text-amber-800 underline uppercase tracking-widest">Xử lý ngay</button>
        </div>
      )}

      {/* 3. Biểu đồ & Hoạt động gần đây */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Biểu đồ tăng trưởng giả lập */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-gray-800 uppercase text-sm tracking-tighter flex items-center gap-2">
              <TrendingUp size={18} className="text-orange-500" /> Tăng trưởng lượt truy cập
            </h3>
            <select className="text-xs font-bold bg-gray-50 border-none rounded-lg p-1 outline-none">
              <option>7 ngày qua</option>
              <option>30 ngày qua</option>
            </select>
          </div>
          
          
          
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[40, 60, 45, 90, 100, 80, 110].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div 
                  style={{ height: `${h}%` }} 
                  className="w-full bg-orange-100 group-hover:bg-orange-500 rounded-t-xl transition-all duration-300 relative"
                >
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {h * 10}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-gray-400">Thứ {i + 2}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Danh sách hoạt động mới nhất */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-800 uppercase text-sm tracking-tighter mb-6">Hoạt động mới nhất</h3>
          <div className="space-y-6">
            <ActivityItem 
              user="Thanh Tùng" 
              action="vừa đăng ký làm Buddy" 
              time="2 phút trước" 
              dotColor="bg-blue-500" 
            />
            <ActivityItem 
              user="KDL Mỹ Khánh" 
              action="đã cập nhật giá vé" 
              time="15 phút trước" 
              dotColor="bg-orange-500" 
            />
            <ActivityItem 
              user="Minh Trí" 
              action="vừa đặt tour tham quan" 
              time="1 giờ trước" 
              dotColor="bg-green-500" 
            />
            <ActivityItem 
              user="Admin" 
              action="đã xóa một bài viết xấu" 
              time="3 giờ trước" 
              dotColor="bg-red-500" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Component con nội bộ cho Stat Card
const StatCard = ({ title, value, icon, trend, color }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`${color} p-3 rounded-2xl`}>{icon}</div>
      <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg uppercase">{trend}</span>
    </div>
    <div className="text-3xl font-black text-slate-800">{value}</div>
    <p className="text-xs font-bold text-gray-400 uppercase mt-1 tracking-wider">{title}</p>
  </div>
);

// Component con nội bộ cho Activity Item
const ActivityItem = ({ user, action, time, dotColor }) => (
  <div className="flex gap-4 relative">
    <div className={`w-2 h-2 rounded-full ${dotColor} mt-1.5 shadow-sm shadow-inherit`}></div>
    <div className="flex-1 border-b border-gray-50 pb-4">
      <p className="text-sm text-gray-800">
        <span className="font-bold">{user}</span> {action}
      </p>
      <p className="text-[10px] text-gray-400 font-medium mt-0.5">{time}</p>
    </div>
  </div>
);

export default AdminOverview;