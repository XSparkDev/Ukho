
import React from 'react';
import { Post, Tribe } from '../types';
import { Heart, MessageCircle, Share2, ShieldCheck, UserPlus } from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="glass-panel rounded-3xl p-6 mb-4 hover:border-orange-500/30 transition-all duration-300 group">
      <div className="flex items-start gap-4">
        <div className="relative">
          <img 
            src={post.userAvatar} 
            alt={post.userName} 
            className="w-14 h-14 rounded-2xl object-cover border-2 border-white/5 group-hover:border-orange-500/50 transition-colors"
          />
          <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-1 border-2 border-[var(--bg-color)]">
            <ShieldCheck size={10} className="text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[var(--text-main)]">{post.userName}</h3>
              <span className="text-[var(--text-dim)] text-xs">@{post.userHandle}</span>
            </div>
            <span className="text-[var(--text-dim)] text-[10px] font-bold uppercase">{post.timestamp}</span>
          </div>
          
          <div className="flex gap-2 mb-3">
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-500/5 px-2 py-0.5 rounded border border-orange-500/20">
              {post.clan}
            </span>
            <span className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-widest bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">
              {post.tribe}
            </span>
          </div>

          <p className="text-[var(--text-main)] opacity-90 leading-relaxed mb-4 text-[15px]">{post.content}</p>
          
          {post.image && (
            <div className="rounded-2xl overflow-hidden mb-4 border border-white/5 shadow-2xl">
              <img src={post.image} alt="Post content" className="w-full object-cover max-h-[400px]" />
            </div>
          )}

          <div className="flex items-center gap-8 pt-2 border-t border-black/5 dark:border-white/5">
            <button className="flex items-center gap-2 text-[var(--text-dim)] hover:text-red-500 transition-colors group/btn">
              <Heart size={18} className="group-hover/btn:fill-red-500 transition-all" />
              <span className="text-xs font-bold">{post.likes}</span>
            </button>
            <button className="flex items-center gap-2 text-[var(--text-dim)] hover:text-orange-400 transition-colors">
              <MessageCircle size={18} />
              <span className="text-xs font-bold">{post.comments}</span>
            </button>
            <button className="flex items-center gap-2 text-[var(--text-dim)] hover:text-blue-400 transition-colors ml-auto">
              <UserPlus size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Connect Kin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
