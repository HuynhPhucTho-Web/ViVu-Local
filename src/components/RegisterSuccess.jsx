import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Home, ArrowRight } from 'lucide-react';

const RegisterSuccess = ({ 
  title = "Gửi yêu cầu thành công!", 
  message = "Hệ thống đã ghi nhận thông tin của bạn. Chúng tôi sẽ phê duyệt trong vòng 24h tới." 
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[40px] p-10 shadow-2xl shadow-orange-100 text-center border border-orange-50 animate-in fade-in zoom-in duration-500">
        
        {/* Icon Animation */}
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-orange-100 rounded-full animate-ping opacity-20"></div>
          <div className="relative w-full h-full bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-200">
            <ShieldCheck size={48} className="text-white" />
          </div>
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
          {title}
        </h2>
        
        <p className="text-gray-500 leading-relaxed mb-10">
          {message}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group"
          >
            <Home size={18} />
            QUAY VỀ TRANG CHỦ
          </button>
          
          <button
            onClick={() => navigate('/manager/dashboard')}
            className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            QUAY VỀ DASHBOARD QUẢN LÝ
            <ArrowRight size={18} />
          </button>
        </div>

        <p className="mt-8 text-[10px] text-gray-400 uppercase tracking-[2px] font-bold">
          ViVuLocal - Local Travel Partner
        </p>
      </div>
    </div>
  );
};

export default RegisterSuccess;