import React, { useState } from 'react';
import { Shield, Trophy, Flame, ArrowRight, Eye, Clock, Sparkles, MapPin, Award } from 'lucide-react';

export default function KenyaSportsSection({ articles = [], onSelectArticle }) {
  const [activeSubTab, setActiveSubTab] = useState('ALL');

  // Filter Kenya articles
  const kenyaArticles = articles.filter(a => {
    if (!a) return false;
    const isKenya = (a.country && a.country.toLowerCase() === 'kenya') ||
      (a.category && String(a.category).toLowerCase().includes('kenya')) ||
      (a.categoryName && String(a.categoryName).toLowerCase().includes('kenya')) ||
      (Array.isArray(a.tags) && a.tags.some(t => ['kenya', 'gor mahia', 'harambee stars', 'faith kipyegon', 'shujaa', 'safari rally'].includes(t.toLowerCase())));

    if (!isKenya) return false;

    if (activeSubTab === 'ALL') return true;
    if (activeSubTab === 'FOOTBALL') {
      return (a.category && a.category.toLowerCase().includes('football')) ||
        (a.league && (a.league.includes('FKF') || a.league.includes('AFCON'))) ||
        (Array.isArray(a.tags) && a.tags.some(t => ['gor mahia', 'harambee stars', 'fkf'].includes(t.toLowerCase())));
    }
    if (activeSubTab === 'ATHLETICS') {
      return (a.category && a.category.toLowerCase().includes('athletics')) ||
        (Array.isArray(a.tags) && a.tags.some(t => ['athletics', 'faith kipyegon', 'marathon', 'omanyala'].includes(t.toLowerCase())));
    }
    if (activeSubTab === 'RUGBY') {
      return (a.category && a.category.toLowerCase().includes('rugby')) ||
        (Array.isArray(a.tags) && a.tags.some(t => ['rugby', 'shujaa', 'kenya 7s'].includes(t.toLowerCase())));
    }
    if (activeSubTab === 'MOTORSPORT') {
      return (a.category && a.category.toLowerCase().includes('motorsport')) ||
        (Array.isArray(a.tags) && a.tags.some(t => ['safari rally', 'wrc', 'motorsport'].includes(t.toLowerCase())));
    }
    return true;
  });

  const featuredKenya = kenyaArticles[0] || articles.find(a => (a.country || '').toLowerCase() === 'kenya') || null;
  const secondaryKenya = kenyaArticles.slice(1, 5);

  const subTabs = [
    { id: 'ALL', label: 'All Kenya' },
    { id: 'FOOTBALL', label: 'Football (FKF)' },
    { id: 'ATHLETICS', label: 'Athletics & Track' },
    { id: 'RUGBY', label: 'Rugby & 7s' },
    { id: 'MOTORSPORT', label: 'Safari Rally' }
  ];

  return (
    <section id="kenya-sports" className="py-14 bg-[#0E0E14] border-b border-[#232332]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 border-b border-[#232332] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl">🇰🇪</span>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#16A34A] font-['Montserrat']">
                DEDICATED NATIONAL DESK
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight font-['Montserrat'] flex items-center gap-2">
              KENYA SPORTS ARENA
            </h2>
            <p className="text-xs text-[#A1A1AA] mt-1">
              Extensive coverage of Harambee Stars, Gor Mahia, world-record athletics, Kenya Shujaa 7s, and the WRC Safari Rally.
            </p>
          </div>

          {/* Sub-Tabs Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
            {subTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider font-['Montserrat'] transition whitespace-nowrap ${
                  activeSubTab === tab.id
                    ? 'bg-[#16A34A] text-white shadow-[0_0_15px_rgba(22,163,74,0.4)]'
                    : 'bg-[#181822] text-[#A1A1AA] hover:text-white border border-[#232332]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Kenya Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Featured Spotlight Card */}
          {featuredKenya && (
            <div 
              onClick={() => onSelectArticle && onSelectArticle(featuredKenya)}
              className="lg:col-span-7 bg-[#121218] border border-[#232332] rounded-2xl overflow-hidden hover:border-[#16A34A]/60 transition-all duration-300 group cursor-pointer flex flex-col justify-between shadow-xl"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#181822]">
                <img
                  src={featuredKenya.featuredImage || featuredKenya.image || '/images/hero-stadium.jpg'}
                  alt={featuredKenya.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121218] via-black/40 to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#16A34A] text-white text-[10px] font-black uppercase tracking-wider font-['Montserrat'] shadow-lg flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    <span>Kenya Spotlight</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                    {featuredKenya.categoryName || featuredKenya.category || 'Kenya'}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-7 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#16A34A] transition-colors leading-snug font-['Montserrat']">
                    {featuredKenya.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A1A1AA] line-clamp-3 mt-2.5 leading-relaxed">
                    {featuredKenya.summary || featuredKenya.excerpt || ''}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#232332] flex items-center justify-between text-xs text-[#A1A1AA]">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-medium">{featuredKenya.authorName || featuredKenya.author || 'Sports Arena Desk'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{featuredKenya.date || 'Today'}</span>
                    </span>
                  </div>
                  <span className="text-[#16A34A] font-black uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Secondary Kenya Stories List */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            {secondaryKenya.map((story) => (
              <div
                key={story.id}
                onClick={() => onSelectArticle && onSelectArticle(story)}
                className="bg-[#121218] border border-[#232332] hover:border-[#16A34A]/50 rounded-xl p-4 transition-all duration-200 group cursor-pointer flex gap-4 items-center"
              >
                <div className="w-24 h-20 sm:w-28 sm:h-24 rounded-lg overflow-hidden bg-[#181822] flex-shrink-0">
                  <img
                    src={story.featuredImage || story.image || '/images/news-saka.jpg'}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-[#16A34A] tracking-wider font-['Montserrat']">
                      {story.categoryName || story.category || 'Kenya'}
                    </span>
                    <span className="text-[10px] text-gray-500">•</span>
                    <span className="text-[10px] text-gray-400">{story.date || 'Recent'}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#16A34A] transition-colors line-clamp-2 leading-snug font-['Montserrat']">
                    {story.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[10px] text-[#A1A1AA]">
                    <span>By {story.authorName || story.author || 'Sports Arena'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{story.views || story.viewsCount || 8200}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
