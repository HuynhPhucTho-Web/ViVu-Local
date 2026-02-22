import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../../components/firebase';
import { useAuthStore } from '../../store/authStore';
import { ArrowLeft, Send, Image, X, Loader2, MessageCircle, User, MessageSquare } from 'lucide-react';
import { uploadToCloudinary } from '../../data/cloudinary';

const BuddyMessages = ({ onBack }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [userInfoMap, setUserInfoMap] = useState({});
  const [selectedConversation, setSelectedConversation] = useState(null);
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

  // Lấy thông tin user từ users collection
  const fetchUserInfo = async (userId) => {
    if (userInfoMap[userId]) return userInfoMap[userId];

    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const info = {
          name: userData.name || 'Khách hàng',
          avatar: userData.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'U')}&background=random`
        };
        setUserInfoMap(prev => ({ ...prev, [userId]: info }));
        return info;
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
    return { name: 'Khách hàng', avatar: `https://ui-avatars.com/api/?name=U&background=random` };
  };

  // Lấy danh sách các cuộc trò chuyện - chỉ lấy tin nhắn gửi đến buddy
  useEffect(() => {
  if (!user?.uid) return;

  const fetchConversations = async () => {
    try {
      const messagesRef = collection(db, 'messages');
      
      // Lấy tất cả tin nhắn liên quan đến Buddy
      // Lưu ý: Query này lấy mọi tin nhắn, sau đó lọc lại ở Client 
      // để tìm những tin nhắn có user.uid nằm trong chatId
      const q = query(
        messagesRef,
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const conversationMap = new Map();

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          const chatId = data.chatId;

          // Kiểm tra xem chatId có chứa UID của Buddy hiện tại không
          if (chatId && chatId.includes(user.uid)) {
            // Tách ID để tìm ID của khách hàng (người đối diện)
            const ids = chatId.split('_');
            const otherUserId = ids[0] === user.uid ? ids[1] : ids[0];

            // Nếu chưa có trong Map (vì đã sort desc nên tin nhắn đầu tiên là mới nhất)
            if (!conversationMap.has(otherUserId)) {
              conversationMap.set(otherUserId, {
                oderId: otherUserId,
                lastMessage: data.text || (data.imageUrl ? '📷 Hình ảnh' : ''),
                lastMessageTime: data.createdAt,
              });
            }
          }
        });

        const convList = Array.from(conversationMap.values());

        // Tự động fetch thông tin Avatar/Tên cho những người mới
        for (const conv of convList) {
          await fetchUserInfo(conv.oderId);
        }

        setConversations(convList);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  fetchConversations();
}, [user?.uid]);

  // Lắng nghe tin nhắn của cuộc trò chuyện được chọn
  useEffect(() => {
    if (!user?.uid || !selectedConversation?.oderId) return;

    const oderId = selectedConversation.oderId;
    const chatId = getChatId(user.uid, oderId);

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
    });

    return () => unsubscribe();
  }, [user?.uid, selectedConversation?.oderId]);

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
    if (!user?.uid || !selectedConversation?.oderId) return;

    const oderId = selectedConversation.oderId;
    const hasText = inputText.trim();
    const hasImage = selectedImage;

    if (!hasText && !hasImage) return;

    setSending(true);

    const chatId = getChatId(user.uid, oderId);

    // Optimistic update
    const optimisticMessage = {
      id: Date.now().toString(),
      chatId,
      senderId: user.uid,
      receiverId: oderId,
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
        senderId: user.uid,
        receiverId: oderId,
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

  const handleSelectConversation = async (conv) => {
    setSelectedConversation(conv);
    await fetchUserInfo(conv.oderId);
  };

  const handleOpenChatPage = (userId) => {
    navigate(`/buddy-chat/${userId}`);
  };

  const formatTime = (msg) => {
    const timestamp = msg.createdAt;
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' });
  };

  // Nếu đang trong cuộc trò chuyện
  if (selectedConversation) {
    const userInfo = userInfoMap[selectedConversation.oderId] || { name: 'Khách hàng', avatar: '' };

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-[calc(100vh-280px)] flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center justify-between bg-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedConversation(null)}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
            >
              <ArrowLeft size={20} />
            </button>
            <img
              src={userInfo.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name)}&background=random`}
              alt={userInfo.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-bold text-gray-900">{userInfo.name}</h3>
              <p className="text-xs text-gray-500">ID: {selectedConversation.oderId.slice(0, 8)}...</p>
            </div>
          </div>
          <button
            onClick={() => handleOpenChatPage(selectedConversation.oderId)}
            className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
            title="Mở trang chat"
          >
            <MessageSquare size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}>
              {msg.senderId !== user?.uid && (
                <img
                  src={userInfo.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name)}&background=random`}
                  alt={userInfo.name}
                  className="w-8 h-8 rounded-full object-cover mr-2 self-end mb-1"
                />
              )}
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl ${msg.senderId === user?.uid
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
                <p className={`text-[10px] mt-1 text-right ${msg.senderId === user?.uid ? 'text-orange-100' : 'text-gray-400'}`}>
                  {formatTime(msg)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="bg-gray-50 px-4 pb-2 flex items-center gap-2">
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

        {/* Input */}
        <div className="p-4 border-t bg-white rounded-b-2xl">
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

  // Danh sách cuộc trò chuyện
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-[calc(100vh-280px)] flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-bold text-lg text-gray-900">Tin nhắn</h2>
        <p className="text-sm text-gray-500">Quản lý tin nhắn từ khách hàng</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin text-orange-500 h-8 w-8" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
            <MessageCircle className="h-12 w-12 mb-2" />
            <p className="text-center">Chưa có tin nhắn nào</p>
            <p className="text-xs text-center mt-1">Tin nhắn từ khách hàng sẽ hiện ở đây</p>
          </div>
        ) : (
          conversations.map((conv) => {
            const userInfo = userInfoMap[conv.oderId] || { name: 'Khách hàng', avatar: '' };
            return (
              <div
                key={conv.oderId}
                className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 border-b border-gray-50 transition cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={userInfo.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name)}&background=random`}
                    alt={userInfo.name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                </div>
                <div
                  className="flex-1 min-w-0"
                  onClick={() => handleSelectConversation(conv)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 truncate">{userInfo.name}</h3>
                    <span className="text-xs text-gray-400">
                      {conv.lastMessageTime ? formatDate(conv.lastMessageTime) : ''}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{conv.lastMessage || 'Chưa có tin nhắn'}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenChatPage(conv.oderId);
                  }}
                  className="p-2 text-orange-500 hover:bg-orange-50 rounded-full transition"
                  title="Mở trang chat"
                >
                  <MessageSquare size={18} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BuddyMessages;
