import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
<<<<<<< HEAD
import { Send, History, Zap, Info } from 'lucide-react';
=======
import { Send, History } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
>>>>>>> d2bc173 (feat: markdown added)
import LiquidGlassCard from './LiquidGlassCard';

interface Message {
  role: 'user' | 'ai';
  content: string;
  timestamp?: string;
}

const SarthiInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  
  const sessionId = "session124"; 
  const API_BASE_URL = "https://synapse-technex.onrender.com";
  const WS_BASE_URL = "wss://synapse-technex.onrender.com";

<<<<<<< HEAD
  // 1. Fetch Message History via Fetch API
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/message-list/${sessionId}`);
        if (!response.ok) throw new Error('Failed to fetch history');
        const data = await response.json();
        const history = data.map((msg: any) => ({
          role: msg.role === 'model' ? 'ai' : 'user', // mapping DB roles to UI roles
=======
  // 1. Fetch Message History and Map to UI Roles
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/message-list/${sessionId}`);
        // Mapping: 'model' -> 'ai', 'user' -> 'user'
        const history = response.data.map((msg: any) => ({
          role: msg.role === 'model' ? 'ai' : 'user', 
>>>>>>> d2bc173 (feat: markdown added)
          content: msg.content,
          timestamp: "Verified" // You can parse msg.id or add a timestamp field if available
        }));
        
        setMessages(history.length > 0 ? history : [
          { role: 'ai', content: "Namaste, Sir. Connection established.", timestamp: "Now" }
        ]);
      } catch (error) {
        console.error("Failed to load history:", error);
      }
    };
    fetchHistory();
  }, []);

  // 2. Setup WebSocket
  useEffect(() => {
    const socket = new WebSocket(`${WS_BASE_URL}/chat/${sessionId}`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: event.data, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
      setIsTyping(false);
    };

    return () => socket.close();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !socketRef.current) return;

    const userMessage = inputValue;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: now }]);
    setInputValue('');
    setIsTyping(true);

    socketRef.current.send(userMessage);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 h-[calc(100vh-200px)] font-sans">
      {/* Sidebar */}
      <div className="lg:col-span-3 hidden lg:block overflow-y-auto no-scrollbar">
        <LiquidGlassCard className="p-8 h-full space-y-10">
          <div>
            <h3 className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
              <History size={16} /> History Slats
            </h3>
            <div className="space-y-4">
              {['Active Debt Analysis', 'Strategy_Vault_01'].map((item, i) => (
                <button key={i} className="w-full text-left p-5 neumorphic-pressed rounded-[24px] text-[11px] text-[var(--text-dim)] font-black uppercase tracking-widest hover:text-[var(--text)] transition-all">
                  {item}
                </button>
              ))}
            </div>
          </div>
        </LiquidGlassCard>
      </div>

      {/* Main Chat Area */}
      <div className="lg:col-span-9 flex flex-col neumorphic-flat rounded-[48px] border border-[var(--border)] overflow-hidden">
        {/* Header */}
        <div className="px-10 py-8 border-b border-[var(--border)] flex items-center justify-between backdrop-blur-3xl bg-[var(--bg)]/40">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-full glass border border-[var(--border)] p-1 relative">
               <div className="w-full h-full rounded-full bg-[var(--text)] opacity-80" />
               <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 border-4 border-[var(--bg)] rounded-full" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter uppercase text-[var(--text)]">SARTHI CORE</h2>
              <span className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-widest">Active Intelligence Layer</span>
            </div>
          </div>
        </div>

        {/* Messages with Markdown */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-12 no-scrollbar scroll-smooth">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex flex-col gap-3 max-w-[80%]">
                <div className={`relative p-8 rounded-[40px] ${
                  msg.role === 'user' 
                    ? 'neumorphic-pressed rounded-br-none' 
                    : 'glass bg-[var(--text)]/[0.04] border border-[var(--border)] rounded-bl-none shadow-2xl'
                }`}>
                  {msg.role === 'ai' ? (
                    <div className="markdown-container text-base leading-relaxed text-[var(--text)]">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <p className="mb-4 last:mb-0 font-black uppercase tracking-tight">{children}</p>,
                          strong: ({ children }) => <strong className="font-black text-[var(--text)]">{children}</strong>,
                          ul: ({ children }) => <ul className="list-disc ml-5 mb-4 space-y-2">{children}</ul>,
                          li: ({ children }) => <li className="font-black uppercase tracking-tight text-sm">{children}</li>
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-base leading-relaxed text-[var(--text-muted)] font-black uppercase tracking-tight">
                      {msg.content}
                    </p>
                  )}
                </div>
                <span className="text-[9px] font-black text-[var(--text-dim)] uppercase tracking-[0.3em] px-4">
                  {msg.timestamp} • {msg.role === 'ai' ? 'CORE_SIG' : 'USER_AUTH'}
                </span>
              </div>
            </motion.div>
          ))}
          {isTyping && <div className="text-[10px] animate-pulse uppercase font-black text-[var(--text-dim)] ml-4">Sarthi is analyzing...</div>}
        </div>

        {/* Input Zone */}
        <div className="p-10 bg-[var(--bg)]/60 border-t border-[var(--border)]">
           <div className="relative neumorphic-pressed rounded-full flex items-center p-2 transition-all">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Submit Strategy Command..."
                className="flex-1 bg-transparent py-6 px-10 outline-none text-lg text-[var(--text)] font-black uppercase tracking-widest placeholder:opacity-20"
              />
              <button 
                onClick={handleSendMessage}
                className="w-16 h-16 rounded-full flex items-center justify-center bg-[var(--text)] text-[var(--bg)] hover:scale-95 transition-transform"
              >
                <Send size={28} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SarthiInterface;