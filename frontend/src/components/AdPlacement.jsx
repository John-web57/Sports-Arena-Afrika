import React, { useState, useEffect, useMemo } from 'react';
import { ExternalLink, Sparkles, ShieldCheck, RefreshCw } from 'lucide-react';
import { getStoredAds, recordAdImpression, recordAdClick, AD_PLACEMENTS } from '../data/mockAds';

export default function AdPlacement({ placementId, className = '', customFallback = null }) {
  const [ads, setAds] = useState(() => getStoredAds());

  // Listen to live updates from CMS
  useEffect(() => {
    const handleUpdate = () => {
      setAds(getStoredAds());
    };
    window.addEventListener('sportsarena_ads_updated', handleUpdate);
    return () => window.removeEventListener('sportsarena_ads_updated', handleUpdate);
  }, []);

  // Filter all currently active ads
  const allActiveAds = useMemo(() => {
    return ads.filter(a => a.status === 'Active' || a.status === 'active');
  }, [ads]);

  // Find matching ads for this placement
  const matchingAds = useMemo(() => {
    return allActiveAds.filter(a => a.placementId === placementId);
  }, [allActiveAds, placementId]);

  // Only show ads if an ad was specifically configured / placed for this placement
  const rotationPool = useMemo(() => {
    if (matchingAds.length > 0) return matchingAds;
    return [];
  }, [matchingAds]);

  // Stagger initial start index deterministically by placementId
  const initialIndex = useMemo(() => {
    if (rotationPool.length <= 1) return 0;
    let hash = 0;
    for (let i = 0; i < placementId.length; i++) {
      hash = (hash + placementId.charCodeAt(i)) % rotationPool.length;
    }
    return hash;
  }, [placementId, rotationPool.length]);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Auto-rotate every 5 seconds to display another advertisement
  useEffect(() => {
    if (rotationPool.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % rotationPool.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [rotationPool.length]);

  // Currently active rotated ad
  const activeAd = rotationPool[currentIndex % (rotationPool.length || 1)];

  const placementMeta = AD_PLACEMENTS.find(p => p.id === placementId) || {
    name: 'Advertisement Slot',
    desktopSize: '728 × 90',
    mobileSize: '320 × 50'
  };

  // Record impression whenever active rotated ad changes
  useEffect(() => {
    if (activeAd?.id) {
      recordAdImpression(activeAd.id);
    }
  }, [activeAd?.id]);

  const handleClick = () => {
    if (activeAd) {
      recordAdClick(activeAd.id);
    }
  };

  const fallbackAdImage = '/images/ads/safaricom-ad.svg';

  // If no active ad is placed for this slot, do not display anything
  if (!activeAd) {
    return customFallback || null;
  }

  // Rotation Navigation Header Strip
  const renderRotationHeader = (label) => (
    <div className="text-[8px] sm:text-[9px] font-black tracking-widest text-[#71717A] uppercase font-['Montserrat'] mb-1 flex items-center justify-between gap-1 px-1">
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse flex-shrink-0"></span>
        <span className="text-[#A1A1AA] truncate text-[8px] sm:text-[9px]">
          {label} • <strong className="text-white">{activeAd.sponsorName}</strong>
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 text-[7px] font-mono text-[#F59E0B] px-1 py-0.5 rounded bg-black/40 border border-white/5 flex-shrink-0">
          <RefreshCw className="w-2 h-2 animate-spin" style={{ animationDuration: '5s' }} />
          <span>5s</span>
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Rotation Dots */}
        {rotationPool.length > 1 && (
          <div className="flex items-center gap-1">
            {rotationPool.map((ad, idx) => (
              <button
                key={ad.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-1 rounded-full transition-all ${
                  (currentIndex % rotationPool.length) === idx
                    ? 'w-2.5 sm:w-3 bg-[#EF233C]'
                    : 'w-1 bg-[#3F3F46] hover:bg-[#A1A1AA]'
                }`}
                title={`Switch to ${ad.sponsorName}`}
              />
            ))}
          </div>
        )}
        <span className="text-[7px] sm:text-[8px] text-[#52525B]">AD</span>
      </div>
    </div>
  );

  // =========================================================================
  // 1. TOP STICKY LEADERBOARD, FOOTER BANNER, FIXTURES & STANDINGS (Small 728x80 standard)
  // =========================================================================
  if (placementId === 'top_sticky' || placementId === 'footer_banner') {
    return (
      <aside aria-label="Sponsored Content" className={`w-full my-2 px-3 max-w-[760px] mx-auto ${className}`}>
        {renderRotationHeader('SPONSORED LEADERBOARD')}

        <a
          key={`${activeAd.id}-${currentIndex}`}
          href={activeAd.targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="group relative block w-full rounded-xl overflow-hidden border border-[#232332] hover:border-[#EF233C]/60 transition-all duration-300 shadow-md bg-[#0B0B0F] animate-ad-swap"
        >
          {/* Small compact leaderboard banner */}
          <div className="relative w-full h-[60px] sm:h-[75px] md:h-[80px] overflow-hidden bg-[#0B0B0F] flex items-center justify-center p-0.5">
            <img
              src={activeAd.imageUrl || fallbackAdImage}
              alt={activeAd.title}
              onError={(e) => { e.currentTarget.src = fallbackAdImage; }}
              className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-[1.01]"
            />
          </div>
        </a>
      </aside>
    );
  }

  // =========================================================================
  // 2. HOMEPAGE HERO BANNER (Small compact sponsorship strip)
  // =========================================================================
  if (placementId === 'homepage_hero') {
    return (
      <aside aria-label="Hero Featured Advertisement" className={`w-full max-w-[760px] mx-auto px-3 my-3 ${className}`}>
        {renderRotationHeader('HOMEPAGE HERO SPONSORSHIP')}

        <a
          key={`${activeAd.id}-${currentIndex}`}
          href={activeAd.targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="group relative block w-full rounded-xl overflow-hidden border border-[#232332] hover:border-[#D90429] transition-all duration-300 shadow-lg bg-[#0B0B0F] animate-ad-swap"
        >
          {/* Small compact hero banner */}
          <div className="relative w-full h-[65px] sm:h-[80px] md:h-[85px] overflow-hidden bg-[#0B0B0F] flex items-center justify-center p-0.5">
            <img
              src={activeAd.imageUrl || '/images/ads/totalenergies-ad.svg'}
              alt={activeAd.title}
              onError={(e) => { e.currentTarget.src = '/images/ads/totalenergies-ad.svg'; }}
              className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.01]"
            />
          </div>
        </a>
      </aside>
    );
  }

  // =========================================================================
  // 3. SPONSORED MATCH CENTRE BANNER (Small compact strip)
  // =========================================================================
  if (false) {
    return (
      <aside aria-label="Sponsored Matchday" className={`w-full max-w-[680px] mx-auto my-3 rounded-xl overflow-hidden border border-[#232332] bg-[#121218] p-2 shadow ${className}`}>
        {renderRotationHeader('MATCH CENTRE PRESENTING PARTNER')}

        <a
          key={`${activeAd.id}-${currentIndex}`}
          href={activeAd.targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="group block relative w-full h-[55px] sm:h-[65px] rounded-lg overflow-hidden bg-[#0B0B0F] border border-[#232332] hover:border-[#F59E0B]/60 transition animate-ad-swap flex items-center justify-center p-0.5"
        >
          <img
            src={activeAd.imageUrl || '/images/ads/betika-ad.svg'}
            alt={activeAd.title}
            onError={(e) => { e.currentTarget.src = '/images/ads/betika-ad.svg'; }}
            className="w-full h-full object-contain object-center group-hover:scale-[1.01] transition duration-300"
          />
        </a>
      </aside>
    );
  }

  // =========================================================================
  // 4. SPONSORED PREDICTION CARD (Adaptive card format with small banner)
  // =========================================================================
  if (false) {
    return (
      <div key={`${activeAd.id}-${currentIndex}`} className={`p-4 sm:p-5 rounded-2xl bg-[#0B0B0F] border border-[#EF233C]/40 text-white relative overflow-hidden shadow-xl flex flex-col justify-between animate-ad-swap ${className}`}>
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-2.5">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#EF233C] text-white font-['Montserrat']">
              SPONSORED TIP
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#F59E0B] font-bold truncate max-w-[120px]">
                {activeAd.sponsorName}
              </span>
              <span className="text-[8px] font-mono text-[#A1A1AA] bg-[#181822] px-1.5 py-0.5 rounded">
                5s AUTO
              </span>
            </div>
          </div>

          {/* Visual Creative Banner Image - Compact */}
          <div className="relative h-[55px] sm:h-[65px] w-full rounded-lg overflow-hidden mb-2.5 bg-[#0B0B0F] border border-[#232332] flex items-center justify-center p-0.5">
            <img
              src={activeAd.imageUrl || '/images/ads/puma-ad.svg'}
              alt={activeAd.title}
              onError={(e) => { e.currentTarget.src = '/images/ads/puma-ad.svg'; }}
              className="w-full h-full object-contain object-center"
            />
          </div>

          <h4 className="text-sm font-black font-['Montserrat'] leading-snug mb-1 text-white">
            {activeAd.headline}
          </h4>

          <p className="text-xs text-[#D4D4D8] leading-relaxed line-clamp-2 mb-2.5">
            {activeAd.subtext}
          </p>
        </div>

        <div className="pt-2 border-t border-white/10">
          <a
            href={activeAd.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-[#D90429] to-[#EF233C] hover:from-[#EF233C] hover:to-[#D90429] text-white text-xs font-black uppercase tracking-wider font-['Montserrat'] flex items-center justify-center gap-2 shadow-sports-glow transition"
          >
            <span>{activeAd.ctaText || 'Play Now'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 5. SIDEBAR RECTANGLE (Small compact sidebar banner)
  // =========================================================================
  if (placementId === 'sidebar_rectangle' || placementId === 'large_sidebar') {
    return (
      <aside aria-label="Sidebar Advertisement" className={`w-full max-w-[280px] mx-auto my-3 p-3 rounded-xl bg-[#121218] border border-[#232332] shadow ${className}`}>
        {renderRotationHeader('SIDEBAR RECTANGLE')}

        <a
          key={`${activeAd.id}-${currentIndex}`}
          href={activeAd.targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="group block rounded-lg overflow-hidden relative border border-[#232332] hover:border-[#EF233C] transition bg-[#181822] animate-ad-swap"
        >
          <div className="h-[75px] sm:h-[90px] w-full bg-[#0B0B0F] relative overflow-hidden flex items-center justify-center p-0.5">
            <img
              src={activeAd.imageUrl || fallbackAdImage}
              alt={activeAd.title}
              onError={(e) => { e.currentTarget.src = fallbackAdImage; }}
              className="w-full h-full object-contain object-center group-hover:scale-105 transition duration-500"
            />
          </div>

          <div className="p-2.5 bg-[#181822]">
            <h5 className="text-xs font-black text-white font-['Montserrat'] leading-tight mb-1 truncate">
              {activeAd.headline}
            </h5>
            <p className="text-[11px] text-[#A1A1AA] line-clamp-2 mb-2">
              {activeAd.subtext}
            </p>
            <span className="w-full py-1.5 rounded-lg bg-[#D90429] group-hover:bg-[#EF233C] text-white text-xs font-black uppercase tracking-wider font-['Montserrat'] flex items-center justify-center gap-1.5 transition">
              <span>{activeAd.ctaText || 'Learn More'}</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </a>
      </aside>
    );
  }

  // =========================================================================
  // 6. IN-ARTICLE BANNER (Small compact editorial banner)
  // =========================================================================
  if (placementId === 'article_inline_1' || placementId === 'article_inline_2') {
    return (
      <aside aria-label="In-Article Sponsored Message" className={`w-full max-w-[680px] mx-auto my-4 p-2 rounded-xl bg-[#121218] border border-[#232332] shadow ${className}`}>
        {renderRotationHeader('SPONSORED EDITORIAL INSIGHT')}

        <a
          key={`${activeAd.id}-${currentIndex}`}
          href={activeAd.targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="group block relative w-full h-[55px] sm:h-[65px] rounded-lg overflow-hidden bg-[#0B0B0F] border border-[#232332] hover:border-[#10B981]/60 transition animate-ad-swap flex items-center justify-center p-0.5"
        >
          <img
            src={activeAd.imageUrl || '/images/ads/sc-ad.svg'}
            alt={activeAd.title}
            onError={(e) => { e.currentTarget.src = '/images/ads/sc-ad.svg'; }}
            className="w-full h-full object-contain object-center group-hover:scale-[1.01] transition"
          />
        </a>
      </aside>
    );
  }

  // Generic Fallback
  return (
    <aside aria-label="Advertisement" className={`w-full my-3 p-3 rounded-xl bg-[#121218] border border-[#232332] text-center ${className}`}>
      <span className="text-[9px] uppercase tracking-widest text-[#71717A] font-['Montserrat'] block mb-1">
        ADVERTISEMENT • {activeAd.sponsorName}
      </span>
      <a
        href={activeAd.targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="text-xs font-bold text-white hover:text-[#EF233C]"
      >
        {activeAd.headline} &rarr;
      </a>
    </aside>
  );
}
