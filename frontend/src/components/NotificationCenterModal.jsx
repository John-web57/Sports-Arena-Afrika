import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import {
  Bell, Check, X, Volume2, VolumeX, Shield, Radio, Flame,
  Clock, Trash2, CheckCircle2, ArrowRight, Settings2, Sparkles, Send
} from 'lucide-react';

export default function NotificationCenterModal({ isOpen, onClose, onSelectArticle }) {
  const [notifications, setNotifications] = useState(notificationService.getNotifications());
  const [permission, setPermission] = useState(notificationService.getPermissionStatus());
  const [settings, setSettings] = useState(notificationService.settings);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'settings'

  useEffect(() => {
    const unsub = notificationService.subscribeToHistory((newList) => {
      setNotifications(newList);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    setPermission(notificationService.getPermissionStatus());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPush = async () => {
    const res = await notificationService.requestPermission();
    setPermission(res);
  };

  const handleToggleSetting = (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    notificationService.saveSettings(updated);
  };

  const handleSendTestNotification = () => {
    const testCases = [
      {
        title: '🚨 BREAKING: CAF Confirms AFCON 2027 Schedule',
        body: 'Tournament kick-off and venue allocation announced across Nairobi, Kampala and Dar es Salaam.',
        type: 'BREAKING',
        category: 'African Football',
        link: '#latest-news'
      },
      {
        title: '🔄 TRANSFER ALERT: Victor Osimhen Completes Move',
        body: 'Nigerian international signs 5-year contract with Chelsea after €75M agreement.',
        type: 'TRANSFER',
        category: 'Transfers',
        link: '#transfer-centre'
      },
      {
        title: '📰 BREAKING SPORTS NEWS',
        body: 'Emirates Stadium clash kicking off at 19:30 EAT. Broadcast live on SuperSport.',
        type: 'BREAKING',
        category: 'Premier League',
        link: '#latest-news'
      },
      {
        title: '🏆 FULL-TIME: Gor Mahia 2–0 AFC Leopards',
        body: 'Benson Omalla strikes twice as Gor Mahia secure Mashemeji Derby triumph.',
        type: 'BREAKING',
        category: 'FKF Premier League',
        link: '#latest-news'
      }
    ];

    const pick = testCases[Math.floor(Math.random() * testCases.length)];
    notificationService.sendNotification(pick);
  };

  const handleItemClick = (notif) => {
    notificationService.markAsRead(notif.id);
    if (notif.data?.articleId && onSelectArticle) {
      onSelectArticle(notif.data.articleId);
    } else if (notif.link && notif.link.startsWith('#')) {
      const el = document.getElementById(notif.link.substring(1));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    onClose();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal / Flyout Drawer */}
      <div className="relative w-full max-w-md bg-[#0F0F14] border border-[#232332] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(217,4,41,0.15)] flex flex-col max-h-[90vh] overflow-hidden z-10 mt-12 sm:mt-16 mr-0 sm:mr-4 text-[#F9FAFB]">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#232332] bg-[#121218] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#D90429]/10 text-[#EF233C] border border-[#D90429]/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black uppercase tracking-tight font-['Montserrat']">
                  SPORTS NOTIFICATIONS
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#D90429] text-white text-[10px] font-black">
                    {unreadCount} NEW
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#A1A1AA]">
                Breaking news and article alerts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#A1A1AA] hover:text-white hover:bg-[#181822] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Push Permission Alert Card */}
        {permission !== 'granted' ? (
          <div className="p-3.5 mx-4 mt-3 rounded-2xl bg-gradient-to-r from-[#D90429]/20 to-[#181822] border border-[#D90429]/40 flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-[#EF233C] animate-ping flex-shrink-0"></div>
              <div className="min-w-0">
                <span className="text-xs font-black uppercase text-white font-['Montserrat'] block truncate">
                  Enable Desktop & Phone Alerts
                </span>
                <span className="text-[10px] text-[#D1D5DB] block truncate">
                  Get instant score changes even when app is minimized
                </span>
              </div>
            </div>

            <button
              onClick={handleRequestPush}
              className="px-3.5 py-1.5 rounded-full bg-[#D90429] hover:bg-[#EF233C] text-white font-black text-xs uppercase tracking-wider shadow-sports-glow transition flex-shrink-0 flex items-center gap-1 font-['Montserrat']"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Allow</span>
            </button>
          </div>
        ) : (
          <div className="px-4 pt-3 flex items-center justify-between text-xs text-[#16A34A]">
            <span className="flex items-center gap-1.5 font-bold font-['Montserrat'] text-[11px] uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Browser Push Notifications Active</span>
            </span>
            <span className="text-[10px] text-[#A1A1AA] font-mono">PWA Enabled</span>
          </div>
        )}

        {/* View Tabs: Notifications List / Preferences */}
        <div className="flex border-b border-[#232332] px-4 pt-2 text-xs font-bold text-[#A1A1AA]">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-2.5 px-3 border-b-2 font-['Montserrat'] uppercase tracking-wider transition ${
              activeTab === 'all'
                ? 'text-white border-[#D90429]'
                : 'border-transparent hover:text-white'
            }`}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-2.5 px-3 border-b-2 font-['Montserrat'] uppercase tracking-wider transition flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'text-white border-[#D90429]'
                : 'border-transparent hover:text-white'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Preferences</span>
          </button>
        </div>

        {/* Tab 1: All Alerts List */}
        {activeTab === 'all' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-[#232332]/50">
            {notifications.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <Bell className="w-10 h-10 text-[#333344] mx-auto" />
                <p className="text-xs text-[#A1A1AA] font-medium">
                  No notifications yet. You're all caught up!
                </p>
                <button
                  onClick={handleSendTestNotification}
                  className="px-4 py-2 rounded-xl bg-[#181822] hover:bg-[#232332] text-xs font-bold text-white border border-[#232332] transition"
                >
                  Send Sample Goal Notification
                </button>
              </div>
            ) : (
              notifications.map((notif) => {
                const isGoal = notif.type === 'GOAL';
                const isBreaking = notif.type === 'BREAKING';

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleItemClick(notif)}
                    className={`pt-2.5 first:pt-0 pb-1 cursor-pointer group transition rounded-xl p-2.5 ${
                      !notif.read ? 'bg-[#181822]/70 border border-[#232332]' : 'hover:bg-[#181822]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                          isGoal
                            ? 'bg-[#16A34A] text-white'
                            : isBreaking
                            ? 'bg-[#D90429] text-white'
                            : 'bg-[#232332] text-[#A1A1AA]'
                        }`}>
                          {notif.type}
                        </span>
                        <span className="text-[10px] text-[#A1A1AA] font-bold uppercase tracking-wider">
                          {notif.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#71717A] font-mono">{notif.timestamp}</span>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-[#EF233C]" title="Unread"></span>
                        )}
                      </div>
                    </div>

                    <h4 className="text-xs font-black text-white group-hover:text-[#EF233C] transition font-['Montserrat'] uppercase">
                      {notif.title}
                    </h4>
                    <p className="text-[11px] text-[#A1A1AA] mt-0.5 line-clamp-2 leading-relaxed">
                      {notif.body}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Notification Preferences */}
        {activeTab === 'settings' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            <span className="font-black uppercase tracking-wider text-[11px] text-[#A1A1AA] font-['Montserrat'] block">
              Alert Categories
            </span>

            {[
              { key: 'breaking', label: '🚨 Breaking Sports News', desc: 'Urgent tournament announcements, scoops & breaking stories' },
              { key: 'transfers', label: '🔄 Transfer Alerts & Deals', desc: 'Confirmed transfers, fees, medical updates & radar' },
              { key: 'reminders', label: '📰 Breaking News Alerts', desc: 'Breaking story and newsroom alerts' },
              { key: 'results', label: '🏆 Breaking Story Updates', desc: 'New published stories and editorial updates' },
              { key: 'highlights', label: '📺 Video Highlights & Podcasts', desc: 'New match highlights and exclusive interview releases' },
              { key: 'sound', label: '🔔 Sports Notification Sound', desc: 'Chime sound when a new editorial alert arrives' }
            ].map((pref) => (
              <div key={pref.key} className="flex items-center justify-between p-3 rounded-2xl bg-[#121218] border border-[#232332]">
                <div className="pr-3">
                  <span className="font-bold text-white block text-xs">{pref.label}</span>
                  <span className="text-[10px] text-[#A1A1AA] block mt-0.5">{pref.desc}</span>
                </div>

                <button
                  onClick={() => handleToggleSetting(pref.key)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    settings[pref.key] ? 'bg-[#16A34A]' : 'bg-[#232332]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      settings[pref.key] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Drawer Footer Actions */}
        <div className="p-3.5 border-t border-[#232332] bg-[#121218] flex items-center justify-between gap-2 text-xs">
          <button
            onClick={handleSendTestNotification}
            className="px-3 py-1.5 rounded-xl bg-[#181822] hover:bg-[#232332] text-white border border-[#232332] flex items-center gap-1.5 transition font-bold text-[11px]"
            title="Trigger a live sample notification immediately"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Send Test Alert</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => notificationService.markAllAsRead()}
              className="text-[#A1A1AA] hover:text-white transition text-[11px] font-semibold"
            >
              Mark all read
            </button>
            <span className="text-[#333344]">•</span>
            <button
              onClick={() => notificationService.clearAll()}
              className="text-[#EF233C] hover:text-red-400 transition text-[11px] font-semibold flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
