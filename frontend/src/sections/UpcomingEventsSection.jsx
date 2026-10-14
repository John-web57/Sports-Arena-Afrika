import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Trophy, ArrowRight, Sparkles, Filter, ExternalLink } from 'lucide-react';
import { upcomingEvents } from '../data/mockData';

export default function UpcomingEventsSection({ onSelectArticle, articles = [] }) {
  const [selectedSport, setSelectedSport] = useState('ALL');

  const sportsFilter = ['ALL', 'FOOTBALL', 'ATHLETICS', 'RUGBY', 'MOTORSPORT', 'BASKETBALL'];

  const filteredEvents = upcomingEvents.filter(ev => {
    if (selectedSport === 'ALL') return true;
    return ev.sport.toUpperCase() === selectedSport;
  });

  const handleEventClick = (ev) => {
    // Try to find a matching article for this event
    const match = articles.find(a => 
      (a.title && a.title.toLowerCase().includes(ev.sport.toLowerCase())) ||
      (Array.isArray(a.tags) && a.tags.some(t => ev.tags.includes(t)))
    );
    if (match && onSelectArticle) {
      onSelectArticle(match);
    } else {
      document.getElementById('latest-news')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="upcoming-events" className="py-14 bg-[#0E0E14] border-b border-[#232332]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 border-b border-[#232332] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Calendar className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#F59E0B] font-['Montserrat']">
                PAN-AFRICAN CALENDAR
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight font-['Montserrat']">
              UPCOMING SPORTING EVENTS
            </h2>
            <p className="text-xs text-[#A1A1AA] mt-1">
              Key African and international tournaments, championships, major matches, rallies, and athletic meets.
            </p>
          </div>

          {/* Sport Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
            {sportsFilter.map(s => (
              <button
                key={s}
                onClick={() => setSelectedSport(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider font-['Montserrat'] transition whitespace-nowrap ${
                  selectedSport === s
                    ? 'bg-[#F59E0B] text-black font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : 'bg-[#181822] text-[#A1A1AA] hover:text-white border border-[#232332]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(ev => (
            <div
              key={ev.id}
              onClick={() => handleEventClick(ev)}
              className="bg-[#121218] border border-[#232332] hover:border-[#F59E0B]/50 rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-xl hover:-translate-y-1"
            >
              <div>
                <div className="relative aspect-[16/9] overflow-hidden bg-[#181822]">
                  <img
                    src={ev.image || '/images/hero-stadium.jpg'}
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121218] via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#F59E0B] text-black text-[10px] font-black uppercase tracking-wider font-['Montserrat'] shadow">
                      {ev.sport}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-bold">
                      {ev.status}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#F59E0B] transition-colors leading-snug font-['Montserrat'] line-clamp-2">
                    {ev.title}
                  </h3>

                  <p className="text-xs text-[#A1A1AA] leading-relaxed line-clamp-2">
                    {ev.description}
                  </p>

                  <div className="pt-2 space-y-2 text-xs text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#F59E0B] flex-shrink-0" />
                      <span className="font-semibold text-white">{ev.date}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">{ev.time}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#EF233C] flex-shrink-0" />
                      <span className="truncate">{ev.venue}, {ev.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-[#1E1E2A] flex items-center justify-between text-xs text-[#A1A1AA] mt-2">
                <div className="flex items-center gap-1.5 pt-3">
                  {ev.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-[#181822] text-gray-400 font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>

                <span className="text-[#F59E0B] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-3">
                  <span>Preview Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
