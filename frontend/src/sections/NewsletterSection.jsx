import React, { useState } from 'react';
import { Mail, CheckCircle2, Flame, Send } from 'lucide-react';
import { notificationService } from '../services/notificationService';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(() => {
    try {
      return localStorage.getItem('sportsarena_newsletter_subscribed') === 'true';
    } catch (e) {
      return false;
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    try {
      const existing = JSON.parse(localStorage.getItem('sportsarena_newsletter_list') || '[]');
      if (!existing.includes(email.trim())) {
        existing.push(email.trim());
        localStorage.setItem('sportsarena_newsletter_list', JSON.stringify(existing));
      }
      localStorage.setItem('sportsarena_newsletter_subscribed', 'true');
    } catch (err) {}

    setSubscribed(true);
    notificationService.showToast({
      title: '📩 Welcome to the Insider!',
      body: `Daily African & global sports briefings will be sent to ${email}`,
      type: 'SYSTEM',
      category: 'Newsletter'
    });
  };

  return (
    <section className="py-14 bg-gradient-to-r from-[#D90429] via-[#EF233C] to-[#9B001A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B0B0F]/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#F59E0B]" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#F59E0B] font-['Montserrat']">
                  SPORTSARENA.AFRICA INSIDER
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight font-['Montserrat'] leading-tight">
                GET DAILY AFRICAN & GLOBAL SPORTS UPDATES
              </h2>
              <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-xl leading-relaxed">
                Join over 250,000 sports fans across Africa receiving morning breaking news, EPL analysis, transfer alerts, and exclusive matchday tactical breakdowns straight to your inbox.
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="bg-[#16A34A]/20 border border-[#16A34A] rounded-2xl p-6 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-[#16A34A] mx-auto" />
                  <h3 className="text-base font-black text-white font-['Montserrat'] uppercase">
                    You're On The Team!
                  </h3>
                  <p className="text-xs text-[#A1A1AA]">
                    Welcome to SportsArena.africa Insider. Check your inbox for today's morning sports briefing.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      required
                      className="flex-1 bg-[#181822] border border-[#232332] rounded-full px-5 py-3.5 text-xs text-white placeholder-[#777788] focus:outline-none focus:border-[#D90429]"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3.5 rounded-full bg-sports-gradient text-white text-xs font-black uppercase tracking-wider font-['Montserrat'] shadow-sports-glow hover:opacity-95 transition flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <span>SUBSCRIBE</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="block text-[11px] text-[#A1A1AA] text-center">
                    🔒 No spam ever. Unsubscribe at any time with a single click.
                  </span>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
