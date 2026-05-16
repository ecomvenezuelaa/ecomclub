import React, { useState } from "react";
import { MessageSquare, Heart, Share2, MoreHorizontal, Lightbulb, Send } from "lucide-react";
import { Post } from "../../types";
import { motion } from "motion/react";

interface PostFeedProps {
  posts: Post[];
  onCreatePost: (content: string) => void;
}

export default function PostFeed({ posts, onCreatePost }: PostFeedProps) {
  const [newPost, setNewPost] = useState("");

  const handleSubmit = () => {
    if (newPost.trim()) {
      onCreatePost(newPost);
      setNewPost("");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Hero Welcome Bento Cell */}
      <div className="lg:col-span-8 bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="max-w-md">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">¡Hola de nuevo, Sarah!</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            Tienes <span className="text-indigo-600 font-bold">5 mensajes nuevos</span> en el muro y una lección pendiente en Arquitectura.
          </p>
        </div>
        <div className="hidden sm:flex -space-x-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 shadow-sm overflow-hidden">
               <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
            </div>
          ))}
          <div className="w-12 h-12 rounded-full border-4 border-white bg-indigo-600 text-[10px] flex items-center justify-center font-bold text-white shadow-sm">+12</div>
        </div>
      </div>

      {/* Progress Sync Cell */}
      <div className="lg:col-span-4 bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-100 flex flex-col justify-between min-h-[160px] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
        <div className="relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest opacity-80">Progreso Mensual</span>
          <p className="text-4xl font-black mt-2">84%</p>
        </div>
        <div className="relative z-10">
          <div className="w-full bg-indigo-400/30 h-2.5 rounded-full mt-4">
            <div className="bg-white h-2.5 rounded-full shadow-sm" style={{ width: "84%" }}></div>
          </div>
          <p className="text-xs font-semibold mt-3 text-indigo-100 tracking-wide">¡Casi alcanzas tu meta! 🏆</p>
        </div>
      </div>

      {/* Main Feed Feed Bento Cells */}
      <div className="lg:col-span-8 space-y-6">
        {/* Create Post Cell */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col group focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          <div className="p-6 flex items-center space-x-4 border-b border-slate-50">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shadow-inner">S</div>
            <input 
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              type="text" 
              placeholder="Comparte algo con la comunidad..." 
              className="bg-slate-50 border-none rounded-2xl flex-1 px-6 py-3 text-sm font-medium focus:ring-0 placeholder:text-slate-400"
            />
            <button 
              onClick={handleSubmit}
              disabled={!newPost.trim()}
              className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale transition-all"
            >
              <Send size={20} />
            </button>
          </div>
        </div>

        {/* Post Items */}
        {posts.map((post, idx) => (
          <motion.article 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            key={post.id} 
            className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md group-hover:rotate-3 transition-transform">
                  <img src={post.avatar} alt={post.author} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{post.author}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{post.role} • {post.timestamp}</p>
                </div>
              </div>
              <button className="text-slate-300 hover:text-slate-900 transition-colors">
                <MoreHorizontal size={24} />
              </button>
            </div>

            <p className="text-slate-600 leading-relaxed font-medium mb-6">{post.content}</p>

            {post.tip && (
              <div className="bg-indigo-50/50 rounded-3xl p-6 border border-indigo-100 flex items-start gap-4 mb-6">
                <div className="bg-white p-3 rounded-2xl shadow-sm text-indigo-600 border border-indigo-50">
                  <Lightbulb size={24} />
                </div>
                <div>
                  <h5 className="font-bold text-indigo-900">{post.tip.title}</h5>
                  <p className="text-sm text-indigo-700/80 mt-1 font-medium leading-relaxed">{post.tip.content}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-8 pt-6 border-t border-slate-50">
              <button className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-all font-bold text-sm">
                <Heart size={20} className="group-active:scale-125 transition-transform" />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all font-bold text-sm">
                <MessageSquare size={20} />
                <span>{post.comments}</span>
              </button>
              <button className="ml-auto p-2 bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all">
                <Share2 size={18} />
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Sidebar Bento Cells */}
      <aside className="lg:col-span-4 space-y-6">
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col min-h-[300px]">
          <h3 className="font-bold text-xl mb-6 text-slate-900 flex items-center justify-between">
            Miembros Online
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
          </h3>
          <div className="space-y-5 flex-1">
            {[
              { name: "Elena Rivas", avatar: "https://i.pravatar.cc/100?u=a", status: "online" },
              { name: "Carlos V.", avatar: "https://i.pravatar.cc/100?u=b", status: "online" },
              { name: "Lucía Mendes", avatar: "https://i.pravatar.cc/100?u=c", status: "away" },
            ].map((member) => (
              <div key={member.name} className="flex items-center space-x-4 group cursor-pointer">
                <div className="relative">
                  <img src={member.avatar} className="w-11 h-11 rounded-2xl shadow-sm grayscale group-hover:grayscale-0 transition-all" alt="avatar" />
                  <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-4 border-white rounded-full ${member.status === 'online' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                </div>
                <span className={`text-sm font-bold ${member.status === 'online' ? 'text-slate-700' : 'text-slate-400'}`}>{member.name}</span>
              </div>
            ))}
          </div>
          <button className="w-full py-4 mt-6 text-indigo-600 text-sm font-black border-2 border-indigo-50 rounded-[1.5rem] hover:bg-indigo-50 transition-all active:scale-95 shadow-sm shadow-indigo-50">
            Ver todos (142)
          </button>
        </div>

        <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent"></div>
           <h3 className="font-bold text-lg mb-4 relative z-10">Anuncio Pro</h3>
           <p className="text-slate-300 text-sm font-medium leading-relaxed mb-6 relative z-10">La conferencia de Diseño Sistémico comienza en 2 horas. No olvides tu cuaderno digital.</p>
           <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-sm relative z-10 hover:bg-indigo-50 transition-colors">Recordarme</button>
        </div>
      </aside>
    </div>
  );
}
