import React, { useState } from 'react';
import { MessageSquare, Heart, Share2, Flame, TrendingUp, UserCheck } from 'lucide-react';

export default function TrendingDiscussionSection({ discussions = [] }) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [likes, setLikes] = useState({});

  const categories = ['ALL', 'MATCH DISCUSSIONS', 'TRANSFER RUMOURS', 'CLUB DISCUSSIONS', 'PLAYER DISCUSSIONS'];

  const filtered = activeCategory === 'ALL'
    ? discussions
    : discussions.filter(d => d.category.toUpperCase().includes(activeCategory));

  const toggleLike = (id) => {
    setLikes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section id="trending-discussions" className="py-14 bg-[#0B0B0F] border-b border-[#232332]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#232332] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Flame className="w-4 h-4 text-[#D90429]" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#EF233C] font-['Montserrat']">
                FAN COMMUNITY HUB
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#F9FAFB] uppercase tracking-tight font-['Montserrat']">
              TRENDING FAN DISCUSSIONS
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider font-['Montserrat'] transition whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-[#D90429] text-white shadow-sports-glow'
                    : 'bg-[#181822] text-[#A1A1AA] hover:text-white border border-[#232332]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Discussion Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((disc) => {
            const isLiked = !!likes[disc.id];
            const currentLikes = isLiked ? disc.likes + 1 : disc.likes;

            return (
              <div
                key={disc.id}
                className="bg-[#121218] border border-[#232332] hover:border-[#D90429]/50 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-lg"
              >
                <div>
                  {/* User Profile Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={disc.avatar}
                        alt={disc.user}
                        className="w-10 h-10 rounded-full object-cover border-2 border-[#D90429]/40"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-white font-['Montserrat']">
                            {disc.user}
                          </span>
                          <UserCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                        </div>
                        <span className="text-[11px] text-[#A1A1AA]">{disc.club} Supporter • {disc.time}</span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-[#181822] border border-[#232332] text-[10px] font-black uppercase text-[#F59E0B] tracking-wider font-['Montserrat']">
                      {disc.category}
                    </span>
                  </div>

                  {/* Headline & Preview */}
                  <h3 className="text-base sm:text-lg font-black text-white hover:text-[#EF233C] transition cursor-pointer font-['Montserrat'] leading-snug">
                    {disc.headline}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                    {disc.preview}
                  </p>
                </div>

                {/* Engagement Bar: Likes, Comments, Shares */}
                <div className="pt-5 mt-5 border-t border-[#232332] flex items-center justify-between text-xs text-[#A1A1AA]">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleLike(disc.id)}
                      className={`flex items-center gap-1.5 transition font-medium ${
                        isLiked ? 'text-[#D90429]' : 'hover:text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{currentLikes}</span>
                    </button>

                    <button className="flex items-center gap-1.5 hover:text-white transition font-medium">
                      <MessageSquare className="w-4 h-4 text-[#16A34A]" />
                      <span>{disc.comments} replies</span>
                    </button>

                    <button className="flex items-center gap-1.5 hover:text-white transition font-medium">
                      <Share2 className="w-4 h-4" />
                      <span>{disc.shares}</span>
                    </button>
                  </div>

                  <a
                    href="#fan-arena"
                    className="text-[#EF233C] font-bold uppercase tracking-wider text-[11px] hover:underline font-['Montserrat']"
                  >
                    Join Debate →
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
