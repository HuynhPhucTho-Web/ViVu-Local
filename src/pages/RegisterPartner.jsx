import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../components/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthStore } from '../store/authStore';
import { uploadToCloudinary } from '../data/cloudinary';
import {
  Building2, Phone, Mail, FileText, Send, CheckCircle2, ArrowLeft,
  MapPin, Clock, Image as ImageIcon, ShieldCheck, Tag, Globe, X
} from 'lucide-react';

const RegisterPartner = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Quản lý Files
  const [files, setFiles] = useState({
    thumbnail: null,
    license: null,
    gallery: []
  });

  // Previews
  const [previews, setPreviews] = useState({
    thumbnail: null,
    license: null,
    gallery: []
  });

  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'Khu du lịch',
    slogan: '',
    description: '',
    address: '',
    googleMapsUrl: '',
    phone: '',
    email: user?.email || '',
    website: '',
    openTime: '08:00',
    closeTime: '17:00',
    priceRange: '',
    amenities: [], // Wifi, bãi xe, vv
    representativeName: user?.name || '',
  });

  const amenitiesList = ['Wifi miễn phí', 'Bãi đỗ xe', 'Khu vui chơi trẻ em', 'Nhà hàng', 'Lối đi người khuyết tật', 'Cho phép thú cưng'];

  const handleAmenityChange = (item) => {
    const updated = formData.amenities.includes(item)
      ? formData.amenities.filter(i => i !== item)
      : [...formData.amenities, item];
    setFormData({ ...formData, amenities: updated });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles({ ...files, thumbnail: file });
      setPreviews({ ...previews, thumbnail: URL.createObjectURL(file) });
    }
  };

  const handleLicenseChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles({ ...files, license: file });
      setPreviews({ ...previews, license: URL.createObjectURL(file) });
    }
  };

  const handleGalleryChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles({ ...files, gallery: selectedFiles });
    setPreviews({ ...previews, gallery: selectedFiles.map(file => URL.createObjectURL(file)) });
  };

  const removeThumbnail = () => {
    setFiles({ ...files, thumbnail: null });
    setPreviews({ ...previews, thumbnail: null });
  };

  const removeLicense = () => {
    setFiles({ ...files, license: null });
    setPreviews({ ...previews, license: null });
  };

  const removeGalleryImage = (index) => {
    const newGallery = files.gallery.filter((_, i) => i !== index);
    const newGalleryPreviews = previews.gallery.filter((_, i) => i !== index);
    setFiles({ ...files, gallery: newGallery });
    setPreviews({ ...previews, gallery: newGalleryPreviews });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.thumbnail || !files.license) return alert("Vui lòng tải lên Ảnh đại diện và Giấy phép kinh doanh!");

    setLoading(true);
    try {
      // 1. Upload Thumbnail & License
      const thumbnailResult = await uploadToCloudinary(files.thumbnail);
      const licenseResult = await uploadToCloudinary(files.license);

      // 2. Upload Gallery (nhiều ảnh)
      const galleryResults = await Promise.all(
        files.gallery.map(file => uploadToCloudinary(file))
      );

      const thumbnailUrl = thumbnailResult.secure_url;
      const licenseUrl = licenseResult.secure_url;
      const galleryUrls = galleryResults.map(result => result.secure_url);

      // 3. Lưu vào Firestore
      await addDoc(collection(db, "partner_requests"), {
        ...formData,
        userId: user.id,
        type: 'manager', // Định danh yêu cầu làm Manager địa điểm
        proofFiles: {
          thumbnail: thumbnailUrl,
          license: licenseUrl,
          gallery: galleryUrls
        },
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      setIsSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      console.error(error);
      alert("Lỗi đăng ký: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6 text-center">
        <div className="animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={60} />
          </div>
          <h2 className="text-3xl font-black text-gray-900">Gửi hồ sơ thành công!</h2>
          <p className="text-gray-500 mt-3 max-w-sm mx-auto">Hồ sơ địa điểm của bạn đang được hệ thống kiểm duyệt pháp lý. Kết quả sẽ được gửi qua email.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-black text-gray-800 uppercase tracking-tight">Hợp tác địa điểm du lịch</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Thông tin định danh */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
            <h3 className="flex items-center gap-2 font-black text-gray-800 mb-6 uppercase text-sm">
              <Building2 size={20} className="text-orange-500" /> 1. Thông tin định danh cơ sở
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tên địa điểm / Cơ sở kinh doanh</label>
                <input required className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 font-bold" 
                  value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Loại hình</label>
                <select className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                  value={formData.businessType} onChange={e => setFormData({...formData, businessType: e.target.value})}>
                  <option>Khu du lịch</option>
                  <option>Bảo tàng/Di tích</option>
                  <option>Nhà hàng/Ẩm thực</option>
                  <option>Khách sạn/Resort</option>
                  <option>Điểm check-in tự do</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Hotline liên hệ</label>
                <input required type="tel" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1 flex items-center gap-1"><MapPin size={14}/> Địa chỉ chi tiết</label>
                <input required className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                  placeholder="Số nhà, tên đường, phường/xã..."
                  value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Section 2: Nội dung quảng bá */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
            <h3 className="flex items-center gap-2 font-black text-gray-800 mb-6 uppercase text-sm">
              <Tag size={20} className="text-orange-500" /> 2. Nội dung hiển thị & Tiện ích
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Slogan ngắn (Dưới 100 ký tự)</label>
                <input className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 italic font-medium" 
                  placeholder="Ví dụ: Thiên đường xanh giữa lòng thành phố"
                  value={formData.slogan} onChange={e => setFormData({...formData, slogan: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Mô tả chi tiết</label>
                <textarea rows={5} className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 font-medium resize-none" 
                  placeholder="Giới thiệu về các hoạt động nổi bật, lịch sử..."
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1 flex items-center gap-1"><Clock size={14}/> Giờ mở cửa</label>
                  <input type="time" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none font-bold text-orange-600"
                    value={formData.openTime} onChange={e => setFormData({...formData, openTime: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1 flex items-center gap-1"><Clock size={14}/> Giờ đóng cửa</label>
                  <input type="time" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none font-bold text-orange-600"
                    value={formData.closeTime} onChange={e => setFormData({...formData, closeTime: e.target.value})} />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tiện ích đi kèm</label>
                <div className="flex flex-wrap gap-2">
                  {amenitiesList.map(item => (
                    <button key={item} type="button" onClick={() => handleAmenityChange(item)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${formData.amenities.includes(item) ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white text-gray-500'}`}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Media & Pháp lý */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
            <h3 className="flex items-center gap-2 font-black text-gray-800 mb-6 uppercase text-sm">
              <ImageIcon size={20} className="text-orange-500" /> 3. Hình ảnh & Pháp lý
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="p-6 border-2 border-dashed border-gray-100 rounded-[24px] text-center relative">
                  {previews.thumbnail ? (
                    <div className="relative">
                      <img src={previews.thumbnail} alt="Thumbnail preview" className="w-full h-32 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <input type="file" id="thumb" className="hidden" onChange={handleThumbnailChange} />
                      <label htmlFor="thumb" className="cursor-pointer">
                        <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <ImageIcon size={24}/>
                        </div>
                        <p className="text-sm font-bold text-gray-700">Ảnh đại diện (Thumbnail)</p>
                        <p className="text-xs text-gray-400 mt-1">Chọn ảnh đẹp nhất</p>
                      </label>
                    </>
                  )}
                </div>
                <div className="space-y-4">
                  {previews.gallery.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {previews.gallery.map((preview, index) => (
                        <div key={index} className="relative">
                          <img src={preview} alt={`Gallery ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="p-6 border-2 border-dashed border-gray-100 rounded-[24px] text-center">
                    <input type="file" multiple id="gal" className="hidden" onChange={handleGalleryChange} />
                    <label htmlFor="gal" className="cursor-pointer">
                      <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <ImageIcon size={24}/>
                      </div>
                      <p className="text-sm font-bold text-gray-700">Bộ sưu tập ảnh (Gallery)</p>
                      <p className="text-xs text-gray-400 mt-1">Chọn nhiều ảnh</p>
                    </label>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-6 bg-slate-900 rounded-[24px] text-white relative">
                  {previews.license ? (
                    <div className="relative">
                      <img src={previews.license} alt="License preview" className="w-full h-32 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={removeLicense}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <input type="file" id="license" className="hidden" onChange={handleLicenseChange} />
                      <label htmlFor="license" className="cursor-pointer flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                          <ShieldCheck size={24}/>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold">Giấy phép kinh doanh</p>
                          <p className="text-[10px] opacity-60 uppercase">Bắt buộc để xác thực</p>
                        </div>
                      </label>
                    </>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1 flex items-center gap-1"><Globe size={14}/> Website / Fanpage</label>
                  <input className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none font-medium" 
                    placeholder="https://..." value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-3xl shadow-2xl shadow-orange-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {loading ? "ĐANG TẢI DỮ LIỆU & FILE..." : (
              <>GỬI HỒ SƠ ĐỊA ĐIỂM <Send size={20}/></>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default RegisterPartner;