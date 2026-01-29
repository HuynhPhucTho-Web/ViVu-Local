import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../components/firebase'; // Đảm bảo import auth từ firebase config
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthStore } from '../store/authStore';
import { uploadToCloudinary } from '../data/cloudinary';
import {
  Building2, Phone, Mail, Send, ArrowLeft,
  MapPin, ShieldCheck, Globe, X, FileText, Briefcase
} from 'lucide-react';

const RegisterPartner = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [licenseFile, setLicenseFile] = useState(null);
  const [licensePreview, setLicensePreview] = useState(null);

  const [formData, setFormData] = useState({
    representativeName: user?.displayName || user?.name || '',
    businessName: '',
    taxCode: '',
    phone: '',
    email: user?.email || '',
    address: '',
    website: '',
  });

  const handleLicenseChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra định dạng file
      if (!file.type.startsWith('image/')) {
        alert("Vui lòng chỉ tải lên định dạng hình ảnh!");
        return;
      }
      setLicenseFile(file);
      setLicensePreview(URL.createObjectURL(file));
    }
  };

  const removeLicense = () => {
    setLicenseFile(null);
    setLicensePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Kiểm tra User
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("Hệ thống chưa nhận diện được tài khoản. Vui lòng đăng nhập lại!");
      return;
    }

    // 2. Kiểm tra file giấy phép
    if (!licenseFile) {
      alert("Vui lòng tải lên ảnh Giấy phép kinh doanh để xác thực!");
      return;
    }

    setLoading(true);
    try {
      // 3. Upload ảnh lên Cloudinary trước
      let licenseUrl = "";
      const uploadRes = await uploadToCloudinary(licenseFile);
      
      if (uploadRes && uploadRes.secure_url) {
        licenseUrl = uploadRes.secure_url;
      } else {
        throw new Error("Không thể tải ảnh lên hệ thống Cloudinary.");
      }

      // 4. Chuẩn bị data và lưu vào Firestore
      const requestData = {
        userId: currentUser.uid,
        email: formData.email || currentUser.email,
        businessName: formData.businessName || "",
        taxCode: formData.taxCode || "",
        representativeName: formData.representativeName || "",
        phone: formData.phone || "",
        address: formData.address || "",
        website: formData.website || "",
        licenseUrl: licenseUrl, // URL từ Cloudinary
        type: 'manager',
        status: 'pending', // Trạng thái mặc định để Admin duyệt
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "partner_requests"), requestData);
      
      setIsSuccess(true);
      // Tự động quay về trang chủ sau 3s
      setTimeout(() => navigate('/'), 3500);

    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      alert("Đã có lỗi xảy ra: " + (err.message || "Vui lòng thử lại sau."));
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6 text-center">
        <div className="animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={60} />
          </div>
          <h2 className="text-3xl font-black text-gray-900">Hồ sơ đã gửi thành công!</h2>
          <p className="text-gray-500 mt-3 max-w-sm mx-auto">
            Chúng tôi đã nhận được thông tin pháp nhân của bạn. 
            Kết quả xác duyệt sẽ được gửi tới bạn trong vòng 24h làm việc.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b px-4 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-black text-gray-800 uppercase tracking-tight">Xác thực đối tác Manager</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Section 1: Thông tin pháp nhân */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
            <h3 className="flex items-center gap-2 font-black text-gray-800 mb-6 uppercase text-sm">
              <Briefcase size={20} className="text-orange-500" /> 1. Thông tin đại diện pháp luật
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tên tổ chức / Hộ kinh doanh</label>
                <input 
                  required 
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                  placeholder="Ví dụ: Công ty TNHH Du lịch Xanh"
                  value={formData.businessName} 
                  onChange={e => setFormData({ ...formData, businessName: e.target.value })} 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Người đại diện</label>
                <input 
                  required 
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                  value={formData.representativeName} 
                  onChange={e => setFormData({ ...formData, representativeName: e.target.value })} 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Mã số thuế</label>
                <input 
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                  placeholder="Mã số doanh nghiệp"
                  value={formData.taxCode} 
                  onChange={e => setFormData({ ...formData, taxCode: e.target.value })} 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Số điện thoại hotline</label>
                <input 
                  required 
                  type="tel" 
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                  value={formData.phone} 
                  onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email liên hệ</label>
                <input 
                  required 
                  type="email" 
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                  value={formData.email} 
                  onChange={e => setFormData({ ...formData, email: e.target.value })} 
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Địa chỉ trụ sở chính</label>
                <input 
                  required 
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                  placeholder="Địa chỉ ghi trên giấy phép..."
                  value={formData.address} 
                  onChange={e => setFormData({ ...formData, address: e.target.value })} 
                />
              </div>
            </div>
          </div>

          {/* Section 2: Tài liệu pháp lý */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
            <h3 className="flex items-center gap-2 font-black text-gray-800 mb-6 uppercase text-sm">
              <FileText size={20} className="text-orange-500" /> 2. Giấy tờ pháp lý
            </h3>
            <div className="space-y-6">
              <div className="p-8 bg-slate-900 rounded-[24px] text-white relative">
                {licensePreview ? (
                  <div className="relative group">
                    <img src={licensePreview} alt="License" className="w-full h-56 object-contain rounded-lg shadow-2xl" />
                    <button 
                      type="button" 
                      onClick={removeLicense} 
                      className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 p-2 rounded-full shadow-lg transition-all"
                    >
                      <X size={20} />
                    </button>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-lg">
                      <p className="text-xs font-bold uppercase tracking-widest">Ảnh đã chọn</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <input 
                      type="file" 
                      id="license" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleLicenseChange} 
                    />
                    <label htmlFor="license" className="cursor-pointer flex flex-col items-center gap-4 py-6 group">
                      <div className="w-20 h-20 bg-white/10 group-hover:bg-orange-500/20 group-hover:scale-110 rounded-[24px] flex items-center justify-center transition-all duration-300">
                        <ShieldCheck size={40} className="text-orange-400 group-hover:text-orange-500" />
                      </div>
                      <div className="text-center">
                        <p className="font-black text-lg">Tải ảnh Giấy phép kinh doanh</p>
                        <p className="text-xs opacity-50 mt-1 uppercase tracking-widest">Yêu cầu ảnh chụp rõ nét, không bị lóa</p>
                      </div>
                    </label>
                  </>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1 flex items-center gap-1">
                  <Globe size={14} /> Link Website/Fanpage (Nếu có)
                </label>
                <input 
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none font-medium focus:ring-2 focus:ring-orange-500"
                  placeholder="https://..." 
                  value={formData.website} 
                  onChange={e => setFormData({ ...formData, website: e.target.value })} 
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-[24px] shadow-2xl shadow-orange-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ĐANG TẢI HỒ SƠ LÊN...
              </>
            ) : (
              <>GỬI HỒ SƠ XÁC THỰC NGAY <Send size={20} /></>
            )}
          </button>

          <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Bằng việc nhấn gửi, bạn cam kết các thông tin trên là chính xác và hoàn toàn chịu trách nhiệm trước pháp luật.
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPartner;