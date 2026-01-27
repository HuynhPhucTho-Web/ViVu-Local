import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, query, where, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { MapPin, Eye, AlertCircle, Shield } from 'lucide-react';

const ManageDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch approved destinations
  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "destinations"),
        where("status", "==", "approved")
      );
      const snap = await getDocs(q);
      const dataPromises = snap.docs.map(async (doc) => {
        const destData = { id: doc.id, ...doc.data() };
        if (destData.managerId) {
          try {
            const userDoc = await getDoc(doc(db, "users", destData.managerId));
            if (userDoc.exists()) {
              destData.uploaderName = userDoc.data().name || "N/A";
            }
          } catch (error) {
            console.error("Lỗi lấy tên manager:", error);
            destData.uploaderName = "N/A";
          }
        } else {
          destData.uploaderName = "N/A";
        }
        return destData;
      });
      const data = await Promise.all(dataPromises);
      setDestinations(data);
    } catch (e) {
      console.error("Lỗi lấy dữ liệu:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  // Handle status change
  const handleStatusChange = async (destinationId, newStatus) => {
    const actionName = newStatus === 'inactive' ? 'VÔ HIỆU HÓA' : 'CHUYỂN THÀNH PENDING';
    if (!window.confirm(`Xác nhận ${actionName} điểm du lịch này?`)) return;

    try {
      await updateDoc(doc(db, "destinations", destinationId), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      // Update UI
      setDestinations(prev => prev.filter(d => d.id !== destinationId));
      alert(`Đã ${actionName} thành công!`);
    } catch (e) {
      console.error(e);
      alert("Lỗi hệ thống: Không thể cập nhật trạng thái.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
        <p className="text-slate-500 font-bold animate-pulse">Đang tải danh sách điểm du lịch...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-white rounded-[32px] shadow-sm border border-slate-100 min-h-screen">

      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 bg-orange-500 text-white rounded-[20px] shadow-lg shadow-orange-200">
          <Shield size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Quản lý điểm du lịch</h1>
          <p className="text-slate-400 text-sm font-medium">Hiện có <span className="text-orange-500 font-black">{destinations.length}</span> điểm du lịch đã duyệt</p>
        </div>
      </div>

      {/* Grid danh sách */}
      {destinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="group bg-white border border-slate-100 rounded-[32px] p-6 hover:shadow-2xl hover:shadow-slate-100 hover:border-orange-200 transition-all duration-300 flex flex-col"
            >
              {/* Hình ảnh */}
              <div className="w-full h-32 bg-gray-200 rounded-2xl overflow-hidden mb-4">
                <img src={dest.images?.[0] || "https://via.placeholder.com/300"} className="w-full h-full object-cover" alt={dest.name} />
              </div>

              {/* Thông tin chính */}
              <div className="flex-1">
                <h3 className="text-lg font-black text-slate-800 mb-1 line-clamp-1">{dest.name}</h3>
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-4">
                  <MapPin size={14} />
                  <span className="truncate">{dest.address || "Chưa cập nhật địa chỉ"}</span>
                </div>
                <p className="text-xs text-gray-500">Người đăng: {dest.uploaderName || "N/A"}</p>
              </div>

              {/* Nút hành động */}
              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => handleStatusChange(dest.id, 'inactive')}
                  className="flex-1 py-3 bg-red-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all"
                >
                  Vô hiệu hóa
                </button>
                <button
                  onClick={() => handleStatusChange(dest.id, 'pending')}
                  className="flex-1 py-3 bg-yellow-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-yellow-600 transition-all"
                >
                  Chuyển Pending
                </button>
                <button className="flex-1 py-3 bg-slate-50 group-hover:bg-slate-900 group-hover:text-white text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                  <Eye size={16} /> Chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
           <AlertCircle size={48} className="text-slate-300 mb-4" />
           <p className="text-slate-400 font-bold tracking-tight text-lg">Không có điểm du lịch nào đã duyệt</p>
        </div>
      )}
    </div>
  );
}
export default ManageDestinations;