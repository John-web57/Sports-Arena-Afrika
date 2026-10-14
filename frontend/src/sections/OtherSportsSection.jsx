import React, { useState } from 'react';
import { Award, Compass, Zap, Swords, Gauge, ArrowRight, Clock, Eye, Sparkles } from 'lucide-react';

export default function OtherSportsSection({ articles = [], onSelectArticle }) {
  const [activeSport, setActiveSport] = useState('ALL');

  const sportsConfig = [
    { id: 'ALL', label: 'All Disciplines', icon: Sparkles, color: '#D90429' },
    { id: 'ATHLETICS', label: 'Athletics & Track', icon: Award, color: '#10B981' },
    { id: 'RUGBY', label: 'Rugby & 7s', icon: Compass, color: '#8B5CF6' },
    { id: 'BASKETBALL', label: 'Basketball (BAL)', icon: Zap, color: '#EC4899' },
    { id: 'MOTORSPORT', label: 'Motorsport & Rally', icon: Gauge, color: '#F59E0B' },
    { id: 'BOXING', label: 'Boxing & Combat', icon: Swords, color: '#3B82F6' }
  ];

  const otherSportsArticles = articles.filter(a => {
    if (!a) return false;
    const cat = String(a.categoryName || a.category || '').toUpperCase();
    const tags = Array.isArray(a.tags) ? a.tags.map(t => String(t).toUpperCase()) : [];
    
    const isOtherSport = cat.includes('ATHLETICS') || cat.includes('RUGBY') ||
      cat.includes('BASKETBALL') || cat.includes('MOTORSPORT') || cat.includes('BOXING') ||
      tags.some(t => ['ATHLETICS', 'FAITH KIPYEGON', 'RUGBY', 'KENYA 7S', 'SHUJAA', 'BAL', 'BASKETBALL', 'SAFARI RALLY', 'BOXING'].includes(t));

    if (!isOtherSport) return false;

    if (activeSport === 'ALL') return true;
    return cat.includes(activeSport) || tags.some(t => t.includes(activeSport));
  });

  const displayArticles = otherSportsArticles.length > 0 ? otherSportsArticles.slice(0, 6) : articles.slice(0, 4);

  return (
    <section id="other-sports" className="py-14 bg-[#0B0B0F] border-b border-[#232332]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 border-b border-[#232332] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#10B981] font-['Montserrat']">
                PAN-AFRICAN SPORTS DISCIPLINES
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight font-['Montserrat']">
              ATHLETICS, RUGBY, BASKETBALL & BEYOND
            </h2>
            <p className="text-xs text-[#A1A1AA] mt-1">
              Celebrating Africa's Olympic legends, world record breakers, Rugby 7s speedsters, BAL basketball contenders, and motorsport champions.
            </p>
          </div>

          {/* Sport Selector Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
            {sportsConfig.map(s => {
              const Icon = s.icon;
              const isSelected = activeSport === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSport(s.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider font-['Montserrat'] transition flex items-center gap-1.5 whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#D90429] text-white shadow-sports-glow'
                      : 'bg-[#181822] text-[#A1A1AA] hover:text-white border border-[#232332]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sports Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayArticles.map((article) => {
            const cat = article.categoryName || article.category || 'Sports';
            return (
              <div
                key={article.id}
                onClick={() => onSelectArticle && onSelectArticle(article)}
                className="bg-[#121218] border border-[#232332] hover:border-[#EF233C]/50 rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-lg hover:-translate-y-1"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#181822]">
                    <img
                      src={article.featuredImage || article.image || '/images/hero-stadium.jpg'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121218] via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#D90429] text-white text-[10px] font-black uppercase tracking-wider font-['Montserrat'] shadow">
                        {cat}
                      </span>
                      {article.country && (
                        <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-gray-200 text-[10px] font-bold">
                          {article.country}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#EF233C] transition-colors leading-snug font-['Montserrat'] line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-[#A1A1AA] line-clamp-2 leading-relaxed">
                      {article.summary || article.excerpt || ''}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-[#1E1E2A] flex items-center justify-between text-xs text-[#A1A1AA] mt-2">
                  <div className="flex items-center gap-2 pt-3">
                    <span className="font-semibold text-gray-300">{article.authorName || article.author || 'Desk'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.date || 'Today'}</span>
                    </span>
                  </div>
                  <span className="text-[#EF233C] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-3">
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
