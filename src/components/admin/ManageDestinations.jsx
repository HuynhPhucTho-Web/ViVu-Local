import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, query, where, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { MapPin, Eye, AlertCircle, Shield, CheckCircle, Clock, X } from 'lucide-react';

const ManageDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // Mặc định hiện yêu cầu mới
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      // Query lấy cả pending và approved để admin quản lý
      const q = query(
        collection(db, "destinations"),
        where("status", "in", ["pending", "approved"])
      );
      
      const snap = await getDocs(q);
      const dataPromises = snap.docs.map(async (docSnapshot) => {
        const destData = { id: docSnapshot.id, ...docSnapshot.data() };
        
        // Lấy tên người đăng
        if (destData.managerId) {
          try {
            const userDoc = await getDoc(doc(db, "users", destData.managerId));
            destData.uploaderName = userDoc.exists() ? userDoc.data().name : "N/A";
          } catch (e) { destData.uploaderName = "N/A"; }
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

  const handleStatusChange = async (destinationId, newStatus) => {
    let actionName = "";
    switch(newStatus) {
        case 'approved': actionName = "PHÊ DUYỆT"; break;
        case 'inactive': actionName = "VÔ HIỆU HÓA"; break;
        default: actionName = "CẬP NHẬT";
    }

    if (!window.confirm(`Xác nhận ${actionName} điểm du lịch này?`)) return;

    try {
      await updateDoc(doc(db, "destinations", destinationId), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      
      // Cập nhật lại state tại chỗ để UI mượt mà
      setDestinations(prev => prev.map(d => 
        d.id === destinationId ? { ...d, status: newStatus } : d
      ));
      
      alert(`Đã ${actionName} thành công!`);
    } catch (e) {
      console.error(e);
      alert("Lỗi hệ thống.");
    }
  };

  // Lọc danh sách hiển thị theo Tab
  const displayedDestinations = destinations.filter(d => d.status === activeTab);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
        <p className="text-slate-500 font-bold">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-white rounded-[32px] shadow-sm border border-slate-100 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-orange-500 text-white rounded-[20px] shadow-lg shadow-orange-200">
            <Shield size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Hệ thống quản trị</h1>
            <p className="text-slate-400 text-sm font-medium">Quản lý phê duyệt và vận hành điểm đến</p>
          </div>
        </div>

        {/* Tabs Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'pending' ? 'bg-white text-orange-500 shadow-sm' : 'text-slate-500'}`}
          >
            Chờ duyệt ({destinations.filter(d => d.status === 'pending').length})
          </button>
          <button 
            onClick={() => setActiveTab('approved')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'approved' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500'}`}
          >
            Đã duyệt ({destinations.filter(d => d.status === 'approved').length})
          </button>
        </div>
      </div>

      {/* Grid danh sách */}
      {displayedDestinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedDestinations.map((dest) => (
            <div key={dest.id} className="group bg-white border border-slate-100 rounded-[32px] p-6 hover:shadow-2xl transition-all duration-300 flex flex-col relative overflow-hidden">
              
              {/* Badge trạng thái */}
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${dest.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                {dest.status === 'approved' ? 'Đang hoạt động' : 'Chờ kiểm duyệt'}
              </div>

              <div className="w-full h-40 bg-gray-200 rounded-2xl overflow-hidden mb-4">
                <img src={dest.image || "https://via.placeholder.com/300"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={dest.title} />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-black text-slate-800 mb-1 line-clamp-1">{dest.title}</h3>
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-4">
                  <MapPin size={14} />
                  <span className="truncate">{dest.address || "Chưa có địa chỉ"}</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold">
                        {dest.uploaderName?.charAt(0)}
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">Người đăng: <span className="font-bold">{dest.uploaderName}</span></p>
                </div>
              </div>

              {/* Nút hành động */}
              <div className="mt-6 flex flex-wrap gap-2">
                {dest.status === 'pending' ? (
                  <button
                    onClick={() => handleStatusChange(dest.id, 'approved')}
                    className="flex-1 py-3 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={14} /> Duyệt ngay
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(dest.id, 'inactive')}
                    className="flex-1 py-3 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all"
                  >
                    Vô hiệu hóa
                  </button>
                )}
                
                <button
                  onClick={() => {
                    setSelectedDestination(dest);
                    setShowModal(true);
                  }}
                  className="px-4 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:opacity-80 transition-all flex items-center justify-center gap-2"
                >
                  <Eye size={14} /> Chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
           <Clock size={48} className="text-slate-300 mb-4 animate-bounce" />
           <p className="text-slate-400 font-bold text-lg">Không có yêu cầu nào trong mục này</p>
        </div>
      )}

      {/* Modal Chi tiết */}
      {showModal && selectedDestination && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 md:p-8">
              {/* Header Modal */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-800">Chi tiết điểm đến</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Nội dung Modal */}
              <div className="space-y-6">
                {/* Hình ảnh chính */}
                <div className="w-full h-64 bg-gray-200 rounded-2xl overflow-hidden">
                  <img src={selectedDestination.image || "https://via.placeholder.com/300"} className="w-full h-full object-cover" alt={selectedDestination.title} />
                </div>

                {/* Thông tin cơ bản */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-bold text-gray-500 uppercase">Tên khu du lịch</label>
                      <p className="text-lg font-semibold text-slate-800">{selectedDestination.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-500 uppercase">Tỉnh/Thành phố</label>
                      <p className="text-slate-600">{selectedDestination.location}</p>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-500 uppercase">Địa chỉ chi tiết</label>
                      <p className="text-slate-600">{selectedDestination.address}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-bold text-gray-500 uppercase">Giá vé tham khảo</label>
                      <p className="text-slate-600">{selectedDestination.priceRange}</p>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-500 uppercase">Giờ mở cửa</label>
                      <p className="text-slate-600">{selectedDestination.openingHours}</p>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-500 uppercase">Người đăng</label>
                      <p className="text-slate-600">{selectedDestination.uploaderName}</p>
                    </div>
                  </div>
                </div>

                {/* Mô tả */}
                <div>
                  <label className="text-sm font-bold text-gray-500 uppercase">Mô tả khu du lịch</label>
                  <p className="text-slate-600 mt-2 leading-relaxed">{selectedDestination.description}</p>
                </div>

                {/* Hình ảnh bổ sung */}
                {selectedDestination.additionalImages && selectedDestination.additionalImages.length > 0 && (
                  <div>
                    <label className="text-sm font-bold text-gray-500 uppercase">Hình ảnh bổ sung</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                      {selectedDestination.additionalImages.map((img, index) => (
                        <div key={index} className="w-full h-24 bg-gray-200 rounded-xl overflow-hidden">
                          <img src={img} alt={`additional-${index}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trạng thái */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-500 uppercase">Trạng thái:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${selectedDestination.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {selectedDestination.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageDestinations;