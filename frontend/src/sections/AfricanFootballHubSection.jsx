import React, { useState } from 'react';
import { africanCountries } from '../data/mockData';
import { Globe2, Shield, Star, ChevronRight, Newspaper } from 'lucide-react';

export default function AfricanFootballHubSection({ onSelectCountryStory }) {
  const [selectedCountry, setSelectedCountry] = useState(africanCountries[0]);

  return (
    <section id="african-hub" className="py-14 bg-[#121218] border-b border-[#232332]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#232332] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Globe2 className="w-4 h-4 text-[#16A34A]" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#16A34A] font-['Montserrat']">
                PAN-AFRICAN SPORTS NETWORK
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#F9FAFB] uppercase tracking-tight font-['Montserrat']">
              AFRICAN FOOTBALL HUB (12 COUNTRY DESKS)
            </h2>
          </div>
          <span className="text-xs text-[#A1A1AA]">
            Dedicated correspondents across East, West, North & Southern Africa
          </span>
        </div>

        {/* 12 Country Flag Grid Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
          {africanCountries.map((c) => {
            const isSelected = selectedCountry.code === c.code;

            return (
              <button
                key={c.code}
                onClick={() => setSelectedCountry(c)}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition text-left ${
                  isSelected
                    ? 'bg-[#181822] border-[#D90429] shadow-[0_0_15px_rgba(217,4,41,0.25)]'
                    : 'bg-[#0B0B0F] border-[#232332] hover:border-[#444455]'
                }`}
              >
                <span className="text-2xl">{c.flag}</span>
                <div className="truncate">
                  <div className="text-xs font-black text-white font-['Montserrat'] truncate">{c.name}</div>
                  <div className="text-[10px] text-[#A1A1AA] truncate">{c.league}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Country Desk Feature Card */}
        <div className="bg-[#0B0B0F] border border-[#232332] rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-5xl">{selectedCountry.flag}</span>
                <div>
                  <h3 className="text-2xl font-black text-white font-['Montserrat'] uppercase">
                    {selectedCountry.name} News Desk
                  </h3>
                  <span className="text-xs text-[#16A34A] font-bold">Official Correspondent Active</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="bg-[#181822] p-3 rounded-xl border border-[#232332] flex justify-between items-center">
                  <span className="text-[#A1A1AA]">National League:</span>
                  <span className="font-bold text-white font-['Montserrat']">{selectedCountry.league}</span>
                </div>
                <div className="bg-[#181822] p-3 rounded-xl border border-[#232332] flex justify-between items-center">
                  <span className="text-[#A1A1AA]">Dominant Club:</span>
                  <span className="font-bold text-[#F59E0B] font-['Montserrat']">{selectedCountry.topClub}</span>
                </div>
                <div className="bg-[#181822] p-3 rounded-xl border border-[#232332] flex justify-between items-center">
                  <span className="text-[#A1A1AA]">Key Stars:</span>
                  <span className="font-bold text-white truncate max-w-[170px]">{selectedCountry.stars}</span>
                </div>
              </div>
            </div>

            {/* Desk Headlines */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center justify-between text-xs text-[#A1A1AA] mb-1">
                <span className="font-black uppercase tracking-wider text-[#EF233C] font-['Montserrat']">
                  Top Stories from {selectedCountry.name}
                </span>
                <span>Updated every 15 mins</span>
              </div>

              {[
                { title: `${selectedCountry.name} National Team Announces Provisional AFCON 2027 Roster`, time: "28m ago", reads: "8.4K" },
                { title: `${selectedCountry.league}: Weekend Blockbuster Derby Sells Out in Record 3 Hours`, time: "2h ago", reads: "12.1K" },
                { title: `Tactical Breakdown: How ${selectedCountry.topClub} Are Dominating the Domestic Circuit`, time: "5h ago", reads: "6.9K" }
              ].map((st, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-[#181822] border border-[#232332] hover:border-[#D90429]/50 transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-1 pr-4">
                    <h4 className="text-sm font-black text-white group-hover:text-[#EF233C] transition font-['Montserrat']">
                      {st.title}
                    </h4>
                    <span className="text-[11px] text-[#A1A1AA]">{st.time} • {st.reads} Reads</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#D90429] flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
