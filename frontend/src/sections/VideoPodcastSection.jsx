import React, { useState, useEffect } from 'react';
import { featuredVideos } from '../data/mockData';
import AdPlacement from '../components/AdPlacement';
import { Play, Mic, Video, Volume2, Eye, Clock, Share2, Sparkles, SkipForward } from 'lucide-react';

export default function VideoPodcastSection() {
  const [playingVideo, setPlayingVideo] = useState(null);
  const [adCountdown, setAdCountdown] = useState(5);
  const [showPreRoll, setShowPreRoll] = useState(true);

  // Pre-roll countdown timer
  useEffect(() => {
    if (playingVideo && showPreRoll) {
      setAdCountdown(5);
      const timer = setInterval(() => {
        setAdCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowPreRoll(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [playingVideo, showPreRoll]);

  const handleOpenVideo = (vid) => {
    setPlayingVideo(vid);
    setShowPreRoll(true);
    setAdCountdown(5);
  };

  return (
    <section id="videos-podcasts" className="py-14 bg-[#121218] border-b border-[#232332]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#232332] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Video className="w-4 h-4 text-[#D90429]" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#EF233C] font-['Montserrat']">
                SPORTSARENA BROADCASTING
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#F9FAFB] uppercase tracking-tight font-['Montserrat']">
              FEATURED VIDEOS & PODCASTS
            </h2>
          </div>
          <span className="text-xs text-[#A1A1AA]">
            Matchday podcasts • Highlights • Manager press conferences
          </span>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredVideos.map((vid) => (
            <div
              key={vid.id}
              onClick={() => handleOpenVideo(vid)}
              className="group rounded-2xl overflow-hidden bg-[#0B0B0F] border border-[#232332] hover:border-[#D90429]/60 cursor-pointer transition flex flex-col justify-between shadow-xl"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-[#181822]">
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-90"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#D90429] text-white flex items-center justify-center shadow-sports-glow transition-transform group-hover:scale-110">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-[11px] font-mono font-bold">
                  {vid.duration}
                </span>

                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded bg-[#D90429] text-white text-[10px] font-black uppercase tracking-wider font-['Montserrat']">
                  {vid.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <h3 className="text-sm sm:text-base font-black text-white group-hover:text-[#EF233C] transition font-['Montserrat'] leading-snug">
                  {vid.title}
                </h3>

                <div className="pt-3 border-t border-[#232332] flex items-center justify-between text-xs text-[#A1A1AA]">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>{vid.views} Views</span>
                  </span>
                  <span className="text-[#EF233C] font-bold uppercase font-['Montserrat']">Watch Now →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Phase 12 Video Pre-Roll Player Lightbox Modal */}
        {playingVideo && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#121218] border border-[#232332] rounded-3xl max-w-3xl w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-[#D90429] font-['Montserrat']">
                  {playingVideo.category}
                </span>
                <button
                  onClick={() => setPlayingVideo(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#D90429] text-white flex items-center justify-center font-bold text-sm transition"
                >
                  ✕
                </button>
              </div>

              {/* Main Video Viewport with Pre-Roll Ad Layer */}
              <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden relative flex items-center justify-center border border-[#232332]">
                <img src={playingVideo.thumbnail} alt="Play" className="w-full h-full object-cover filter brightness-40" />
                
                {/* Phase 12: Pre-Roll Advertisement Overlay */}
                {showPreRoll ? (
                  <div className="absolute inset-0 bg-black/85 flex flex-col justify-between p-6 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#D90429] text-white text-[10px] font-black uppercase font-['Montserrat']">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>VIDEO PRE-ROLL ADVERTISEMENT • SAFARICOM 5G</span>
                      </div>
                      <span className="text-xs font-mono text-[#F59E0B]">
                        Ad plays in: {adCountdown}s
                      </span>
                    </div>

                    <div className="text-center max-w-md mx-auto space-y-2">
                      <h4 className="text-lg sm:text-xl font-black text-white font-['Montserrat']">
                        STREAM EVERY MATCHDAY IN ZERO-BUFFER 4K
                      </h4>
                      <p className="text-xs text-[#A1A1AA]">
                        Dial *544# to claim your Pan-African Sports Pass. Official Telecom Partner of SportsArena.africa.
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <a
                        href="https://www.safaricom.co.ke"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#16A34A] font-bold hover:underline"
                      >
                        Visit Sponsor Website &rarr;
                      </a>

                      <button
                        onClick={() => setShowPreRoll(false)}
                        className="px-4 py-2 rounded-xl bg-white/20 hover:bg-[#D90429] text-white text-xs font-black uppercase tracking-wider font-['Montserrat'] flex items-center gap-1.5 transition"
                      >
                        <span>{adCountdown === 0 ? 'Skip Ad' : `Skip Ad (${adCountdown}s)`}</span>
                        <SkipForward className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="absolute flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-[#D90429] text-white flex items-center justify-center animate-pulse shadow-sports-glow">
                      <Play className="w-7 h-7 fill-current ml-1" />
                    </div>
                    <span className="text-white font-black uppercase text-sm font-['Montserrat'] text-center px-4">
                      Playing: {playingVideo.title}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
                <span>Duration: {playingVideo.duration} • High Definition 1080p</span>
                <button
                  onClick={() => setPlayingVideo(null)}
                  className="px-4 py-2 rounded-full bg-[#181822] text-white font-bold hover:bg-[#232332] transition"
                >
                  Close Player
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
