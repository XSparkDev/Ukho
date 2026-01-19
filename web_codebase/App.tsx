
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { PostCard } from './components/PostCard';
import { ClanFinder } from './components/ClanFinder';
import { ClanSearchCard } from './components/ClanSearchCard';
import { KinRecommendations } from './components/KinRecommendations';
import { ClanRelations } from './components/ClanRelations';
import { ContactsPage } from './components/ContactsPage';
import { AuthPage } from './components/AuthPage';
import { getAncestralWisdom, recitePraises } from './services/geminiService';
import { Post, Tribe, User, ClanPraise } from './types';
import { Search, Home, Bell, MessageSquare, User as UserIcon, Plus, Send, Volume2, ShieldCheck, BookOpen, ChevronDown, Users, Sun, Moon, Ghost, LogOut, Menu, X } from 'lucide-react';

const MOCK_USER_INITIAL: User = {
  id: 'u1',
  name: "Sipho Khumalo",
  handle: "sipho_roots",
  avatar: "https://images.unsplash.com/photo-1507152832244-10d557b33b75?auto=format&fit=crop&q=80&w=150&h=150",
  tribe: Tribe.ZULU,
  clan: "Khumalo",
  bio: "Preserving our legacy through technology."
};

const IZITHAKAZELO: ClanPraise[] = [
  { 
    clanName: 'Khumalo', 
    praises: 'Mntungwa, Khumalo, Mzilikazi kaMashobane, Mabaso!' 
  },
  { 
    clanName: 'Dlamini', 
    praises: 'Dlamini, Mlangeni, Nkosi, Sibalukhulu!' 
  }
];

