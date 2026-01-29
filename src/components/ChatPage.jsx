import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, ChevronLeft, Phone } from "lucide-react";

const ChatPage = () => {
    const { buddyId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const scrollRef = useRef();

    // Giả lập tin nhắn chào mừng từ Buddy
    useEffect(() => {
        setMessages([
            { id: 1, text: "Chào bạn! Rất vui được hỗ trợ bạn. Bạn dự định đi tour vào ngày nào nhỉ?", isMe: false }
        ]);
    }, [buddyId]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setMessages([...messages, { id: Date.now(), text: input, isMe: true }]);
        setInput("");
    };

    return (
        <div className="h-screen flex flex-col bg-white">
            {/* Chat Header */}
            <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded-full">
                        <ChevronLeft />
                    </button>
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center font-bold text-orange-600">
                        B
                    </div>
                    <div>
                        <h2 className="font-bold text-sm">Buddy #{buddyId.slice(0, 5)}</h2>
                        <p className="text-[10px] text-green-500">Đang hoạt động</p>
                    </div>
                </div>
                <button className="p-2 text-gray-400"><Phone size={20} /></button>
            </div>

            {/* Message List */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${msg.isMe ? "bg-orange-500 text-white rounded-tr-none" : "bg-white text-gray-700 border shadow-sm rounded-tl-none"
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={sendMessage} className="p-4 border-t bg-white flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-grow p-3 bg-gray-100 rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 transition-all"
                />
                <button type="submit" className="bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600">
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default ChatPage;