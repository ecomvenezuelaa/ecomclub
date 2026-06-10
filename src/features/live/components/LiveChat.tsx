import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { useApiFetch } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";

interface ChatMessage {
  id: string;
  live_id: string;
  user_id: string;
  content: string;
  created_at: string;
  author_name: string;
  author_avatar?: string | null;
  author_role: string;
}

interface LiveChatProps {
  liveId: string;
}

export default function LiveChat({ liveId }: LiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const api = useApiFetch();
  const { user } = useAuth();

  const fetchMessages = async () => {
    try {
      const { data } = await api<ChatMessage[]>(`/api/lives/${liveId}/chat?limit=100`);
      setMessages(data);
    } catch (err) {
      console.error("[LiveChat] Error fetching messages:", err);
    }
  };

  // Polling every 3 seconds
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [liveId]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || isSending) return;
    setIsSending(true);
    const content = newMessage.trim();
    setNewMessage("");

    // Optimistic UI update
    const optimisticMsg: ChatMessage = {
      id: "temp-" + Date.now(),
      live_id: liveId,
      user_id: user?.id || "",
      content,
      created_at: new Date().toISOString(),
      author_name: user?.name || "Usuario",
      author_avatar: user?.avatar,
      author_role: user?.role || "member"
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const { data: realMsg } = await api<ChatMessage>(`/api/lives/${liveId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      setMessages((prev) => prev.map(m => m.id === optimisticMsg.id ? realMsg : m));
    } catch (err) {
      console.error("[LiveChat] Error sending message:", err);
      // Remove optimistic if failed
      setMessages((prev) => prev.filter(m => m.id !== optimisticMsg.id));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] lg:h-full bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 shrink-0">
        <h3 className="font-black text-slate-900 text-sm">Chat en vivo</h3>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {messages.length === 0 ? (
          <p className="text-center text-xs font-bold text-slate-400 mt-10">
            No hay mensajes aún. ¡Sé el primero en saludar!
          </p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex gap-3">
              {msg.author_avatar ? (
                <img src={msg.author_avatar} alt={msg.author_name} className="w-8 h-8 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                  {msg.author_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="font-bold text-slate-900 text-xs">{msg.author_name}</span>
                  {msg.author_role === "admin" || msg.author_role === "superadmin" ? (
                    <span className="bg-indigo-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Admin
                    </span>
                  ) : null}
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-slate-600 break-words mt-0.5">{msg.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-slate-100 shrink-0">
        <div className="flex items-center gap-2 bg-slate-50 rounded-2xl p-1.5 pr-2 focus-within:ring-2 focus-within:ring-violet-200 transition-shadow">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-3 outline-none"
            maxLength={500}
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || isSending}
            className="p-2 rounded-xl bg-[#ae3df7] text-white hover:bg-[#921be2] disabled:opacity-50 disabled:grayscale transition-colors shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
