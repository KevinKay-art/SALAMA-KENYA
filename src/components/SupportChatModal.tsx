import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Shield, Lock, PhoneCall, CheckCircle2, User } from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface ChatMessage {
  id: string;
  sessionId: string;
  senderType: 'survivor' | 'counselor' | 'system';
  senderName: string;
  message: string;
  readStatus: boolean;
  createdAt: string;
}

interface SupportChatModalProps {
  lang: Language;
  onClose: () => void;
}

export const SupportChatModal: React.FC<SupportChatModalProps> = ({ lang, onClose }) => {
  const t = translations[lang];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [sessionId] = useState(() => {
    return 'survivor-' + Math.random().toString(36).substring(2, 8);
  });
  const [isLoading, setIsLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat/session-demo-survivor`);
      const data = await res.json();
      if (data.success && data.data) {
        setMessages(data.data);
      }
    } catch (err) {
      console.error('Error fetching chat:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const text = inputMsg.trim();
    setInputMsg('');

    // Optimistic UI
    const tempMsg: ChatMessage = {
      id: 'temp-' + Date.now(),
      sessionId: 'session-demo-survivor',
      senderType: 'survivor',
      senderName: 'You (Anonymous Survivor)',
      message: text,
      readStatus: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      await fetch(`/api/chat/session-demo-survivor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderType: 'survivor',
          senderName: 'Anonymous Survivor',
          message: text,
        }),
      });

      // Fetch updated with auto reply after 2 seconds
      setTimeout(() => {
        fetchMessages();
      }, 2000);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full h-[640px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-800 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h3 className="font-bold text-sm md:text-base">{t.chatTitle}</h3>
              <p className="text-[11px] text-emerald-200 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                {t.expectedResponseTime}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white font-bold text-sm bg-emerald-900/40 px-3 py-1.5 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Emergency Hotline reminder bar */}
        <div className="bg-rose-50 px-4 py-2 border-b border-rose-100 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-rose-800">
            ⚠️ In immediate danger? Call HAK 1195 Toll-Free
          </span>
          <a
            href="tel:1195"
            className="px-2.5 py-1 bg-rose-600 text-white font-bold rounded-lg text-xs"
          >
            Call 1195
          </a>
        </div>

        {/* Message body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-xs text-slate-400">
              Loading secure encrypted chat...
            </div>
          ) : (
            <>
              {messages.map((msg) => {
                const isSurvivor = msg.senderType === 'survivor';
                const isSystem = msg.senderType === 'system';

                if (isSystem) {
                  return (
                    <div key={msg.id} className="p-3 bg-emerald-100/60 text-emerald-900 rounded-xl text-xs text-center font-medium my-2 border border-emerald-200">
                      🔒 {msg.message}
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isSurvivor ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-slate-400 font-semibold mb-1 px-1">
                      {msg.senderName}
                    </span>
                    <div
                      className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                        isSurvivor
                          ? 'bg-emerald-700 text-white rounded-tr-none'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
                      }`}
                    >
                      {msg.message}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Chat input */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2 shrink-0">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder={t.typeMessagePlaceholder}
            className="flex-1 p-3 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <button
            type="submit"
            disabled={!inputMsg.trim()}
            className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
