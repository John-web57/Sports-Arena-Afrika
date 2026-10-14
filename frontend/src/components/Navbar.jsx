import React, { useState } from 'react';
import { 
  Search, Bell, Menu, X, Bookmark, Flame, Users, Calendar, ChevronDown,
  Sparkles, Radio, ExternalLink, ShieldCheck 
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import { SOCIAL_LINKS } from '../data/socialLinks';

// Crisp, verified SVG icon components for social platforms
const FacebookIcon = ({ className = "w-3.5 h-3.5 fill-current" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterXIcon = ({ className = "w-3 h-3 fill-current" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedInIcon = ({ className = "w-3.5 h-3.5 fill-current" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const TelegramIcon = ({ className = "w-3.5 h-3.5 fill-current" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.196 1.006.128.832.942z"/>
  </svg>
);

export default function Navbar({
  onOpenSearch,
  bookmarkCount = 0,
  onOpenBookmarks,
  onOpenNotifications,
  unreadNotificationCount = 0,
  onSelectCategory,
  onNavigate,
  showSearch = true,
  showSocial = true,
  navigationItems = []
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [openDropdown, setOpenDropdown] = useState(null);

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const mainNavigation = [
    { label: 'Home', href: '#home', category: 'ALL' },
    { label: 'Sports', items: [
      { label: 'Football', href: '#latest-news', category: 'FOOTBALL' },
      { label: 'Athletics', href: '#other-sports', category: 'ATHLETICS' },
      { label: 'Basketball', href: '#other-sports', category: 'BASKETBALL' },
      { label: 'Rugby', href: '#other-sports', category: 'RUGBY' },
      { label: 'Boxing', href: '#other-sports', category: 'BOXING' },
      { label: 'Tennis', href: '#other-sports', category: 'TENNIS' },
      { label: 'Motorsport', href: '#other-sports', category: 'MOTORSPORT' },
      { label: 'Other sports', href: '#other-sports', category: 'ALL' }
    ] },
    { label: 'Africa', items: [
      { label: 'East Africa', href: '#african-hub', category: 'AFRICAN FOOTBALL' },
      { label: 'Kenya', href: '#kenya-sports', category: 'KENYA' },
      { label: 'Uganda', href: '#african-hub', category: 'UGANDA' },
      { label: 'Tanzania', href: '#african-hub', category: 'TANZANIA' },
      { label: 'Rwanda', href: '#african-hub', category: 'RWANDA' },
      { label: 'Ethiopia', href: '#african-hub', category: 'ETHIOPIA' },
      { label: 'West Africa', href: '#african-hub', category: 'WEST AFRICA' },
      { label: 'Central Africa', href: '#african-hub', category: 'CENTRAL AFRICA' },
      { label: 'Southern Africa', href: '#african-hub', category: 'SOUTHERN AFRICA' },
      { label: 'North Africa', href: '#african-hub', category: 'NORTH AFRICA' }
    ] },
    { label: 'Global', items: [
      { label: 'Premier League', href: '#latest-news', category: 'PREMIER LEAGUE' },
      { label: 'Champions League', href: '#latest-news', category: 'CHAMPIONS LEAGUE' },
      { label: 'La Liga', href: '#latest-news', category: 'LA LIGA' },
      { label: 'NBA', href: '#other-sports', category: 'NBA' },
      { label: 'FIFA', href: '#latest-news', category: 'FIFA' },
      { label: 'Olympics', href: '#upcoming-events', category: 'OLYMPICS' },
      { label: 'Other international', href: '#latest-news', category: 'ALL' }
    ] },
    { label: 'News', items: [
      { label: 'Breaking news', href: '#latest-news', category: 'ALL' },
      { label: 'Latest news', href: '#latest-news', category: 'ALL' },
      { label: 'Trending', href: '#latest-news', category: 'ALL' },
      { label: 'Features', href: '#analysis-features', category: 'ANALYSIS' },
      { label: 'Interviews', href: '#interviews', category: 'INTERVIEWS' },
      { label: 'Analysis', href: '#analysis-features', category: 'ANALYSIS' },
      { label: 'Opinion', href: '#fan-arena', category: 'ALL' }
    ] },
    { label: 'Features', href: '#analysis-features', category: 'ANALYSIS' },
    { label: 'More', items: [
      { label: 'Videos & podcasts', href: '#videos-podcasts' },
      { label: 'Events', href: '#upcoming-events' },
      { label: 'Fan Arena', href: '#fan-arena' },
      { label: 'About us', href: '#site-footer' },
      { label: 'Contact', href: '#site-footer' }
    ] }
  ];
  const orderedNavigation = navigationItems.length
    ? navigationItems.map(label => mainNavigation.find(item => item.label === label)).filter(Boolean)
    : mainNavigation;

  const handleNavClick = (item) => {
    setActiveTab(item.label);
    if (item.category && onSelectCategory) {
      onSelectCategory(item.category);
    }
    if (item.href && onNavigate) onNavigate(item.href);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };

  const renderNavigationItem = (item, mobile = false) => (
    <a
      key={item.label}
      href={item.href}
      onClick={() => handleNavClick(item)}
      className={mobile
        ? 'block rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--brand-tint)] hover:text-[var(--brand-primary)]'
        : 'block whitespace-nowrap rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--brand-tint)] hover:text-[var(--brand-primary)]'}
    >
      {item.label}
    </a>
  );

  return (
    <div className="bg-[var(--page-bg)] border-b border-[var(--border-color)] w-full">
      {/* 1. TOP UTILITY RIBBON: Live Edition & Date (Left) + Social Media Icons (Top Right) */}
      <div className="bg-[#07070B] border-b border-[#1A1A24] py-1.5 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Left: Live Edition Indicator & Date */}
          <div className="flex items-center gap-2 sm:gap-3 text-[#A1A1AA] text-[11px] font-['Montserrat'] min-w-0">
            {/* Live Indicator Pill */}
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#D90429]/15 border border-[#D90429]/40 text-[#EF233C] font-black text-[9px] uppercase tracking-wider flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF233C] animate-ping inline-block"></span>
              <span>LIVE</span>
            </div>
            
            <span className="hidden sm:inline font-bold uppercase tracking-wider text-[#F9FAFB] text-[10px] truncate">
              Pan-Africa & Kenya Edition
            </span>
            <span className="hidden md:inline text-[#2E2E3A]">•</span>
            <div className="hidden md:flex items-center gap-1 text-[10px] text-[#A1A1AA] font-medium whitespace-nowrap">
              <Calendar className="w-3 h-3 text-[#EF233C]" />
              <span>{todayFormatted}</span>
            </div>
            <span className="hidden xl:inline text-[#2E2E3A]">•</span>
            <span className="hidden xl:inline text-[9px] text-[#EF233C] font-bold uppercase tracking-wider">
              Official Sportswire
            </span>
          </div>

          {/* Right: Social Media Icons (Top Right) */}
          {showSocial && <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            <span className="text-[10px] font-black tracking-wider uppercase text-[#71717A] hidden sm:inline font-['Montserrat']">
              Follow Us:
            </span>
            
            <div className="flex items-center space-x-1 sm:space-x-1.5">
              {/* Facebook Page */}
              <a
                href={SOCIAL_LINKS.facebookPage}
                target="_blank"
                rel="noopener noreferrer"
                title="Follow Sports Arena Afrika on Facebook"
                aria-label="Sports Arena Afrika Facebook Page"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#14141E] hover:bg-[#1877F2] text-[#A1A1AA] hover:text-white border border-[#232332] hover:border-[#1877F2] flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
              >
                <FacebookIcon />
              </a>

              {/* Twitter / X */}
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                title="Follow @SportsArena26 on X"
                aria-label="Sports Arena Afrika on X"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#14141E] hover:bg-black text-[#A1A1AA] hover:text-white border border-[#232332] hover:border-[#52525B] flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
              >
                <TwitterXIcon />
              </a>

              {/* Telegram Channel */}
              <a
                href={SOCIAL_LINKS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                title="Join Sports Arena Telegram Channel"
                aria-label="Sports Arena Afrika on Telegram"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#14141E] hover:bg-[#229ED9] text-[#A1A1AA] hover:text-white border border-[#232332] hover:border-[#229ED9] flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
              >
                <TelegramIcon />
              </a>

              {/* LinkedIn Page */}
              <a
                href={SOCIAL_LINKS.linkedinPage}
                target="_blank"
                rel="noopener noreferrer"
                title="Connect with Sports Arena on LinkedIn"
                aria-label="Sports Arena Afrika on LinkedIn"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#14141E] hover:bg-[#0A66C2] text-[#A1A1AA] hover:text-white border border-[#232332] hover:border-[#0A66C2] flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
              >
                <LinkedInIcon />
              </a>

              {/* Facebook Fan Community Group */}
              <a
                href={SOCIAL_LINKS.facebookGroup}
                target="_blank"
                rel="noopener noreferrer"
                title="Join African Sports Fans Community Group"
                aria-label="African Sports Fans Community Group"
                className="hidden xs:inline-flex items-center gap-1 px-2 h-6 sm:h-7 rounded-lg bg-[#14141E] hover:bg-[#D90429] text-[#A1A1AA] hover:text-white border border-[#232332] hover:border-[#D90429] transition-all duration-200 hover:scale-105 shadow-sm text-[9px] sm:text-[10px] font-bold font-['Montserrat'] uppercase"
              >
                <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden md:inline">Fan Group</span>
              </a>
            </div>
          </div>}

        </div>
      </div>

      {/* 2. MAIN NAVBAR BODY */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 bg-[var(--surface-bg)]">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Brand Logo */}
          <div className="flex items-center flex-shrink-0">
            <a href="#home" className="transition-transform hover:scale-102 flex-shrink-0">
              <BrandLogo size="default" />
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1 xl:gap-2 flex-shrink min-w-0">
            {orderedNavigation.map((item) => {
              const isActive = activeTab === item.label;
              if (item.items) {
                const isOpen = openDropdown === item.label;
                return (
                  <div className="relative" key={item.label}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                      className={`flex items-center gap-1 rounded-lg px-2 py-2 text-[10px] xl:text-[11px] font-black tracking-wide uppercase transition font-['Montserrat'] ${
                        isActive || isOpen
                          ? 'bg-[var(--brand-primary)] text-white'
                          : 'text-[var(--text-primary)] hover:bg-[var(--brand-tint)] hover:text-[var(--brand-primary)]'
                      }`}
                    >
                      {item.label}<ChevronDown className="h-3 w-3" />
                    </button>
                    {isOpen && (
                      <div className="absolute left-0 top-full z-[60] mt-2 max-h-[70vh] min-w-52 overflow-y-auto rounded-xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-2 shadow-xl">
                        {item.items.map(renderNavigationItem)}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => handleNavClick(item)}
                  className={`text-[10px] xl:text-[11px] font-black tracking-wide uppercase py-2 px-2 rounded-lg transition-all duration-200 font-['Montserrat'] flex items-center gap-1 whitespace-nowrap ${
                    isActive
                      ? 'bg-[var(--brand-primary)] text-white'
                      : 'text-[var(--text-primary)] hover:bg-[var(--brand-tint)] hover:text-[var(--brand-primary)]'
                  }`}
                >
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Action Icons (Search, Notifications, Bookmarks, Fan CTA, Mobile Menu) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 flex-shrink-0">
            {/* Search Button */}
            {showSearch && <button
              onClick={onOpenSearch}
              className="p-1.5 sm:p-2 text-[var(--text-secondary)] hover:text-[var(--brand-primary)] bg-[var(--surface-bg)] hover:bg-[var(--brand-tint)] rounded-full transition-all border border-[var(--border-color)] shadow-sm"
              title="Search articles, teams, clubs, or topics"
              aria-label="Search articles"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>}

            {/* Notification Bell Button */}
            <button
              onClick={onOpenNotifications}
              className="relative p-1.5 sm:p-2 text-[var(--text-secondary)] hover:text-[var(--brand-primary)] bg-[var(--surface-bg)] hover:bg-[var(--brand-tint)] rounded-full transition-all border border-[var(--border-color)] shadow-sm"
              title="Breaking News & Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#D90429] text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse shadow-[0_0_8px_rgba(217,4,41,0.6)]">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Bookmarks Counter */}
            <button
              onClick={onOpenBookmarks}
              className="relative p-1.5 sm:p-2 text-[var(--text-secondary)] hover:text-[var(--brand-primary)] bg-[var(--surface-bg)] hover:bg-[var(--brand-tint)] rounded-full transition-all border border-[var(--border-color)] shadow-sm"
              title="Saved Articles & Reading List"
              aria-label="Reading list"
            >
              <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
              {bookmarkCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#EF233C] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {bookmarkCount}
                </span>
              )}
            </button>

            {/* Join Fan Arena CTA Button */}
            <a
              href="#fan-arena"
              className="hidden 2xl:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sports-gradient text-white text-xs font-black uppercase tracking-wider shadow-sports-glow font-['Montserrat'] hover:scale-105 transition-all flex-shrink-0"
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>FAN ARENA</span>
            </a>

            {/* Mobile Drawer Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#F9FAFB] hover:text-[#EF233C] bg-[#14141E] border border-[#232332] rounded-lg transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. MOBILE DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[var(--page-bg)] border-b border-[var(--border-color)] px-4 pt-3 pb-6 space-y-4 animate-in fade-in duration-200">
          <nav aria-label="Mobile navigation" className="space-y-2">
            {orderedNavigation.map(item => item.items ? (
              <details key={item.label} className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-bg)]">
                <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-3 font-['Montserrat'] text-sm font-bold uppercase text-[var(--text-primary)]">
                  {item.label}<ChevronDown className="h-4 w-4" />
                </summary>
                <div className="grid grid-cols-2 gap-1 border-t border-[var(--border-color)] p-2">
                  {item.items.map(entry => renderNavigationItem(entry, true))}
                </div>
              </details>
            ) : renderNavigationItem(item, true))}
          </nav>

          {/* Quick Notification Button in Mobile Drawer */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenNotifications) onOpenNotifications();
            }}
            className="w-full p-3 rounded-xl bg-[var(--brand-tint)] border border-[var(--brand-primary)]/40 text-left flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[var(--brand-primary)]" />
              <span className="text-xs font-black uppercase text-[var(--text-primary)] font-['Montserrat']">
                Live Alerts & Notifications
              </span>
            </div>
            {unreadNotificationCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#D90429] text-white text-[10px] font-black">
                {unreadNotificationCount} New
              </span>
            )}
          </button>

          {/* Quick Bookmarks Button in Mobile Drawer */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenBookmarks) onOpenBookmarks();
            }}
            className="w-full p-3 rounded-xl bg-[var(--surface-bg)] hover:bg-[var(--brand-tint)] border border-[var(--border-color)] text-left flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[var(--brand-primary)]" />
              <span className="text-xs font-black uppercase text-[var(--text-primary)] font-['Montserrat']">
                Saved Articles ({bookmarkCount})
              </span>
            </div>
          </button>

          {/* Dedicated Social Media Channels in Mobile Drawer */}
          {showSocial && <div className="pt-2 border-t border-[#1C1C28]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black tracking-wider uppercase text-[#71717A] font-['Montserrat']">
                Official Social Channels
              </span>
              <span className="text-[10px] text-[#EF233C] font-bold">@SportsArena26</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              <a
                href={SOCIAL_LINKS.facebookPage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#14141E] hover:bg-[#1877F2] text-[#A1A1AA] hover:text-white border border-[#232332] transition group"
              >
                <FacebookIcon className="w-4 h-4 fill-current mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-bold">Facebook</span>
              </a>

              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#14141E] hover:bg-black text-[#A1A1AA] hover:text-white border border-[#232332] transition group"
              >
                <TwitterXIcon className="w-4 h-4 fill-current mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-bold">X (Twitter)</span>
              </a>

              <a
                href={SOCIAL_LINKS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#14141E] hover:bg-[#229ED9] text-[#A1A1AA] hover:text-white border border-[#232332] transition group"
              >
                <TelegramIcon className="w-4 h-4 fill-current mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-bold">Telegram</span>
              </a>

              <a
                href={SOCIAL_LINKS.linkedinPage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#14141E] hover:bg-[#0A66C2] text-[#A1A1AA] hover:text-white border border-[#232332] transition group"
              >
                <LinkedInIcon className="w-4 h-4 fill-current mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-bold">LinkedIn</span>
              </a>
            </div>

            {/* Fan Group Banner */}
            <a
              href={SOCIAL_LINKS.facebookGroup}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full p-2.5 rounded-xl bg-[#181824] hover:bg-[#D90429] text-[#A1A1AA] hover:text-white border border-[#282838] hover:border-[#D90429] flex items-center justify-between text-xs transition group font-['Montserrat'] font-bold"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#EF233C] group-hover:text-white" />
                <span>Join African Sports Fans Community</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
            </a>
          </div>}

          {/* Drawer Footer Branding */}
          <div className="pt-3 border-t border-[#1C1C28] flex items-center justify-between text-xs text-[#71717A]">
            <span className="font-semibold">Sports Arena Afrika</span>
            <span className="text-[10px] font-mono text-[#52525B]">Pan-Africa Sports Network</span>
          </div>
        </div>
      )}
    </div>
  );
}
