import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Search, UserX, ShieldAlert, ShieldCheck, MoreVertical, Mail, Phone } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const snap = await getDocs(collection(db, "users"));
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    if (!window.confirm(`Xác nhận đổi quyền người dùng thành ${newRole}?`)) return;
    await updateDoc(doc(db, "users", userId), { role: newRole });
    fetchUsers(); // Refresh lại danh sách
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'banned' ? 'active' : 'banned';
    if (!window.confirm(`Xác nhận ${newStatus === 'banned' ? 'KHÓA' : 'MỞ KHÓA'} tài khoản này?`)) return;
    await updateDoc(doc(db, "users", userId), { status: newStatus });
    fetchUsers();
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Thanh bộ lọc và tìm kiếm */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="bg-gray-50 border-none rounded-xl px-4 py-2.5 font-bold text-gray-600 outline-none"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">Tất cả vai trò</option>
          <option value="user">User</option>
          <option value="buddy">Buddy</option>
          <option value="manager">Manager</option>
        </select>
      </div>

      {/* Danh sách người dùng */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Người dùng</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Vai trò</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.map((u) => (
              <tr key={u.id} className={`hover:bg-gray-50/30 transition-colors ${u.status === 'banned' ? 'opacity-50' : ''}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                      {u.name?.[0]}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">{u.name}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1"><Mail size={12}/> {u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                    u.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                    u.role === 'manager' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    u.role === 'buddy' ? 'bg-green-50 text-green-600 border-green-100' :
                    'bg-gray-50 text-gray-500 border-gray-100'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <div className={`h-2 w-2 rounded-full ${u.status === 'banned' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <span className="text-xs font-bold text-gray-600 capitalize">{u.status || 'Active'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {/* Nút Khóa/Mở khóa */}
                    <button 
                      onClick={() => handleToggleStatus(u.id, u.status)}
                      className={`p-2 rounded-lg transition-colors ${u.status === 'banned' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
                      title={u.status === 'banned' ? 'Mở khóa' : 'Khóa tài khoản'}
                    >
                      {u.status === 'banned' ? <ShieldCheck size={18}/> : <UserX size={18}/>}
                    </button>
                    
                    {/* Menu hạ cấp (Ví dụ từ Manager về User) */}
                    {u.role !== 'user' && (
                      <button 
                        onClick={() => handleUpdateRole(u.id, 'user')}
                        className="p-2 bg-amber-50 text-amber-600 rounded-lg"
                        title="Hạ cấp xuống User"
                      >
                        <ShieldAlert size={18}/>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && !loading && (
          <div className="p-12 text-center text-gray-400 font-medium">
            Không tìm thấy người dùng nào phù hợp.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;