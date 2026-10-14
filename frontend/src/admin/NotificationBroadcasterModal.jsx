import React, { useState } from 'react';
import { notificationService } from '../services/notificationService';
import { Send, Bell, Flame, X, Sparkles, CheckCircle2, FileText } from 'lucide-react';

export default function NotificationBroadcasterModal({ isOpen, onClose, articles = [] }) {
  const [notifType, setNotifType] = useState('BREAKING');
  const [title, setTitle] = useState('🚨 BREAKING: CAF Announces AFCON 2027 Schedule');
  const [body, setBody] = useState('Confederation of African Football confirms opening fixture dates and stadium venues across East Africa.');
  const [category, setCategory] = useState('African Football');
  const [targetLink, setTargetLink] = useState('#latest-news');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePresetChange = (type) => {
    setNotifType(type);
    const art = articles[0];
    if (type === 'BREAKING') {
      setTitle(`🚨 BREAKING: ${art?.title || 'Latest Sports News'}`);
      setBody(art?.excerpt || 'Read the latest Sports Arena Afrika breaking story.');
      setCategory(art?.category || 'Breaking News');
      setTargetLink('#latest-news');
    } else if (type === 'TRANSFER') {
      setTitle('🔄 TRANSFER ALERT: Major African Transfer Update');
      setBody('Read the latest confirmed transfer news and reporting.');
      setCategory('Transfers'); setTargetLink('#transfer-centre');
    } else if (type === 'HIGHLIGHTS') {
      setTitle('📺 SPORTS VIDEO HIGHLIGHTS');
      setBody('New sports video and interview content is now available.');
      setCategory('Videos'); setTargetLink('#videos-podcasts');
    } else {
      const item = articles[1] || articles[0];
      setTitle(`📰 NEW ARTICLE: ${item?.title || 'New story published'}`);
      setBody(item?.excerpt || 'A new story is available on Sports Arena Afrika.');
      setCategory(item?.category || 'News'); setTargetLink('#latest-news');
    }
  };

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    notificationService.sendNotification({
      title: title.trim(),
      body: body.trim(),
      type: notifType,
      category,
      link: targetLink
    });

    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#121218] border border-[#232332] rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-[#232332] bg-[#181822] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#D90429]/20 border border-[#D90429]/40 flex items-center justify-center text-[#EF233C]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase font-['Montserrat']">
                Push Notification Broadcaster
              </h3>
              <span className="text-[11px] text-[#A1A1AA]">
                Dispatch immediate browser push and in-app alerts to readers
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#232332] text-[#A1A1AA] hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleBroadcast} className="p-6 space-y-4 text-xs">
          
          {sentSuccess && (
            <div className="p-3 rounded-xl bg-green-950/80 border border-green-500/40 text-green-300 text-xs flex items-center gap-2 animate-fadeIn font-semibold">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>Notification successfully dispatched to all active reader tabs & service workers!</span>
            </div>
          )}

          {/* Quick Preset Buttons */}
          <div>
            <label className="block text-[#A1A1AA] font-bold uppercase tracking-wider text-[10px] mb-2 font-['Montserrat']">
              Select Editorial Notification Preset
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'BREAKING', label: '🚨 Breaking News', icon: Flame },
                { id: 'TRANSFER', label: '🔄 Transfer Alert', icon: Globe },
                { id: 'ARTICLE', label: '📅 Match Reminder', icon: Calendar },
                { id: 'ARTICLE', label: '🏆 Full-Time Result', icon: Trophy },
                { id: 'HIGHLIGHTS', label: '📺 Highlights', icon: Tv },
                { id: 'ARTICLE', label: '📰 New Article', icon: FileText }
              ].map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePresetChange(p.id)}
                    className={`p-2.5 rounded-xl border text-[11px] font-bold transition flex items-center gap-2 justify-start ${
                      notifType === p.id
                        ? 'bg-[#D90429] text-white border-[#D90429] shadow-sports-glow'
                        : 'bg-[#181822] text-[#A1A1AA] hover:text-white border-[#232332]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Alert Title */}
          <div>
            <label className="block text-[#A1A1AA] font-bold uppercase tracking-wider text-[10px] mb-1.5 font-['Montserrat']">
              Notification Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#181822] border border-[#232332] rounded-xl p-3 text-white focus:outline-none focus:border-[#EF233C]"
            />
          </div>

          {/* Alert Message Body */}
          <div>
            <label className="block text-[#A1A1AA] font-bold uppercase tracking-wider text-[10px] mb-1.5 font-['Montserrat']">
              Message Body (Shown in Toast & OS Notification Banner)
            </label>
            <textarea
              rows={2}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full bg-[#181822] border border-[#232332] rounded-xl p-3 text-white focus:outline-none focus:border-[#EF233C]"
            />
          </div>

          {/* Category & Deep Link Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#A1A1AA] font-bold uppercase tracking-wider text-[10px] mb-1 font-['Montserrat']">
                Category Badge
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#181822] border border-[#232332] rounded-xl p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-[#A1A1AA] font-bold uppercase tracking-wider text-[10px] mb-1 font-['Montserrat']">
                Target Section Link
              </label>
              <select
                value={targetLink}
                onChange={(e) => setTargetLink(e.target.value)}
                className="w-full bg-[#181822] border border-[#232332] rounded-xl p-2.5 text-white"
              >
                <option value="#latest-news">Latest News (#latest-news)</option>
                <option value="#transfer-centre">Transfer Centre (#transfer-centre)</option>
                                                                <option value="#videos-podcasts">Videos & Podcasts (#videos-podcasts)</option>
                <option value="#fan-arena">Fan Arena (#fan-arena)</option>
              </select>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-[#232332] flex items-center justify-between">
            <span className="text-[11px] text-[#A1A1AA]">
              Readers with notifications allowed will hear audio chime & see push card.
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#181822] hover:bg-[#232332] text-[#A1A1AA] hover:text-white font-bold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-sports-gradient text-white font-black uppercase tracking-wider font-['Montserrat'] shadow-sports-glow hover:opacity-95 transition flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast Alert</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
