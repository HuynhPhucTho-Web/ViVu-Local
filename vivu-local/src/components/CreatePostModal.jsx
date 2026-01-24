import { useState, useEffect, useRef } from 'react';
import {
  X,
  Image as ImageIcon,
  MapPin,
  Camera,
  Link as LinkIcon,
  Upload,
  RefreshCw
} from 'lucide-react';
import { destinations } from '../data/mockData';

const CreatePostModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [imageMode, setImageMode] = useState('upload');
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setLocation('');
    setImage('');
    setImageMode('upload');
    stopCamera();
  };

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setLocation(initialData.location || '');
      setImage(initialData.image || '');
      setImageMode(
        initialData.image?.startsWith('data:') ? 'upload' : 'url'
      );
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
      }
    } catch (err) {
      alert('Không thể truy cập camera');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    setImage(canvas.toDataURL('image/jpeg'));
    stopCamera();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, location, image });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {initialData ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input
            required
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Tiêu đề"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <select
              required
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Chọn địa điểm</option>
              {destinations.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
              <option value="Khác">Khác</option>
            </select>
          </div>

          <textarea
            required
            rows={3}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Nội dung"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* Image mode */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {[
              ['upload', Upload, 'Tải ảnh'],
              ['url', LinkIcon, 'Link'],
              ['camera', Camera, 'Camera']
            ].map(([mode, Icon, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setImageMode(mode);
                  mode === 'camera' ? startCamera() : stopCamera();
                }}
                className={`flex-1 py-2 rounded ${
                  imageMode === mode ? 'bg-white shadow' : ''
                }`}
              >
                <Icon className="inline h-4 w-4 mr-1" /> {label}
              </button>
            ))}
          </div>

          {/* Image input */}
          {imageMode === 'upload' && (
            <input type="file" accept="image/*" onChange={handleFileUpload} />
          )}

          {imageMode === 'url' && (
            <input
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          )}

          {imageMode === 'camera' && (
            <div>
              {isCameraOpen ? (
                <>
                  <video ref={videoRef} autoPlay className="w-full rounded" />
                  <button type="button" onClick={capturePhoto}>
                    Chụp ảnh
                  </button>
                </>
              ) : (
                <button type="button" onClick={startCamera}>
                  <RefreshCw /> Mở camera
                </button>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}

          {image && (
            <img src={image} alt="preview" className="rounded-lg" />
          )}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded">
              {initialData ? 'Lưu' : 'Đăng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
