import React, { useState } from 'react';
import {
  X, Phone, Mail, MapPin, Globe, ShieldCheck, 
  Briefcase, FileText, CheckCircle, FileCheck, Building2
} from 'lucide-react';
import ImageModal from '../ImageModal';

const PartnerRequestModal = ({ isOpen, item, onClose, onAction }) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  if (!isOpen || !item) return null;

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={onClose} />

      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Header Section */}
        <div className="p-8 border-b border-slate-50 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100">
              <Building2 size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">{item.businessName}</h2>
              <p className="text-orange-500 font-bold text-xs uppercase tracking-widest">Hồ sơ đăng ký Manager</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-red-500 hover:text-white rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Thông tin pháp nhân */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Briefcase size={12}/> Thông tin doanh nghiệp
              </h4>
              <div className="space-y-3">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Mã số thuế</p>
                  <p className="text-sm font-black text-slate-800">{item.taxCode || "N/A"}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Người đại diện</p>
                  <p className="text-sm font-black text-slate-800">{item.representativeName}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Phone size={12}/> Thông tin liên hệ
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center"><Phone size={14}/></div>
                  {item.phone}
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center"><Mail size={14}/></div>
                  <span className="truncate">{item.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center"><Globe size={14}/></div>
                  <span className="truncate text-blue-500 underline">{item.website || "Không có website"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Giấy phép kinh doanh - Click to view */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FileText size={12}/> Giấy phép kinh doanh (Bắt buộc)
            </h4>
            <div 
              className="relative group cursor-pointer overflow-hidden rounded-[24px] border-4 border-slate-100 shadow-sm"
              onClick={() => handleImageClick(item.licenseUrl)}
            >
              <img 
                src={item.licenseUrl} 
                alt="Business License" 
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white px-4 py-2 rounded-full flex items-center gap-2 text-xs font-black uppercase">
                  <ShieldCheck size={16} className="text-orange-500"/> Click để phóng to
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex gap-4 pt-4">
            <button 
              onClick={() => onAction(item.id, item.userId, 'manager', 'rejected')}
              className="flex-1 py-4 rounded-2xl font-black uppercase text-xs tracking-widest bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
            >
              Từ chối hồ sơ
            </button>
            <button 
              onClick={() => onAction(item.id, item.userId, 'manager', 'approved')}
              className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-500 shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <FileCheck size={18}/> Phê duyệt Manager
            </button>
          </div>
        </div>
      </div>

      <ImageModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        imageUrl={selectedImage}
      />
    </div>
  );
};

export default PartnerRequestModal;