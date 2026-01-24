import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Save, Languages, DollarSign, Award, BookOpen, Loader2 } from 'lucide-react';

const BuddyProfileEdit = () => {
  const { user, login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  
  // Khởi tạo state từ dữ liệu user hiện tại
  const [profile, setProfile] = useState({
    bio: user?.bio || '',
    languages: user?.languages || ['Tiếng Việt'],
    hourlyRate: user?.hourlyRate || '',
    skills: user?.skills || '',
    experience: user?.experience || ''
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, profile);
      
      // Cập nhật lại global state để hiển thị ngay lập tức
      login({ ...user, ...profile });
      alert("Cập nhật hồ sơ Buddy thành công!");
    } catch (error) {
      console.error(error);
      alert("Lỗi khi cập nhật hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Hồ sơ năng lực</h2>
          <p className="text-sm text-gray-500">Thông tin này sẽ hiển thị công khai để khách du lịch tìm thuê bạn.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-orange-200 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Lưu thay đổi
        </button>
      </div>

      <form className="p-6 space-y-6">
        {/* Giá thuê & Ngôn ngữ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <DollarSign size={16} className="text-orange-500" /> Giá thuê mỗi giờ (VNĐ)
            </label>
            <input 
              type="number"
              placeholder="Ví dụ: 200000"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={profile.hourlyRate}
              onChange={(e) => setProfile({...profile, hourlyRate: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <Languages size={16} className="text-blue-500" /> Ngôn ngữ giao tiếp
            </label>
            <input 
              placeholder="Tiếng Việt, Tiếng Anh..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={profile.languages}
              onChange={(e) => setProfile({...profile, languages: e.target.value.split(',')})}
            />
            <p className="text-[10px] text-gray-400">* Phân cách bằng dấu phẩy</p>
          </div>
        </div>

        {/* Kỹ năng & Kinh nghiệm */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <Award size={16} className="text-purple-500" /> Kỹ năng đặc biệt
          </label>
          <input 
            placeholder="Chụp ảnh điện thoại, Am hiểu ẩm thực đường phố, Biết lái xe máy..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            value={profile.skills}
            onChange={(e) => setProfile({...profile, skills: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <BookOpen size={16} className="text-green-500" /> Kinh nghiệm dẫn tour
          </label>
          <textarea 
            rows={3}
            placeholder="Chia sẻ ngắn gọn về quá trình làm Buddy của bạn..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none"
            value={profile.experience}
            onChange={(e) => setProfile({...profile, experience: e.target.value})}
          />
        </div>

        {/* Giới thiệu bản thân */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Lời chào & Giới thiệu bản thân</label>
          <textarea 
            rows={5}
            placeholder="Chào bạn, mình là một người con của vùng đất Cần Thơ, mình rất vui nếu được đồng hành cùng bạn..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none"
            value={profile.bio}
            onChange={(e) => setProfile({...profile, bio: e.target.value})}
          />
        </div>

        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
          <div className="text-blue-500 font-bold">💡</div>
          <p className="text-xs text-blue-700 leading-relaxed">
            <strong>Mẹo:</strong> Hồ sơ đầy đủ thông tin và có mô tả chi tiết giúp bạn tăng khả năng được khách du lịch lựa chọn lên đến 80%. Hãy viết thật chân thành nhé!
          </p>
        </div>
      </form>
    </div>
  );
};

export default BuddyProfileEdit;