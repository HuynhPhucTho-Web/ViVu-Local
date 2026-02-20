import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Send, MoreVertical, Phone, Video, Image, X, Loader2, MessageCircle } from 'lucide-react';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  or,
  where
} from 'firebase/firestore';
import { db } from '../components/firebase';
import { uploadToCloudinary } from '../data/cloudinary';
import { useAuthStore } from '../store/authStore';

const Chat = () => {
  const { id: buddyId } = useParams();
  const location = useLocation();
  const { user } = useAuthStore();
  
  // Lấy thông tin buddy từ state hoặc tìm trong dữ liệu mock
  const buddyName = location.state?.buddyName || 'Buddy';
  const buddyAvatar = location.state?.buddyAvatar || 'https://ui-avatars.com/api/?name=B&background=random';
  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [inputText, setInputText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Load messages từ Firestore
  useEffect(() => {
    if (!user?.uid || !buddyId) return;

    // Query đơn giản: lấy tin nhắn theo thời gian
    // Lọc phía client để hiển thị tin nhắn giữa 2 người
    const q = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Lọc phía client: chỉ hiển thị tin nhắn giữa user và buddy
        if (
          (data.senderId === user.uid && data.receiverId === buddyId) ||
          (data.senderId === buddyId && data.receiverId === user.uid)
        ) {
          loadedMessages.push({ id: doc.id, ...data });
        }
      });
      setMessages(loadedMessages);
      setLoading(false);
    }, (error) => {
      console.error("Lỗi tải tin nhắn:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid, buddyId]);

  // Xử lý chọn ảnh
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Tạo preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Xóa ảnh đã chọn
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Gửi tin nhắn
  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!user?.uid) {
      alert('Vui lòng đăng nhập để chat!');
      return;
    }

    const hasText = inputText.trim();
    const hasImage = selectedImage;

    if (!hasText && !hasImage) return;

    setSending(true);

    try {
      let imageUrl = null;

      // Nếu có ảnh, upload lên Cloudinary trước
      if (hasImage) {
        try {
          const result = await uploadToCloudinary(selectedImage, 'image');
          imageUrl = result.secure_url;
        } catch (uploadError) {
          console.error("Lỗi upload ảnh:", uploadError);
          alert('Lỗi upload ảnh. Vui lòng thử lại!');
          setSending(false);
          return;
        }
      }

      // Lưu tin nhắn vào Firestore
      const messageData = {
        senderId: user.uid,
        receiverId: buddyId,
        text: inputText.trim() || '',
        imageUrl: imageUrl || null,
        createdAt: serverTimestamp(),
        type: imageUrl ? 'image' : 'text'
      };

      await addDoc(collection(db, 'messages'), messageData);

      // Reset form
      setInputText('');
      handleRemoveImage();

    } catch (error) {
      console.error("Lỗi gửi tin nhắn:", error);
      alert('Lỗi gửi tin nhắn. Vui lòng thử lại!');
    } finally {
      setSending(false);
    }
  };

  // Format thời gian
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Hiển thị tin nhắn đầu tiên khi chưa có tin nhắn
  if (!loading && messages.length === 0) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-100">
        {/* Chat Header */}
        <div className="bg-white px-4 py-3 shadow-sm flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center">
            <Link to={`/buddy/${buddyId}`} className="mr-3 text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="relative">
              <img src={buddyAvatar} alt={buddyName} className="w-10 h-10 rounded-full object-cover" />
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-500"></div>
            </div>
            <div className="ml-3">
              <h3 className="font-bold text-gray-900">{buddyName}</h3>
              <p className="text-xs text-gray-500">Đang hoạt động</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-orange-500">
            <button><Phone className="h-5 w-5" /></button>
            <button><Video className="h-5 w-5" /></button>
            <button><MoreVertical className="h-5 w-5 text-gray-500" /></button>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
              <MessageCircle className="h-10 w-10 text-orange-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Bắt đầu cuộc trò chuyện</h3>
            <p className="text-gray-500 text-sm">Gửi tin nhắn cho {buddyName} để được hỗ trợ!</p>
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white p-4 border-t border-gray-200">
          <form onSubmit={handleSend} className="flex items-end space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-full text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition"
            >
              <Image className="h-5 w-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:bg-white transition outline-none"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={sending}
            />
            <button 
              type="submit" 
              disabled={sending || (!inputText.trim() && !selectedImage)}
              className="bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
            >
              {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-100">
      {/* Chat Header */}
      <div className="bg-white px-4 py-3 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <Link to={`/buddy/${buddyId}`} className="mr-3 text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="relative">
            <img src={buddyAvatar} alt={buddyName} className="w-10 h-10 rounded-full object-cover" />
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-500"></div>
          </div>
          <div className="ml-3">
            <h3 className="font-bold text-gray-900">{buddyName}</h3>
            <p className="text-xs text-gray-500">Đang hoạt động</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-orange-500">
          <button><Phone className="h-5 w-5" /></button>
          <button><Video className="h-5 w-5" /></button>
          <button><MoreVertical className="h-5 w-5 text-gray-500" /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin text-orange-500 h-8 w-8" />
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}>
              {msg.senderId !== user?.uid && (
                <img src={buddyAvatar} alt={buddyName} className="w-8 h-8 rounded-full object-cover mr-2 self-end mb-1" />
              )}
              <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                msg.senderId === user?.uid 
                  ? 'bg-orange-500 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
              }`}>
                {/* Nếu có ảnh */}
                {msg.imageUrl && (
                  <img 
                    src={msg.imageUrl} 
                    alt="Hình ảnh" 
                    className="rounded-lg mb-2 max-w-[200px] max-h-[200px] object-cover"
                  />
                )}
                {/* Nếu có text */}
                {msg.text && <p>{msg.text}</p>}
                <p className={`text-[10px] mt-1 text-right ${msg.senderId === user?.uid ? 'text-orange-100' : 'text-gray-400'}`}>
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="bg-white px-4 pb-2 flex items-center gap-2">
          <div className="relative">
            <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-lg" />
            <button
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <span className="text-xs text-gray-500">Ảnh sẽ được gửi khi bạn nhấn nút gửi</span>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-gray-200">
        <form onSubmit={handleSend} className="flex items-end space-x-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 rounded-full text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition"
          >
            <Image className="h-5 w-5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:bg-white transition outline-none"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={sending}
          />
          <button 
            type="submit" 
            disabled={sending || (!inputText.trim() && !selectedImage)}
            className="bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
          >
            {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
