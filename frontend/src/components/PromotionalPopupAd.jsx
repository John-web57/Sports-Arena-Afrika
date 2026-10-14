import React, { useState, useEffect } from 'react';
import { X, Sparkles, ExternalLink } from 'lucide-react';
import { getStoredAds, recordAdImpression, recordAdClick } from '../data/mockAds';

export default function PromotionalPopupAd() {
  const [isOpen, setIsOpen] = useState(false);
  const [popupAd, setPopupAd] = useState(null);

  useEffect(() => {
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('sportsarena_popup_dismissed');
    if (isDismissed) return;

    const ads = getStoredAds();
    const active = ads.find(a => a.placementId === 'promotional_popup' && (a.status === 'Active' || a.status === 'active'));

    if (active) {
      setPopupAd(active);
      // Show popup after 3 seconds of reader browsing
      const timer = setTimeout(() => {
        setIsOpen(true);
        recordAdImpression(active.id);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('sportsarena_popup_dismissed', 'true');
  };

  const handleClick = () => {
    if (popupAd) {
      recordAdClick(popupAd.id);
    }
    handleClose();
  };

  if (!isOpen || !popupAd) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0B0B0F] border border-[#232332] rounded-3xl overflow-hidden shadow-2xl text-white">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/70 hover:bg-[#D90429] text-white flex items-center justify-center transition border border-white/20"
          aria-label="Close promotion"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Media / Creative Header */}
        <div className="relative aspect-[16/9] w-full bg-[#181822]">
          <img
            src={popupAd.imageUrl || '/images/ads/totalenergies-ad.svg'}
            alt={popupAd.title}
            onError={(e) => { e.currentTarget.src = '/images/ads/totalenergies-ad.svg'; }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-black/30 to-transparent"></div>
          
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase text-[#F59E0B]">
            <Sparkles className="w-3 h-3" />
            <span>{popupAd.badgeText || 'FEATURED PROMOTION'}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#A1A1AA] font-mono">
            <span>Sponsor: <strong className="text-white">{popupAd.sponsorName}</strong></span>
            <span className="text-[10px] text-[#71717A] uppercase">SPONSORED POPUP</span>
          </div>

          <h3 className="text-xl font-black font-['Montserrat'] text-white leading-tight">
            {popupAd.headline}
          </h3>

          <p className="text-sm text-[#D4D4D8] leading-relaxed">
            {popupAd.subtext}
          </p>

          <div className="pt-2 flex items-center gap-3">
            <a
              href={popupAd.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#D90429] to-[#EF233C] hover:from-[#EF233C] hover:to-[#D90429] text-white text-xs font-black uppercase tracking-wider font-['Montserrat'] flex items-center justify-center gap-2 shadow-sports-glow transition"
            >
              <span>{popupAd.ctaText || 'Claim Offer Now'}</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={handleClose}
              className="px-4 py-3 rounded-xl bg-[#181822] hover:bg-[#232332] text-xs font-bold text-[#A1A1AA] hover:text-white transition"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
