
import React from 'react';
import { ShieldCheck, MessageSquare, Phone } from 'lucide-react';
import { ClanContact } from '../types';

const CLAN_CONTACTS: ClanContact[] = [
  { id: 'c1', name: 'Baba Mthimkhulu', role: 'Chief Elder', clan: 'Khumalo', verified: true, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 'c2', name: 'Gogo Dlamini', role: 'Genealogist', clan: 'Dlamini', verified: true, avatar: 'https://images.unsplash.com/photo-1567532939604-b6c5b0ad2e01?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 'c3', name: 'Nkosi Zwelithini', role: 'Traditional Council', clan: 'Zulu', verified: true, avatar: 'https://images.unsplash.com/photo-1507152832244-10d557b33b75?auto=format&fit=crop&q=80&w=150&h=150' },
];

export const ClanRelations: React.FC = () => {
  return (
    <div className="glass-panel rounded-3xl p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-widest">Clan Relations</h3>
          <p className="text-[10px] text-[var(--text-dim)]">Verified Representatives</p>
        </div>
        <ShieldCheck size={18} className="text-emerald-500" />
      </div>

      <div className="space-y-4">
        {CLAN_CONTACTS.map((contact) => (
          <div key={contact.id} className="flex items-center gap-4 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-transparent hover:border-black/10 dark:hover:border-white/10 transition-all">
            <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-xl bg-black/10 object-cover" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-xs font-bold text-[var(--text-main)] truncate">{contact.name}</p>
                {contact.verified && <ShieldCheck size={10} className="text-emerald-500 flex-shrink-0" />}
              </div>
              <p className="text-[10px] text-[var(--text-dim)]">{contact.role} • {contact.clan}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-orange-500/10 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition-all">
                <MessageSquare size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-6 py-3 border border-black/10 dark:border-white/10 rounded-2xl text-[10px] font-black text-[var(--text-dim)] uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-all">
        View All Relations
      </button>
    </div>
  );
};
