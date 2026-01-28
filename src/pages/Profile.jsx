import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { User, Mail, Phone, MapPin, Calendar, Settings, Edit, Upload, Loader2, ShieldCheck, Star } from 'lucide-react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../components/firebase';
import { uploadToCloudinary } from '../data/cloudinary';
import ImageModal from '../components/ImageModal';

const Profile = () => {
  const { user, login } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  // Khởi tạo state rỗng, sẽ được lấp đầy bởi useEffect
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    gender: '',
    avatar: '',
  });

  // QUAN TRỌNG: Đồng bộ dữ liệu từ Store vào Form mỗi khi User thay đổi (ví dụ: khi vừa được duyệt Role)
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || '',
        gender: user.gender || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  // Hàm hiển thị tên Role cho đẹp
  const getRoleBadge = (role) => {
    switch (role) {
      case 'manager': return { label: '🌟 Đối tác quản lý', color: 'bg-purple-100 text-purple-700 border-purple-200' };
      case 'buddy': return { label: '💎 Local Buddy', color: 'bg-blue-100 text-blue-700 border-blue-200' };
      case 'admin': return { label: '🔑 Quản trị viên', color: 'bg-red-100 text-red-700 border-red-200' };
      default: return { label: '👤 Thành viên', color: 'bg-gray-100 text-gray-700 border-gray-200' };
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.id);
      
      // Chỉ cập nhật các trường thông tin cá nhân, KHÔNG ghi đè role hay email (để bảo mật)
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        city: formData.city,
        gender: formData.gender,
        avatar: formData.avatar,
      };

      await updateDoc(userRef, updateData);

      // Cập nhật lại Store toàn cục: Giữ nguyên user cũ, chỉ đè thông tin mới
      login({ ...user, ...updateData });
      
      alert('🎉 Cập nhật hồ sơ thành công!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Lỗi khi cập nhật hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const result = await uploadToCloudinary(file);
      const avatarUrl = result.secure_url;
      setFormData(prev => ({ ...prev, avatar: avatarUrl }));
      
      // Nếu không trong chế độ edit, cập nhật trực tiếp vào DB luôn cho tiện
      if (!isEditing) {
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, { avatar: avatarUrl });
        login({ ...user, avatar: avatarUrl });
      }
    } catch (error) {
      alert('Lỗi khi tải ảnh lên');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-orange-600 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Bạn chưa đăng nhập</h2>
          <p className="text-gray-500 mb-6">Vui lòng đăng nhập để xem thông tin cá nhân.</p>
          <button onClick={() => window.location.href='/login'} className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all">Đăng nhập ngay</button>
        </div>
      </div>
    );
  }

  const roleInfo = getRoleBadge(user.role);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Profile Card Chính */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-200/60 overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-orange-400 to-rose-400"></div>
          <div className="px-8 pb-8">
            <div className="relative flex flex-col md:flex-row md:items-end -mt-12 gap-6">
              <div className="relative group">
                <div className="h-32 w-32 rounded-[32px] bg-white p-1 shadow-xl">
                  <div className="h-full w-full rounded-[28px] bg-slate-100 overflow-hidden flex items-center justify-center border-2 border-white">
                    {formData.avatar ? (
                      <img src={formData.avatar} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-12 w-12 text-slate-300" />
                    )}
                  </div>
                </div>
                <label className="absolute bottom-2 right-2 bg-slate-900 text-white p-2 rounded-xl cursor-pointer hover:scale-110 transition-all shadow-lg">
                  <Upload className="h-4 w-4" />
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
              </div>

              <div className="flex-1 mb-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-black text-slate-800">{user.name}</h1>
                  {user.isVerified && <ShieldCheck className="text-blue-500 w-6 h-6" />}
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <span className={`px-4 py-1 rounded-full text-xs font-bold border ${roleInfo.color}`}>
                    {roleInfo.label}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400 text-sm font-medium">
                    <Mail size={14} /> {user.email}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                  isEditing ? 'bg-slate-100 text-slate-600' : 'bg-orange-500 text-white shadow-lg shadow-orange-200 hover:bg-orange-600'
                }`}
              >
                {isEditing ? 'Hủy bỏ' : <><Edit size={18}/> Chỉnh sửa</>}
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cột trái: Form thông tin */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                <div className="p-2 bg-orange-50 text-orange-500 rounded-lg"><User size={20}/></div>
                Thông tin cá nhân
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">Họ và tên</label>
                  <input
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-orange-500 transition-all disabled:opacity-70 font-medium"
                    placeholder="Nhập họ tên..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">Số điện thoại</label>
                  <input
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-orange-500 transition-all disabled:opacity-70 font-medium"
                    placeholder="Chưa có số điện thoại"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">Thành phố</label>
                  <input
                    disabled={!isEditing}
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-orange-500 transition-all disabled:opacity-70 font-medium"
                    placeholder="Ví dụ: Đà Lạt, Hà Nội..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">Giới tính</label>
                  <select
                    disabled={!isEditing}
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-orange-500 transition-all disabled:opacity-70 font-medium"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              {isEditing && (
                <div className="mt-10 flex gap-4">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="animate-spin" size={20}/>}
                    Lưu thay đổi
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cột phải: Thông tin hệ thống */}
          <div className="space-y-8">
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-500 rounded-lg"><Settings size={20}/></div>
                Tài khoản
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                    <Calendar size={18} /> Ngày tham gia
                  </div>
                  <span className="font-bold text-slate-800">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'Mới tham gia'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                    <Star size={18} /> Điểm uy tín
                  </div>
                  <span className="font-bold text-orange-500">9.8/10</span>
                </div>
                <div className="pt-6 border-t border-slate-50">
                   <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-green-700 text-sm font-black uppercase">Đã xác thực danh tính</span>
                   </div>
                </div>
              </div>
            </div>
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

export default Profile;