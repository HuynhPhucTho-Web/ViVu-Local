import { useState } from 'react';
import { db } from '../../components/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { uploadToCloudinary } from '../../data/cloudinary';
import { useAuthStore } from '../../store/authStore';
import { Clock, Users, Ticket, Loader2, ImageIcon, X, MapPin } from 'lucide-react';

const TourForm = ({ onSuccess }) => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '', location: '', price: '', duration: '', maxPeople: '', description: ''
  });

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const url = await uploadToCloudinary(file);
      setImages([...images, url.secure_url]);
    } catch (error) {
      alert("Lỗi tải ảnh lên!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return alert("Vui lòng thêm ảnh tour");
    setLoading(true);
    try {
      await addDoc(collection(db, "tours"), {
        ...formData,
        image: images[0],
        additionalImages: images.slice(1),
        creatorId: user.uid,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      onSuccess();
    } catch (err) { alert("Lỗi gửi dữ liệu"); }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photo Upload UI */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Hình ảnh Tour</label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
          {images.map((img, index) => (
            <div key={index} className="relative group rounded-xl overflow-hidden border-2 border-blue-100">
              <img src={img} alt={`tour-${index}`} className="w-full h-24 object-cover" />
              <button
                type="button"
                onClick={() => setImages(images.filter((_, i) => i !== index))}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {images.length < 5 && (
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all group">
              <div className="p-2 bg-blue-100 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
                <ImageIcon size={20} />
              </div>
              <p className="text-xs font-semibold text-gray-600 mt-1">Thêm ảnh</p>
              <input type="file" className="hidden" accept="image/*" onChange={handleUploadImage} />
            </label>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Tên Tour</label>
          <input required placeholder="Ví dụ: Trekking Núi Cấm 2 ngày 1 đêm"
            className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
            onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Địa điểm</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
            <input required placeholder="Ví dụ: Cần Thơ"
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
              onChange={e => setFormData({...formData, location: e.target.value})} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Thời lượng</label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input required placeholder="2 ngày 1 đêm" className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
                onChange={e => setFormData({...formData, duration: e.target.value})} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Số khách tối đa</label>
            <div className="relative">
              <Users className="absolute left-3 top-3 text-gray-400" size={18} />
              <input required type="number" placeholder="15" className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
                onChange={e => setFormData({...formData, maxPeople: e.target.value})} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Giá trọn gói</label>
            <div className="relative">
              <Ticket className="absolute left-3 top-3 text-gray-400" size={18} />
              <input required placeholder="2.500.000đ" className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
                onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Mô tả Tour</label>
          <textarea required rows={5} placeholder="Lịch trình tóm tắt và dịch vụ bao gồm..."
            className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border-gray-200 resize-none"
            onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all flex justify-center items-center gap-2"
      >
        {loading ? <Loader2 className="animate-spin" /> : "ĐĂNG KÝ TOUR"}
      </button>
    </form>
  );
};

export default TourForm;
