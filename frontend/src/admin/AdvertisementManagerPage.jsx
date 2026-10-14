import React, { useState } from 'react';
import {
  DollarSign, TrendingUp, MousePointerClick, Eye, Sparkles, Plus,
  Search, Filter, CheckCircle2, PauseCircle, Clock, AlertTriangle,
  ExternalLink, Trash2, Edit3, Image, Video, Globe, Smartphone,
  Monitor, Calendar, ChevronRight, ShieldCheck, Check, Layers, BarChart3,
  RefreshCw
} from 'lucide-react';
import {
  getStoredAds,
  saveStoredAds,
  getStoredSponsors,
  saveStoredSponsors,
  AD_PLACEMENTS,
  AD_TYPES,
  GEOGRAPHIC_TRAFFIC_DATA,
  DEVICE_METRICS
} from '../data/mockAds';

export default function AdvertisementManagerPage() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'all' | 'create' | 'sponsors' | 'analytics' | 'placements'
  const [ads, setAds] = useState(() => getStoredAds());
  const [sponsors, setSponsors] = useState(() => getStoredSponsors());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPlacement, setFilterPlacement] = useState('ALL');
  const [toastMessage, setToastMessage] = useState(null);

  // New Ad Form State
  const [formData, setFormData] = useState({
    title: '',
    sponsorId: sponsors[0]?.id || 1,
    type: 'Hero Banner Advertisement',
    placementId: 'homepage_hero',
    headline: '',
    subtext: '',
    badgeText: 'SPONSORED',
    ctaText: 'Learn More',
    targetUrl: 'https://',
    imageUrl: '/images/ads/safaricom-ad.svg',
    videoUrl: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-12-31',
    status: 'Active',
    priority: 2,
    deviceTargeting: 'All'
  });

  // New Sponsor Form State (Modal)
  const [isAddSponsorOpen, setIsAddSponsorOpen] = useState(false);
  const [sponsorForm, setSponsorForm] = useState({
    name: '',
    category: 'Sports & Entertainment',
    logo: '/images/ads/logo-safaricom.svg',
    contactEmail: '',
    website: 'https://',
    country: 'Kenya'
  });

  // Monetization Integrations Toggles
  const [integrations, setIntegrations] = useState({
    googleAdSense: true,
    googleAdManager: true,
    directSponsors: true,
    videoSponsors: true,
    sponsoredArticles: true,
    newsletterSponsors: true
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle Ad Status (Active <-> Paused)
  const handleToggleStatus = (adId) => {
    const updated = ads.map(a => {
      if (a.id === adId) {
        const nextStatus = a.status === 'Active' ? 'Paused' : 'Active';
        return { ...a, status: nextStatus };
      }
      return a;
    });
    setAds(updated);
    saveStoredAds(updated);
    showToast('Advertisement status updated successfully');
  };

  // Delete Ad
  const handleDeleteAd = (adId) => {
    if (window.confirm('Are you sure you want to remove this advertisement?')) {
      const updated = ads.filter(a => a.id !== adId);
      setAds(updated);
      saveStoredAds(updated);
      showToast('Advertisement removed');
    }
  };

  // Create Ad Form Submit
  const handleCreateAd = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.headline || !formData.targetUrl) {
      alert('Please fill in required fields (Title, Headline, Target URL)');
      return;
    }

    const selectedSponsor = sponsors.find(s => s.id === Number(formData.sponsorId)) || sponsors[0];

    const newAd = {
      id: Date.now(),
      title: formData.title,
      sponsorId: selectedSponsor.id,
      sponsorName: selectedSponsor.name,
      sponsorLogo: selectedSponsor.logo,
      type: formData.type,
      placementId: formData.placementId,
      headline: formData.headline,
      subtext: formData.subtext,
      badgeText: formData.badgeText || 'SPONSORED',
      ctaText: formData.ctaText || 'Learn More',
      targetUrl: formData.targetUrl,
      imageUrl: formData.imageUrl,
      videoUrl: formData.videoUrl,
      themeBg: 'from-[#1E3A8A] via-[#B91C1C] to-[#0B0B0F]',
      accentColor: '#EF233C',
      priority: Number(formData.priority) || 1,
      status: formData.status,
      startDate: formData.startDate,
      endDate: formData.endDate,
      impressions: 0,
      clicks: 0,
      deviceTargeting: formData.deviceTargeting
    };

    const updated = [newAd, ...ads];
    setAds(updated);
    saveStoredAds(updated);
    showToast(`Ad "${newAd.title}" published!`);
    setActiveTab('all');
  };

  // Add Sponsor Submit
  const handleAddSponsor = (e) => {
    e.preventDefault();
    if (!sponsorForm.name || !sponsorForm.contactEmail) {
      alert('Please fill in company name and contact email');
      return;
    }

    const newSp = {
      id: Date.now(),
      name: sponsorForm.name,
      category: sponsorForm.category,
      logo: sponsorForm.logo,
      contactEmail: sponsorForm.contactEmail,
      website: sponsorForm.website,
      country: sponsorForm.country,
      campaignsCount: 0,
      totalClicks: 0,
      totalImpressions: 0,
      status: 'Active'
    };

    const updated = [newSp, ...sponsors];
    setSponsors(updated);
    saveStoredSponsors(updated);
    setIsAddSponsorOpen(false);
    showToast(`Sponsor "${newSp.name}" registered!`);
  };

  // Calculate Aggregated Metrics
  const totalImpressions = ads.reduce((acc, a) => acc + (a.impressions || 0), 0);
  const totalClicks = ads.reduce((acc, a) => acc + (a.clicks || 0), 0);
  const averageCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';
  const activeAdsCount = ads.filter(a => a.status === 'Active').length;
  const estimatedRevenue = (totalClicks * 0.45 + (totalImpressions / 1000) * 1.8).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  // Filtered Ads
  const filteredAds = ads.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.sponsorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || a.status.toUpperCase() === filterStatus.toUpperCase();
    const matchesPlacement = filterPlacement === 'ALL' || a.placementId === filterPlacement;
    return matchesSearch && matchesStatus && matchesPlacement;
  });

  // Top Performing Ad
  const topAd = [...ads].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#16A34A] text-white font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar with Title & New Ad CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#232332]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#D90429]/20 text-[#EF233C] text-[10px] font-black uppercase tracking-wider font-['Montserrat'] border border-[#EF233C]/30">
              REVENUE MODULE • VERSION 1.0
            </span>
            <span className="text-xs text-[#A1A1AA] font-mono">AUTOMATED AD ENGINE</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-white font-['Montserrat'] tracking-tight">
            Advertisement & Sponsorship Hub
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Display, schedule, track, and monetize across SportsArena.africa without editing code.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('create')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D90429] to-[#EF233C] hover:from-[#EF233C] hover:to-[#D90429] text-white text-xs font-black uppercase tracking-wider font-['Montserrat'] flex items-center gap-2 shadow-sports-glow transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Advertisement</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#232332]">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'all', label: `All Ads (${ads.length})`, icon: Layers },
          { id: 'create', label: 'Create Ad', icon: Plus },
          { id: 'sponsors', label: `Sponsors (${sponsors.length})`, icon: ShieldCheck },
          { id: 'analytics', label: 'Analytics & Traffic', icon: BarChart3 },
          { id: 'placements', label: 'Placement Map', icon: Globe }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider font-['Montserrat'] whitespace-nowrap transition ${
                isActive
                  ? 'bg-[#181822] text-[#EF233C] border border-[#EF233C]/40 shadow-sm'
                  : 'text-[#A1A1AA] hover:bg-[#121218] hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: OVERVIEW & DASHBOARD METRICS                       */}
      {/* ========================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Impressions */}
            <div className="p-5 rounded-2xl bg-[#121218] border border-[#232332] relative overflow-hidden">
              <div className="flex items-center justify-between text-[#A1A1AA] text-xs font-mono mb-2">
                <span>TOTAL IMPRESSIONS</span>
                <Eye className="w-4 h-4 text-[#2563EB]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-['Montserrat']">
                {totalImpressions.toLocaleString()}
              </div>
              <div className="mt-2 text-[11px] text-[#16A34A] font-bold flex items-center gap-1">
                <span>↑ +18.4% vs last week</span>
              </div>
            </div>

            {/* Total Clicks */}
            <div className="p-5 rounded-2xl bg-[#121218] border border-[#232332] relative overflow-hidden">
              <div className="flex items-center justify-between text-[#A1A1AA] text-xs font-mono mb-2">
                <span>TOTAL CLICKS</span>
                <MousePointerClick className="w-4 h-4 text-[#EF233C]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-['Montserrat']">
                {totalClicks.toLocaleString()}
              </div>
              <div className="mt-2 text-[11px] text-[#16A34A] font-bold flex items-center gap-1">
                <span>↑ +12.1% organic CTR</span>
              </div>
            </div>

            {/* Avg CTR */}
            <div className="p-5 rounded-2xl bg-[#121218] border border-[#232332] relative overflow-hidden">
              <div className="flex items-center justify-between text-[#A1A1AA] text-xs font-mono mb-2">
                <span>AVERAGE CTR</span>
                <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-['Montserrat']">
                {averageCTR}%
              </div>
              <div className="mt-2 text-[11px] text-[#A1A1AA]">
                Industry standard: ~1.8%
              </div>
            </div>

            {/* Estimated Ad Revenue */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#121218] to-[#1E1B4B] border border-[#2563EB]/40 relative overflow-hidden">
              <div className="flex items-center justify-between text-[#A1A1AA] text-xs font-mono mb-2">
                <span>ESTIMATED REVENUE</span>
                <DollarSign className="w-4 h-4 text-[#16A34A]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-['Montserrat']">
                {estimatedRevenue}
              </div>
              <div className="mt-2 text-[11px] text-[#16A34A] font-bold">
                Active Campaigns: {activeAdsCount}
              </div>
            </div>

          </div>

          {/* Quick Highlight Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Top Performing Creative */}
            <div className="p-5 rounded-2xl bg-[#121218] border border-[#232332] flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-[#181822] overflow-hidden flex-shrink-0 border border-[#232332]">
                <img
                  src={topAd?.imageUrl || '/images/ads/totalenergies-ad.svg'}
                  alt={topAd?.title}
                  onError={(e) => { e.currentTarget.src = '/images/ads/totalenergies-ad.svg'; }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-black uppercase tracking-wider text-[#F59E0B]">
                  ★ TOP PERFORMING CREATIVE
                </span>
                <h4 className="text-sm font-black text-white font-['Montserrat'] truncate">
                  {topAd?.title}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-[#A1A1AA]">
                  <span>Sponsor: <strong>{topAd?.sponsorName}</strong></span>
                  <span>Clicks: <strong className="text-white">{topAd?.clicks.toLocaleString()}</strong></span>
                  <span>CTR: <strong className="text-[#16A34A]">{((topAd?.clicks / topAd?.impressions) * 100).toFixed(1)}%</strong></span>
                </div>
              </div>
            </div>

            {/* Top Placement */}
            <div className="p-5 rounded-2xl bg-[#121218] border border-[#232332] flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-[#2563EB]">
                  ★ TOP PERFORMING PLACEMENT
                </span>
                <h4 className="text-sm font-black text-white font-['Montserrat']">
                  Homepage Hero Banner (1200 × 300)
                </h4>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  Generates 38% of total network clicks across Pan-Africa.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('placements')}
                className="px-3 py-1.5 rounded-lg bg-[#181822] hover:bg-[#232332] text-xs font-bold text-white transition flex items-center gap-1"
              >
                <span>View Placements</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Phase 15 — Monetization Integrations Controls */}
          <div className="p-6 rounded-2xl bg-[#121218] border border-[#232332] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white font-['Montserrat']">
                  Monetization Channel Integrations (Phase 15)
                </h3>
                <p className="text-xs text-[#A1A1AA]">
                  Toggle active ad networks and monetization channels across SportsArena.africa.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#16A34A]/20 text-[#16A34A] text-[10px] font-black uppercase font-mono">
                READY FOR REVENUE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {[
                { key: 'googleAdSense', label: 'Google AdSense', desc: 'Auto-fill unoccupied leaderboard & article slots.' },
                { key: 'googleAdManager', label: 'Google Ad Manager (GAM)', desc: 'Direct programmatic header bidding & DFP.' },
                { key: 'directSponsors', label: 'Direct Sponsor Campaigns', desc: 'Native high-value Pan-African brand partnerships.' },
                { key: 'videoSponsors', label: 'Video Pre-Roll Sponsors', desc: '5-second video ad cards on highlights player.' },
                { key: 'sponsoredArticles', label: 'Sponsored Editorial Badging', desc: 'Mark sponsored journalism & brand columns.' },
                { key: 'newsletterSponsors', label: 'Newsletter Sponsor Strips', desc: 'Daily matchday email dispatch revenue banner.' }
              ].map(item => {
                const isEnabled = integrations[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() => {
                      setIntegrations(prev => ({ ...prev, [item.key]: !prev[item.key] }));
                      showToast(`${item.label} ${!isEnabled ? 'Activated' : 'Paused'}`);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start justify-between ${
                      isEnabled ? 'bg-[#181822] border-[#16A34A]/50 text-white' : 'bg-[#0B0B0F] border-[#232332] text-[#71717A]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-black font-['Montserrat'] flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-[#16A34A]' : 'bg-[#71717A]'}`}></span>
                        <span>{item.label}</span>
                      </div>
                      <p className="text-[10px] mt-1 text-[#A1A1AA] line-clamp-2">
                        {item.desc}
                      </p>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      isEnabled ? 'bg-[#16A34A]/20 text-[#16A34A]' : 'bg-[#232332] text-[#71717A]'
                    }`}>
                      {isEnabled ? 'ON' : 'OFF'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: ALL ADVERTISEMENTS (INVENTORY TABLE)               */}
      {/* ========================================================= */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#121218] border border-[#232332]">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
              <input
                type="text"
                placeholder="Search ads by title or sponsor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B0B0F] border border-[#232332] text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-[#EF233C]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#0B0B0F] border border-[#232332] text-xs text-white focus:outline-none focus:border-[#EF233C]"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active Only</option>
                <option value="PAUSED">Paused Only</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="EXPIRED">Expired</option>
              </select>

              <select
                value={filterPlacement}
                onChange={(e) => setFilterPlacement(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#0B0B0F] border border-[#232332] text-xs text-white focus:outline-none focus:border-[#EF233C]"
              >
                <option value="ALL">All Placements</option>
                {AD_PLACEMENTS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Advertisements Table */}
          <div className="rounded-2xl bg-[#121218] border border-[#232332] overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs text-white">
              <thead className="bg-[#181822] text-[#A1A1AA] uppercase tracking-wider font-mono text-[10px] border-b border-[#232332]">
                <tr>
                  <th className="p-4">Ad Creative / Title</th>
                  <th className="p-4">Sponsor</th>
                  <th className="p-4">Placement Slot</th>
                  <th className="p-4">Schedule</th>
                  <th className="p-4">Views</th>
                  <th className="p-4">Clicks</th>
                  <th className="p-4">CTR</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232332]">
                {filteredAds.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="p-8 text-center text-[#71717A]">
                      No advertisements found matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredAds.map((ad) => {
                    const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : '0.00';
                    const isActive = ad.status === 'Active';

                    return (
                      <tr key={ad.id} className="hover:bg-[#181822]/60 transition">
                        {/* Thumbnail & Title */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-10 rounded-lg bg-[#0B0B0F] overflow-hidden flex-shrink-0 border border-[#232332]">
                              <img
                                src={ad.imageUrl || '/images/ads/safaricom-ad.svg'}
                                alt={ad.title}
                                onError={(e) => { e.currentTarget.src = '/images/ads/safaricom-ad.svg'; }}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="max-w-xs">
                              <span className="font-bold text-white font-['Montserrat'] block line-clamp-1">
                                {ad.title}
                              </span>
                              <span className="text-[10px] text-[#A1A1AA] block line-clamp-1">
                                {ad.headline}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Sponsor */}
                        <td className="p-4">
                          <span className="px-2 py-1 rounded bg-[#181822] text-[11px] font-bold text-white border border-[#232332] whitespace-nowrap">
                            {ad.sponsorName}
                          </span>
                        </td>

                        {/* Placement */}
                        <td className="p-4">
                          <span className="text-[11px] text-[#E4E4E7] block">
                            {AD_PLACEMENTS.find(p => p.id === ad.placementId)?.name || ad.placementId}
                          </span>
                          <span className="text-[9px] text-[#71717A] font-mono">
                            Priority: {ad.priority}
                          </span>
                        </td>

                        {/* Schedule */}
                        <td className="p-4 whitespace-nowrap font-mono text-[10px] text-[#A1A1AA]">
                          <div>{ad.startDate}</div>
                          <div>to {ad.endDate}</div>
                        </td>

                        {/* Views */}
                        <td className="p-4 font-mono font-bold text-white">
                          {(ad.impressions || 0).toLocaleString()}
                        </td>

                        {/* Clicks */}
                        <td className="p-4 font-mono font-bold text-[#EF233C]">
                          {(ad.clicks || 0).toLocaleString()}
                        </td>

                        {/* CTR */}
                        <td className="p-4 font-mono font-bold text-[#16A34A]">
                          {ctr}%
                        </td>

                        {/* Status Toggle Badge */}
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleStatus(ad.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider font-['Montserrat'] flex items-center gap-1 transition ${
                              isActive
                                ? 'bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/30 hover:bg-[#16A34A]/40'
                                : 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30 hover:bg-[#F59E0B]/40'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#16A34A]' : 'bg-[#F59E0B]'}`}></span>
                            <span>{ad.status}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={ad.targetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-[#0B0B0F] hover:bg-[#232332] text-[#A1A1AA] hover:text-white transition"
                              title="Test Target URL"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>

                            <button
                              onClick={() => handleDeleteAd(ad.id)}
                              className="p-1.5 rounded-lg bg-[#0B0B0F] hover:bg-[#D90429] text-[#A1A1AA] hover:text-white transition"
                              title="Delete Advertisement"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: CREATE ADVERTISEMENT FORM                          */}
      {/* ========================================================= */}
      {activeTab === 'create' && (
        <form onSubmit={handleCreateAd} className="p-6 rounded-2xl bg-[#121218] border border-[#232332] space-y-6">
          <div className="border-b border-[#232332] pb-4">
            <h3 className="text-lg font-black text-white font-['Montserrat']">
              Create New Advertisement (No Code Required)
            </h3>
            <p className="text-xs text-[#A1A1AA]">
              Configure creative, sponsor, schedule, and placement slot.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-white uppercase font-mono mb-1.5">
                Advertisement Title * (Internal Campaign Name)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Safaricom 5G Matchday Speed Pass"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0B0F] border border-[#232332] text-xs text-white focus:outline-none focus:border-[#EF233C]"
              />
            </div>

            {/* Sponsor */}
            <div>
              <label className="block text-xs font-bold text-white uppercase font-mono mb-1.5">
                Sponsor *
              </label>
              <select
                value={formData.sponsorId}
                onChange={(e) => setFormData({ ...formData, sponsorId: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0B0F] border border-[#232332] text-xs text-white focus:outline-none focus:border-[#EF233C]"
              >
                {sponsors.map(sp => (
                  <option key={sp.id} value={sp.id}>{sp.name} ({sp.country})</option>
                ))}
              </select>
            </div>

            {/* Ad Type */}
            <div>
              <label className="block text-xs font-bold text-white uppercase font-mono mb-1.5">
                Advertisement Type (Format)
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0B0F] border border-[#232332] text-xs text-white focus:outline-none focus:border-[#EF233C]"
              >
                {Object.values(AD_TYPES).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Placement Slot */}
            <div>
              <label className="block text-xs font-bold text-white uppercase font-mono mb-1.5">
                Placement Slot * (Where It Appears)
              </label>
              <select
                value={formData.placementId}
                onChange={(e) => setFormData({ ...formData, placementId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0B0F] border border-[#232332] text-xs text-white focus:outline-none focus:border-[#EF233C]"
              >
                {AD_PLACEMENTS.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} [{p.desktopSize}]
                  </option>
                ))}
              </select>
            </div>

            {/* Headline */}
            <div>
              <label className="block text-xs font-bold text-white uppercase font-mono mb-1.5">
                Public Headline * (Displayed on Banner)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. STREAM MATCHES IN ULTRA 4K WITH 5G"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0B0F] border border-[#232332] text-xs text-white focus:outline-none focus:border-[#EF233C]"
              />
            </div>

            {/* Subtext */}
            <div>
              <label className="block text-xs font-bold text-white uppercase font-mono mb-1.5">
                Subtext / Description (1-2 sentences)
              </label>
              <input
                type="text"
                placeholder="e.g. Get 10GB Matchday Pass for only KES 150."
                value={formData.subtext}
                onChange={(e) => setFormData({ ...formData, subtext: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0B0F] border border-[#232332] text-xs text-white focus:outline-none focus:border-[#EF233C]"
              />
            </div>

            {/* Target URL */}
            <div>
              <label className="block text-xs font-bold text-white uppercase font-mono mb-1.5">
                Target URL * (Where Users Land on Click)
              </label>
              <input
                type="url"
                required
                placeholder="https://sponsor.com/landing-page"
                value={formData.targetUrl}
                onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0B0F] border border-[#232332] text-xs text-white focus:outline-none focus:border-[#EF233C]"
              />
            </div>

            {/* Image / Media URL */}
            <div>
              <label className="block text-xs font-bold text-white uppercase font-mono mb-1.5">
                Creative Image / Banner URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0B0F] border border-[#232332] text-xs text-white focus:outline-none focus:border-[#EF233C]"
              />
            </div>

            {/* CTA Text */}
            <div>
              <label className="block text-xs font-bold text-white uppercase font-mono mb-1.5">
                CTA Button Text
              </label>
              <input
                type="text"
                value={formData.ctaText}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0B0F] border border-[#232332] text-xs text-white focus:outline-none focus:border-[#EF233C]"
              />
            </div>

            {/* Badge Text */}
            <div>
              <label className="block text-xs font-bold text-white uppercase font-mono mb-1.5">
                Sponsor Badge Text
              </label>
              <input
                type="text"
                value={formData.badgeText}
                onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0B0F] border border-[#232332] text-xs text-white focus:outline-none focus:border-[#EF233C]"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-xs font-bold text-white uppercase font-mono mb-1.5">
                Campaign Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0B0F] border border-[#232332] text-xs text-white focus:outline-none focus:border-[#EF233C]"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-xs font-bold text-white uppercase font-mono mb-1.5">
                Campaign End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0B0F] border border-[#232332] text-xs text-white focus:outline-none focus:border-[#EF233C]"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-bold text-white uppercase font-mono mb-1.5">
                Display Priority (1 = Normal, 3 = Highest)
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0B0F] border border-[#232332] text-xs text-white focus:outline-none focus:border-[#EF233C]"
              >
                <option value={1}>1 - Standard Fill</option>
                <option value={2}>2 - High Priority Campaign</option>
                <option value={3}>3 - Exclusive Title Takeover</option>
              </select>
            </div>

            {/* Initial Status */}
            <div>
              <label className="block text-xs font-bold text-white uppercase font-mono mb-1.5">
                Initial Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0B0F] border border-[#232332] text-xs text-white focus:outline-none focus:border-[#EF233C]"
              >
                <option value="Active">Active (Publish Immediately)</option>
                <option value="Scheduled">Scheduled (Wait for Start Date)</option>
                <option value="Paused">Paused (Saved as Inactive)</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

          </div>

          {/* Form Action Buttons */}
          <div className="pt-4 border-t border-[#232332] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className="px-5 py-2.5 rounded-xl bg-[#181822] hover:bg-[#232332] text-xs font-bold text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D90429] to-[#EF233C] text-white text-xs font-black uppercase tracking-wider font-['Montserrat'] shadow-sports-glow hover:shadow-red-600/50 transition"
            >
              Publish Advertisement
            </button>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* TAB 4: SPONSOR DIRECTORY & MANAGEMENT                     */}
      {/* ========================================================= */}
      {activeTab === 'sponsors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white font-['Montserrat']">
                Advertiser & Sponsor Profiles
              </h3>
              <p className="text-xs text-[#A1A1AA]">
                Direct corporate sponsors supporting SportsArena.africa.
              </p>
            </div>

            <button
              onClick={() => setIsAddSponsorOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#181822] hover:bg-[#232332] border border-[#232332] text-white text-xs font-black uppercase tracking-wider font-['Montserrat'] flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4 text-[#16A34A]" />
              <span>Add New Sponsor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sponsors.map(sp => (
              <div key={sp.id} className="p-5 rounded-2xl bg-[#121218] border border-[#232332] hover:border-[#2563EB]/40 transition space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/10 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/20">
                    <img
                      src={sp.logo || '/images/ads/logo-safaricom.svg'}
                      alt={sp.name}
                      onError={(e) => { e.currentTarget.src = '/images/ads/logo-safaricom.svg'; }}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-black text-white font-['Montserrat'] truncate">
                      {sp.name}
                    </h4>
                    <span className="text-[11px] text-[#A1A1AA] block truncate">
                      {sp.category}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#232332] space-y-1.5 text-xs text-[#A1A1AA]">
                  <div className="flex items-center justify-between">
                    <span>Region:</span>
                    <strong className="text-white">{sp.country}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Contact:</span>
                    <a href={`mailto:${sp.contactEmail}`} className="text-[#2563EB] hover:underline truncate max-w-[160px]">
                      {sp.contactEmail}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active Campaigns:</span>
                    <strong className="text-[#16A34A]">{sp.campaignsCount}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Clicks:</span>
                    <strong className="text-white font-mono">{sp.totalClicks.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={sp.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 rounded-lg bg-[#181822] hover:bg-[#232332] text-xs font-bold text-[#E4E4E7] flex items-center justify-center gap-1.5 transition"
                  >
                    <span>Visit Website</span>
                    <ExternalLink className="w-3 h-3 text-[#A1A1AA]" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Add Sponsor Modal */}
          {isAddSponsorOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-md bg-[#121218] border border-[#232332] rounded-3xl p-6 text-white space-y-4">
                <h3 className="text-base font-black font-['Montserrat']">Register Sponsor</h3>
                <form onSubmit={handleAddSponsor} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono text-[#A1A1AA] uppercase">Company Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. KCB Bank"
                      value={sponsorForm.name}
                      onChange={(e) => setSponsorForm({ ...sponsorForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#0B0B0F] border border-[#232332] text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#A1A1AA] uppercase">Contact Email</label>
                    <input
                      type="email"
                      required
                      placeholder="ads@kcbbank.co.ke"
                      value={sponsorForm.contactEmail}
                      onChange={(e) => setSponsorForm({ ...sponsorForm, contactEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#0B0B0F] border border-[#232332] text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#A1A1AA] uppercase">Website URL</label>
                    <input
                      type="url"
                      value={sponsorForm.website}
                      onChange={(e) => setSponsorForm({ ...sponsorForm, website: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#0B0B0F] border border-[#232332] text-xs text-white"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddSponsorOpen(false)}
                      className="px-4 py-2 rounded-xl bg-[#181822] text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#D90429] text-white text-xs font-bold"
                    >
                      Save Sponsor
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: ANALYTICS & GEOGRAPHY (PHASE 10)                    */}
      {/* ========================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          
          {/* Country Distribution Table */}
          <div className="p-6 rounded-2xl bg-[#121218] border border-[#232332] space-y-4">
            <div>
              <h3 className="text-base font-black text-white font-['Montserrat']">
                Traffic & Engagement by African Country (Phase 10)
              </h3>
              <p className="text-xs text-[#A1A1AA]">
                Real-time regional readership distribution across 54 African nations.
              </p>
            </div>

            <div className="space-y-3">
              {GEOGRAPHIC_TRAFFIC_DATA.map(item => (
                <div key={item.country} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="text-base">{item.flag}</span>
                      <span>{item.country}</span>
                    </span>
                    <span className="text-[#A1A1AA] font-mono">
                      {item.impressions.toLocaleString()} views • <strong>{item.clicks.toLocaleString()} clicks</strong> ({item.ctr} CTR)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#0B0B0F] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#D90429] to-[#EF233C]"
                      style={{ width: `${item.share}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="p-5 rounded-2xl bg-[#121218] border border-[#232332] flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#EF233C]/20 text-[#EF233C]">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-[#A1A1AA] font-mono">MOBILE READERS</span>
                <div className="text-2xl font-black text-white font-['Montserrat']">
                  {DEVICE_METRICS.mobile.percent}%
                </div>
                <span className="text-[10px] text-[#16A34A] font-bold">
                  {DEVICE_METRICS.mobile.clicks.toLocaleString()} clicks ({DEVICE_METRICS.mobile.ctr} CTR)
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#121218] border border-[#232332] flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#2563EB]/20 text-[#2563EB]">
                <Monitor className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-[#A1A1AA] font-mono">DESKTOP BROWSERS</span>
                <div className="text-2xl font-black text-white font-['Montserrat']">
                  {DEVICE_METRICS.desktop.percent}%
                </div>
                <span className="text-[10px] text-[#16A34A] font-bold">
                  {DEVICE_METRICS.desktop.clicks.toLocaleString()} clicks ({DEVICE_METRICS.desktop.ctr} CTR)
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#121218] border border-[#232332] flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#F59E0B]/20 text-[#F59E0B]">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-[#A1A1AA] font-mono">TABLETS & IPADS</span>
                <div className="text-2xl font-black text-white font-['Montserrat']">
                  {DEVICE_METRICS.tablet.percent}%
                </div>
                <span className="text-[10px] text-[#16A34A] font-bold">
                  {DEVICE_METRICS.tablet.clicks.toLocaleString()} clicks ({DEVICE_METRICS.tablet.ctr} CTR)
                </span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: PLACEMENTS DIRECTORY & SIZES (PHASE 2 & 4)        */}
      {/* ========================================================= */}
      {activeTab === 'placements' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-black text-white font-['Montserrat']">
              Standard Advertisement Placement Map (Phases 2, 4 & 7)
            </h3>
            <p className="text-xs text-[#A1A1AA]">
              Standard IAB sizes automatically chosen by frontend based on reader viewport.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AD_PLACEMENTS.map(slot => {
              const activeCount = ads.filter(a => a.placementId === slot.id && a.status === 'Active').length;

              return (
                <div key={slot.id} className="p-5 rounded-2xl bg-[#121218] border border-[#232332] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white font-['Montserrat']">
                      {slot.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      activeCount > 0 ? 'bg-[#16A34A]/20 text-[#16A34A]' : 'bg-[#71717A]/20 text-[#71717A]'
                    }`}>
                      {activeCount > 0 ? `${activeCount} Active Ad` : 'Available'}
                    </span>
                  </div>

                  <p className="text-xs text-[#A1A1AA]">
                    {slot.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-[#71717A]">
                    <span>Desktop: <strong className="text-white">{slot.desktopSize}</strong></span>
                    <span>Mobile: <strong className="text-white">{slot.mobileSize}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
