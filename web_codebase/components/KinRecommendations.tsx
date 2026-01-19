
import React from 'react';
import { UserPlus, Star, Users } from 'lucide-react';
import { KinRecommendation } from '../types';

const MOCK_RECKS: KinRecommendation[] = [
  { id: 'r1', name: 'Lungile Khumalo', clan: 'Khumalo', matchReason: 'Direct Clan Match', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 'r2', name: 'Sabelo Mabaso', clan: 'Mabaso', matchReason: 'Related Branch', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 'r3', name: 'Nomalanga Mntungwa', clan: 'Mntungwa', matchReason: 'Shared Praises', avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=150&h=150' },
];

export const KinRecommendations: React.FC = () => {
  return (
    <div className="glass-panel rounded-[2.5rem] p-8 mb-8 border border-white/5 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-orange-500/10 p-2 rounded-xl text-orange-500">
          <Star size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[var(--text-main)]">Possible Kin</h2>
          <p className="text-[10px] text-[var(--text-dim)] font-black uppercase tracking-widest">People who might be your people</p>
        </div>
      </div>

      {MOCK_RECKS.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_RECKS.map((reck) => (
            <div key={reck.id} className="bg-black/5 dark:bg-black/20 rounded-3xl p-5 border border-white/5 flex flex-col items-center text-center group hover:border-orange-500/30 transition-all">
              <img src={reck.avatar} alt={reck.name} className="w-16 h-16 rounded-2xl mb-3 border-2 border-transparent group-hover:border-orange-500/50 transition-colors object-cover shadow-lg" />
              <h3 className="text-sm font-bold text-[var(--text-main)] truncate w-full">{reck.name}</h3>
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-tighter mb-1">{reck.clan}</p>
              <p className="text-[9px] text-[var(--text-dim)] mb-4 italic">{reck.matchReason}</p>
              <button className="w-full py-2 bg-orange-500/5 hover:bg-orange-500 text-orange-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                <UserPlus size={12} />
                Connect
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-black/5 dark:bg-black/20 rounded-3xl p-8 text-center border border-dashed border-white/10">
          <Users size={32} className="mx-auto mb-3 text-[var(--text-dim)] opacity-30" />
          <p className="text-xs text-[var(--text-dim)]">Searching the lineage for suggestions...</p>
        </div>
      )}
    </div>
  );
};
