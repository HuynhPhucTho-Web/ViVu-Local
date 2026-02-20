import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react';
import { vivuKnowledgeBase } from "../data/vivuDataAI";

const ChatbotBubble = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Xin chào! Mình là ViVuBot. Mình có thể giúp gì cho bạn về tour và địa điểm du lịch?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    
    const preferredModels = [
        "llama-3.3-70b-versatile",  
        "llama-3.1-8b-instant",     
        "mixtral-8x7b-32768",      
        "gemma2-9b-it",             
    ];

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userContent = input.trim();
        setMessages(prev => [...prev, { text: userContent, isBot: false }]);
        setInput('');
        setLoading(true);

        let success = false;
        let errorMessage = "";

        const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

        for (const modelName of preferredModels) {
            if (success) break;

            try {
                const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${API_KEY}`
                    },
                    body: JSON.stringify({
                        model: modelName,
                        messages: [
                            {
                                role: "system",
                                content: vivuKnowledgeBase
                            },
                            {
                                role: "user",
                                content: userContent
                            }
                        ],
                        temperature: 0.7,
                        max_tokens: 800,
                    })
                });

                const data = await response.json();

                if (response.ok && data.choices?.[0]?.message?.content) {
                    const botReply = data.choices[0].message.content;
                    setMessages(prev => [...prev, { text: botReply, isBot: true }]);
                    success = true;
                } else if (data.error?.message?.includes("rate_limit")) {
                    console.warn(`Model ${modelName} bị giới hạn, thử model khác...`);
                    errorMessage = "Hệ thống đang bận, đang chuyển sang model dự phòng...";
                } else {
                    errorMessage = data.error?.message || "Lỗi hệ thống";
                }
            } catch (error) {
                console.error(`Lỗi với ${modelName}:`, error);
                errorMessage = "Kết nối bị gián đoạn.";
            }
        }

        if (!success) {
            setMessages(prev => [...prev, { text: errorMessage, isBot: true }]);
        }
        setLoading(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans">
            {isOpen && (
                <div className="mb-4 w-[350px] h-[500px] bg-white rounded-[28px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 transform origin-bottom-right">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white flex justify-between items-center shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <Bot size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm">ViVu Assistant</p>
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                    <p className="text-[10px] opacity-90">Đang trực tuyến</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-black/10 p-1 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50/50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.isBot ? 'bg-white text-gray-700 border border-gray-100 rounded-tl-none' : 'bg-orange-500 text-white rounded-tr-none'
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

                    <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Hỏi ViVuBot..."
                            className="flex-grow outline-none text-sm p-2.5 bg-gray-100 rounded-xl focus:bg-white focus:ring-1 focus:ring-orange-300 transition-all"
                        />
                        <button
                            disabled={loading}
                            onClick={handleSend}
                            className={`p-2.5 rounded-xl transition-all ${loading ? 'bg-gray-100 text-gray-400' : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md'}`}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-all"
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