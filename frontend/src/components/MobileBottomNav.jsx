import React from 'react';
import { Home, Flame, Newspaper, MessageSquare } from 'lucide-react';

export default function MobileBottomNav({ activeTab = 'home', onSelectTab }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home, href: '#home' },
    { id: 'news', label: 'News', icon: Newspaper, href: '#latest-news' },
    { id: 'transfers', label: 'Transfers', icon: Flame, href: '#transfer-centre' },
    { id: 'arena', label: 'Fan Arena', icon: MessageSquare, href: '#fan-arena' }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B0B0F]/95 backdrop-blur-xl border-t border-[#232332] px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around shadow-[0_-4px_25px_rgba(0,0,0,0.95)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <a
            key={tab.id}
            href={tab.href}
            onClick={() => onSelectTab && onSelectTab(tab.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition relative ${
              isActive ? 'text-[#EF233C]' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider font-['Montserrat']">
              {tab.label}
            </span>
          </a>
        );
      })}
    </div>
  );
}
