import React, { useState, useEffect } from 'react';
import { Download, X, WifiOff, Wifi, Sparkles, Smartphone } from 'lucide-react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showOnlineToast, setShowOnlineToast] = useState(false);

  // Monitor Network Connectivity (Online / Offline status)
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowOnlineToast(true);
      setTimeout(() => setShowOnlineToast(false), 4000);
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Capture PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      // Prevent automatic browser mini-infobar on mobile
      e.preventDefault();
      setDeferredPrompt(e);

      // Check if user dismissed prompt recently
      const dismissedUntil = localStorage.getItem('sportsarena_pwa_dismissed');
      if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) {
        return;
      }

      // Show after 3 seconds for smooth UX
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);

      return () => clearTimeout(timer);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Check if app is already installed
    window.addEventListener('appinstalled', () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
      console.log('[PWA] Sports Arena Afrika installed to home screen.');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[PWA] Install prompt outcome:', outcome);

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Dismiss for 7 days
    localStorage.setItem('sportsarena_pwa_dismissed', (Date.now() + 7 * 24 * 60 * 60 * 1000).toString());
  };

  return (
    <>
      {/* Offline Status Persistent Banner */}
      {isOffline && (
        <div className="fixed top-0 inset-x-0 z-[100] bg-amber-600 text-white py-1.5 px-4 text-center text-xs font-bold shadow-lg flex items-center justify-center gap-2 animate-fadeIn">
          <WifiOff className="w-3.5 h-3.5 animate-pulse" />
          <span>You are offline. Showing cached news & scores from browser storage.</span>
        </div>
      )}

      {/* Online Restored Toast */}
      {showOnlineToast && (
        <div className="fixed top-4 right-4 z-[100] bg-green-600 text-white py-2 px-4 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2 animate-fadeIn">
          <Wifi className="w-4 h-4" />
          <span>Back online! Sports news is synced.</span>
        </div>
      )}

      {/* PWA Install Floating Banner / Card */}
      {showPrompt && (
        <div className="dark-contrast-panel fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[90] max-w-sm w-[calc(100vw-32px)] bg-[#121218]/95 backdrop-blur-md border border-[#D90429]/40 rounded-2xl p-4 shadow-2xl shadow-black/80 animate-slideUp">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#0B0B0F] border border-[#232332] p-1.5 flex-shrink-0 flex items-center justify-center shadow-inner">
              <img src="/images/logo.png" alt="Sports Arena Afrika" className="w-full h-full object-contain" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#EF233C] font-['Montserrat']">
                  OFFICIAL APP
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              </div>
              <h4 className="font-bold text-white text-sm leading-tight mt-0.5">
                Install Sports Arena Afrika
              </h4>
              <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                Fast breaking-news alerts, offline reading & instant home screen access.
              </p>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-sports-gradient text-white text-xs font-black uppercase tracking-wider font-['Montserrat'] shadow-sports-glow flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-95 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>INSTALL</span>
                </button>
                <button
                  onClick={handleDismiss}
                  className="py-1.5 px-3 rounded-xl bg-[#181822] hover:bg-[#232332] text-zinc-400 hover:text-white text-xs font-semibold transition"
                >
                  Later
                </button>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="text-zinc-500 hover:text-white p-1 transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
