import React, { useState } from 'react';
import {
  X, Phone, Mail, MapPin, Calendar, CreditCard,
  Languages, Clock, Info, ExternalLink, Award, Building2,
  CheckCircle, FileCheck, DollarSign
} from 'lucide-react';
import ImageModal from '../ImageModal';

const PartnerRequestModal = ({ isOpen, item, onClose, onAction }) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  if (!isOpen || !item) return null;

  const isManager = item.type === 'manager';

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Header với Cover Màu */}
        <div className={`h-32 w-full ${isManager ? 'bg-purple-600' : 'bg-orange-500'}`} />
        
        <div className="px-8 pb-8">
          {/* Avatar & Title Section */}
          <div className="relative -mt-12 flex items-end gap-6 mb-8">
            <div className="w-32 h-32 rounded-3xl border-4 border-white bg-slate-100 overflow-hidden shadow-lg">
              <img 
                src={item.proofFiles?.avatar || "https://ui-avatars.com/api/?name=" + (item.name || item.businessName)} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="pb-2">
              <h2 className="text-3xl font-black text-slate-900">{item.name || item.businessName}</h2>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isManager ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                Đối tác: {item.type}
              </span>
            </div>
            <button onClick={onClose} className="absolute top-14 right-0 p-2 bg-slate-100 hover:bg-red-500 hover:text-white rounded-full transition-all">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* CỘT TRÁI: THÔNG TIN LIÊN HỆ */}
            <div className="md:col-span-1 space-y-6">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Liên hệ</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <div className="p-2 bg-slate-50 rounded-lg"><Phone size={14}/></div>
                    {item.phone}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <div className="p-2 bg-slate-50 rounded-lg"><Mail size={14}/></div>
                    <span className="truncate">{item.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <div className="p-2 bg-slate-50 rounded-lg"><MapPin size={14}/></div>
                    {item.location || "N/A"}
                  </div>
                </div>
              </div>

              {/* Chứng chỉ / Pháp lý */}
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tài liệu xác thực</h4>
                <div className="space-y-2">
                  {/* Horizontal scrollable list */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {item.proofFiles?.guideCardBack && (
                      <div
                        className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleImageClick(item.proofFiles.guideCardBack)}
                      >
                        <img src={item.proofFiles.guideCardBack} className="w-full h-full object-cover" alt="Guide Card Back" />
                      </div>
                    )}
                    {item.proofFiles?.guideCardFront && (
                      <div
                        className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleImageClick(item.proofFiles.guideCardFront)}
                      >
                        <img src={item.proofFiles.guideCardFront} className="w-full h-full object-cover" alt="Guide Card Front" />
                      </div>
                    )}
                    {item.proofFiles?.license && (
                      <div
                        className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleImageClick(item.proofFiles.license)}
                      >
                        <img src={item.proofFiles.license} className="w-full h-full object-cover" alt="Business License" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: CHI TIẾT NĂNG LỰC */}
            <div className="md:col-span-2 space-y-8">
              {/* PHẦN DÀNH CHO BUDDY */}
              {!isManager && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-orange-50 rounded-2xl">
                      <p className="text-[10px] font-bold text-orange-400 uppercase">Số thẻ HDV</p>
                      <p className="text-lg font-black text-orange-700">{item.guideCardNumber}</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-2xl">
                      <p className="text-[10px] font-bold text-blue-400 uppercase">Mức phí mong muốn</p>
                      <p className="text-lg font-black text-blue-700">{item.expectedRate}đ <span className="text-xs font-normal">/ngày</span></p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 mb-2 flex items-center gap-2"><Languages size={18} className="text-orange-500"/> Ngoại ngữ & Kỹ năng</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(item.languages) ? item.languages.map(l => (
                        <span key={l} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">{l}</span>
                      )) : []}
                    </div>
                    <p className="mt-4 text-sm text-slate-600 leading-relaxed italic">"{item.specialty || "Không có mô tả thêm."}"</p>
                  </div>
                </>
              )}

              {/* PHẦN DÀNH CHO MANAGER */}
              {isManager && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-purple-50 rounded-2xl">
                      <p className="text-[10px] font-bold text-purple-400 uppercase">Giờ hoạt động</p>
                      <p className="text-lg font-black text-purple-700">{item.openTime} - {item.closeTime}</p>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-2xl">
                      <p className="text-[10px] font-bold text-emerald-400 uppercase">Loại hình</p>
                      <p className="text-lg font-black text-emerald-700">{item.businessType}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 mb-2 flex items-center gap-2"><Building2 size={18} className="text-purple-500"/> Giới thiệu địa điểm</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.amenities?.map(a => (
                        <span key={a} className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle size={10}/> {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Album Ảnh (Nếu có) */}
              {item.proofFiles?.gallery?.length > 0 && (
                <div>
                  <h4 className="text-sm font-black text-slate-800 mb-3">Hình ảnh thực tế</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {item.proofFiles.gallery.map((img, idx) => (
                      <img key={idx} src={img} className="h-16 w-full object-cover rounded-lg border" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-10 flex gap-4">
            <button 
              onClick={() => onAction(item.id, item.userId, item.type, 'rejected')}
              className="flex-1 py-4 rounded-2xl font-black uppercase text-xs tracking-widest bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
            >
              Từ chối hồ sơ
            </button>
            <button 
              onClick={() => onAction(item.id, item.userId, item.type, 'approved')}
              className="flex-3 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-500 shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <FileCheck size={18}/> Xác thực & Duyệt đối tác
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        imageUrl={selectedImage}
      />
    </div>
  );
};

export default PartnerRequestModal;
