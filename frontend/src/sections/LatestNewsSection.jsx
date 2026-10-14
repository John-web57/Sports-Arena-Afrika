import React, { useState } from 'react';
import { Bookmark, MessageSquare, Eye, Clock, Share2, Flame, ArrowRight, Sparkles, CheckCircle2, Tag, Hash, X } from 'lucide-react';
import AdPlacement from '../components/AdPlacement';

export default function LatestNewsSection({
  articles = [],
  onSelectArticle,
  bookmarks = {},
  onToggleBookmark,
  filterTag,
  onTagChange,
  filterCategory,
  onCategoryChange
}) {
  const [internalCategory, setInternalCategory] = useState('ALL');
  const [internalTag, setInternalTag] = useState(null);

  const selectedCategory = filterCategory !== undefined ? filterCategory : internalCategory;
  const setSelectedCategory = onCategoryChange || setInternalCategory;

  const selectedTag = filterTag !== undefined ? filterTag : internalTag;
  const setSelectedTag = onTagChange || setInternalTag;

  const categories = [
    'ALL', 'FOOTBALL', 'KENYA', 'AFRICAN FOOTBALL', 'ATHLETICS',
    'RUGBY', 'BASKETBALL', 'MOTORSPORT', 'BOXING', 'ANALYSIS', 'TRANSFERS'
  ];
  const popularTags = [
    'Faith Kipyegon', 'Gor Mahia', 'Harambee Stars', 'Victor Osimhen',
    'Kenya 7s', 'AFCON 2027', 'CAF Champions League', 'Safari Rally',
    'Ferdinand Omanyala', 'BAL'
  ];

  const filteredArticles = articles.filter(art => {
    if (!art) return false;
    if (art.status && String(art.status).toUpperCase() === 'ARCHIVED') return false;

    const cat = String(art.category || art.categoryName || '').toUpperCase();
    const country = String(art.country || '');
    const isFootball = cat.includes('FOOTBALL') || cat.includes('PREMIER LEAGUE') || cat.includes('CHAMPIONS LEAGUE') || cat.includes('LA LIGA') || cat.includes('FKF') || (art.league && (art.league.includes('Premier') || art.league.includes('CAF') || art.league.includes('FKF')));

    let matchesCategory = false;
    if (selectedCategory === 'ALL') {
      matchesCategory = true;
    } else if (selectedCategory === 'FOOTBALL') {
      matchesCategory = isFootball;
    } else if (selectedCategory === 'KENYA') {
      matchesCategory = country.toLowerCase() === 'kenya' || cat.includes('KENYA') || (Array.isArray(art.tags) && art.tags.some(t => ['kenya', 'gor mahia', 'harambee stars'].includes(t.toLowerCase())));
    } else {
      matchesCategory = cat.includes(selectedCategory);
    }

    const matchesTag = !selectedTag
      ? true
      : Array.isArray(art.tags) && art.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase());

    return matchesCategory && matchesTag;
  });

  const leadArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
  const secondaryArticles = filteredArticles.length > 1 ? filteredArticles.slice(1) : [];
  const mostReadArticles = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  return (
    <section id="latest-news" className="py-14 bg-[#0B0B0F] border-b border-[#232332]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 border-b border-[#232332] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D90429] animate-pulse"></span>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#EF233C] font-['Montserrat']">
                SPORTSARENA.AFRICA NEWS DESK
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#F9FAFB] uppercase tracking-tight font-['Montserrat']">
              LATEST SPORTS NEWS & ANALYSIS
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider font-['Montserrat'] transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#D90429] text-white shadow-sports-glow'
                    : 'bg-[#181822] text-[#A1A1AA] hover:text-white border border-[#232332]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Active Category Filter Reset Chip */}
        {selectedCategory !== 'ALL' && (
          <div className="flex items-center gap-2 py-1 px-3 rounded-xl bg-[#121218] border border-[#232332] w-fit">
            <span className="text-xs text-[#A1A1AA]">
              Filtered by: <strong className="text-white font-bold">{selectedCategory}</strong>
            </span>
            <button
              onClick={() => setSelectedCategory('ALL')}
              className="px-2 py-0.5 rounded-lg bg-[#232332] text-xs text-[#A1A1AA] hover:text-white hover:bg-[#D90429] transition flex items-center gap-1"
              title="Clear filter"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        )}

        {/* 🌟 1. HERO SPOTLIGHT: THE LATEST ARTICLE DISPLAYED BIGGER & MORE PROMINENT */}
        {leadArticle && (
          <div className="bg-[#121218] border-2 border-[#D90429]/40 hover:border-[#D90429] rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 group">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              
              {/* Left Column (7 cols): Big Cinematic 16:9 Image */}
              <div 
                onClick={() => onSelectArticle && onSelectArticle(leadArticle)}
                className="lg:col-span-7 relative aspect-video lg:aspect-auto min-h-[300px] sm:min-h-[400px] overflow-hidden bg-[#181822] cursor-pointer"
              >
                <img
                  src={leadArticle.image}
                  alt={leadArticle.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121218] via-transparent to-black/40"></div>

                {/* Big Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-[#D90429] text-white text-xs font-black uppercase tracking-wider font-['Montserrat'] shadow-sports-glow flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
                    <span>LATEST HEADLINE STORY</span>
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider font-['Montserrat'] border border-white/10">
                    {leadArticle.category}
                  </span>
                </div>

                {/* Bookmark Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark && onToggleBookmark(leadArticle.id);
                  }}
                  className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition shadow-lg ${
                    bookmarks[leadArticle.id]
                      ? 'bg-[#D90429] text-white'
                      : 'bg-black/60 text-[#A1A1AA] hover:text-white hover:bg-black/80'
                  }`}
                  title={bookmarks[leadArticle.id] ? "Remove Bookmark" : "Save Article"}
                >
                  <Bookmark className="w-5 h-5 fill-current" />
                </button>
              </div>

              {/* Right Column (5 cols): Prominent Headline, Lead Excerpt & Byline */}
              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-gradient-to-br from-[#121218] via-[#121218] to-[#181822]">
                <div className="space-y-4">
                  {/* Category & Time */}
                  <div className="flex items-center gap-3 text-xs text-[#A1A1AA]">
                    <span className="text-[#EF233C] font-black uppercase tracking-widest font-['Montserrat']">
                      SPORTSARENA EXCLUSIVE
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{leadArticle.date}</span>
                    </span>
                  </div>

                  {/* Bigger Title */}
                  <h3
                    onClick={() => onSelectArticle && onSelectArticle(leadArticle)}
                    className="text-xl sm:text-2xl md:text-3xl font-black text-white hover:text-[#EF233C] transition-colors cursor-pointer font-['Montserrat'] leading-tight"
                  >
                    {leadArticle.title}
                  </h3>

                  {/* Rich Excerpt */}
                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                    {leadArticle.excerpt}
                  </p>


                </div>

                {/* Author Info & CTAs */}
                <div className="space-y-5 pt-4 border-t border-[#232332]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={leadArticle.authorAvatar || "/images/logo.png"}
                        alt={leadArticle.author}
                        className="w-10 h-10 rounded-full object-cover border-2 border-[#D90429]"
                      />
                      <div>
                        <span className="font-bold text-sm text-white block font-['Montserrat']">
                          {leadArticle.author}
                        </span>
                        <span className="text-xs text-[#A1A1AA]">Senior Football Correspondent</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#A1A1AA] font-mono">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-[#F59E0B]" />
                        <span>{(leadArticle.views || 14820).toLocaleString()}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4 text-[#16A34A]" />
                        <span>{leadArticle.commentsCount || 142}</span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectArticle && onSelectArticle(leadArticle)}
                    className="w-full py-3.5 px-6 rounded-2xl bg-sports-gradient text-white text-xs sm:text-sm font-black uppercase tracking-wider font-['Montserrat'] shadow-sports-glow hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-2 group"
                  >
                    <span>READ COMPLETE STORY</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* 📰 2. MORE TOP STORIES & MOST READ SIDEBAR (8 Cols / 4 Cols Magazine Split) */}
        {secondaryArticles.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 items-start">
            
            {/* Left 8 Cols: Stories Grid */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-[#232332]">
                <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider font-['Montserrat']">
                  More Top Stories & Match Reports
                </h3>
                <span className="text-xs text-[#A1A1AA] font-mono">
                  {secondaryArticles.length} Stories Available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {secondaryArticles.map((article) => {
                  const isBookmarked = !!bookmarks[article.id];

                  return (
                    <article
                      key={article.id}
                      className="group rounded-2xl overflow-hidden bg-[#121218] border border-[#232332] hover:border-[#D90429]/60 transition-all duration-300 flex flex-col shadow-lg hover:shadow-[0_10px_30px_rgba(217,4,41,0.2)]"
                    >
                      {/* 16:9 Featured Image Container */}
                      <div className="relative aspect-video w-full overflow-hidden bg-[#181822]">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121218] via-transparent to-black/30"></div>

                        {/* Category Pill Tag */}
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#D90429] text-white text-[10px] font-black uppercase tracking-wider font-['Montserrat'] shadow">
                          {article.category}
                        </span>

                        {/* Bookmark Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleBookmark && onToggleBookmark(article.id);
                          }}
                          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${
                            isBookmarked
                              ? 'bg-[#D90429] text-white'
                              : 'bg-black/60 text-[#A1A1AA] hover:text-white hover:bg-black/80'
                          }`}
                          title={isBookmarked ? "Remove Bookmark" : "Save Article"}
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h3
                            onClick={() => onSelectArticle && onSelectArticle(article)}
                            className="text-base font-black text-[#F9FAFB] group-hover:text-[#EF233C] transition leading-snug line-clamp-2 cursor-pointer font-['Montserrat']"
                          >
                            {article.title}
                          </h3>

                          <p className="mt-2 text-xs text-[#A1A1AA] line-clamp-2 leading-relaxed">
                            {article.excerpt}
                          </p>


                        </div>

                        {/* Author, Views, Comments & Date Metadata Bar */}
                        <div className="pt-3 border-t border-[#232332] flex items-center justify-between text-xs text-[#A1A1AA]">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white truncate max-w-[110px]">
                              {article.author}
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5 text-[11px] font-medium">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5 text-[#F59E0B]" />
                              <span>{(article.views || 0).toLocaleString()}</span>
                            </span>
                            <span>{article.date}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Right 4 Cols: Most Read Today + 300x250 Banner */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* 🔥 Most Read Today Widget */}
              <div className="bg-[#121218] border border-[#232332] rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#232332]">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#D90429] fill-current" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-white font-['Montserrat']">
                      MOST READ TODAY
                    </h3>
                  </div>
                  <span className="text-[10px] text-[#A1A1AA] font-mono">Top 5</span>
                </div>

                <div className="space-y-3">
                  {mostReadArticles.map((item, index) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectArticle && onSelectArticle(item)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#181822] transition cursor-pointer group"
                    >
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs font-mono flex-shrink-0 ${
                        index === 0
                          ? 'bg-[#D90429] text-white shadow-sports-glow'
                          : index === 1
                            ? 'bg-[#F59E0B] text-black font-extrabold'
                            : index === 2
                              ? 'bg-[#16A34A] text-white'
                              : 'bg-[#181822] text-[#A1A1AA] border border-[#232332]'
                      }`}>
                        {index + 1}
                      </span>

                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold text-[#F59E0B] uppercase font-['Montserrat'] block mb-0.5">
                          {item.category}
                        </span>
                        <h4 className="text-xs font-bold text-white group-hover:text-[#EF233C] transition line-clamp-2 leading-snug">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-[#A1A1AA] mt-1 font-mono">
                          <span>{(item.views || 0).toLocaleString()} reads</span>
                          <span>•</span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 📢 300x250 Advertisement Placement */}
              <div className="rounded-2xl overflow-hidden">
                <AdPlacement placementId="article_sidebar" />
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
