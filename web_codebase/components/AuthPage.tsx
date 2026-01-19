
import React, { useState } from 'react';
import { Shield, Phone, Lock, User, MapPin, ChevronRight, Zap } from 'lucide-react';

interface AuthPageProps {
  onLogin: (userData: any) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    cellNumber: '',
    password: '',
    fullName: '',
    clanName: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      id: 'u-new',
      name: formData.fullName || 'New Member',
      clan: formData.clanName || 'Unknown',
      handle: (formData.fullName || 'member').toLowerCase().replace(/\s+/g, '_'),
      avatar: `https://images.unsplash.com/photo-1523910088395-dce0fc364d70?auto=format&fit=crop&q=80&w=150&h=150`
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[var(--bg-color)] transition-colors duration-300">
      {/* Tribal Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] border-[20px] border-orange-500 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] border-[20px] border-purple-500 rounded-full blur-[100px]"></div>
        <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,0 L100,100 M100,0 L0,100" stroke="rgba(249, 115, 22, 0.1)" strokeWidth="0.1" fill="none" />
        </svg>
      </div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-28 h-28 ukho-gradient rounded-[2rem] ukho-glow border-4 border-white/20 mb-6 transform hover:scale-105 transition-transform duration-500">
            <span className="text-white font-black text-5xl lowercase">ü</span>
          </div>
          <h1 className="text-4xl font-black text-[var(--text-main)] tracking-tighter italic">UKHO</h1>
          <p className="text-orange-500 font-black uppercase text-xs tracking-[0.3em] mt-2">Connect Your Roots</p>
        </div>

        <div className="glass-panel rounded-[3rem] p-8 md:p-10 border-b-8 border-b-orange-500 relative shadow-2xl transition-all">
          <div className="flex justify-center gap-4 mb-8">
            <button 
              onClick={() => setIsLogin(true)}
              className={`pb-2 px-4 font-black uppercase text-xs tracking-widest transition-all ${isLogin ? 'text-orange-500 border-b-2 border-orange-500' : 'text-[var(--text-dim)]'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`pb-2 px-4 font-black uppercase text-xs tracking-widest transition-all ${!isLogin ? 'text-orange-500 border-b-2 border-orange-500' : 'text-[var(--text-dim)]'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-5 animate-in slide-in-from-top-4 duration-300">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500/50" size={18} />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    required
                    onChange={handleInputChange}
                    className="w-full bg-black/5 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all font-medium"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500/50" size={18} />
                  <input
                    type="text"
                    name="clanName"
                    placeholder="Clan Name (e.g. Khumalo)"
                    required
                    onChange={handleInputChange}
                    className="w-full bg-black/5 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all font-medium"
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500/50" size={18} />
              <input
                type="tel"
                name="cellNumber"
                placeholder="Cell Number"
                required
                onChange={handleInputChange}
                className="w-full bg-black/5 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all font-medium"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500/50" size={18} />
              <input
                type="password"
                name="password"
                placeholder="Secure Key"
                required
                onChange={handleInputChange}
                className="w-full bg-black/5 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-5 ukho-gradient text-white rounded-[1.5rem] font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-2 hover:opacity-90 transition-all transform active:scale-95 shadow-xl mt-4"
            >
              {isLogin ? 'Ascend to Plaza' : 'Join the Lineage'}
              <ChevronRight size={18} />
            </button>
          </form>

          <p className="text-center mt-8 text-[10px] text-[var(--text-dim)] font-black uppercase tracking-widest opacity-50">
            Powered by the ancestors & vibranium tech
          </p>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-2 text-orange-500/30">
          <Shield size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Encrypted Transmissions</span>
        </div>
      </div>
    </div>
  );
};
