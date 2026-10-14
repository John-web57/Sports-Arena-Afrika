import React, { useState } from 'react';
import { ArrowRightLeft, Flame, CheckCircle, Clock, ShieldAlert, AlertCircle, ArrowRight, Sparkles, UserCheck } from 'lucide-react';

export const comprehensiveTransferData = {
  'CONFIRMED DEALS': [
    {
      id: 'tr1',
      player: 'Victor Osimhen',
      fromClub: 'Napoli',
      toClub: 'Chelsea FC',
      fee: '€75,000,000',
      type: 'Confirmed Deal',
      probability: 100,
      source: 'Fabrizio Romano',
      status: 'Medical Booked in London',
      date: 'Today',
      badgeColor: 'bg-[#16A34A]'
    },
    {
      id: 'tr2',
      player: 'Benson Omalla',
      fromClub: 'Gor Mahia (Kenya)',
      toClub: 'JS Kabylie (Algeria)',
      fee: '$250,000',
      type: 'Confirmed Deal',
      probability: 100,
      source: 'SportsArena Kenya',
      status: 'Official 3-Year Contract',
      date: 'Yesterday',
      badgeColor: 'bg-[#16A34A]'
    },
    {
      id: 'tr3',
      player: 'Kylian Mbappé',
      fromClub: 'Paris Saint-Germain',
      toClub: 'Real Madrid',
      fee: 'Free Transfer (Signed)',
      type: 'Confirmed Deal',
      probability: 100,
      source: 'Marca Spain',
      status: 'Presented at Bernabéu',
      date: 'This Week',
      badgeColor: 'bg-[#16A34A]'
    }
  ],
  'RUMOURS': [
    {
      id: 'tr4',
      player: 'Mohamed Salah',
      fromClub: 'Liverpool',
      toClub: 'Al-Ittihad (Saudi Arabia)',
      fee: '£120,000,000',
      type: 'Transfer Rumour',
      probability: 65,
      source: 'The Athletic UK',
      status: 'Contract talks ongoing',
      date: 'Today',
      badgeColor: 'bg-[#F59E0B]'
    },
    {
      id: 'tr5',
      player: 'Michael Olunga',
      fromClub: 'Al-Duhail SC',
      toClub: 'Besiktas (Turkey)',
      fee: '€4,500,000',
      type: 'Transfer Rumour',
      probability: 70,
      source: 'Fanatik Istanbul',
      status: 'Formal bid submitted',
      date: 'Today',
      badgeColor: 'bg-[#F59E0B]'
    },
    {
      id: 'tr6',
      player: 'Ademola Lookman',
      fromClub: 'Atalanta',
      toClub: 'Paris Saint-Germain',
      fee: '€55,000,000',
      type: 'Transfer Rumour',
      probability: 78,
      source: 'L\'Equipe France',
      status: 'Personal terms agreed',
      date: 'Yesterday',
      badgeColor: 'bg-[#F59E0B]'
    }
  ],
  'DEADLINE DAY': [
    {
      id: 'tr7',
      player: 'Austin Odhiambo',
      fromClub: 'Gor Mahia',
      toClub: 'Simba SC (Tanzania)',
      fee: '$180,000',
      type: 'Deadline Day Radar',
      probability: 85,
      source: 'Azam Sports News',
      status: 'Paperwork submitted',
      date: 'Deadline Day',
      badgeColor: 'bg-[#EF233C]'
    },
    {
      id: 'tr8',
      player: 'Nico Williams',
      fromClub: 'Athletic Club Bilbao',
      toClub: 'Arsenal FC',
      fee: '€58,000,000 Release Clause',
      type: 'Deadline Day Radar',
      probability: 60,
      source: 'Sky Sports News',
      status: 'Arteta pushing for agreement',
      date: 'Deadline Day',
      badgeColor: 'bg-[#EF233C]'
    }
  ],
  'FREE AGENTS': [
    {
      id: 'tr9',
      player: 'Anthony Martial',
      fromClub: 'Manchester United (Released)',
      toClub: 'AEK Athens',
      fee: 'Free Transfer',
      type: 'Free Agent',
      probability: 90,
      source: 'BBC Sport',
      status: 'Contract finalized',
      date: 'Recent',
      badgeColor: 'bg-[#8B5CF6]'
    },
    {
      id: 'tr10',
      player: 'Adrien Rabiot',
      fromClub: 'Juventus (Contract Expired)',
      toClub: 'Olympique Marseille',
      fee: 'Free Transfer',
      type: 'Free Agent',
      probability: 95,
      source: 'RMC Sport',
      status: 'Medical completed',
      date: 'Recent',
      badgeColor: 'bg-[#8B5CF6]'
    }
  ],
  'CONTRACT RENEWALS': [
    {
      id: 'tr11',
      player: 'Bukayo Saka',
      fromClub: 'Arsenal FC',
      toClub: 'Arsenal FC (Extension)',
      fee: 'New 5-Year Contract',
      type: 'Contract Renewal',
      probability: 100,
      source: 'Arsenal Media',
      status: 'Signed until 2030',
      date: 'Official',
      badgeColor: 'bg-[#10B981]'
    },
    {
      id: 'tr12',
      player: 'Vinícius Júnior',
      fromClub: 'Real Madrid',
      toClub: 'Real Madrid (Extension)',
      fee: '€1B Buyout Clause',
      type: 'Contract Renewal',
      probability: 100,
      source: 'Real Madrid CF',
      status: 'Signed until 2029',
      date: 'Official',
      badgeColor: 'bg-[#10B981]'
    }
  ]
};

