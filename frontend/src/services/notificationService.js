/**
 * SportsArena.africa - Notification Service
 * Handles:
 * 1. Web Push / Browser Notification API (Notification.requestPermission & new Notification)
 * 2. In-App Floating Toast Notifications with sports telemetry icons
 * 3. Web Audio API synthesized sports alert chimes (works 100% offline with zero dependencies)
 * 4. Cross-tab synchronization via BroadcastChannel
 * 5. Notification history & preferences persistence in localStorage
 */

const NOTIFICATION_STORAGE_KEY = 'sportsarena_notifications_history';
const SETTINGS_STORAGE_KEY = 'sportsarena_notification_preferences';

// Cross-tab broadcast channel for push alerts
const pushChannel = typeof window !== 'undefined' && window.BroadcastChannel
  ? new BroadcastChannel('sportsarena_notifications_channel')
  : null;

// Initial pre-loaded sports notification history - accurately synchronized with editorial articles
export const defaultNotificationHistory = [
  {
    id: 'notif-1',
    title: '🚨 BREAKING: Arsenal Stun Liverpool 2-1 at the Emirates in Title Showdown',
    body: 'Bukayo Saka and Gabriel Martinelli strike in each half as Mikel Arteta’s Gunners claim crucial three points in London.',
    type: 'BREAKING',
    category: 'Premier League',
    timestamp: '12 mins ago',
    read: false,
    link: '#latest-news',
    data: { articleId: 1 }
  },
  {
    id: 'notif-2',
    title: '🏆 HISTORIC: Gor Mahia Clinch 21st FKF Premier League Title',
    body: "K'Ogalo seal another historic milestone in Kenyan football with Benson Omalla leading champions to CAF qualification.",
    type: 'ARTICLE',
    category: 'Kenya',
    timestamp: '45 mins ago',
    read: false,
    link: '#latest-news',
    data: { articleId: 2 }
  },
  {
    id: 'notif-3',
    title: '🌍 CAF CHAMPIONS LEAGUE: Al Ahly Drawn Against Mamelodi Sundowns',
    body: "Africa's continental powerhouses collide in blockbuster quarter-final draw across Cairo and Pretoria.",
    type: 'BREAKING',
    category: 'African Football',
    timestamp: '1 hour ago',
    read: true,
    link: '#latest-news',
    data: { articleId: 3 }
  },
  {
    id: 'notif-4',
    title: '⚡ HAT-TRICK HERO: Victor Osimhen Dominates with Sensational Treble',
    body: 'Super Eagles star strikes three goals in 27 minutes in commanding European performance.',
    type: 'ARTICLE',
    category: 'African Football',
    timestamp: '2 hours ago',
    read: true,
    link: '#latest-news',
    data: { articleId: 4 }
  },
  {
    id: 'notif-5',
    title: '🔄 TRANSFER RADAR: Real Madrid & Mbappé Champions League Focus',
    body: 'Tactical breakdown and transfer market analysis as Madrid prepare European knockout trident.',
    type: 'TRANSFER',
    category: 'Transfers',
    timestamp: '3 hours ago',
    read: true,
    link: '#latest-news',
    data: { articleId: 5 }
  },
  {
    id: 'notif-6',
    title: '🇰🇪 HARAMBEE STARS: 26-Man Squad Confirmed for AFCON Preparations',
    body: 'Michael Olunga captains national team alongside rising FKF stars for continental friendly tour.',
    type: 'ARTICLE',
    category: 'Kenya',
    timestamp: '4 hours ago',
    read: true,
    link: '#latest-news',
    data: { articleId: 6 }
  }
];

