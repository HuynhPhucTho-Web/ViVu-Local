import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, query, where, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  Check, X, Phone, Mail, Shield, User, Briefcase, FileText,
  MapPin, CreditCard, Languages, Eye, Clock, Building2,
  ExternalLink, FileCheck, Search, Filter, AlertCircle
} from 'lucide-react';
import PartnerRequestModal from './PartnerRequestModal';

const ManagePartnerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('pending');

  // 1. Lấy dữ liệu từ Firestore
  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Fetch pending requests
      const pendingQuery = query(
        collection(db, "partner_requests"),
        where("status", "==", "pending")
      );
      const pendingSnap = await getDocs(pendingQuery);
      const pendingData = pendingSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setRequests(pendingData);

      // Fetch approved requests
      const approvedQuery = query(
        collection(db, "partner_requests"),
        where("status", "==", "approved"),
        where("type", "==", "manager")
      );
      const approvedSnap = await getDocs(approvedQuery);
      const approvedData = approvedSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setApprovedRequests(approvedData);
    } catch (e) {
      console.error("Lỗi lấy dữ liệu:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (requestId, userId, type, status) => {
    if (!window.confirm(`Xác nhận duyệt yêu cầu này?`)) return;

    try {
      // 1. Lấy dữ liệu chi tiết từ đơn đăng ký
      const requestRef = doc(db, "partner_requests", requestId);
      const requestSnap = await getDoc(requestRef);
      const reqData = requestSnap.data();

      // 2. Cập nhật trạng thái đơn đăng ký
      await updateDoc(requestRef, {
        status: status,
        updatedAt: serverTimestamp()
      });

      if (status === 'approved') {
        const userRef = doc(db, "users", userId);

        // 3. COPY dữ liệu từ đơn đăng ký vào Document của User
        // Điều này giúp thông tin "Sống" cùng với tài khoản User
        await updateDoc(userRef, {
          role: type, // 'manager' hoặc 'buddy'
          isVerified: true,
          verifiedAt: serverTimestamp(),

          // Thông tin kinh doanh lấy từ đơn đăng ký (reqData)
          businessName: reqData.businessName || "",
          businessType: reqData.businessType || "",
          address: reqData.address || "",
          phone: reqData.phone || "", // SĐT hotline cơ sở
          slogan: reqData.slogan || "",
          description: reqData.description || "",
          openTime: reqData.openTime || "",
          closeTime: reqData.closeTime || "",
          amenities: reqData.amenities || [],
          businessPhotos: {
            thumbnail: reqData.proofFiles?.thumbnail || "",
            gallery: reqData.proofFiles?.gallery || []
          }
        });
      }

      // Refresh data after action
      await fetchRequests();

      alert("Duyệt thành công! Dữ liệu đã được cập nhật vào hồ sơ User.");
    } catch (e) {
      console.error(e);
      alert("Lỗi: " + e.message);
    }
  };

  // 3. Lọc dữ liệu theo tab
  const filteredRequests = filterType === 'pending' ? requests : approvedRequests;

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
            <p className="text-slate-400 text-sm font-medium">
              {filterType === 'pending'
                ? `Hiện có ${requests.length} hồ sơ đang chờ xử lý`
                : `Hiện có ${approvedRequests.length} hồ sơ đã duyệt`
              }
            </p>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          {[
            { key: 'pending', label: 'Chờ duyệt' },
            { key: 'approved', label: 'Đã duyệt' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterType(tab.key)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterType === tab.key
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              {tab.label}
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
                  {r.type === 'manager' ? <Briefcase size={22} /> : <User size={22} />}
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${r.type === 'manager' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                    {r.type === 'manager' ? '🌟 ĐỐI TÁC' : '💎 BUDDY'}
                  </span>
                  <p className="text-[10px] text-slate-300 mt-1 font-bold">
                    {new Date(r.createdAt?.seconds * 1000).toLocaleDateString('vi-VN')}
                  </p>
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
                    <Phone size={14} className="text-slate-300" /> {r.phone}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                    <Mail size={14} className="text-slate-300" /> <span className="truncate">{r.email}</span>
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