import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Upload, Loader2, Info, CreditCard, Languages, MapPin } from 'lucide-react';
import { db, storage, auth } from '../components/firebase'; 
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const RegisterBuddy = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Quản lý file
  const [files, setFiles] = useState({
    avatar: null,
    guideCardFront: null,
    guideCardBack: null,
  });

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    idNumber: '', // CCCD
    phone: '',
    email: auth.currentUser?.email || '',
    address: '',
    guideCardNumber: '', // Số thẻ HDV
    guideCardType: 'nội địa',
    expiryDate: '',
    languages: [],
    experienceYears: '',
    areas: '', // Khu vực hoạt động
    specialty: '', // Thế mạnh
    expectedRate: '', // Mức phí
  });

  const handleLangChange = (lang) => {
    const updated = formData.languages.includes(lang)
      ? formData.languages.filter(l => l !== lang)
      : [...formData.languages, lang];
    setFormData({ ...formData, languages: updated });
  };

  const uploadFile = async (file, path) => {
    if (!file) return "";
    const fileRef = ref(storage, `${path}/${auth.currentUser.uid}_${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return alert("Vui lòng đăng nhập!");
    if (!files.guideCardFront) return alert("Vui lòng tải lên ảnh thẻ HDV!");

    setLoading(true);
    try {
      // 1. Upload các tệp đính kèm
      const avatarUrl = await uploadFile(files.avatar, 'buddy_avatars');
      const cardFrontUrl = await uploadFile(files.guideCardFront, 'buddy_verifications/front');
      const cardBackUrl = await uploadFile(files.guideCardBack, 'buddy_verifications/back');

      // 2. Lưu vào Firestore
      await addDoc(collection(db, "partner_requests"), {
        userId: auth.currentUser.uid,
        type: 'buddy',
        ...formData,
        proofFiles: {
          avatar: avatarUrl,
          guideCardFront: cardFrontUrl,
          guideCardBack: cardBackUrl
        },
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      alert('Hồ sơ đã được gửi! Admin sẽ đối soát dữ liệu với Cục Du lịch và phản hồi sớm.');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert("Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-8 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <Shield size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight">Đăng ký Local Buddy</h1>
              <p className="text-orange-100 opacity-90 text-sm">Cung cấp thông tin để xác thực thẻ Hướng dẫn viên</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          
          {/* Section 1: Thông tin cá nhân */}
          <div>
            <h3 className="flex items-center gap-2 font-black text-slate-800 mb-6 uppercase text-sm tracking-wider">
              <Info size={18} className="text-orange-500" /> 1. Thông tin cá nhân
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Họ và tên (Theo giấy khai sinh)</label>
                <input required className="w-full px-4 py-3 rounded-xl border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Ngày sinh</label>
                <input type="date" required className="w-full px-4 py-3 rounded-xl border bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500" 
                  value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Số CCCD / Hộ chiếu</label>
                <input required className="w-full px-4 py-3 rounded-xl border bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500" 
                  value={formData.idNumber} onChange={e => setFormData({...formData, idNumber: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Số điện thoại</label>
                <input required type="tel" className="w-full px-4 py-3 rounded-xl border bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500" 
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Section 2: Hồ sơ HDV */}
          <div className="pt-6 border-t border-dashed">
            <h3 className="flex items-center gap-2 font-black text-slate-800 mb-6 uppercase text-sm tracking-wider">
              <CreditCard size={18} className="text-orange-500" /> 2. Hồ sơ năng lực & Bằng cấp
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Loại thẻ HDV</label>
                <select className="w-full px-4 py-3 rounded-xl border bg-slate-50 outline-none" 
                  value={formData.guideCardType} onChange={e => setFormData({...formData, guideCardType: e.target.value})}>
                  <option value="nội địa">Nội địa</option>
                  <option value="quốc tế">Quốc tế</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Số thẻ HDV</label>
                <input required placeholder="VD: 123456789" className="w-full px-4 py-3 rounded-xl border bg-slate-50 outline-none" 
                  value={formData.guideCardNumber} onChange={e => setFormData({...formData, guideCardNumber: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Ngày hết hạn thẻ</label>
                <input type="date" className="w-full px-4 py-3 rounded-xl border bg-slate-50 outline-none" 
                  value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
              </div>
            </div>

            <div className="mt-6 space-y-4">
               <label className="text-xs font-bold text-slate-500 ml-1 flex items-center gap-2"><Languages size={14}/> Ngoại ngữ</label>
               <div className="flex flex-wrap gap-2">
                  {['Tiếng Anh', 'Tiếng Trung', 'Tiếng Hàn', 'Tiếng Nhật', 'Tiếng Pháp'].map(lang => (
                    <button key={lang} type="button" onClick={() => handleLangChange(lang)}
                      className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${formData.languages.includes(lang) ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white text-slate-500'}`}>
                      {lang}
                    </button>
                  ))}
               </div>
            </div>
          </div>

          {/* Section 3: File Upload */}
          <div className="pt-6 border-t border-dashed">
            <h3 className="flex items-center gap-2 font-black text-slate-800 mb-6 uppercase text-sm tracking-wider">
              <Upload size={18} className="text-orange-500" /> 3. Tệp đính kèm (Ảnh & PDF)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Avatar 3x4 */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-center text-slate-400 uppercase">Ảnh thẻ 3x4</p>
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-orange-50 transition-colors">
                  {files.avatar ? <span className="text-[10px] p-2 text-center">{files.avatar.name}</span> : <Upload className="text-slate-300"/>}
                  <input type="file" className="hidden" onChange={e => setFiles({...files, avatar: e.target.files[0]})} />
                </label>
              </div>
              {/* Thẻ trước */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-center text-slate-400 uppercase">Mặt trước thẻ HDV</p>
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-orange-50">
                  {files.guideCardFront ? <span className="text-[10px] p-2 text-center">{files.guideCardFront.name}</span> : <Upload className="text-slate-300"/>}
                  <input type="file" className="hidden" onChange={e => setFiles({...files, guideCardFront: e.target.files[0]})} />
                </label>
              </div>
              {/* Thẻ sau */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-center text-slate-400 uppercase">Mặt sau thẻ HDV</p>
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-orange-50">
                  {files.guideCardBack ? <span className="text-[10px] p-2 text-center">{files.guideCardBack.name}</span> : <Upload className="text-slate-300"/>}
                  <input type="file" className="hidden" onChange={e => setFiles({...files, guideCardBack: e.target.files[0]})} />
                </label>
              </div>
            </div>
          </div>

          {/* Section 4: Khu vực hoạt động */}
          <div className="pt-6 border-t border-dashed">
             <h3 className="flex items-center gap-2 font-black text-slate-800 mb-6 uppercase text-sm tracking-wider">
              <MapPin size={18} className="text-orange-500" /> 4. Thông tin bổ sung
            </h3>
            <div className="grid grid-cols-1 gap-5">
              <input placeholder="Khu vực hoạt động (VD: Sapa, Hà Giang, Hội An...)" className="w-full px-4 py-3 rounded-xl border bg-slate-50 outline-none" 
                value={formData.areas} onChange={e => setFormData({...formData, areas: e.target.value})} />
              <textarea placeholder="Sở trường / Thế mạnh cá nhân..." rows={3} className="w-full px-4 py-3 rounded-xl border bg-slate-50 outline-none" 
                value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} />
              <div className="flex items-center gap-4 bg-orange-50 p-4 rounded-2xl">
                <label className="text-sm font-black text-orange-700">Mức phí mong muốn (VNĐ/Ngày):</label>
                <input type="number" placeholder="VD: 500000" className="flex-1 px-4 py-2 rounded-xl border-none outline-none font-bold text-orange-600" 
                  value={formData.expectedRate} onChange={e => setFormData({...formData, expectedRate: e.target.value})} />
              </div>
            </div>
          </div>

          <button disabled={loading} type="submit" 
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-5 rounded-[20px] font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-orange-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
            {loading ? <Loader2 className="animate-spin" /> : "Gửi hồ sơ xét duyệt Buddy"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterBuddy;