
import React, { useEffect, useState } from 'react';
import { fetchVibraniumNews } from '../services/geminiService';
import { NewsItem } from '../types';
import { Zap, Shield, Crown, Map } from 'lucide-react';

const CategoryIcon: React.FC<{ category: string }> = ({ category }) => {
  switch (category.toLowerCase()) {
    case 'tech': return <Zap size={16} className="text-blue-500" />;
    case 'royal': return <Crown size={16} className="text-orange-500" />;
    case 'border': return <Shield size={16} className="text-emerald-500" />;
    default: return <Map size={16} className="text-purple-500" />;
  }
};

export const VibraniumNews: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      const data = await fetchVibraniumNews();
      setNews(data);
      setLoading(false);
    };
    loadNews();
  }, []);

  return (
    <div className="glass-panel rounded-3xl p-6 sticky top-4 h-fit border-l-4 border-l-purple-600">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
        <h2 className="text-lg font-bold text-[var(--text-main)] tracking-tight uppercase">Vibranium Feed</h2>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex flex-col gap-2">
              <div className="h-4 bg-black/5 dark:bg-slate-800 rounded w-3/4"></div>
              <div className="h-3 bg-black/5 dark:bg-slate-800 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {news.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                <CategoryIcon category={item.category} />
                <span className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest">{item.category}</span>
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-main)] group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                {item.title}
              </h3>
              <p className="text-xs text-[var(--text-dim)] mt-1 line-clamp-2">{item.summary}</p>
            </div>
          ))}
          <button className="w-full py-2 text-xs font-bold text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded-xl hover:bg-purple-500/10 transition-colors">
            ACCESS ARCHIVES
          </button>
        </div>
      )}
    </div>
  );
};
