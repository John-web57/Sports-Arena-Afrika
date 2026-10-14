import React from 'react';
import { BookOpen, TrendingUp, Sparkles, Clock, ArrowRight, UserCheck, Quote, ShieldAlert } from 'lucide-react';

export default function AnalysisFeaturesSection({ articles = [], onSelectArticle }) {
  // Find analysis and features articles
  const deepArticles = articles.filter(a => {
    if (!a) return false;
    const cat = String(a.categoryName || a.category || '').toUpperCase();
    const tags = Array.isArray(a.tags) ? a.tags.map(t => String(t).toUpperCase()) : [];
    return cat.includes('ANALYSIS') || cat.includes('FEATURE') || tags.includes('ANALYSIS') || tags.includes('FEATURES') || tags.includes('TACTICS');
  });

  const featuredAnalysis = deepArticles[0] || articles.find(a => String(a.title).toLowerCase().includes('tactical')) || articles[0];
  const secondaryAnalysis = deepArticles.slice(1, 4).length > 0 ? deepArticles.slice(1, 4) : articles.slice(1, 4);

  return (
    <section id="analysis-features" className="py-14 bg-[#121218] border-b border-[#232332]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 border-b border-[#232332] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <BookOpen className="w-4 h-4 text-[#3B82F6]" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#3B82F6] font-['Montserrat']">
                SPORTSARENA INVESTIGATIVE & TACTICAL DESK
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight font-['Montserrat']">
              EDITORIAL ANALYSIS & IN-DEPTH FEATURES
            </h2>
            <p className="text-xs text-[#A1A1AA] mt-1">
              Tactical breakdowns, structural data analysis, historical retrospectives, and deeper sports journalism.
            </p>
          </div>

          <span className="text-xs text-[#A1A1AA] font-mono">
            Long-form Journalism & Tactical Scrutiny
          </span>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Large Editorial Card */}
          {featuredAnalysis && (
            <div
              onClick={() => onSelectArticle && onSelectArticle(featuredAnalysis)}
              className="lg:col-span-7 bg-[#0B0B0F] border border-[#232332] hover:border-[#3B82F6]/60 rounded-2xl overflow-hidden p-6 sm:p-8 transition-all duration-300 group cursor-pointer flex flex-col justify-between shadow-2xl relative"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#60A5FA] text-xs font-black uppercase tracking-wider font-['Montserrat'] flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Tactical Analysis</span>
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-[#A1A1AA]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>6 min read</span>
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-[#60A5FA] transition-colors leading-tight font-['Montserrat']">
                  {featuredAnalysis.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed line-clamp-3">
                  {featuredAnalysis.summary || featuredAnalysis.excerpt || ''}
                </p>

                {/* Callout Quote Box */}
                <div className="p-4 rounded-xl bg-[#181822] border-l-4 border-[#3B82F6] italic text-xs text-gray-300">
                  <Quote className="w-4 h-4 text-[#3B82F6] inline-block mr-1 -mt-1" />
                  "Modern African club football is no longer won merely on physical duels, but in high-pressing transition corridors and tactical rest-defense."
                </div>
              </div>

              <div className="pt-6 border-t border-[#1E1E2A] flex items-center justify-between text-xs mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#181822] border border-[#3B82F6]/40 flex items-center justify-center font-bold text-xs text-[#60A5FA]">
                    SA
                  </div>
                  <div>
                    <div className="text-white font-bold">{featuredAnalysis.authorName || featuredAnalysis.author || 'Senior Tactical Analyst'}</div>
                    <div className="text-[10px] text-[#A1A1AA]">Sports Arena Editorial Board</div>
                  </div>
                </div>

                <span className="text-[#3B82F6] font-black uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Read Full Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          )}

          {/* Secondary Features Column */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            {secondaryAnalysis.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => onSelectArticle && onSelectArticle(item)}
                className="bg-[#0B0B0F] border border-[#232332] hover:border-[#3B82F6]/40 rounded-xl p-5 transition group cursor-pointer space-y-2 flex-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-black uppercase tracking-wider text-[#3B82F6] font-['Montserrat']">
                      {item.categoryName || item.category || 'Special Feature'}
                    </span>
                    <span className="text-gray-500 font-mono">5 min read</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#60A5FA] transition-colors leading-snug font-['Montserrat']">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#A1A1AA] line-clamp-2 mt-1">
                    {item.summary || item.excerpt || ''}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1E1E2A] flex items-center justify-between text-[10px] text-[#A1A1AA]">
                  <span>By {item.authorName || item.author || 'Sports Arena Staff'}</span>
                  <span className="text-gray-400 font-medium">{item.date || 'Recent'}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
