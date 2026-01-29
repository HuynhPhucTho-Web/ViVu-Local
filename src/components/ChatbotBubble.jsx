import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react';

const ChatbotBubble = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Xin chào! Mình là ViVuBot. Bạn cần hỏi về Tour, Địa điểm hay cách trở thành Local Buddy?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const scrollRef = useRef(null);

    // Cuộn xuống khi có tin nhắn mới
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = { text: input, isBot: false };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput('');
        setLoading(true);

        try {
            // SỬA LỖI Ở ĐÂY: Dùng import.meta.env cho Vite
            const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

            if (!API_KEY) {
                throw new Error("API Key không tồn tại. Kiểm tra lại file .env và khởi động lại server.");
            }

            const systemInstruction = `
            Bạn là ViVuBot, trợ lý ảo của dự án ViVuLocal. 
            Dữ liệu huấn luyện:
            - ViVuLocal kết nối khách với Local Buddy (người dẫn đường địa phương) và Partner (chủ khu du lịch).
            - Local Buddy: Người bản địa dẫn khách trải nghiệm văn hóa thực tế.
            - Partner: Chủ vườn trái cây, nhà hàng, homestay.
            - Cách đăng ký Buddy: Vào trang Profile hoặc mục "Trở thành Local Buddy".
            - Cách đăng ký Đối tác: Vào "Quản lý" -> "Đăng ký đối tác".
            - Quy trình: Gửi form -> Chờ Admin duyệt -> Hiển thị trên web.
            - Trả lời thân thiện, ngắn gọn, tiếng Việt. Nếu không rõ, bảo khách gọi hotline: 0123.456.789.
            `;

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: `${systemInstruction}\n\nNgười dùng hỏi: ${currentInput}` }]
                        }]
                    })
                }
            );

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }

            if (data.candidates && data.candidates[0].content.parts[0].text) {
                const botReply = data.candidates[0].content.parts[0].text;
                setMessages(prev => [...prev, { text: botReply, isBot: true }]);
            }

        } catch (error) {
            console.error("Lỗi Chatbot:", error);
            setMessages(prev => [...prev, { 
                text: "ViVuBot đang bảo trì hệ thống. Bạn vui lòng thử lại sau hoặc liên hệ Admin nhé!", 
                isBot: true 
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans">
            {/* Khung Chat */}
            {isOpen && (
                <div className="mb-4 w-[350px] h-[500px] bg-white rounded-[28px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <Bot size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm">ViVu Assistant</p>
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                    <p className="text-[10px] opacity-90">Sẵn sàng hỗ trợ</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-black/10 p-1 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Danh sách tin nhắn */}
                    <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50/50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                                    msg.isBot 
                                    ? 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none' 
                                    : 'bg-orange-500 text-white shadow-md rounded-tr-none'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                                    <Loader2 size={16} className="animate-spin text-orange-500" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Nhập thắc mắc của bạn..."
                            className="flex-grow outline-none text-sm p-2.5 bg-gray-100 rounded-xl focus:bg-white focus:ring-1 focus:ring-orange-300 transition-all"
                        />
                        <button 
                            disabled={loading}
                            onClick={handleSend}
                            className={`p-2.5 rounded-xl transition-all ${
                                loading ? 'bg-gray-100 text-gray-400' : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-100'
                            }`}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* Nút Bubble */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-all shadow-orange-200"
            >
                {isOpen ? <X size={28} /> : (
                    <div className="relative">
                        <MessageCircle size={30} fill="currentColor" />
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-orange-500 rounded-full"></span>
                    </div>
                )}
            </button>
        </div>
    );
};

export default ChatbotBubble;