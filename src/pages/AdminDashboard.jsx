import { useState } from 'react';
import { Users, Briefcase, MapPin, ShieldCheck, BarChart3 } from 'lucide-react';
import ManageUsers from '../components/admin/ManageUsers';
import ManagePartnerRequests from '../components/admin/ManagePartnerRequests';
import ManageDestinations from '../components/admin/ManageDestinations';
import AdminOverview from '../components/admin/AdminOverview';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const menuItems = [
    { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
    { id: 'users', label: 'Người dùng, Buddy & partners', icon: Users },
    { id: 'partners', label: 'Yêu cầu Đối tác', icon: Briefcase },
    { id: 'destinations', label: 'Khu du lịch', icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar cố định */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-orange-500 font-black text-xl">
            <ShieldCheck size={28} /> VIVU ADMIN
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === item.id ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/20' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} /> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-black text-slate-800 uppercase">
            {menuItems.find(i => i.id === activeTab)?.label}
          </h1>
          <div className="text-sm font-medium text-slate-500">
            Hệ thống quản trị • {new Date().toLocaleDateString('vi-VN')}
          </div>
        </header>

        {/* Render Components tương ứng */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {activeTab === 'overview' && <AdminOverview />}
          {activeTab === 'users' && <ManageUsers />}
          {activeTab === 'partners' && <ManagePartnerRequests />}
          {activeTab === 'destinations' && <ManageDestinations />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;