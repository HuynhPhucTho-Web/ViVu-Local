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
    image: null
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
      await addDoc(collection(db, "discovery_posts"), {
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
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

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

          {/* Content */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
            <h3 className="flex items-center gap-2 font-black text-slate-800 mb-6 uppercase text-sm">
              <FileText size={20} className="text-orange-500" /> 3. Nội dung bài viết
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
