import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Image, X, Loader2, User } from 'lucide-react';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
  getDoc,
  doc
} from 'firebase/firestore';
import { db } from '../components/firebase';
import { uploadToCloudinary } from '../data/cloudinary';
import { useAuthStore } from '../store/authStore';

const BuddyChat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: buddy } = useAuthStore();

  const [userInfo, setUserInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [inputText, setInputText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getChatId = (uid1, uid2) => {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
  };

  // Lấy thông tin user
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userId) return;
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserInfo({
            name: userData.name || 'Khách hàng',
            avatar: userData.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'U')}&background=random`
          });
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, [userId]);

  // Lắng nghe tin nhắn
  useEffect(() => {
    if (!buddy?.uid || !userId) return;

    const chatId = getChatId(buddy.uid, userId);

    const q = query(
      collection(db, 'messages'),
      where('chatId', '==', chatId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(loaded);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [buddy?.uid, userId]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!buddy?.uid || !userId) return;

    const hasText = inputText.trim();
    const hasImage = selectedImage;
    if (!hasText && !hasImage) return;

    setSending(true);

    const chatId = getChatId(buddy.uid, userId);

    const optimisticMessage = {
      id: Date.now().toString(),
      chatId,
      senderId: buddy.uid,
      receiverId: userId,
      text: hasText || '',
      imageUrl: null,
      createdAt: new Date(),
      type: hasImage ? 'image' : 'text',
      pending: true
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setInputText('');
    handleRemoveImage();

    try {
      let imageUrl = null;

      if (hasImage) {
        const result = await uploadToCloudinary(selectedImage, 'image');
        imageUrl = result.secure_url;
      }

      await addDoc(collection(db, 'messages'), {
        chatId,
        senderId: buddy.uid,
        receiverId: userId,
        text: hasText || '',
        imageUrl: imageUrl,
        createdAt: serverTimestamp(),
        type: imageUrl ? 'image' : 'text'
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (msg) => {
    const timestamp = msg.createdAt;
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-100">
      <div className="bg-white px-4 py-3 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-3 text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="relative">
            <img 
              src={userInfo?.avatar || `https://ui-avatars.com/api/?name=U&background=random`} 
              alt={userInfo?.name || 'User'} 
              className="w-10 h-10 rounded-full object-cover" 
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-500"></div>
          </div>
          <div className="ml-3">
            <h3 className="font-bold text-gray-900">{userInfo?.name || 'Khách hàng'}</h3>
            <p className="text-xs text-gray-500">Đang hoạt động</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin text-orange-500 h-8 w-8" />
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.senderId === buddy?.uid ? 'justify-end' : 'justify-start'}`}>
              {msg.senderId !== buddy?.uid && (
                <img 
                  src={userInfo?.avatar || `https://ui-avatars.com/api/?name=U&background=random`} 
                  alt={userInfo?.name || 'User'} 
                  className="w-8 h-8 rounded-full object-cover mr-2 self-end mb-1" 
                />
              )}
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                  msg.senderId === buddy?.uid
                    ? 'bg-orange-500 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="img"
                    className="rounded-lg mb-2 max-w-[200px] max-h-[200px] object-cover"
                  />
                )}
                {msg.text && <p>{msg.text}</p>}
                <p className={`text-[10px] mt-1 text-right ${msg.senderId === buddy?.uid ? 'text-orange-100' : 'text-gray-400'}`}>
                  {formatTime(msg)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

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
        </div>
      )}

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

export default BuddyChat;
