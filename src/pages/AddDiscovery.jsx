import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { db } from '../components/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { uploadToCloudinary } from '../data/cloudinary';
import {
  ArrowLeft, Save, Upload, X, Star, MapPin,
  FileText, Image as ImageIcon, Tag, DollarSign
} from 'lucide-react';

const AddDiscovery = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Check if user is manager
  if (!user || user.role !== 'manager') {
    return <div className="p-20 text-center font-bold">Bạn không có quyền truy cập trang này.</div>;
  }

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    location: '',
    category: 'food',
    cost: '',
    tags: [],
    image: null,
    foodType: '',
    drinkType: '',
    interests: []
  });

  const [tagInput, setTagInput] = useState('');

  const categories = [
    { id: 'food', label: 'Ẩm thực', icon: '🍽️' },
    { id: 'stay', label: 'Lưu trú', icon: '🏨' },
    { id: 'culture', label: 'Văn hóa', icon: '🎭' }
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.location || !formData.image) {
      alert('Vui lòng điền đầy đủ thông tin và tải lên hình ảnh!');
      return;
    }

    setLoading(true);

    try {
      // 1. Upload image to Cloudinary
      const imageResult = await uploadToCloudinary(formData.image);
      const imageUrl = imageResult.secure_url;

      // 2. Save to Firestore
      const postData = {
        title: formData.title,
        content: formData.content,
        location: formData.location,
        category: formData.category,
        cost: formData.cost,
        tags: formData.tags,
        image: imageUrl,
        author: user.name || user.email,
        authorId: user.uid,
        status: 'published',
        interests: formData.interests || [],
        ratings: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Add category-specific fields
      if (formData.category === 'food') {
        postData.foodType = formData.foodType || null;
        postData.drinkType = formData.drinkType || null;
      } else if (formData.category === 'stay') {
        postData.stayType = formData.stayType || null;
      } else if (formData.category === 'culture') {
        postData.cultureType = formData.cultureType || null;
      }

      await addDoc(collection(db, "discovery_posts"), postData);

      alert('Bài viết đã được tạo thành công!');
      navigate('/manager/manage-discovery');
    } catch (error) {
      console.error('Lỗi tạo bài viết:', error);
      alert('Có lỗi xảy ra khi tạo bài viết. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/manager/manage-discovery')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-orange-500 text-white rounded-[20px] shadow-lg shadow-orange-200">
              <FileText size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Thêm bài viết mới</h1>
              <p className="text-slate-400 text-sm font-medium">Chia sẻ trải nghiệm của bạn</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Image Upload */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
            <h3 className="flex items-center gap-2 font-black text-slate-800 mb-6 uppercase text-sm">
              <ImageIcon size={20} className="text-orange-500" /> 1. Hình ảnh chính
            </h3>

            <div className="max-w-md">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-2xl border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-orange-300 transition-colors">
                  <input
                    type="file"
                    id="image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="image" className="cursor-pointer">
                    <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload size={32} />
                    </div>
                    <p className="text-slate-600 font-bold mb-2">Tải lên hình ảnh</p>
                    <p className="text-slate-400 text-sm">Chọn ảnh đẹp nhất để thu hút người xem</p>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
            <h3 className="flex items-center gap-2 font-black text-slate-800 mb-6 uppercase text-sm">
              <FileText size={20} className="text-orange-500" /> 2. Thông tin cơ bản
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Tiêu đề bài viết</label>
                <input
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                  placeholder="Ví dụ: Lạc lối ở Hội An – Ăn sập phố cổ chỉ với 500k"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center gap-1">
                  <MapPin size={14} /> Địa điểm
                </label>
                <input
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                  placeholder="Ví dụ: Hội An, Quảng Nam"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Danh mục</label>
                <select
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                  ))}
                </select>
              </div>



              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center gap-1">
                  <DollarSign size={14} /> Tổng chi phí
                </label>
                <input
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                  placeholder="Ví dụ: 450.000đ"
                  value={formData.cost}
                  onChange={(e) => setFormData({...formData, cost: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Additional Information for Filtering */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
            <h3 className="flex items-center gap-2 font-black text-slate-800 mb-6 uppercase text-sm">
              <Tag size={20} className="text-orange-500" /> 3. Thông tin bổ sung (để lọc)
            </h3>

            <div className="space-y-6">
              {/* Food Category Fields */}
              {formData.category === 'food' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Loại món ăn</label>
                    <select
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                      value={formData.foodType}
                      onChange={(e) => setFormData({...formData, foodType: e.target.value})}
                    >
                      <option value="">Chọn loại món ăn</option>
                      <optgroup label="🍜 Nhóm món chính">
                        <option value="mon-com">Món cơm</option>
                        <option value="mon-bun">Món bún</option>
                        <option value="mon-pho">Món phở</option>
                        <option value="mon-mi-mien">Món mì – miến</option>
                        <option value="mon-chao">Món cháo</option>
                        <option value="mon-lau">Món lẩu</option>
                        <option value="mon-nuong">Món nướng</option>
                        <option value="mon-chien">Món chiên</option>
                        <option value="mon-xao">Món xào</option>
                        <option value="mon-hap">Món hấp</option>
                      </optgroup>
                      <optgroup label="🥩 Nhóm theo nguyên liệu">
                        <option value="mon-ga">Món gà</option>
                        <option value="mon-bo">Món bò</option>
                        <option value="mon-heo">Món heo</option>
                        <option value="mon-hai-san">Món hải sản</option>
                        <option value="mon-chay">Món chay</option>
                      </optgroup>
                      <optgroup label="🍲 Món ăn kèm & phụ">
                        <option value="mon-an-vat">Món ăn vặt</option>
                        <option value="mon-khai-vi">Món khai vị</option>
                        <option value="mon-an-kem">Món ăn kèm (rau, dưa chua, trứng…)</option>
                        <option value="canh-sup">Canh – súp</option>
                      </optgroup>
                      <optgroup label="🍰 Tráng miệng">
                        <option value="banh-ngot">Bánh ngọt</option>
                        <option value="che">Chè</option>
                        <option value="kem">Kem</option>
                        <option value="trai-cay">Trái cây</option>
                      </optgroup>
                      <optgroup label="🌏 Theo vùng / phong cách">
                        <option value="mon-viet">Món Việt</option>
                        <option value="mon-a">Món Á</option>
                        <option value="mon-au">Món Âu</option>
                        <option value="mon-han">Món Hàn</option>
                        <option value="mon-nhat">Món Nhật</option>
                        <option value="mon-thai">Món Thái</option>
                        <option value="fast-food">Fast Food</option>
                      </optgroup>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Loại đồ uống</label>
                    <select
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                      value={formData.drinkType}
                      onChange={(e) => setFormData({...formData, drinkType: e.target.value})}
                    >
                      <option value="">Chọn loại đồ uống</option>
                      <option value="nuoc-ngot">Nước ngọt</option>
                      <option value="tra-tra-sua">Trà – trà sữa</option>
                      <option value="ca-phe">Cà phê</option>
                      <option value="sinh-to-nuoc-ep">Sinh tố – nước ép</option>
                      <option value="bia-do-uong-co-con">Bia – đồ uống có cồn</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Stay Category Fields */}
              {formData.category === 'stay' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Loại hình lưu trú</label>
                  <select
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                    value={formData.stayType || ''}
                    onChange={(e) => setFormData({...formData, stayType: e.target.value})}
                  >
                    <option value="">Chọn loại hình lưu trú</option>
                    <optgroup label="🏨 Khách sạn (Hotel)">
                      <option value="khach-san-1-5-sao">Khách sạn 1–5 sao</option>
                      <option value="business-hotel">Business hotel</option>
                      <option value="boutique-hotel">Boutique hotel</option>
                    </optgroup>
                    <optgroup label="🏠 Nhà nghỉ – Motel">
                      <option value="nha-nghi-binh-dan">Nhà nghỉ bình dân</option>
                      <option value="motel-ven-duong">Motel ven đường</option>
                    </optgroup>
                    <optgroup label="🏡 Homestay">
                      <option value="o-chung-chu-nha">Ở chung với chủ nhà</option>
                      <option value="nha-nguyen-can">Nhà nguyên căn</option>
                      <option value="phu-hop-trai-nghiem">Phù hợp du lịch trải nghiệm</option>
                    </optgroup>
                    <optgroup label="🏖️ Resort">
                      <option value="khu-nghi-duong-cao-cap">Khu nghỉ dưỡng cao cấp</option>
                      <option value="co-ho-boi-spa-bien">Thường có hồ bơi, spa, biển</option>
                    </optgroup>
                    <optgroup label="🏢 Căn hộ dịch vụ (Serviced Apartment)">
                      <option value="o-dai-ngay">Ở dài ngày</option>
                      <option value="co-bep-phong-khach">Có bếp, phòng khách</option>
                    </optgroup>
                    <optgroup label="🛏️ Hostel">
                      <option value="phong-dorm">Phòng dorm</option>
                      <option value="gia-re">Giá rẻ</option>
                      <option value="phu-hop-backpacker">Phù hợp backpacker</option>
                    </optgroup>
                    <optgroup label="🏘️ Villa">
                      <option value="biet-thu-nghi-duong">Biệt thự nghỉ dưỡng</option>
                      <option value="di-nhom-gia-dinh">Đi nhóm, gia đình</option>
                    </optgroup>
                    <optgroup label="🌿 Farmstay / Eco-lodge">
                      <option value="gan-thien-nhien">Gần thiên nhiên</option>
                      <option value="trai-nghiem-sinh-thai">Trải nghiệm sinh thái</option>
                    </optgroup>
                  </select>
                </div>
              )}

              {/* Culture Category Fields */}
              {formData.category === 'culture' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Loại hình văn hóa</label>
                  <select
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                    value={formData.cultureType || ''}
                    onChange={(e) => setFormData({...formData, cultureType: e.target.value})}
                  >
                    <option value="">Chọn loại hình văn hóa</option>
                    <optgroup label="🏛️ Di tích – Lịch sử">
                      <option value="di-tich-lich-su">Di tích lịch sử</option>
                      <option value="den-chua-mieu">Đền, chùa, miếu</option>
                      <option value="lang-thanh-co">Lăng, thành cổ</option>
                      <option value="khu-tuong-niem">Khu tưởng niệm</option>
                    </optgroup>
                    <optgroup label="🏛️ Bảo tàng – Triển lãm">
                      <option value="bao-tang-lich-su">Bảo tàng lịch sử</option>
                      <option value="bao-tang-nghe-thuat">Bảo tàng nghệ thuật</option>
                      <option value="nha-trung-bay">Nhà trưng bày</option>
                      <option value="trien-lam-chuyen-de">Triển lãm chuyên đề</option>
                    </optgroup>
                    <optgroup label="🎭 Nghệ thuật – Biểu diễn">
                      <option value="nha-hat">Nhà hát</option>
                      <option value="san-khau-kich">Sân khấu kịch</option>
                      <option value="ca-mua-nhac-truyen-thong">Ca múa nhạc truyền thống</option>
                      <option value="mua-roi-nuoc">Múa rối nước</option>
                    </optgroup>
                    <optgroup label="🎪 Lễ hội – Sự kiện văn hóa">
                      <option value="le-hoi-truyen-thong">Lễ hội truyền thống</option>
                      <option value="hoi-lang">Hội làng</option>
                      <option value="festival-van-hoa">Festival văn hóa</option>
                      <option value="su-kien-nghe-thuat">Sự kiện nghệ thuật</option>
                    </optgroup>
                    <optgroup label="🏺 Làng nghề – Truyền thống">
                      <option value="lang-gom">Làng gốm</option>
                      <option value="lang-det">Làng dệt</option>
                      <option value="lang-moc">Làng mộc</option>
                      <option value="lang-tranh-dan-gian">Làng tranh dân gian</option>
                    </optgroup>
                    <optgroup label="⛪ Tôn giáo – Tín ngưỡng">
                      <option value="chua">Chùa</option>
                      <option value="nha-tho">Nhà thờ</option>
                      <option value="den-thanh">Đền thánh</option>
                      <option value="thanh-that">Thánh thất</option>
                    </optgroup>
                    <optgroup label="🏘️ Văn hóa dân gian">
                      <option value="pho-co">Phố cổ</option>
                      <option value="cho-truyen-thong">Chợ truyền thống</option>
                      <option value="khong-gian-van-hoa-cong-dong">Không gian văn hóa cộng đồng</option>
                      <option value="nha-co">Nhà cổ</option>
                    </optgroup>
                  </select>
                </div>
              )}

              {/* Interests - Always shown */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Sở thích phù hợp</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { id: 'adventure', label: 'Phiêu lưu' },
                    { id: 'culture', label: 'Văn hóa' },
                    { id: 'nature', label: 'Thiên nhiên' },
                    { id: 'food', label: 'Ẩm thực' },
                    { id: 'shopping', label: 'Mua sắm' }
                  ].map(interest => (
                    <label key={interest.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(interest.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              interests: [...formData.interests, interest.id]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              interests: formData.interests.filter(i => i !== interest.id)
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{interest.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
            <h3 className="flex items-center gap-2 font-black text-slate-800 mb-6 uppercase text-sm">
              <FileText size={20} className="text-orange-500" /> 4. Nội dung bài viết
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nội dung chính</label>
                <textarea
                  required
                  rows={8}
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 font-medium resize-none"
                  placeholder="Chia sẻ trải nghiệm, kinh nghiệm của bạn..."
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center gap-1">
                  <Tag size={14} /> Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:bg-orange-200 rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Thêm tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all"
                  >
                    Thêm
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-lg shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ĐANG TẢI...
                </>
              ) : (
                <>
                  <Save size={20} /> TẠO BÀI VIẾT
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddDiscovery;
