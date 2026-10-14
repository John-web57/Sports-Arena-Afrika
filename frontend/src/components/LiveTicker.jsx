import React, { useState } from 'react';
import { Flame, Pause, Play, Sparkles, ArrowRight } from 'lucide-react';

export const defaultBreakingNewsItems = [
  { id: 1, type: 'BREAKING', desk: 'EPL', text: "Arsenal stun Liverpool 2-1 at the Emirates in gripping Premier League title showdown", badgeColor: 'bg-[#D90429]', articleId: 1 },
  { id: 2, type: 'KENYA', desk: 'FKF', text: "Gor Mahia officially seal historic 21st FKF Premier League championship title", badgeColor: 'bg-[#16A34A]', articleId: 2 },
  { id: 3, type: 'CAF', desk: 'DRAW', text: "CAF Champions League Quarter-Final: Al Ahly drawn against Mamelodi Sundowns", badgeColor: 'bg-[#EF233C]', articleId: 3 },
  { id: 4, type: 'NIGERIA', desk: 'SUPER EAGLES', text: "Victor Osimhen nets stunning hat-trick in European masterclass performance", badgeColor: 'bg-[#F59E0B]', articleId: 4 },
  { id: 5, type: 'TRANSFERS', desk: 'LA LIGA', text: "Transfer Radar: Real Madrid & Mbappé Champions League knockout focus", badgeColor: 'bg-[#2563EB]', articleId: 5 },
  { id: 6, type: 'HARAMBEE', desk: 'KENYA', text: "Harambee Stars confirm 26-man provisional squad for upcoming international tour", badgeColor: 'bg-[#8B5CF6]', articleId: 6 }
];

export const defaultTickerItems = defaultBreakingNewsItems;

export default function LiveTicker({ items = defaultBreakingNewsItems, onSelectNews }) {
  const [isPaused, setIsPaused] = useState(false);

  const displayList = items && items.length > 0 ? items : defaultBreakingNewsItems;

  return (
    <div className="dark-contrast-panel relative z-40 bg-[#0B0B0F]/95 backdrop-blur-md border-b border-[#232332] flex items-center h-10 sm:h-11 overflow-hidden select-none">
      {/* Ticker Brand Tag */}
      <div className="flex items-center gap-2 bg-[#D90429] text-white px-3 sm:px-4 h-full font-black text-xs uppercase tracking-wider font-['Montserrat'] z-10 flex-shrink-0 shadow-[2px_0_10px_rgba(0,0,0,0.5)] border-r border-[#232332]">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
        <span className="hidden sm:inline">BREAKING NEWS TICKER</span>
        <span className="sm:hidden">NEWS</span>
      </div>

      {/* Scrolling Continuous News Strip */}
      <div
        className="flex-1 overflow-hidden relative flex items-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className={`flex items-center space-x-8 text-xs font-medium text-[#F9FAFB] ${
            isPaused ? 'animate-none' : 'animate-ticker'
          }`}
        >
          {[...displayList, ...displayList].map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              onClick={() => onSelectNews && onSelectNews(item)}
              className="flex items-center space-x-2.5 whitespace-nowrap cursor-pointer hover:text-[#EF233C] transition group"
            >
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase text-white tracking-wider ${item.badgeColor || 'bg-[#D90429]'}`}>
                {item.type}
              </span>
              <span className="text-[#A1A1AA] text-[11px] font-semibold uppercase">[{item.desk}]</span>
              <span className="font-semibold tracking-wide group-hover:underline">{item.text}</span>
              <span className="text-[#232332] font-black">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pause / Play Control */}
      <div className="flex items-center px-3 h-full bg-[#0B0B0F] border-l border-[#232332] z-10">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="text-[#A1A1AA] hover:text-[#F9FAFB] transition p-1"
          title={isPaused ? "Resume Ticker Scrolling" : "Pause Ticker"}
        >
          {isPaused ? <Play className="w-3.5 h-3.5 text-[#16A34A]" /> : <Pause className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}
