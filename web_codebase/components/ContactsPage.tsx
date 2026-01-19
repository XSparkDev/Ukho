
import React, { useState, useMemo } from 'react';
import { Search, ShieldCheck, MessageSquare, Phone, UserPlus, Star, Filter, MoreVertical, SearchX } from 'lucide-react';
import { ClanContact, KinRecommendation } from '../types';

const VERIFIED_ELDERS: ClanContact[] = [
  { id: 'c1', name: 'Baba Mthimkhulu', role: 'Chief Elder', clan: 'Khumalo', verified: true, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 'c2', name: 'Gogo Dlamini', role: 'Genealogist', clan: 'Dlamini', verified: true, avatar: 'https://images.unsplash.com/photo-1567532939604-b6c5b0ad2e01?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 'c3', name: 'Nkosi Zwelithini', role: 'Traditional Council', clan: 'Zulu', verified: true, avatar: 'https://images.unsplash.com/photo-1507152832244-10d557b33b75?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 'c4', name: 'Mkhulu Gumede', role: 'History Keeper', clan: 'Gumede', verified: true, avatar: 'https://images.unsplash.com/photo-1523910088395-dce0fc364d70?auto=format&fit=crop&q=80&w=150&h=150' },
];

const POTENTIAL_KIN: KinRecommendation[] = [
  { id: 'r1', name: 'Lungile Khumalo', clan: 'Khumalo', matchReason: 'Direct Clan Match', avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 'r2', name: 'Sabelo Mabaso', clan: 'Mabaso', matchReason: 'Related Branch', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 'r3', name: 'Nomalanga Mntungwa', clan: 'Mntungwa', matchReason: 'Shared Praises', avatar: 'https://images.unsplash.com/photo-1567532939604-b6c5b0ad2e01?auto=format&fit=crop&q=80&w=150&h=150' },
];

export const ContactsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredElders = useMemo(() => {
    return VERIFIED_ELDERS.filter(e => 
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      e.clan.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="glass-panel rounded-[2.5rem] p-8 border-b-4 border-b-orange-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-[var(--text-main)] tracking-tighter italic">YOUR CLAN NETWORK</h1>
              <p className="text-[var(--text-dim)] font-medium mt-1 uppercase text-xs tracking-[0.2em]">Connecting the bloodlines</p>
            </div>
            <div className="relative group flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)] group-focus-within:text-orange-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search ancestors or kin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/5 dark:bg-[var(--panel-bg)] border border-black/5 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Verified Elders Section */}
        <section>
          <div className="flex items-center gap-3 mb-6 px-4">
            <ShieldCheck className="text-emerald-500" size={24} />
            <h2 className="text-xl font-bold text-[var(--text-main)] uppercase tracking-widest">Verified Elders</h2>
          </div>
          
          {filteredElders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredElders.map(elder => (
                <div key={elder.id} className="glass-panel p-6 rounded-[2rem] hover:border-orange-500/30 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <img src={elder.avatar} alt={elder.name} className="w-16 h-16 rounded-2xl bg-black/10 border-2 border-transparent group-hover:border-emerald-500/50 transition-all object-cover" />
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-[var(--bg-color)]">
                        <ShieldCheck size={12} className="text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[var(--text-main)]">{elder.name}</h3>
                      <p className="text-orange-500 text-xs font-black uppercase tracking-widest">{elder.clan} Clan</p>
                      <p className="text-[var(--text-dim)] text-xs mt-1">{elder.role}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button className="p-3 bg-orange-500/10 text-orange-500 rounded-xl hover:bg-orange-500 hover:text-white transition-all">
                        <MessageSquare size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-12 text-center">
              <SearchX size={48} className="mx-auto mb-4 text-[var(--text-dim)] opacity-20" />
              <p className="text-[var(--text-dim)] font-bold">No elders found matching "{searchQuery}"</p>
            </div>
          )}
        </section>

        {/* Potential Kin Section */}
        {!searchQuery && (
          <section>
            <div className="flex items-center gap-3 mb-6 px-4">
              <Star className="text-orange-500" size={24} />
              <h2 className="text-xl font-bold text-[var(--text-main)] uppercase tracking-widest">Potential Kin</h2>
            </div>
            <div className="glass-panel rounded-[2.5rem] p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {POTENTIAL_KIN.map(kin => (
                  <div key={kin.id} className="flex flex-col items-center text-center bg-black/5 dark:bg-black/40 p-6 rounded-3xl border border-black/5 dark:border-white/5 hover:scale-[1.02] transition-transform">
                    <img src={kin.avatar} alt={kin.name} className="w-20 h-20 rounded-full bg-black/10 mb-4 border-2 border-orange-500/20 object-cover" />
                    <h3 className="font-bold text-[var(--text-main)] text-lg">{kin.name}</h3>
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2 px-3 py-1 bg-orange-500/5 rounded-full border border-orange-500/10">{kin.clan}</span>
                    <p className="text-xs text-[var(--text-dim)] italic mb-6">"{kin.matchReason}"</p>
                    <button className="w-full py-3 ukho-gradient text-white rounded-xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                      <UserPlus size={16} />
                      SEND LINK
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Directory View */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6 px-4">
            <h2 className="text-xl font-bold text-[var(--text-main)] uppercase tracking-widest">Full Directory</h2>
            <button className="flex items-center gap-2 text-xs font-black text-[var(--text-dim)] hover:text-orange-500 transition-colors uppercase tracking-widest">
              <Filter size={14} />
              Filter List
            </button>
          </div>
          <div className="glass-panel rounded-3xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5">
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-[var(--text-dim)] tracking-[0.2em]">Identity</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-[var(--text-dim)] tracking-[0.2em]">Clan Relation</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-[var(--text-dim)] tracking-[0.2em]">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {[1, 2, 3, 4, 5].map((item) => {
                  const avatarIds = ['photo-1507152832244-10d557b33b75', 'photo-1531123897727-8f129e1688ce', 'photo-1523910088395-dce0fc364d70', 'photo-1567532939604-b6c5b0ad2e01', 'photo-1492562080023-ab3db95bfbce'];
                  return (
                    <tr key={item} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <img src={`https://images.unsplash.com/${avatarIds[item-1]}?auto=format&fit=crop&q=80&w=100&h=100`} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <p className="text-sm font-bold text-[var(--text-main)]">Member #{item}04</p>
                            <p className="text-[10px] text-[var(--text-dim)]">Active {item}h ago</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-medium text-[var(--text-main)] opacity-70">Distant Cousin</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          Linked
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="text-[var(--text-dim)] hover:text-[var(--text-main)]">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};
