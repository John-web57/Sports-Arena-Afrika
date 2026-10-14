import React from 'react';
import {
  Zap, Flame, Users, Globe2, Shield, Phone, Mail, ChevronRight, ExternalLink
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import { SOCIAL_LINKS } from '../data/socialLinks';

const FacebookIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterXIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.196 1.006.128.832.942z"/>
  </svg>
);

export default function Footer() {
  const brandPillars = [
    { icon: Zap, label: 'BOLD', desc: 'Passion' },
    { icon: Flame, label: 'PASSIONATE', desc: 'Strength' },
    { icon: Users, label: 'POWERFUL', desc: 'Community' },
    { icon: Globe2, label: 'AFRICAN', desc: 'Continental' },
    { icon: Shield, label: 'UNIFIED', desc: 'Africa First' }
  ];

  return (
    <footer id="site-footer" className="border-t border-[var(--border-color)] bg-[var(--surface-bg)] text-[var(--text-primary)]">
      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
          
          {/* Col 1: Brand Logo & Mission */}
          <div className="space-y-4 md:col-span-1">
            <BrandLogo size="default" />
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed pt-2">
              Sports Arena Afrika is a premier digital sports news and publishing platform delivering sports journalism, breaking news, tactical analysis, in-depth features, athlete interviews, and multimedia coverage across African and Kenyan sports.
            </p>
            <div className="pt-2">
              <span className="text-[11px] text-[#D90429] font-black uppercase tracking-wider block font-['Montserrat']">
                SPORTSARENA.AFRICA
              </span>
              <span className="text-[10px] text-[var(--text-secondary)]">Nairobi • Lagos • Johannesburg • Cairo</span>
            </div>
          </div>

          {/* Col 2: Sports Desks */}
          <div className="space-y-3">
            <h4 className="text-xs font-black tracking-[0.2em] uppercase text-[var(--text-primary)] font-['Montserrat']">
              SPORTS DESKS
            </h4>
            <ul className="space-y-2 text-xs font-bold text-[var(--text-secondary)] uppercase font-['Montserrat']">
              <li><a href="#kenya-sports" className="hover:text-[#EF233C] transition">Kenya Sports Arena</a></li>
              <li><a href="#african-hub" className="hover:text-[#EF233C] transition">African Football Hub</a></li>
              <li><a href="#other-sports" className="hover:text-[#EF233C] transition">Athletics & Marathons</a></li>
              <li><a href="#other-sports" className="hover:text-[#EF233C] transition">Rugby & Kenya Shujaa 7s</a></li>
              <li><a href="#other-sports" className="hover:text-[#EF233C] transition">Basketball (BAL & KBF)</a></li>
              <li><a href="#other-sports" className="hover:text-[#EF233C] transition">WRC Safari Rally & Motorsport</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-black tracking-[0.2em] uppercase text-[var(--text-primary)] font-['Montserrat']">
              EDITORIAL DESK
            </h4>
            <ul className="space-y-2 text-xs font-bold text-[var(--text-secondary)] uppercase font-['Montserrat']">
              <li><a href="#latest-news" className="hover:text-[#EF233C] transition">Latest Sports News Feed</a></li>
              <li><a href="#analysis-features" className="hover:text-[#EF233C] transition">Tactical Analysis & Tactics</a></li>
              <li><a href="#analysis-features" className="hover:text-[#EF233C] transition">In-Depth Features</a></li>
              <li><a href="#interviews" className="hover:text-[#EF233C] transition">Exclusive Interviews</a></li>
              <li><a href="#upcoming-events" className="hover:text-[#EF233C] transition">Upcoming Events Calendar</a></li>
              <li><a href="#videos-podcasts" className="hover:text-[#EF233C] transition">Multimedia & Video Desk</a></li>
            </ul>
          </div>

          {/* Col 4: Follow Us & Social Network */}
          <div className="space-y-4">
            <h4 className="text-xs font-black tracking-[0.2em] uppercase text-[var(--text-primary)] font-['Montserrat']">
              CONNECT WITH US
            </h4>
            <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
              {/* Facebook Page */}
              <a 
                href={SOCIAL_LINKS.facebookPage} 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition shadow"
                title="Sports Arena Afrika Official Facebook Page"
                aria-label="Sports Arena Afrika Official Facebook Page"
              >
                <FacebookIcon />
              </a>

              {/* Facebook Group */}
              <a 
                href={SOCIAL_LINKS.facebookGroup} 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition shadow"
                title="Official Sports Arena Afrika Facebook Group"
                aria-label="Official Sports Arena Afrika Facebook Group"
              >
                <FacebookIcon />
              </a>

              {/* Twitter / X */}
              <a 
                href={SOCIAL_LINKS.twitter} 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full bg-black border border-gray-700 text-white flex items-center justify-center hover:scale-110 transition shadow"
                title="Official Twitter / X: @SportsArena26"
                aria-label="Official Twitter / X: @SportsArena26"
              >
                <TwitterXIcon />
              </a>

              {/* Telegram Channel */}
              <a 
                href={SOCIAL_LINKS.telegram} 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full bg-[#2AABEE] text-white flex items-center justify-center hover:scale-110 transition shadow"
                title="Official Telegram Channel: @SportsArenaAfrica"
                aria-label="Official Telegram Channel: @SportsArenaAfrica"
              >
                <TelegramIcon />
              </a>

              {/* LinkedIn Page */}
              <a 
                href={SOCIAL_LINKS.linkedinPage} 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:scale-110 transition shadow"
                title="Official LinkedIn Company Page: Sports Arena Africa"
                aria-label="Official LinkedIn Company Page: Sports Arena Africa"
              >
                <LinkedInIcon />
              </a>

              {/* LinkedIn Group */}
              <a 
                href={SOCIAL_LINKS.linkedinGroup} 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:scale-110 transition shadow"
                title="Official Sports Arena Africa LinkedIn Group"
                aria-label="Official Sports Arena Africa LinkedIn Group"
              >
                <LinkedInIcon />
              </a>
            </div>

            {/* Official Community Groups */}
            <div className="space-y-2 pt-2 border-t border-[#1E1E2C] text-xs">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                Official Communities:
              </span>
              <div className="space-y-1.5">
                <a 
                  href={SOCIAL_LINKS.facebookGroup} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold transition group"
                >
                  <Users className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition" />
                  <span>Join Facebook Group</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>

                <a 
                  href={SOCIAL_LINKS.linkedinGroup} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-bold transition group"
                >
                  <Users className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition" />
                  <span>Join LinkedIn Group</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>

                <a 
                  href={SOCIAL_LINKS.telegram} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-bold transition group"
                >
                  <Globe2 className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition" />
                  <span>Telegram News Alerts</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed pt-1">
              Join millions of sports followers across our official African publishing and discussion networks.
            </p>
          </div>

        </div>
      </div>

      {/* Brand Values Ribbon */}
      <div className="bg-[#121218] border-t border-[#232332] py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-black tracking-widest text-[var(--text-secondary)] font-['Montserrat']">
          {brandPillars.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} className="flex items-center gap-2 group cursor-default">
                <Icon className="w-4 h-4 text-[#D90429] transition-transform group-hover:scale-125" />
                <span className="group-hover:text-white transition">{val.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="bg-[var(--page-bg)] py-4 px-4 text-center text-xs text-[var(--text-secondary)] border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 Sports Arena Afrika (sportsarenaafrika.com) • Africa's Premier Sports Journalism Hub. All rights reserved.</span>
          <div className="flex items-center space-x-4 text-[11px]">
            <a href="#terms" className="hover:text-white transition">Terms of Service</a>
            <span>•</span>
            <a href="#privacy" className="hover:text-white transition">Privacy Policy</a>
            <span>•</span>
            <a href="#editorial" className="hover:text-white transition">Editorial Guidelines</a>
            <span>•</span>
            <a href="#admin" className="text-gray-500 hover:text-[#EF233C] transition font-mono">CMS Portal</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
