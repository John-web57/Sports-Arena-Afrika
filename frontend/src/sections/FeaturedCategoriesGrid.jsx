import React from 'react';
import { Trophy, Globe, Flame, ArrowRight, Shield, Zap, Award, Compass } from 'lucide-react';

export const featuredCategories = [
  {
    id: 'PREMIER LEAGUE',
    name: 'Premier League',
    subtitle: 'English top-flight analysis, tactical breakdowns & match reports',
    icon: Trophy,
    color: '#D90429',
    bgGradient: 'from-[#D90429]/20 to-transparent',
    storyCount: '48 Articles'
  },
  {
    id: 'AFRICAN FOOTBALL',
    name: 'African Football',
    subtitle: 'CAF Champions League, AFCON 2027, CHAN & WAFCON updates',
    icon: Globe,
    color: '#16A34A',
    bgGradient: 'from-[#16A34A]/20 to-transparent',
    storyCount: '62 Articles'
  },
  {
    id: 'KENYA',
    name: 'Kenyan Football',
    subtitle: 'FKF Premier League, Harambee Stars, Gor Mahia & AFC Leopards',
    icon: Shield,
    color: '#F59E0B',
    bgGradient: 'from-[#F59E0B]/20 to-transparent',
    storyCount: '34 Articles'
  },
  {
    id: 'TRANSFERS',
    name: 'Transfer Centre',
    subtitle: 'Verified done deals, summer rumours, fees & deadline radar',
    icon: Flame,
    color: '#EF233C',
    bgGradient: 'from-[#EF233C]/20 to-transparent',
    storyCount: '29 Updates'
  },
  {
    id: 'BASKETBALL',
    name: 'Basketball',
    subtitle: 'NBA coverage, Basketball Africa League (BAL) & Kenya KBF',
    icon: Zap,
    color: '#EC4899',
    bgGradient: 'from-[#EC4899]/20 to-transparent',
    storyCount: '18 Stories'
  },
  {
    id: 'ATHLETICS',
    name: 'Athletics & Marathons',
    subtitle: 'Kenyan distance runners, Diamond League, Olympic champions',
    icon: Award,
    color: '#10B981',
    bgGradient: 'from-[#10B981]/20 to-transparent',
    storyCount: '22 Stories'
  },
  {
    id: 'RUGBY',
    name: 'Rugby & Sevens',
    subtitle: 'Kenya Shujaa, Simbas, World Rugby SVNS & Rugby Africa Cup',
    icon: Compass,
    color: '#8B5CF6',
    bgGradient: 'from-[#8B5CF6]/20 to-transparent',
    storyCount: '15 Stories'
  },
  {
    id: 'CHAMPIONS LEAGUE',
    name: 'Champions League',
    subtitle: 'UEFA Champions League nights, knockout fixtures & tactical previews',
    icon: Trophy,
    color: '#3B82F6',
    bgGradient: 'from-[#3B82F6]/20 to-transparent',
    storyCount: '26 Articles'
  }
];

export default function FeaturedCategoriesGrid({ onSelectCategory }) {
  const handleCategoryClick = (catId) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
    const el = document.getElementById('latest-news');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="featured-categories" className="py-12 bg-[#0E0E14] border-b border-[#232332]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#232332] gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF233C]"></span>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#EF233C] font-['Montserrat']">
                SPORTS CHANNELS & DESKS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-['Montserrat']">
              FEATURED CATEGORIES
            </h2>
          </div>
          <span className="text-xs text-[#A1A1AA] font-semibold">
            Explore dedicated editorial desks across sports
          </span>
        </div>

        {/* 8-Card Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="group relative bg-[#121218] hover:bg-[#181822] border border-[#232332] hover:border-[#EF233C]/60 rounded-2xl p-5 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 shadow-lg overflow-hidden flex flex-col justify-between"
              >
                {/* Subtle Glow Gradient */}
                <div className={`absolute -top-12 -right-12 w-28 h-28 rounded-full bg-gradient-to-br ${cat.bgGradient} blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>

                <div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#232332] transition group-hover:scale-110"
                      style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-[#A1A1AA] bg-[#0B0B0F] px-2 py-0.5 rounded-full border border-[#232332]">
                      {cat.storyCount}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white group-hover:text-[#EF233C] transition font-['Montserrat'] uppercase tracking-wide mb-1.5 relative z-10">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#A1A1AA] line-clamp-2 leading-relaxed relative z-10">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#232332] flex items-center justify-between text-xs font-bold text-[#A1A1AA] group-hover:text-white relative z-10 font-['Montserrat']">
                  <span className="text-[11px] uppercase tracking-wider">Browse Desk</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#EF233C] transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
