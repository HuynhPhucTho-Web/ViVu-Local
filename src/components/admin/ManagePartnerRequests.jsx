import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase'; 
import { 
  Check, X, Phone, Mail, Shield, User, Briefcase, FileText, 
  MapPin, CreditCard, Languages, Eye, Clock, Building2, 
  ExternalLink, FileCheck, Search, Filter, AlertCircle
} from 'lucide-react';
import PartnerRequestModal from './PartnerRequestModal'; 

const ManagePartnerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');

  // 1. Lấy dữ liệu từ Firestore
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "partner_requests"), 
        where("status", "==", "pending")
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setRequests(data);
    } catch (e) {
      console.error("Lỗi lấy dữ liệu:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 2. Xử lý Duyệt hoặc Từ chối
  const handleAction = async (requestId, userId, type, status) => {
    const actionName = status === 'approved' ? 'DUYỆT' : 'TỪ CHỐI';
    if (!window.confirm(`Xác nhận ${actionName} yêu cầu này?`)) return;

    try {
      // Cập nhật trạng thái đơn
      await updateDoc(doc(db, "partner_requests", requestId), { 
        status: status,
        updatedAt: serverTimestamp()
      });
      
      // Nếu duyệt, nâng cấp Role người dùng
      if (status === 'approved') {
        const newRole = type === 'manager' ? 'owner' : 'buddy';
        await updateDoc(doc(db, "users", userId), { 
          role: newRole,
          isVerified: true,
          verifiedAt: serverTimestamp()
        });
      }
      
      // Cập nhật UI
      setRequests(prev => prev.filter(r => r.id !== requestId));
      setIsModalOpen(false);
      alert(`Đã ${actionName} thành công!`);
    } catch (e) { 
      console.error(e);
      alert("Lỗi hệ thống: Không thể cập nhật trạng thái."); 
    }
  };

  // 3. Lọc dữ liệu theo tab
  const filteredRequests = requests.filter(r => 
    filterType === 'all' ? true : r.type === filterType
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
        <p className="text-slate-500 font-bold animate-pulse">Đang tải danh sách chờ duyệt...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-white rounded-[32px] shadow-sm border border-slate-100 min-h-screen">
      
      {/* Header & Bộ lọc */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-orange-500 text-white rounded-[20px] shadow-lg shadow-orange-200">
            <Shield size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Xét duyệt đối tác</h1>
            <p className="text-slate-400 text-sm font-medium">Hiện có <span className="text-orange-500 font-black">{requests.length}</span> hồ sơ đang chờ xử lý</p>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          {['all', 'buddy', 'manager'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filterType === type 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {type === 'all' ? 'Tất cả' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Grid danh sách */}
      {filteredRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((r) => (
            <div 
              key={r.id} 
              className="group bg-white border border-slate-100 rounded-[32px] p-6 hover:shadow-2xl hover:shadow-slate-100 hover:border-orange-200 transition-all duration-300 flex flex-col"
            >
              {/* Badge & Icon */}
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${r.type === 'manager' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                  {r.type === 'manager' ? <Briefcase size={22}/> : <User size={22}/>}
                </div>
                <div className="text-right">
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${r.type === 'manager' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                        {r.type}
                    </span>
                    <p className="text-[10px] text-slate-300 mt-1 font-bold">{new Date(r.createdAt?.seconds * 1000).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>

              {/* Thông tin chính */}
              <div className="flex-1">
                <h3 className="text-lg font-black text-slate-800 mb-1 line-clamp-1">{r.businessName || r.name}</h3>
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-4">
                  <MapPin size={14} />
                  <span className="truncate">{r.address || r.location || "Chưa cập nhật địa chỉ"}</span>
                </div>

                <div className="space-y-2 py-4 border-t border-slate-50">
                   <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                      <Phone size={14} className="text-slate-300"/> {r.phone}
                   </div>
                   <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                      <Mail size={14} className="text-slate-300"/> <span className="truncate">{r.email}</span>
                   </div>
                </div>
              </div>

              {/* Nút xem chi tiết */}
              <button 
                onClick={() => { setSelectedRequest(r); setIsModalOpen(true); }}
                className="mt-6 w-full py-4 bg-slate-50 group-hover:bg-slate-900 group-hover:text-white text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                <Eye size={16} /> Xem hồ sơ chi tiết
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
           <AlertCircle size={48} className="text-slate-300 mb-4" />
           <p className="text-slate-400 font-bold tracking-tight text-lg">Không có yêu cầu nào trong danh mục này</p>
        </div>
      )}

      {/* Modal chi tiết (Gọi component đã tách riêng) */}
      <PartnerRequestModal 
        isOpen={isModalOpen}
        item={selectedRequest}
        onClose={() => setIsModalOpen(false)}
        onAction={handleAction}
      />
    </div>
  );
};

export default ManagePartnerRequests;