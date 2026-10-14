import React, { useState, useMemo } from 'react';
import { Search, X, TrendingUp, Shield, Trophy, Globe, Clock, ArrowRight, BookOpen } from 'lucide-react';

const CLUB_KEYWORDS = [
  'arsenal', 'liverpool', 'gor mahia', 'al ahly', 'sundowns', 'mamelodi sundowns', 
  'galatasaray', 'real madrid', 'barcelona', 'chelsea', 'manchester', 'afc leopards',
  'simba', 'esperance', 'tp mazembe', 'rs berkane', 'tusker', 'shabana'
];

const COUNTRY_KEYWORDS = [
  'kenya', 'nigeria', 'egypt', 'south africa', 'england', 'morocco', 'tanzania', 
  'ghana', 'uganda', 'cameroon', 'senegal', 'spain', 'algeria', 'ivory coast'
];

export default function SearchModal({ isOpen, onClose, onSelectTopic, articles = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const popularSearches = [
    'Faith Kipyegon world record',
    'Gor Mahia 21st FKF title',
    'Kenya 7s Shujaa HSBC SVNS',
    'CAF Champions League draw',
    'WRC Safari Rally Kenya',
    'Al Ahly vs Mamelodi Sundowns',
    'Harambee Stars AFCON squad',
    'Basketball Africa League BAL'
  ];

  const topClubs = ['Gor Mahia', 'Arsenal', 'Al Ahly', 'Mamelodi Sundowns', 'Nairobi City Thunder', 'Kenya Shujaa', 'Real Madrid'];
  const topCountries = ['Kenya', 'Nigeria', 'Egypt', 'South Africa', 'Uganda', 'Tanzania', 'Morocco', 'Ghana'];
  const topCategories = ['Kenya Sports', 'African Football', 'Athletics', 'Rugby', 'Basketball', 'Motorsport', 'Analysis', 'Transfers'];

  const filterOptions = [
    { id: 'ALL', label: 'All Results' },
    { id: 'ARTICLES', label: 'Articles' },
    { id: 'CLUBS', label: 'Teams & Clubs' },
    { id: 'COUNTRIES', label: 'Countries' }
  ];

  // Accurately filter articles based on search query AND active filter tab
  const matchedArticles = useMemo(() => {
    let pool = articles || [];

    // Filter by type constraint
    if (filterType === 'CLUBS') {
      pool = pool.filter(a => {
        const text = `${a.title || ''} ${a.league || ''} ${(a.tags || []).join(' ')}`.toLowerCase();
        return CLUB_KEYWORDS.some(c => text.includes(c));
      });
    } else if (filterType === 'COUNTRIES') {
      pool = pool.filter(a => {
        const ctry = String(a.country || '').toLowerCase();
        const text = `${a.title || ''} ${(a.tags || []).join(' ')}`.toLowerCase();
        return ctry !== '' || COUNTRY_KEYWORDS.some(c => text.includes(c));
      });
    }

    if (!searchTerm.trim()) {
      return filterType === 'ALL' ? [] : pool;
    }

    const term = searchTerm.toLowerCase().trim();
    return pool.filter(a => {
      const title = (a.title || '').toLowerCase();
      const cat = (a.categoryName || a.category || '').toLowerCase();
      const summary = (a.excerpt || a.summary || a.metaDesc || '').toLowerCase();
      const author = (a.authorName || a.author || '').toLowerCase();
      const country = (a.country || '').toLowerCase();
      const league = (a.league || '').toLowerCase();
      const tags = (a.tags || []).map(t => String(t).toLowerCase());

      return (
        title.includes(term) ||
        cat.includes(term) ||
        summary.includes(term) ||
        author.includes(term) ||
        country.includes(term) ||
        league.includes(term) ||
        tags.some(t => t.includes(term))
      );
    });
  }, [articles, searchTerm, filterType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="bg-[#121218] border border-[#232332] rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col max-h-[85vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#232332] flex items-center gap-3 bg-[#181822]">
          <Search className="w-5 h-5 text-[#EF233C] flex-shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search news, clubs, countries, or players..."
            className="flex-1 bg-transparent text-white placeholder-[#777788] focus:outline-none text-sm sm:text-base font-medium"
            autoFocus
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-[#232332]"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#A1A1AA] hover:text-white rounded-full bg-[#232332] hover:bg-[#D90429] transition"
            title="Close Search (ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="px-5 py-2.5 bg-[#0B0B0F] border-b border-[#232332] flex items-center gap-2 overflow-x-auto scrollbar-none flex-shrink-0">
          {filterOptions.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider font-['Montserrat'] transition whitespace-nowrap ${
                filterType === f.id
                  ? 'bg-gradient-to-r from-[#D90429] to-[#EF233C] text-white shadow-sports-glow'
                  : 'bg-[#181822] text-[#A1A1AA] hover:text-white hover:bg-[#232332]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Results Area */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 min-h-0">
          {searchTerm.trim() || filterType !== 'ALL' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#A1A1AA] uppercase tracking-wider font-['Montserrat']">
                  {matchedArticles.length} {matchedArticles.length === 1 ? 'Article' : 'Articles'} Found
                </span>
                {filterType !== 'ALL' && (
                  <span className="text-[11px] text-[#EF233C] font-bold uppercase tracking-wider font-['Montserrat']">
                    Filtered by {filterType}
                  </span>
                )}
              </div>

              {matchedArticles.length > 0 ? (
                <div className="space-y-2.5">
                  {matchedArticles.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => {
                        if (onSelectTopic) onSelectTopic(art);
                        onClose();
                      }}
                      className="p-3.5 bg-[#181822] hover:bg-[#1E1E2C] rounded-2xl border border-[#232332] hover:border-[#EF233C]/60 cursor-pointer transition flex items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1.5 pr-2 min-w-0">
                        <span className="text-xs sm:text-sm font-bold text-white group-hover:text-[#EF233C] transition line-clamp-2 leading-snug">
                          {art.title}
                        </span>
                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                          <span className="px-2 py-0.5 rounded-full bg-[#D90429]/20 text-[#EF233C] font-black uppercase font-['Montserrat']">
                            {art.categoryName || art.category || 'Sports'}
                          </span>
                          {art.country && (
                            <span className="text-gray-400 font-medium">
                              📍 {art.country}
                            </span>
                          )}
                          <span className="text-[#777788] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {art.readTime || art.readingTime || 3} min read
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#EF233C] font-black uppercase font-['Montserrat'] flex-shrink-0 group-hover:translate-x-1 transition-transform">
                        <span>Read</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-xs text-[#A1A1AA] bg-[#181822]/40 rounded-2xl border border-[#232332] p-6">
                  <p className="font-bold text-sm text-gray-300">No matching sports articles found</p>
                  <p className="mt-1 text-gray-400">Try checking spelling or exploring popular categories below.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {/* Quick Topic suggestions */}
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#A1A1AA] font-['Montserrat'] mb-2.5">
                  <TrendingUp className="w-4 h-4 text-[#D90429]" />
                  <span>Trending Headlines</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSearchTerm(item)}
                      className="px-3 py-1.5 rounded-full bg-[#181822] hover:bg-[#D90429] hover:text-white text-[#A1A1AA] text-xs font-semibold transition border border-[#232332]"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clubs Quick Filters */}
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#A1A1AA] font-['Montserrat'] mb-2.5">
                  <Trophy className="w-4 h-4 text-[#F59E0B]" />
                  <span>African & World Clubs</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {topClubs.map((club, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setFilterType('CLUBS');
                        setSearchTerm(club);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#181822] hover:bg-[#F59E0B] hover:text-black text-gray-200 text-xs font-bold transition border border-[#232332] font-['Montserrat']"
                    >
                      {club}
                    </button>
                  ))}
                </div>
              </div>

              {/* Countries Quick Filters */}
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#A1A1AA] font-['Montserrat'] mb-2.5">
                  <Globe className="w-4 h-4 text-[#16A34A]" />
                  <span>Browse by Country Desk</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {topCountries.map((country, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setFilterType('COUNTRIES');
                        setSearchTerm(country);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#181822] hover:bg-[#16A34A] hover:text-white text-gray-200 text-xs font-bold transition border border-[#232332] font-['Montserrat']"
                    >
                      {country}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3.5 px-5 border-t border-[#232332] bg-[#0E0E14] flex items-center justify-between text-xs text-[#777788] flex-shrink-0">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-[#181822] text-gray-300 font-mono text-[10px]">ESC</kbd> to exit</span>
          <span className="text-[#EF233C] font-bold font-['Montserrat'] uppercase tracking-wider text-[10px]">Sports Arena News Search</span>
        </div>

      </div>
    </div>
  );
}
