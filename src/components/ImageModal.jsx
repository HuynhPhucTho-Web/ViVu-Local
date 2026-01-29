import React from 'react';
import { X, ZoomIn, Download } from 'lucide-react';

const ImageModal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4 md:p-10 animate-in fade-in duration-200">
      {/* Nút đóng góc cao */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-all active:scale-90"
      >
        <X size={28} />
      </button>

      {/* Toolbar nhỏ bên dưới */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
        <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Đang xem Giấy phép kinh doanh</p>
        <div className="h-4 w-[1px] bg-white/20" />
        <a href={imageUrl} target="_blank" rel="noreferrer" className="text-white hover:text-orange-400 transition-colors">
            <Download size={20} />
        </a>
      </div>

      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={imageUrl}
          alt="Full size verification"
          className="max-w-full max-h-full object-contain shadow-2xl rounded-sm animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

export default ImageModal;