class NotificationService {
  constructor() {
    this.toastListeners = new Set();
    this.historyListeners = new Set();
    this.audioContext = null;

    // Load initial settings
    this.settings = this.loadSettings();

    // Listen to cross-tab push events
    if (pushChannel) {
      pushChannel.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type === 'NEW_NOTIFICATION') {
          this.handleIncomingNotification(payload, false);
        }
      };
    }
  }

  loadSettings() {
    if (typeof window === 'undefined') {
      return { enabled: true, breaking: true, transfers: true, reminders: true, results: true, highlights: true, sound: true };
    }
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read notification settings', e);
    }
    return { enabled: true, breaking: true, transfers: true, reminders: true, results: true, highlights: true, sound: true };
  }

  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(this.settings));
      } catch (e) {
        console.warn('Could not save notification settings', e);
      }
    }
  }

  getNotifications() {
    if (typeof window === 'undefined') return defaultNotificationHistory;
    try {
      const stored = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read notification history', e);
    }
    return defaultNotificationHistory;
  }

  saveNotifications(list) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(list));
      } catch (e) {
        console.warn('Could not persist notifications', e);
      }
    }
    this.historyListeners.forEach(cb => {
      try { cb(list); } catch (e) { console.error(e); }
    });
  }

  // Check browser permission status
  getPermissionStatus() {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission; // 'default' | 'granted' | 'denied'
  }

  // Request browser permission
  async requestPermission() {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    try {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        this.playStadiumChime();
        this.sendNotification({
          title: '🔔 SportsArena Notifications Active!',
          body: "You'll receive breaking news, transfer updates, and new story alerts.",
          type: 'SYSTEM',
          category: 'SportsArena'
        });
      }
      return perm;
    } catch (err) {
      console.warn('Error requesting notification permission:', err);
      return 'denied';
    }
  }

  // Synthesized Web Audio API Stadium Chime / Fanfare (Zero external assets needed)
  playStadiumChime(isGoal = false) {
    if (!this.settings.sound || typeof window === 'undefined') return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!this.audioContext) {
        this.audioContext = new AudioCtx();
      }
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const ctx = this.audioContext;
      const now = ctx.currentTime;

      if (isGoal) {
        // Goal Fanfare: 4 ascending celebratory stadium notes
        const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0, now + idx * 0.12);
          gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.12 + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.35);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.4);
        });
      } else {
        // Standard notification chime: gentle double bell (587Hz -> 880Hz)
        [587.33, 880].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.15);
          gain.gain.setValueAtTime(0, now + idx * 0.15);
          gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.15 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.3);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.15);
          osc.stop(now + idx * 0.15 + 0.35);
        });
      }
    } catch (e) {
      console.debug('Audio chime note:', e);
    }
  }

  // Primary dispatch method
  sendNotification({
    title,
    body,
    type = 'BREAKING',
    category = 'Breaking News',
    link = '#latest-news',
    data = {}
  }) {
    const item = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title,
      body,
      type,
      category,
      link,
      data,
      timestamp: 'Just now',
      read: false
    };

    // Broadcast to other tabs
    if (pushChannel) {
      pushChannel.postMessage({
        type: 'NEW_NOTIFICATION',
        payload: item
      });
    }

    this.handleIncomingNotification(item, true);
    return item;
  }

  handleIncomingNotification(item, isLocalOrigin = false) {
    // 1. Play audio alert
    const isGoal = item.type === 'GOAL';
    this.playStadiumChime(isGoal);

    // 2. Add to notification history
    const current = this.getNotifications();
    const updated = [item, ...current.slice(0, 49)];
    this.saveNotifications(updated);

    // 3. Trigger In-App floating Toast Banner
    this.toastListeners.forEach(cb => {
      try { cb(item); } catch (e) { console.error(e); }
    });

    // 4. Trigger Native Browser Push Notification if granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then(reg => {
            reg.showNotification(item.title, {
              body: item.body,
              icon: '/favicon.svg',
              badge: '/favicon.svg',
              tag: item.id,
              vibrate: [150, 50, 150],
              data: { url: item.link }
            });
          }).catch(() => {
            this.fallbackSystemNotification(item);
          });
        } else {
          this.fallbackSystemNotification(item);
        }
      } catch (err) {
        console.warn('Browser notification display warning:', err);
      }
    }
  }

  fallbackSystemNotification(item) {
    try {
      const notif = new Notification(item.title, {
        body: item.body,
        icon: '/favicon.svg',
        tag: item.id
      });
      notif.onclick = () => {
        window.focus();
        if (item.link && item.link.startsWith('#')) {
          const el = document.getElementById(item.link.substring(1));
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
        notif.close();
      };
    } catch (e) {
      console.debug('Standard Notification fallback note:', e);
    }
  }

  markAllAsRead() {
    const list = this.getNotifications().map(n => ({ ...n, read: true }));
    this.saveNotifications(list);
  }

  markAsRead(id) {
    const list = this.getNotifications().map(n => n.id === id ? { ...n, read: true } : n);
    this.saveNotifications(list);
  }

  clearAll() {
    this.saveNotifications([]);
  }

  subscribeToToasts(callback) {
    this.toastListeners.add(callback);
    return () => this.toastListeners.delete(callback);
  }

  subscribeToHistory(callback) {
    this.historyListeners.add(callback);
    return () => this.historyListeners.delete(callback);
  }
}

export const notificationService = new NotificationService();
export default notificationService;
