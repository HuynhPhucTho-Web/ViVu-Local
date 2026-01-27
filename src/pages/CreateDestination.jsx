import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../components/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { uploadToCloudinary } from '../data/cloudinary';
import { useAuthStore } from '../store/authStore';
import { MapPin, Image as ImageIcon, Clock, Ticket, Navigation, Loader2, ArrowLeft, X } from 'lucide-react';

const CreateDestination = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    address: '',
    priceRange: '',
    openingHours: '',
    description: '',
    image: '',
    additionalImages: []
  });

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const url = await uploadToCloudinary(file);
      setFormData({ ...formData, image: url.secure_url });
    } catch (error) {
      alert("Lỗi tải ảnh lên!");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAdditionalImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const url = await uploadToCloudinary(file);
      setFormData({ ...formData, additionalImages: [...formData.additionalImages, url.secure_url] });
    } catch (error) {
      alert("Lỗi tải ảnh lên!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) return alert("Vui lòng tải lên ảnh khu du lịch!");
    
    setLoading(true);
    try {
      await addDoc(collection(db, "destinations"), {
        ...formData,
        managerId: user.id,
        managerName: user.name,
        status: 'pending', // Trạng thái chờ Admin duyệt
        createdAt: new Date().toISOString(),
        rating: 5,
        reviews: 0
      });
      alert("Gửi yêu cầu đăng ký thành công! Vui lòng chờ Admin phê duyệt.");
      navigate('/partner/dashboard');
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi gửi dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Đăng ký Khu du lịch đối tác</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Upload Ảnh lớn */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Hình ảnh đại diện</label>
            {formData.image ? (
              <div className="relative group rounded-xl overflow-hidden border-2 border-orange-100">
                <img src={formData.image} alt="preview" className="w-full h-64 object-cover" />
                <button
                  type="button"
                  onClick={() => setFormData({...formData, image: ''})}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-orange-50 hover:border-orange-200 transition-all group">
                {loading ? <Loader2 className="animate-spin text-orange-500" /> : (
                  <>
                    <div className="p-4 bg-orange-100 rounded-full text-orange-600 mb-2 group-hover:scale-110 transition-transform">
                      <ImageIcon size={32} />
                    </div>
                    <p className="text-sm font-semibold text-gray-600">Bấm để tải ảnh khu du lịch</p>
                    <p className="text-xs text-gray-400 mt-1">Nên chọn ảnh chất lượng cao (16:9)</p>
                  </>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleUploadImage} />
              </label>
            )}
          </div>

          {/* Upload Ảnh phụ (4-5 ảnh) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Hình ảnh bổ sung (4-5 ảnh)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {formData.additionalImages.map((img, index) => (
                <div key={index} className="relative group rounded-xl overflow-hidden border-2 border-orange-100">
                  <img src={img} alt={`additional-${index}`} className="w-full h-24 object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = formData.additionalImages.filter((_, i) => i !== index);
                      setFormData({...formData, additionalImages: newImages});
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {formData.additionalImages.length < 5 && (
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-orange-50 hover:border-orange-200 transition-all group">
                  <div className="p-2 bg-orange-100 rounded-full text-orange-600 group-hover:scale-110 transition-transform">
                    <ImageIcon size={20} />
                  </div>
                  <p className="text-xs font-semibold text-gray-600 mt-1">Thêm ảnh</p>
                  <input type="file" className="hidden" accept="image/*" onChange={handleUploadAdditionalImage} />
                </label>
              )}
            </div>
          </div>

          {/* Thông tin cơ bản */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Tên khu du lịch</label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input required className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500 border-gray-200" 
                    placeholder="VD: Khu du lịch Mỹ Khánh" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Tỉnh/Thành phố</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input required className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500 border-gray-200" 
                    placeholder="VD: Cần Thơ" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Địa chỉ chi tiết</label>
              <input required className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500 border-gray-200" 
                placeholder="Số đường, phường/xã..." value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Giá vé tham khảo</label>
                <div className="relative">
                  <Ticket className="absolute left-3 top-3 text-gray-400" size={18} />
                  <select required className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500 border-gray-200 appearance-none"
                    value={formData.priceRange} onChange={(e) => setFormData({...formData, priceRange: e.target.value})}>
                    <option value="">Chọn mức giá</option>
                    <option value="Miễn phí">Miễn phí</option>
                    <option value="Dưới 50.000đ">Dưới 50.000đ</option>
                    <option value="50.000đ - 100.000đ">50.000đ - 100.000đ</option>
                    <option value="100.000đ - 200.000đ">100.000đ - 200.000đ</option>
                    <option value="Trên 200.000đ">Trên 200.000đ</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Giờ mở cửa</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <select required className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500 border-gray-200 appearance-none"
                    value={formData.openingHours} onChange={(e) => setFormData({...formData, openingHours: e.target.value})}>
                    <option value="">Chọn giờ mở cửa</option>
                    <option value="06:00 - 18:00">06:00 - 18:00</option>
                    <option value="07:00 - 19:00">07:00 - 19:00</option>
                    <option value="08:00 - 20:00">08:00 - 20:00</option>
                    <option value="09:00 - 21:00">09:00 - 21:00</option>
                    <option value="24/7">24/7</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Mô tả khu du lịch</label>
              <textarea required rows={5} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500 border-gray-200 resize-none" 
                placeholder="Giới thiệu những điểm đặc sắc, dịch vụ tại đây..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 transition-all flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Gửi thông tin đăng ký đối tác"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDestination;