import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { Bell, Flame, Activity, CheckCircle, AlertTriangle, X, ExternalLink, ArrowRight } from 'lucide-react';

export default function NotificationToastContainer({ onSelectArticle, onSelectMatch }) {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsub = notificationService.subscribeToToasts((newToast) => {
      setToasts((prev) => [newToast, ...prev.slice(0, 3)]); // Keep at most 4 toasts on screen

      // Auto dismiss after 6 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 6500);
    });

    return () => unsub();
  }, []);

  const handleDismiss = (id, e) => {
    if (e) e.stopPropagation();
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClickToast = (toast) => {
    if (toast.data?.matchId && onSelectMatch) {
      onSelectMatch(toast.data.matchId);
    } else if (toast.data?.articleId && onSelectArticle) {
      onSelectArticle(toast.data.articleId);
    } else if (toast.link && toast.link.startsWith('#')) {
      const el = document.getElementById(toast.link.substring(1));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    handleDismiss(toast.id);
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-[100] max-w-sm sm:max-w-md w-full space-y-3 pointer-events-none select-none">
      {toasts.map((toast) => {
        const isGoal = toast.type === 'GOAL';
        const isBreaking = toast.type === 'BREAKING';
        const isCard = toast.type === 'CARD';
        const isVAR = toast.type === 'VAR';

        return (
          <div
            key={toast.id}
            onClick={() => handleClickToast(toast)}
            className={`pointer-events-auto transform transition-all duration-300 hover:scale-[1.02] cursor-pointer rounded-2xl p-4 bg-[#121218]/95 backdrop-blur-xl border shadow-[0_10px_35px_rgba(0,0,0,0.9)] overflow-hidden relative group ${
              isGoal
                ? 'border-[#16A34A] shadow-[0_0_25px_rgba(22,163,74,0.3)]'
                : isBreaking
                ? 'border-[#D90429] shadow-[0_0_25px_rgba(217,4,41,0.3)]'
                : 'border-[#232332]'
            }`}
          >
            {/* Top Row: Category Pill & Close Button */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider font-['Montserrat'] flex items-center gap-1 ${
                  isGoal
                    ? 'bg-[#16A34A] text-white animate-pulse'
                    : isBreaking
                    ? 'bg-[#D90429] text-white shadow-sports-glow'
                    : isCard
                    ? 'bg-[#F59E0B] text-black font-black'
                    : isVAR
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-[#232332] text-[#A1A1AA]'
                }`}>
                  {isGoal && <span>⚽ GOAL ALERT</span>}
                  {isBreaking && <span>🚨 BREAKING FLASH</span>}
                  {isCard && <span>📰 BREAKING NEWS</span>}
                  {isVAR && <span>🔍 VAR DECISION</span>}
                  {!isGoal && !isBreaking && !isCard && !isVAR && <span>{toast.type || 'NOTIFICATION'}</span>}
                </span>

                <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider font-semibold">
                  {toast.category}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[10px] text-[#A1A1AA] font-mono">Just now</span>
                <button
                  onClick={(e) => handleDismiss(toast.id, e)}
                  className="p-1 rounded-full text-[#A1A1AA] hover:text-white hover:bg-[#181822] transition"
                  title="Dismiss notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Content Header & Body */}
            <div className="space-y-1 pr-2">
              <h4 className="text-xs sm:text-sm font-black text-white font-['Montserrat'] uppercase tracking-tight line-clamp-1 group-hover:text-[#EF233C] transition">
                {toast.title}
              </h4>
              <p className="text-[11px] sm:text-xs text-[#D1D5DB] leading-relaxed line-clamp-2">
                {toast.body}
              </p>
            </div>

            {/* Action link */}
            <div className="mt-2.5 pt-2 border-t border-[#232332] flex items-center justify-between text-[11px] text-[#A1A1AA]">
              <span className="font-semibold text-[10px] uppercase tracking-wider text-[#A1A1AA]">SportsArena Live Broadcast</span>
              <span className="text-[#EF233C] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>View Details</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            {/* Auto-dismissing animated progress line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#232332]">
              <div
                className={`h-full animate-toast-timer ${
                  isGoal ? 'bg-[#16A34A]' : isBreaking ? 'bg-[#D90429]' : 'bg-[#2563EB]'
                }`}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
