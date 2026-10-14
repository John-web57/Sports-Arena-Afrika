import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Eye, Clock, ArrowRight, Flame } from 'lucide-react';

export default function HeroBanner({ onSelectArticle, onJoinArena, articles = [] }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Group articles into sets of 3 for the Trending Magazine grid
  const pageSize = 3;
  const totalPages = Math.max(1, Math.ceil(articles.length / pageSize));

  // Auto-advance pages every 9 seconds when not hovered
  useEffect(() => {
    if (totalPages <= 1 || isHovered) return;
    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 9000);
    return () => clearInterval(timer);
  }, [totalPages, isHovered]);

  const currentArticles = articles.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  
  // Primary big story on left, and 2 stacked stories on right
  const mainStory = currentArticles[0] || articles[0] || {
    id: 1,
    title: 'Arsenal Stun Liverpool 2-1 at the Emirates in Gripping Title Race Showdown',
    summary: "Bukayo Saka and Gabriel Martinelli strike in each half as Mikel Arteta's Gunners withstand late pressure to secure three crucial points in London.",
    featuredImage: '/images/news-saka.jpg',
    categoryName: 'Premier League',
    publishedAt: 'September 29, 2026',
    authorName: 'SportsArena Staff'
  };

  const rightTopStory = currentArticles[1] || articles[1] || {
    id: 2,
    title: "Gor Mahia Clinch Historic 21st FKF Premier League Title in Machakos Thriller",
    featuredImage: '/images/hero-stadium.jpg',
    categoryName: 'Kenya',
    publishedAt: 'September 28, 2026',
    authorName: 'Wanjiru Mwangi'
  };

  const rightBottomStory = currentArticles[2] || articles[2] || {
    id: 3,
    title: "CAF Champions League Quarter-Final: Al Ahly Drawn Against Mamelodi Sundowns",
    featuredImage: '/images/news-liverpool.jpg',
    categoryName: 'African Football',
    publishedAt: 'September 28, 2026',
    authorName: 'Tariq El-Haddad'
  };

  const formatDisplayDate = (dateVal) => {
    if (!dateVal) return 'September 29, 2026';
    if (typeof dateVal === 'string' && (dateVal.includes('ago') || dateVal.includes('Today') || dateVal.includes('Yesterday'))) {
      return dateVal;
    }
    try {
      const d = new Date(dateVal);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      }
    } catch (e) {}
    return String(dateVal);
  };

  const handleCardClick = (article) => {
    if (onSelectArticle) {
      onSelectArticle(article);
    }
  };

  return (
    <section
      id="home"
      className="w-full bg-[#0B0B0F] border-b border-[#232332] py-6 sm:py-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Row: Green 'Trending' Pill Badge & Pagination Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-4 py-1.5 rounded-sm bg-[#52B74A] hover:bg-[#46a33f] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm font-['Montserrat']">
              Trending
            </span>
            <span className="hidden sm:inline-block text-xs text-[#A1A1AA] font-medium">
              Click any article to read the full story
            </span>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#A1A1AA] font-mono mr-1">
                {currentPage + 1} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1))}
                className="p-1.5 rounded bg-[#181822] hover:bg-[#232332] text-white border border-[#232332] transition"
                title="Previous Stories"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage((prev) => (prev + 1) % totalPages)}
                className="p-1.5 rounded bg-[#181822] hover:bg-[#232332] text-white border border-[#232332] transition"
                title="Next Stories"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Magazine Grid Layout (Replicating exact layout: Big Left Card + 2 Stacked Right Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
          
          {/* LEFT COLUMN: Large Main Featured Article (7 or 8 Cols) */}
          <div
            onClick={() => handleCardClick(mainStory)}
            className="dark-contrast-panel lg:col-span-7 xl:col-span-8 group relative rounded-xl overflow-hidden cursor-pointer bg-[#181822] border border-[#232332] shadow-2xl flex flex-col justify-end min-h-[380px] sm:min-h-[440px] lg:min-h-[500px] transition-all duration-300 hover:border-[#52B74A]/60"
            title="Click to read full article"
          >
            {/* Background Cover Image with Hover Zoom */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={mainStory.featuredImage || mainStory.image || '/images/hero-stadium.jpg'}
                alt={mainStory.title}
                className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-105 transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Bottom Dark Gradient for High Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            </div>

            {/* Content Overlay at the Bottom */}
            <div className="relative z-10 p-5 sm:p-7 md:p-8 space-y-2.5">
              {/* Publication Date */}
              <div className="text-xs sm:text-sm text-gray-300 font-medium">
                {formatDisplayDate(mainStory.publishedAt || mainStory.date)}
              </div>

              {/* Bold Large Article Title */}
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight font-['Montserrat'] group-hover:text-[#52B74A] transition-colors drop-shadow-md">
                {mainStory.title}
              </h2>

              {/* Article Excerpt / Summary */}
              {(mainStory.summary || mainStory.excerpt) && (
                <p className="text-xs sm:text-sm md:text-base text-gray-200 line-clamp-2 leading-relaxed font-normal max-w-2xl drop-shadow">
                  {mainStory.summary || mainStory.excerpt}
                </p>
              )}

              {/* Hover Indicator Prompt */}
              <div className="pt-1 flex items-center gap-1.5 text-xs font-bold text-[#52B74A] group-hover:translate-x-1 transition-transform">
                <span>Click to read full story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Two Stacked Featured Articles (5 or 4 Cols) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 lg:gap-5 justify-between">
            
            {/* 1. TOP STACKED CARD */}
            <div
              onClick={() => handleCardClick(rightTopStory)}
              className="dark-contrast-panel group relative rounded-xl overflow-hidden cursor-pointer bg-[#181822] border border-[#232332] shadow-xl flex flex-col justify-end h-[220px] sm:h-[240px] lg:h-[240px] transition-all duration-300 hover:border-[#10B981]/60"
              title="Click to read full article"
            >
              {/* Background Cover Image */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={rightTopStory.featuredImage || rightTopStory.image || '/images/hero-stadium.jpg'}
                  alt={rightTopStory.title}
                  className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-105 transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              </div>

              {/* Bottom Information Banner with Green-tinted Accent */}
              <div className="relative z-10 p-4 sm:p-5 bg-gradient-to-t from-[#064E3B]/95 via-[#064E3B]/80 to-transparent backdrop-blur-[2px] border-t border-[#10B981]/30 space-y-1.5">
                <div className="text-[11px] sm:text-xs text-emerald-200/90 font-medium">
                  {formatDisplayDate(rightTopStory.publishedAt || rightTopStory.date)}
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-white leading-snug line-clamp-2 font-['Montserrat'] group-hover:underline">
                  {rightTopStory.title}
                </h3>
              </div>
            </div>

            {/* 2. BOTTOM STACKED CARD */}
            <div
              onClick={() => handleCardClick(rightBottomStory)}
              className="dark-contrast-panel group relative rounded-xl overflow-hidden cursor-pointer bg-[#181822] border border-[#232332] shadow-xl flex flex-col justify-end h-[220px] sm:h-[240px] lg:h-[240px] transition-all duration-300 hover:border-[#F59E0B]/60"
              title="Click to read full article"
            >
              {/* Background Cover Image */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={rightBottomStory.featuredImage || rightBottomStory.image || '/images/hero-stadium.jpg'}
                  alt={rightBottomStory.title}
                  className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-105 transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              </div>

              {/* Bottom Information Banner with Amber/Golden-tinted Accent */}
              <div className="relative z-10 p-4 sm:p-5 bg-gradient-to-t from-[#78350F]/95 via-[#78350F]/80 to-transparent backdrop-blur-[2px] border-t border-[#F59E0B]/30 space-y-1.5">
                <div className="text-[11px] sm:text-xs text-amber-200/90 font-medium">
                  {formatDisplayDate(rightBottomStory.publishedAt || rightBottomStory.date)}
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-white leading-snug line-clamp-2 font-['Montserrat'] group-hover:underline">
                  {rightBottomStory.title}
                </h3>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
