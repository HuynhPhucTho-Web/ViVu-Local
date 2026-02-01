import { useState, useEffect } from 'react';
import { X, Upload, Loader2, MapPin, ImageIcon } from 'lucide-react';
import { uploadToCloudinary } from '../data/cloudinary';
import { destinations } from '../data/mockData';

const CreatePostModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({ title: '', content: '', location: '', images: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        images: initialData.images || (initialData.image ? [initialData.image] : [])
      });
    } else {
      setFormData({ title: '', content: '', location: '', images: [] });
    }
  }, [initialData, isOpen]);



  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoading(true);
    try {
      const uploadPromises = files.map(file => uploadToCloudinary(file));
      const results = await Promise.all(uploadPromises);
      const newImageUrls = results.map(result => result.secure_url);

      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newImageUrls]
      }));
    } catch (err) {
      alert("Lỗi tải ảnh!");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      alert("Lỗi khi đăng bài!");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Container chính: Cố định chiều cao tối đa */}
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Fixed Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-white shrink-0">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content: Phần này sẽ cuộn nếu quá dài */}
        <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
          <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
            
            {/* Tiêu đề */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Tiêu đề</label>
              <input 
                required 
                className="w-full border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none border transition-all" 
                placeholder="Tiêu đề ấn tượng..." 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
              />
            </div>

            {/* Địa điểm */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Địa điểm</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <select 
                  required 
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none appearance-none bg-white" 
                  value={formData.location} 
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                >
                  <option value="">Chọn địa danh...</option>
                  {destinations.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  <option value="Khác">Vị trí khác</option>
                </select>
              </div>
            </div>

            {/* Nội dung */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nội dung</label>
              <textarea 
                required 
                rows={3} 
                className="w-full border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none border resize-none" 
                placeholder="Chia sẻ câu chuyện của bạn..." 
                value={formData.content} 
                onChange={(e) => setFormData({...formData, content: e.target.value})} 
              />
            </div>

            {/* Media Upload Area: Hỗ trợ nhiều ảnh */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Hình ảnh chuyến đi</label>

              {/* Hiển thị ảnh đã chọn */}
              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {formData.images.map((imageUrl, index) => (
                    <div key={index} className="relative rounded-xl overflow-hidden border border-gray-100 shadow-inner group bg-gray-100">
                      <img src={imageUrl} className="w-full h-24 object-cover" alt={`preview-${index}`} />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="bg-red-500 text-white p-1.5 rounded-full hover:scale-110 transition-transform shadow-lg"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload area */}
              <label className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-orange-50 hover:border-orange-200 transition-all cursor-pointer group">
                {loading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="animate-spin text-orange-500 mb-2" />
                    <span className="text-xs text-gray-500 font-medium">Đang tải ảnh lên...</span>
                  </div>
                ) : (
                  <>
                    <div className="bg-orange-100 p-3 rounded-full text-orange-600 mb-2 group-hover:scale-110 transition-transform">
                      <Upload size={24} />
                    </div>
                    <span className="text-sm font-semibold text-gray-600">Thêm hình ảnh</span>
                    <span className="text-[10px] text-gray-400 mt-1">Có thể chọn nhiều ảnh (JPG, PNG, WEBP)</span>
                  </>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  disabled={loading}
                />
              </label>
            </div>
          </div>

          {/* Fixed Footer: Nút bấm luôn nằm ở đây */}
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 shrink-0">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-all"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              disabled={loading || !formData.title || !formData.content} 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-100 transition-all active:scale-95 disabled:opacity-50 disabled:bg-gray-300 disabled:shadow-none"
            >
              {loading ? 'Đang xử lý...' : (initialData ? 'Lưu thay đổi' : 'Đăng bài ngay')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;