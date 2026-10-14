import React from 'react';
import { adminTrafficStats, topTeamsAnalytics, topPlayersAnalytics } from '../data/mockData';
import { BarChart3, Globe, Search, TrendingUp, Users, ArrowUpRight, Shield, Award, CheckCircle, FileCode } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="p-6 sm:p-8 space-y-8 bg-[#0B0B0F] min-h-screen text-[#F9FAFB]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#232332] gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#EF233C] font-['Montserrat']">
            TRAFFIC, RANKINGS & GOOGLE SEARCH CONSOLE (PHASE 8)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Montserrat'] uppercase mt-1">
            PAN-AFRICAN AUDIENCE & SEO ANALYTICS
          </h1>
        </div>

        {/* Structured Data & Sitemap Indicator */}
        <div className="flex items-center gap-2 bg-[#121218] border border-[#232332] px-3.5 py-1.5 rounded-xl">
          <FileCode className="w-4 h-4 text-[#16A34A]" />
          <div className="text-xs">
            <span className="text-zinc-400">XML Sitemap: </span>
            <span className="text-green-400 font-bold">Generated (sitemap.xml)</span>
          </div>
        </div>
      </div>

      {/* Top 4 Traffic KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Visitors Today", val: adminTrafficStats.visitorsToday.toLocaleString(), sub: "+24.2% week-on-week" },
          { label: "Pageviews Today", val: adminTrafficStats.pageviewsToday.toLocaleString(), sub: "3.75 pages per session" },
          { label: "Avg Session Duration", val: adminTrafficStats.avgTimeOnSite, sub: "High reader engagement" },
          { label: "Real-time Concurrents", val: adminTrafficStats.liveVisitors.toLocaleString(), sub: "Active now on site" }
        ].map((stat, i) => (
          <div key={i} className="bg-[#121218] border border-[#232332] rounded-xl p-5 shadow">
            <span className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider font-['Montserrat']">{stat.label}</span>
            <div className="text-3xl font-black text-white font-mono mt-1">{stat.val}</div>
            <span className="text-xs text-[#16A34A] font-semibold mt-1 block">{stat.sub}</span>
          </div>
        ))}
      </div>

      {/* Row 2: Most Searched Clubs & Most Searched Players */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Most Searched Clubs */}
        <div className="lg:col-span-6 bg-[#121218] border border-[#232332] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#232332]">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#D90429]" />
              <h3 className="text-sm font-black uppercase text-white font-['Montserrat']">
                Top Teams • Most Searched Clubs
              </h3>
            </div>
            <span className="text-xs text-[#A1A1AA]">Search Volume</span>
          </div>

          <div className="divide-y divide-[#232332]">
            {topTeamsAnalytics.map((t, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{t.name}</span>
                  <span className="text-[11px] text-zinc-500">{t.league}</span>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="font-mono font-bold text-white block">{t.searches}</span>
                    <span className="text-[10px] text-zinc-500">Searches</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-green-500/20 text-green-400 font-bold font-mono text-[11px]">
                    {t.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Searched Players */}
        <div className="lg:col-span-6 bg-[#121218] border border-[#232332] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#232332]">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-black uppercase text-white font-['Montserrat']">
                Top Players • Most Searched Athletes
              </h3>
            </div>
            <span className="text-xs text-[#A1A1AA]">Search Volume</span>
          </div>

          <div className="divide-y divide-[#232332]">
            {topPlayersAnalytics.map((p, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{p.name}</span>
                  <span className="text-[11px] text-zinc-500">{p.club}</span>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="font-mono font-bold text-white block">{p.searches}</span>
                    <span className="text-[10px] text-zinc-500">Searches</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-green-500/20 text-green-400 font-bold font-mono text-[11px]">
                    {p.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Traffic by African Country & Google Search Console Keywords */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (6 Cols): Traffic by African Country */}
        <div className="lg:col-span-6 bg-[#121218] border border-[#232332] rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#232332]">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#16A34A]" />
              <h3 className="text-sm font-black uppercase text-white font-['Montserrat']">
                Audience by African Country
              </h3>
            </div>
            <span className="text-xs text-[#A1A1AA]">Geographic Breakdown</span>
          </div>

          <div className="space-y-3">
            {adminTrafficStats.topCountries.map((c, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white flex items-center gap-2">
                    <span>{c.flag}</span>
                    <span>{c.country}</span>
                  </span>
                  <span className="font-mono text-[#F9FAFB]">{c.visits.toLocaleString()} ({c.percent}%)</span>
                </div>
                <div className="h-2 w-full bg-[#181822] rounded-full overflow-hidden">
                  <div
                    className="bg-[#D90429] h-full rounded-full transition-all duration-700"
                    style={{ width: `${c.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (6 Cols): Google Search Console Keywords */}
        <div className="lg:col-span-6 bg-[#121218] border border-[#232332] rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#232332]">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#2563EB]" />
              <h3 className="text-sm font-black uppercase text-white font-['Montserrat']">
                Google Search Console Rankings
              </h3>
            </div>
            <span className="text-xs text-[#A1A1AA]">Organic Keywords</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181822] text-[#A1A1AA] uppercase tracking-wider font-bold border-b border-[#232332]">
                <tr>
                  <th className="py-2.5 px-3">Search Query</th>
                  <th className="py-2.5 px-2 text-center">Pos</th>
                  <th className="py-2.5 px-2 text-center">CTR</th>
                  <th className="py-2.5 px-3 text-right">Clicks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232332] text-white">
                {adminTrafficStats.topSearchKeywords.map((kw, i) => (
                  <tr key={i} className="hover:bg-[#181822]/60">
                    <td className="py-3 px-3 font-semibold text-white truncate max-w-[200px]">
                      {kw.keyword}
                    </td>
                    <td className="py-3 px-2 text-center font-mono font-bold text-[#16A34A]">
                      {kw.position}
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-[#F59E0B]">
                      {kw.ctr}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white">
                      {kw.clicks.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