const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'u2',
    userName: "Zandi Madiba",
    userHandle: "zandile_m",
    userAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=150&h=150",
    content: "Just attended the clan gathering in Eastern Cape. The wisdom shared by the elders was profound. Unity is our strength. ✊🇿🇦",
    timestamp: "1h",
    likes: 420,
    comments: 24,
    tribe: Tribe.XHOSA,
    clan: "Madiba",
    image: "https://images.unsplash.com/photo-1518131332463-54898869f37c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'p2',
    userId: 'u3',
    userName: "Banele Zulu",
    userHandle: "banele_z",
    userAvatar: "https://images.unsplash.com/photo-1523910088395-dce0fc364d70?auto=format&fit=crop&q=80&w=150&h=150",
    content: "Looking for Khumalo clan contacts in Johannesburg for a traditional ceremony request. Any leads?",
    timestamp: "4h",
    likes: 89,
    comments: 15,
    tribe: Tribe.ZULU,
    clan: "Zulu"
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [wisdom, setWisdom] = useState("Connecting to the roots...");
  const [activeTab, setActiveTab] = useState('plaza');
  const [selectedClanPraise, setSelectedClanPraise] = useState<ClanPraise>(IZITHAKAZELO[0]);
  const [isLightMode, setIsLightMode] = useState(true); // Light mode default
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchWisdom = async () => {
      const text = await getAncestralWisdom();
      setWisdom(text || "Umuntu ngumuntu ngabantu.");
    };
    if (user) fetchWisdom();
  }, [user]);

  useEffect(() => {
    if (!isLightMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isLightMode]);

  const handleRecite = () => {
    recitePraises(selectedClanPraise.clanName, selectedClanPraise.praises);
  };

  const handleLogin = (userData: any) => {
    setUser({
      ...MOCK_USER_INITIAL,
      ...userData,
      tribe: userData.tribe || Tribe.ZULU
    });
  };

  const handleLogout = () => {
    setUser(null);
    setIsMobileMenuOpen(false);
  };

  const navigateTo = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <Layout>
      {/* Mobile Top Bar - Only visible on small screens */}
      <div className="md:hidden flex items-center justify-between p-4 glass-panel sticky top-4 z-40 rounded-3xl mx-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 ukho-gradient rounded-full flex items-center justify-center ukho-glow border border-white/20">
            <span className="text-white font-black text-xl lowercase">ü</span>
          </div>
          <span className="text-xl font-black tracking-tighter text-[var(--text-main)] italic">Ukho</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 bg-orange-500/10 text-orange-500 rounded-xl hover:bg-orange-500/20 transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Floating Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass-panel w-full max-w-sm rounded-[3rem] p-8 relative shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-2 text-[var(--text-dim)] hover:text-orange-500 transition-colors"
            >
              <X size={28} />
            </button>

            <div className="flex flex-col items-center mb-10">
              <div className="w-20 h-20 ukho-gradient rounded-[2rem] flex items-center justify-center ukho-glow border-4 border-white/20 mb-4">
                <span className="text-white font-black text-4xl lowercase">ü</span>
              </div>
              <h2 className="text-2xl font-black italic text-[var(--text-main)]">Ukho Network</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mt-1">Connect Your Roots</p>
            </div>

            <nav className="space-y-2 mb-10">
              <button 
                onClick={() => navigateTo('plaza')} 
                className={`flex items-center gap-4 w-full p-5 rounded-3xl transition-all ${activeTab === 'plaza' ? 'bg-orange-500 text-white shadow-lg' : 'text-[var(--text-dim)] hover:bg-orange-500/10 hover:text-[var(--text-main)]'}`}
              >
                <Home size={24} />
                <span className="font-bold text-lg">Plaza</span>
              </button>
              <button 
                onClick={() => navigateTo('contacts')} 
                className={`flex items-center gap-4 w-full p-5 rounded-3xl transition-all ${activeTab === 'contacts' ? 'bg-orange-500 text-white shadow-lg' : 'text-[var(--text-dim)] hover:bg-orange-500/10 hover:text-[var(--text-main)]'}`}
              >
                <Users size={24} />
                <span className="font-bold text-lg">Contacts</span>
              </button>
              <button className="flex items-center gap-4 w-full p-5 rounded-3xl text-[var(--text-dim)] hover:bg-orange-500/10 hover:text-[var(--text-main)] transition-all">
                <Search size={24} />
                <span className="font-bold text-lg">Discover</span>
              </button>
              <button className="flex items-center gap-4 w-full p-5 rounded-3xl text-[var(--text-dim)] hover:bg-orange-500/10 hover:text-[var(--text-main)] transition-all">
                <BookOpen size={24} />
                <span className="font-bold text-lg">Isibongo</span>
              </button>
            </nav>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setIsLightMode(!isLightMode)}
                className="flex items-center justify-center gap-3 p-4 rounded-3xl glass-panel text-orange-500 font-bold"
              >
                {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
                <span>{isLightMode ? 'Dark' : 'Light'}</span>
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-3 p-4 rounded-3xl glass-panel text-red-500 font-bold"
              >
                <LogOut size={20} />
                <span>Exit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation - Visible on medium screens and up */}
      <div className="hidden md:flex w-20 lg:w-64 flex-shrink-0 flex-col gap-6 sticky top-4 h-[calc(100vh-2rem)]">
        <div className="p-4 flex flex-col items-center lg:items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 ukho-gradient rounded-full flex items-center justify-center ukho-glow border-2 border-white/20">
              <span className="text-white font-black text-2xl lowercase">ü</span>
            </div>
            <span className="text-2xl font-black tracking-tighter hidden lg:block text-[var(--text-main)] italic">Ukho</span>
          </div>
          <button 
            onClick={() => setIsLightMode(!isLightMode)}
            className="p-2 rounded-xl glass-panel text-orange-500 hover:bg-orange-500/10 transition-colors self-center lg:self-start"
          >
            {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        <nav className="space-y-1">
          <button onClick={() => navigateTo('plaza')} className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all ${activeTab === 'plaza' ? 'bg-orange-500/10 text-orange-500 shadow-inner' : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'}`}>
            <Home size={24} />
            <span className="font-bold hidden lg:block">Plaza</span>
          </button>
          <button onClick={() => navigateTo('contacts')} className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all ${activeTab === 'contacts' ? 'bg-orange-500/10 text-orange-500 shadow-inner' : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'}`}>
            <Users size={24} />
            <span className="font-bold hidden lg:block">Contacts</span>
          </button>
          <button className="flex items-center gap-4 w-full p-4 rounded-2xl text-[var(--text-dim)] hover:text-[var(--text-main)] transition-all">
            <Search size={24} />
            <span className="font-bold hidden lg:block">Discover Clans</span>
          </button>
          <button className="flex items-center gap-4 w-full p-4 rounded-2xl text-[var(--text-dim)] hover:text-[var(--text-main)] transition-all">
            <BookOpen size={24} />
            <span className="font-bold hidden lg:block">Isibongo</span>
          </button>
        </nav>

        <button className="w-full ukho-gradient hover:opacity-90 text-white font-bold py-4 rounded-full ukho-glow transition-all flex items-center justify-center gap-2 mt-4 shadow-lg">
          <Plus size={24} />
          <span className="hidden lg:block uppercase tracking-widest text-xs font-black">Share Wisdom</span>
        </button>

        <div className="mt-auto p-4 hidden md:flex items-center gap-3 glass-panel rounded-2xl border border-white/5 group relative">
          <img src={user.avatar} alt="Me" className="w-10 h-10 rounded-full border-2 border-orange-500/50 object-cover" />
          <div className="hidden lg:block overflow-hidden flex-1">
            <p className="text-sm font-bold text-[var(--text-main)] truncate">{user.name}</p>
            <p className="text-xs text-orange-400 font-medium">Clan: {user.clan}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-[var(--text-dim)] hover:text-red-500 transition-colors"
            title="Disconnect"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-2xl w-full">
        {activeTab === 'plaza' ? (
          <>
            <div className="glass-panel rounded-3xl p-8 mb-8 border-b-4 border-b-orange-500 relative overflow-hidden mt-6 md:mt-0">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-purple-500 to-orange-500 opacity-30"></div>
              <div className="flex items-center gap-2 mb-4 text-orange-500">
                <ShieldCheck size={20} />
                <span className="text-xs font-black uppercase tracking-[0.2em]">Ancestral Wisdom</span>
              </div>
              <p className="text-xl font-medium text-[var(--text-main)] leading-relaxed italic">"{wisdom}"</p>
            </div>

            <ClanSearchCard />

            {/* Izithakazelo (Praises) Card */}
            <div className="glass-panel rounded-[2.5rem] p-8 mb-8 border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-500/10 p-4 rounded-2xl text-orange-500 shadow-inner">
                    <Volume2 size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text-main)] tracking-tight">Izithakazelo</h2>
                    <p className="text-[10px] text-[var(--text-dim)] font-black uppercase tracking-[0.2em] mt-0.5">Recite Your Roots</p>
                  </div>
                </div>
                
                <div className="relative group/sel hidden sm:block">
                  <select 
                    className="appearance-none bg-black/5 dark:bg-black/20 px-6 py-3 pr-10 rounded-xl border border-white/5 text-xs font-bold text-[var(--text-main)] opacity-70 cursor-pointer focus:ring-1 focus:ring-orange-500/30 outline-none"
                    onChange={(e) => setSelectedClanPraise(IZITHAKAZELO.find(p => p.clanName === e.target.value) || IZITHAKAZELO[0])}
                  >
                    {IZITHAKAZELO.map(p => <option key={p.clanName} value={p.clanName}>{p.clanName}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)] pointer-events-none" />
                </div>
              </div>

              {/* Mobile selector for Praises */}
              <div className="sm:hidden mb-6">
                 <select 
                    className="w-full appearance-none bg-black/5 dark:bg-black/20 px-6 py-4 rounded-2xl border border-white/5 text-sm font-bold text-[var(--text-main)] cursor-pointer focus:ring-1 focus:ring-orange-500/30 outline-none"
                    onChange={(e) => setSelectedClanPraise(IZITHAKAZELO.find(p => p.clanName === e.target.value) || IZITHAKAZELO[0])}
                  >
                    {IZITHAKAZELO.map(p => <option key={p.clanName} value={p.clanName}>{p.clanName}</option>)}
                  </select>
              </div>

              <div className="bg-black/5 dark:bg-black/40 rounded-[2rem] p-6 sm:p-10 mb-8 border border-white/5 shadow-inner flex items-center justify-center min-h-[120px]">
                <p className="text-[var(--text-main)] font-bold leading-relaxed text-center text-lg sm:text-xl tracking-tight italic">
                  {selectedClanPraise.praises}
                </p>
              </div>

              <button 
                onClick={handleRecite}
                className="w-full py-5 rounded-[1.5rem] border-2 border-orange-500/30 text-orange-500 font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 hover:bg-orange-500/10 hover:border-orange-500 transition-all active:scale-[0.98] group/btn"
              >
                <Volume2 size={24} className="group-hover/btn:scale-110 transition-transform" />
                RECITE PRAISES
              </button>
            </div>

            <KinRecommendations />

            {/* Feed Empty State */}
            <div className="space-y-4">
              {MOCK_POSTS.length > 0 ? (
                MOCK_POSTS.map(post => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="glass-panel rounded-3xl p-16 text-center border-dashed border-2 border-orange-500/20">
                  <Ghost size={64} className="mx-auto mb-6 text-orange-500/20 animate-bounce" />
                  <h3 className="text-xl font-bold text-[var(--text-main)]">The Plaza is Quiet</h3>
                  <p className="text-[var(--text-dim)] text-sm mt-2 max-w-xs mx-auto">Ancestors are waiting for your voice. Be the first to share wisdom with the network.</p>
                  <button className="mt-8 px-8 py-4 ukho-gradient text-white rounded-full font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-transform">Post Transmissions</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="mt-6 md:mt-0">
            <ContactsPage />
          </div>
        )}
      </main>

      {/* Right Sidebar - Visible on large screens */}
      <div className="hidden lg:block w-80 flex-shrink-0 sticky top-4 h-[calc(100vh-2rem)] overflow-y-auto pr-2">
        <ClanFinder />
        <ClanRelations />

        <div className="mt-6 glass-panel rounded-3xl p-6">
          <h3 className="text-sm font-bold text-[var(--text-dim)] uppercase tracking-widest mb-6">Trending Clans</h3>
          <div className="space-y-6">
            {[
              { tag: '#DlaminiUnite', posts: '15.2k', tribe: 'Swati/Zulu' },
              { tag: '#MthembuLegacy', posts: '8.4k', tribe: 'Xhosa' },
              { tag: '#BapediCulture', posts: '12k', tribe: 'Pedi' }
            ].map((trend, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-bold text-[var(--text-main)] group-hover:text-orange-400 transition-colors">{trend.tag}</span>
                  <span className="text-[10px] bg-black/5 dark:bg-black/10 px-2 py-0.5 rounded text-[var(--text-dim)]">{trend.tribe}</span>
                </div>
                <p className="text-xs text-[var(--text-dim)] font-medium">{trend.posts} transmissions</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 px-4 text-[10px] text-[var(--text-dim)] flex flex-wrap gap-x-3 gap-y-1 uppercase font-bold tracking-widest mb-4">
          <a href="#" className="hover:text-orange-400 transition-colors">Unity Code</a>
          <a href="#" className="hover:text-orange-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-orange-400 transition-colors">Traditions</a>
          <span>&copy; 2024 Ukho Network</span>
        </div>
      </div>
    </Layout>
  );
};

export default App;
