import React from 'react';
import { Hash, Flame, X, Sparkles } from 'lucide-react';

export const defaultTrendingTags = [
  'Arsenal',
  'TransferRadar',
  'GorMahia',
  'HarambeeStars',
  'AFCON2027',
  'BukayoSaka',
  'CAF',
  'PremierLeague',
  'VictorOsimhen',
  'BensonOmalla'
];

export default function TrendingTagsRibbon({ activeTag, onSelectTag, onClearTag }) {
  const handleTagClick = (tag) => {
    if (activeTag === tag) {
      if (onClearTag) onClearTag();
    } else {
      if (onSelectTag) onSelectTag(tag);
      const el = document.getElementById('latest-news');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#0B0B0F] border-b border-[#232332] py-3 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 py-2 px-3 rounded-2xl bg-[#121218] border border-[#232332]">
          
          {/* Tag Pills Track */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#EF233C] font-['Montserrat'] flex items-center gap-1.5 flex-shrink-0">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>TRENDING TAGS:</span>
            </span>

            {defaultTrendingTags.map((tag) => {
              const isActive = activeTag && activeTag.toLowerCase() === tag.toLowerCase();

              return (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1 ${
                    isActive
                      ? 'bg-[#EF233C] text-white shadow-sports-glow font-bold'
                      : 'bg-[#181822] text-[#A1A1AA] hover:text-white hover:bg-[#232332] border border-[#232332]'
                  }`}
                >
                  <Hash className="w-3 h-3 text-[#EF233C]" />
                  <span>{tag}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tag Clear Indicator */}
          {activeTag && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-[#A1A1AA]">
                Filtered by <strong className="text-[#EF233C]">#{activeTag}</strong>
              </span>
              <button
                onClick={onClearTag}
                className="px-2 py-0.5 rounded-full bg-[#181822] hover:bg-[#D90429] hover:text-white text-xs text-[#A1A1AA] border border-[#232332] flex items-center gap-1 transition"
                title="Clear tag filter"
              >
                <X className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
