import React from 'react';
import { Award, Flame, Play, ChevronRight } from 'lucide-react';

export default function WomensFootballSection() {
  const stories = [
    {
      id: 'w1',
      title: "WAFCON 2026: Nigeria's Super Falcons & South Africa's Banyana Banyana Gear Up for Continental Clash",
      category: "WAFCON",
      date: "3 hours ago",
      image: "/images/news-liverpool.jpg",
      reads: "14.2K"
    },
    {
      id: 'w2',
      title: "FKF Women's Premier League: Kenya Police Bullets Extend Unbeaten Run with Commanding Win",
      category: "FKF Women's League",
      date: "5 hours ago",
      image: "/images/hero-stadium.jpg",
      reads: "8.7K"
    },
    {
      id: 'w3',
      title: "UEFA Women's Champions League: Asisat Oshoala & Barbra Banda Lighting up European Knockouts",
      category: "UWCL",
      date: "Yesterday",
      image: "/images/news-saka.jpg",
      reads: "19.5K"
    }
  ];

  return (
    <section id="womens-football" className="py-14 bg-[#0B0B0F] border-b border-[#232332]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#232332] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF233C]"></span>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#EF233C] font-['Montserrat']">
                CONTINENTAL & GLOBAL COVERAGE
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#F9FAFB] uppercase tracking-tight font-['Montserrat']">
              WOMEN'S FOOTBALL HUB
            </h2>
          </div>
          <span className="text-xs text-[#A1A1AA]">
            WAFCON • FKF Women's League • UEFA Women's Champions League
          </span>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((s) => (
            <div
              key={s.id}
              className="group rounded-2xl overflow-hidden bg-[#121218] border border-[#232332] hover:border-[#D90429]/50 transition flex flex-col justify-between shadow-lg"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-[#181822]">
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#EF233C] text-white text-[10px] font-black uppercase tracking-wider font-['Montserrat']">
                  {s.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <h3 className="text-base font-black text-white group-hover:text-[#EF233C] transition font-['Montserrat'] leading-snug">
                  {s.title}
                </h3>

                <div className="pt-3 border-t border-[#232332] flex items-center justify-between text-xs text-[#A1A1AA]">
                  <span>{s.date}</span>
                  <span>{s.reads} Reads</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
