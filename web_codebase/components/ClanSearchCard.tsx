
import React, { useState } from 'react';
import { Search, ChevronDown, MapPin } from 'lucide-react';

export const ClanSearchCard: React.FC = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="glass-panel rounded-[2.5rem] p-8 mb-6 relative overflow-hidden group">
      {/* Background subtle glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-orange-500/10 p-4 rounded-2xl text-orange-500 shadow-inner">
            <Search size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text-main)] tracking-tight">Clan Search</h2>
            <p className="text-[10px] text-[var(--text-dim)] font-black uppercase tracking-[0.2em] mt-0.5">Find Your Origins</p>
          </div>
        </div>
        
        <div className="bg-black/5 dark:bg-white/5 px-4 py-2 rounded-xl border border-black/5 dark:border-white/5 flex items-center gap-3 cursor-pointer hover:bg-orange-500/10 transition-colors">
          <span className="text-xs font-bold text-[var(--text-main)] opacity-70">All Regions</span>
          <ChevronDown size={14} className="text-[var(--text-dim)]" />
        </div>
      </div>

      {/* Main Search Area */}
      <div className="bg-black/5 dark:bg-black/40 rounded-[2rem] p-6 mb-8 border border-black/5 dark:border-white/5 shadow-inner">
        <div className="flex items-center gap-4">
          <MapPin size={20} className="text-orange-500/50" />
          <input 
            type="text" 
            placeholder="Enter surname or clan name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-[var(--text-main)] placeholder:text-[var(--text-dim)] font-medium text-lg"
          />
        </div>
      </div>

      {/* Action Button */}
      <button className="w-full py-5 rounded-[1.5rem] border-2 border-orange-500/30 text-orange-500 font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 hover:bg-orange-500/10 hover:border-orange-500 transition-all active:scale-[0.98] group/btn">
        <Search size={20} className="group-hover/btn:scale-110 transition-transform" />
        Search Directory
      </button>
    </div>
  );
};
