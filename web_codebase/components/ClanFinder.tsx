
import React, { useState, useMemo } from 'react';
import { MapPin, UserPlus, Search, X, Filter } from 'lucide-react';

const NEARBY_KIN = [
  { id: '1', name: 'Thabo Dlamini', clan: 'Dlamini', dist: '0.4km', location: 'Soweto' },
  { id: '2', name: 'Nomusa Zulu', clan: 'Zulu', dist: '1.2km', location: 'Durban' },
  { id: '3', name: 'Lerato Mofokeng', clan: 'Mofokeng', dist: '2.5km', location: 'Johannesburg' },
  { id: '4', name: 'Sizwe Madiba', clan: 'Madiba', dist: '3.1km', location: 'Mthatha' },
  { id: '5', name: 'Kopano Tswana', clan: 'Tswana', dist: '4.8km', location: 'Pretoria' },
  { id: '6', name: 'Zanele Khumalo', clan: 'Khumalo', dist: '0.9km', location: 'Soweto' },
];

export const ClanFinder: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredKin = useMemo(() => {
    const sQuery = searchQuery.toLowerCase().trim();
    const lQuery = locationQuery.toLowerCase().trim();
    
    return NEARBY_KIN.filter((kin) => {
      const matchesSearch = !sQuery || 
        kin.name.toLowerCase().includes(sQuery) || 
        kin.clan.toLowerCase().includes(sQuery);
      
      const matchesLocation = !lQuery || 
        kin.location.toLowerCase().includes(lQuery);

      return matchesSearch && matchesLocation;
    });
  }, [searchQuery, locationQuery]);

  const clearFilters = () => {
    setSearchQuery('');
    setLocationQuery('');
  };

  return (
    <div className="glass-panel rounded-3xl p-6 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-orange-500 animate-pulse" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-orange-500">Nearby Kin</h3>
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-orange-500 text-white' : 'text-slate-500 hover:bg-white/5'}`}
        >
          <Filter size={14} />
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {/* Name/Clan Search */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={14} className="text-slate-500 group-focus-within:text-orange-500 transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name or clan..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-8 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-500 hover:text-slate-300"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Location Filter (Expandable) */}
        {showFilters && (
          <div className="relative group animate-in slide-in-from-top-2 duration-200">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin size={14} className="text-slate-500 group-focus-within:text-orange-500 transition-colors" />
            </div>
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Filter by location (e.g. Soweto)..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-8 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
            />
            {locationQuery && (
              <button
                onClick={() => setLocationQuery('')}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-500 hover:text-slate-300"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {filteredKin.length > 0 ? (
          filteredKin.map((kin) => (
            <div
              key={kin.id}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all group/item"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-100 truncate group-hover/item:text-orange-400 transition-colors">
                  {kin.name}
                </p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                    {kin.clan}
                  </span>
                  <span className="text-[10px] text-slate-600">• {kin.location}</span>
                  <span className="text-[10px] text-slate-700 bg-white/5 px-1.5 rounded">{kin.dist}</span>
                </div>
              </div>
              <button
                title="Connect with kin"
                className="p-2.5 bg-orange-500/5 text-orange-500 rounded-xl hover:bg-orange-500 hover:text-white transition-all transform active:scale-95"
              >
                <UserPlus size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="py-8 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 mb-3">
              <Search size={18} className="text-slate-600" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No kin found</p>
            <p className="text-[10px] text-slate-600 mt-1">Adjust your search or location filter</p>
            {(searchQuery || locationQuery) && (
              <button 
                onClick={clearFilters}
                className="mt-4 text-[10px] text-orange-500 font-black uppercase hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {(searchQuery || locationQuery) && filteredKin.length > 0 && (
        <p className="mt-4 text-[10px] text-center text-slate-600 font-bold uppercase tracking-tighter">
          Showing {filteredKin.length} result{filteredKin.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};