export default function TransferCentreSection({ onSelectArticle }) {
  const [activeTab, setActiveTab] = useState('CONFIRMED DEALS');

  const tabs = ['CONFIRMED DEALS', 'RUMOURS', 'DEADLINE DAY', 'FREE AGENTS', 'CONTRACT RENEWALS'];
  const currentDeals = comprehensiveTransferData[activeTab] || comprehensiveTransferData['CONFIRMED DEALS'];

  return (
    <section id="transfer-centre" className="py-14 bg-[#0B0B0F] border-b border-[#232332]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#232332] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <ArrowRightLeft className="w-4 h-4 text-[#EF233C]" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#EF233C] font-['Montserrat']">
                PAN-AFRICAN & GLOBAL TRANSFER DESK
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight font-['Montserrat']">
              TRANSFER CENTRE
            </h2>
          </div>

          {/* Transfer Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider font-['Montserrat'] transition whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-[#D90429] text-white shadow-sports-glow'
                    : 'bg-[#181822] text-[#A1A1AA] hover:text-white border border-[#232332]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column: Left Biggest Transfer Story Feature (5 Cols), Right Active Transfers List (7 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Biggest Transfer Story */}
          <div className="lg:col-span-5 bg-[#121218] border border-[#232332] hover:border-[#EF233C]/50 rounded-2xl overflow-hidden shadow-2xl transition group flex flex-col justify-between">
            <div>
              <div className="relative h-56 sm:h-64 overflow-hidden bg-[#0B0B0F]">
                <img
                  src="/images/news-saka.jpg"
                  alt="Victor Osimhen Transfer"
                  className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#D90429] text-white text-[10px] font-black uppercase tracking-wider font-['Montserrat'] shadow-md flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-current" />
                  <span>BIGGEST TRANSFER STORY</span>
                </div>
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-[11px] font-mono font-bold text-[#16A34A] border border-[#16A34A]/40">
                  Fee: €75,000,000
                </div>
              </div>

              <div className="p-6 space-y-3">
                <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider block">
                  Chelsea FC • Napoli • Summer Window
                </span>
                <h3 className="text-xl font-black text-white group-hover:text-[#EF233C] transition font-['Montserrat']">
                  Victor Osimhen Agrees Personal Terms Ahead of Record-Breaking Chelsea Move
                </h3>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  The Nigerian international has concluded formal personal negotiations on a 5-year agreement at Stamford Bridge. Medical scheduled in London with formal announcement pending.
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => onSelectArticle && onSelectArticle({
                  title: 'Victor Osimhen Agrees Personal Terms Ahead of Record-Breaking Chelsea Move',
                  category: 'Transfers',
                  author: 'Fabrizio Romano / SportsArena Staff',
                  image: '/images/news-saka.jpg',
                  content: "Victor Osimhen's long-awaited move to Chelsea has taken a decisive step forward. Napoli and Chelsea representatives met in Milan to iron out the €75M release clause structure."
                })}
                className="w-full py-3 rounded-xl bg-sports-gradient text-white text-xs font-black uppercase tracking-wider font-['Montserrat'] shadow-sports-glow hover:opacity-95 transition flex items-center justify-center gap-2"
              >
                <span>READ FULL TRANSFER STORY</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Dynamic Transfer Deals Cards */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#232332]">
              <span className="text-xs font-black uppercase tracking-wider text-[#A1A1AA] font-['Montserrat']">
                {activeTab} DIRECTORY ({currentDeals.length})
              </span>
              <span className="text-[11px] text-[#EF233C] font-semibold">
                Updated in Real-Time by SportsArena Editors
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="bg-[#121218] border border-[#232332] hover:border-[#EF233C]/40 rounded-xl p-4 shadow-lg flex flex-col justify-between transition group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider text-white ${deal.badgeColor}`}>
                        {deal.type}
                      </span>
                      <span className="text-[#A1A1AA] text-[10px] font-mono font-bold">
                        {deal.probability}% Verified
                      </span>
                    </div>

                    <h4 className="text-base font-black text-white group-hover:text-[#EF233C] transition font-['Montserrat'] mb-1">
                      {deal.player}
                    </h4>
                    <span className="text-xs font-bold text-[#D90429] font-mono block mb-3">
                      Fee: {deal.fee}
                    </span>

                    {/* From / To Clubs Box */}
                    <div className="bg-[#181822] p-2.5 rounded-lg space-y-1.5 border border-[#232332] text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[#777788]">From:</span>
                        <span className="font-bold text-white font-['Montserrat'] truncate max-w-[130px]">{deal.fromClub}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#777788]">To:</span>
                        <span className="font-bold text-[#16A34A] font-['Montserrat'] truncate max-w-[130px]">{deal.toClub}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#232332] text-[10px] text-[#A1A1AA] flex items-center justify-between">
                    <span>Source: {deal.source}</span>
                    <span className="text-white font-semibold">{deal.status}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Transfer Deadline Countdown Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#D90429]/20 via-[#181822] to-[#121218] border border-[#D90429]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#EF233C] block font-['Montserrat']">
                  SUMMER TRANSFER WINDOW DEADLINE
                </span>
                <span className="text-sm font-bold text-white">
                  Coverage active across Premier League, CAF & African Leagues
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono font-black text-xs text-white bg-[#0B0B0F] px-3 py-1.5 rounded-lg border border-[#232332]">
                <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>31 DAYS : 14 HRS : 22 MINS</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
