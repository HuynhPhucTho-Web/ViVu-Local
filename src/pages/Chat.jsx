import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send, MoreVertical, Phone, Video } from 'lucide-react';
import { buddies } from '../data/mockData';

const Chat = () => {
  const { id } = useParams();
  const buddy = buddies.find(b => b.id === Number(id));
  const [messages, setMessages] = useState([
    { id: 1, sender: 'buddy', text: 'Xin chào! Mình có thể giúp gì cho bạn?', time: '10:00' }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  if (!buddy) return <div className="text-center py-20">Không tìm thấy cuộc trò chuyện</div>;

    const handleSend = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now(),
        sender: 'me',
        text: inputText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setInputText('');

      // Simulate reply
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'buddy',
          text: 'Cảm ơn bạn đã nhắn tin. Mình sẽ trả lời ngay nhé!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-100">
      {/* Chat Header */}
      <div className="bg-white px-4 py-3 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <Link to={`/buddy/${id}`} className="mr-3 text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="relative">
            <img src={buddy.image} alt={buddy.name} className="w-10 h-10 rounded-full object-cover" />
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${buddy.status === 'available' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
          <div className="ml-3">
            <h3 className="font-bold text-gray-900">{buddy.name}</h3>
            <p className="text-xs text-gray-500">
              {buddy.status === 'available' ? 'Đang hoạt động' : 'Đang bận'}
            </p>
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
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'buddy' && (
              <img src={buddy.image} alt={buddy.name} className="w-8 h-8 rounded-full object-cover mr-2 self-end mb-1" />
            )}
            <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${
              msg.sender === 'me' 
                ? 'bg-orange-500 text-white rounded-br-none' 
                : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
            }`}>
              <p>{msg.text}</p>
              <p className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-orange-100' : 'text-gray-400'}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-gray-200">
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:bg-white transition outline-none"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={!inputText.trim()}
            className="bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
