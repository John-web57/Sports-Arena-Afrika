/**
 * Official Sports Arena Afrika Social Media Channels & Communities
 * Primary Publishing & Broadcast Networks
 */

export const SOCIAL_LINKS = {
  // Facebook
  facebookPage: "https://www.facebook.com/Sportsarenas",
  facebookGroup: "https://facebook.com/groups/999503631665020/",
  
  // LinkedIn
  linkedinPage: "https://www.linkedin.com/company/sports-arena-africa/",
  linkedinGroup: "https://www.linkedin.com/groups/19483036",
  
  // Telegram
  telegram: "https://t.me/SportsArenaAfrica",
  
  // Twitter / X
  twitter: "https://x.com/SportsArena26",
  twitterHandle: "@SportsArena26"
};

export const SOCIAL_COMMUNITIES = [
  {
    id: "fb-page",
    platform: "Facebook",
    label: "Official Facebook Page",
    subLabel: "Latest Breaking News & Match Analysis",
    url: SOCIAL_LINKS.facebookPage,
    icon: "facebook",
    badge: "Official Page"
  },
  {
    id: "fb-group",
    platform: "Facebook Group",
    label: "African Football & Sports Fans Group",
    subLabel: "Fan Debates, Discussions & Match Polls",
    url: SOCIAL_LINKS.facebookGroup,
    icon: "users",
    badge: "Community Group"
  },
  {
    id: "twitter",
    platform: "X / Twitter",
    label: "@SportsArena26",
    subLabel: "Breaking Updates, Press Conferences & Live Commentary",
    url: SOCIAL_LINKS.twitter,
    icon: "twitter",
    badge: "Live Feed"
  },
  {
    id: "telegram",
    platform: "Telegram",
    label: "Sports Arena Africa News Channel",
    subLabel: "Instant Bulletins, Squad Announcements & Audio Desks",
    url: SOCIAL_LINKS.telegram,
    icon: "send",
    badge: "Instant Alerts"
  },
  {
    id: "linkedin-page",
    platform: "LinkedIn",
    label: "Sports Arena Africa Corporate",
    subLabel: "African Sports Business, Rights & Media Leadership",
    url: SOCIAL_LINKS.linkedinPage,
    icon: "linkedin",
    badge: "Corporate"
  },
  {
    id: "linkedin-group",
    platform: "LinkedIn Group",
    label: "African Sports Industry & Media Network",
    subLabel: "Journalists, Analysts, Agents & Sports Executives",
    url: SOCIAL_LINKS.linkedinGroup,
    icon: "briefcase",
    badge: "Executive Network"
  }
];

export default SOCIAL_LINKS;
