// SportsArena.africa Advertisement & Revenue Management Mock Data Store
// Version 1.0 - Supporting Phase 1 through Phase 15

export const AD_TYPES = {
  HERO_BANNER: 'Hero Banner Advertisement',
  TOP_STICKY: 'Top Sticky Banner',
  SIDEBAR_RECTANGLE: 'Sidebar Advertisement',
  LARGE_SIDEBAR: 'Large Sidebar Skyscraper',
  IN_ARTICLE: 'In-Article Advertisement',
  VIDEO_PREROLL: 'Video Advertisement',
  SPONSORED_MATCH: 'Sponsored Match Advertisement',
  SPONSORED_PREDICTION: 'Sponsored Prediction Card',
  FOOTER_BANNER: 'Footer Advertisement',
  POPUP: 'Popup Advertisement',
  NEWSLETTER: 'Newsletter Advertisement'
};

export const INITIAL_SPONSORS = [
  {
    id: 1,
    name: 'Safaricom M-PESA',
    logo: '/images/ads/logo-safaricom.svg',
    category: 'Telecommunications & Fintech',
    contactEmail: 'advertising@safaricom.co.ke',
    website: 'https://www.safaricom.co.ke',
    country: 'Kenya',
    campaignsCount: 3,
    totalClicks: 14820,
    totalImpressions: 420000,
    status: 'Active'
  },
  {
    id: 2,
    name: 'TotalEnergies CAF',
    logo: '/images/ads/logo-totalenergies.svg',
    category: 'Energy & Football Sponsor',
    contactEmail: 'partnerships@totalenergies.com',
    website: 'https://totalenergies.com',
    country: 'Pan-Africa',
    campaignsCount: 2,
    totalClicks: 21450,
    totalImpressions: 590000,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Betika Sports',
    logo: '/images/ads/logo-betika.svg',
    category: 'Sports Betting & Gaming',
    contactEmail: 'marketing@betika.com',
    website: 'https://betika.com',
    country: 'Kenya / Ghana',
    campaignsCount: 4,
    totalClicks: 32600,
    totalImpressions: 780000,
    status: 'Active'
  },
  {
    id: 4,
    name: 'Puma Africa',
    logo: '/images/ads/logo-puma.svg',
    category: 'Sports Apparel & Kits',
    contactEmail: 'africa-ads@puma.com',
    website: 'https://puma.com',
    country: 'Pan-Africa / South Africa',
    campaignsCount: 2,
    totalClicks: 9800,
    totalImpressions: 310000,
    status: 'Active'
  },
  {
    id: 5,
    name: 'Standard Chartered',
    logo: '/images/ads/logo-sc.svg',
    category: 'Banking & Finance',
    contactEmail: 'corporate-sponsors@sc.com',
    website: 'https://sc.com/ke',
    country: 'Regional',
    campaignsCount: 1,
    totalClicks: 6400,
    totalImpressions: 195000,
    status: 'Active'
  },
  {
    id: 6,
    name: 'MTN Group',
    logo: '/images/ads/logo-mtn.svg',
    category: 'Telecommunications',
    contactEmail: 'advertising@mtn.com',
    website: 'https://mtn.com',
    country: 'Nigeria / South Africa',
    campaignsCount: 2,
    totalClicks: 18900,
    totalImpressions: 480000,
    status: 'Active'
  }
];

export const AD_PLACEMENTS = [
  {
    id: 'top_sticky',
    name: 'Top Sticky Leaderboard',
    page: 'Global Reader Header',
    desktopSize: '728 × 90',
    mobileSize: '320 × 50',
    maxAds: 2,
    description: 'Premier billboard displayed immediately beneath the main navigation bar.'
  },
  {
    id: 'homepage_hero',
    name: 'Homepage Hero Banner',
    page: 'Homepage',
    desktopSize: '1200 × 300',
    mobileSize: '360 × 180',
    maxAds: 1,
    description: 'Prominent full-width sponsorship banner placed directly under the hero breaking carousel.'
  },
  {
    id: 'live_match_centre',
    name: 'Live Match Centre Sponsor',
    page: 'Live Match Centre',
    desktopSize: '728 × 90',
    mobileSize: '320 × 90',
    maxAds: 1,
    description: 'Featured sponsor banner inside live scoreboard and telemetry section.'
  },
  {
    id: 'match_prediction',
    name: 'Sponsored Prediction Widget',
    page: 'Tips & Match Predictions',
    desktopSize: '350 × 280',
    mobileSize: '320 × 240',
    maxAds: 2,
    description: 'Native sponsored card embedded within analyst prediction fixtures.'
  },
  {
    id: 'sidebar_rectangle',
    name: 'Desktop Sidebar Rectangle',
    page: 'Articles & Standings',
    desktopSize: '300 × 250',
    mobileSize: '300 × 250',
    maxAds: 3,
    description: 'Standard Medium Rectangle banner on the right rail.'
  },
  {
    id: 'large_sidebar',
    name: 'Large Sidebar Skyscraper',
    page: 'Standings & Fixtures Rail',
    desktopSize: '300 × 600',
    mobileSize: 'Hidden on mobile',
    maxAds: 1,
    description: 'High-impact half-page skyscraper ad alongside league tables.'
  },
  {
    id: 'article_inline_1',
    name: 'In-Article Banner (Paragraph 2)',
    page: 'News Articles',
    desktopSize: '728 × 90',
    mobileSize: '320 × 100',
    maxAds: 1,
    description: 'Native reader banner inserted between paragraph 2 and 3 of news articles.'
  },
  {
    id: 'article_inline_2',
    name: 'In-Article Banner (Before Comments)',
    page: 'News Articles',
    desktopSize: '728 × 90',
    mobileSize: '320 × 100',
    maxAds: 1,
    description: 'Call-to-action banner right before fan comments section.'
  },
  {
    id: 'fixtures_sponsor',
    name: 'Fixtures Weekend Banner',
    page: 'Fixtures & Timetable',
    desktopSize: '970 × 120',
    mobileSize: '320 × 80',
    maxAds: 1,
    description: 'Matchday fixtures timetable presenting sponsor.'
  },
  {
    id: 'standings_sponsor',
    name: 'League Standings Sponsor',
    page: 'Standings & Golden Boot',
    desktopSize: '728 × 90',
    mobileSize: '320 × 60',
    maxAds: 1,
    description: 'Official timing or title sponsor banner above league standings.'
  },
  {
    id: 'video_preroll',
    name: 'Video Highlights Sponsor',
    page: 'Video & Podcasts',
    desktopSize: '640 × 360',
    mobileSize: '360 × 202',
    maxAds: 2,
    description: 'Pre-roll and mid-roll sports highlight video overlay ad.'
  },
  {
    id: 'footer_banner',
    name: 'Bottom Footer Banner',
    page: 'Site Footer',
    desktopSize: '728 × 90',
    mobileSize: '320 × 50',
    maxAds: 1,
    description: 'Persistent leaderboard placed directly above the brand footer.'
  },
  {
    id: 'newsletter_strip',
    name: 'Newsletter Sponsor Strip',
    page: 'Email Newsletter',
    desktopSize: '600 × 100',
    mobileSize: '320 × 80',
    maxAds: 1,
    description: 'Sponsor badge inside the daily Pan-African email dispatch.'
  },
  {
    id: 'promotional_popup',
    name: 'Promotional Popup Modal',
    page: 'Homepage (Optional)',
    desktopSize: '600 × 400',
    mobileSize: '320 × 380',
    maxAds: 1,
    description: 'Centrally positioned interactive modal with dismiss button.'
  }
];

export const INITIAL_ADS = [
  {
    id: 101,
    title: 'Safaricom 5G Matchday Speed Pass',
    sponsorId: 1,
    sponsorName: 'Safaricom M-PESA',
    sponsorLogo: '/images/ads/logo-safaricom.svg',
    type: 'Top Sticky Banner',
    placementId: 'top_sticky',
    headline: 'STREAM MATCHES IN ULTRA 4K WITH SAFARICOM 5G',
    subtext: 'Get 10GB Matchday Pass for only KES 150. Dial *544# or use M-PESA App.',
    badgeText: 'OFFICIAL TELECOM PARTNER',
    ctaText: 'Activate 5G Pass',
    targetUrl: 'https://www.safaricom.co.ke/5g-sports',
    imageUrl: '/images/ads/safaricom-ad.svg',
    themeBg: 'from-[#055A28] to-[#0D1811]',
    accentColor: '#16A34A',
    priority: 3,
    status: 'Active',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    impressions: 145000,
    clicks: 5220,
    deviceTargeting: 'All'
  },
  {
    id: 102,
    title: 'TotalEnergies CAF Champions League Official Partner',
    sponsorId: 2,
    sponsorName: 'TotalEnergies CAF',
    sponsorLogo: '/images/ads/logo-totalenergies.svg',
    type: 'Hero Banner Advertisement',
    placementId: 'homepage_hero',
    headline: 'FUELING AFRICAN FOOTBALL PASSION ACROSS 54 NATIONS',
    subtext: 'Join the TotalEnergies Energy of Africa Challenge. Win VIP All-Access Matchday Tickets in Cairo & Pretoria.',
    badgeText: 'TITLE CONTINENTAL SPONSOR',
    ctaText: 'Enter VIP Draw',
    targetUrl: 'https://totalenergies.com/caf-champions-league',
    imageUrl: '/images/ads/totalenergies-ad.svg',
    themeBg: 'from-[#1E3A8A] via-[#B91C1C] to-[#0B0B0F]',
    accentColor: '#EF233C',
    priority: 3,
    status: 'Active',
    startDate: '2026-08-15',
    endDate: '2026-11-30',
    impressions: 210000,
    clicks: 7420,
    deviceTargeting: 'All'
  },
  {
    id: 103,
    title: 'Betika Big Match Jackpot — 100M KES',
    sponsorId: 3,
    sponsorName: 'Betika Sports',
    sponsorLogo: '/images/ads/logo-betika.svg',
    type: 'Sponsored Match Advertisement',
    placementId: 'live_match_centre',
    headline: 'BETIKA MATCHDAY BOOST: 0-TAX FAST PAYOUTS',
    subtext: 'Arsenal vs Liverpool & Gor Mahia Derby Specials. Guaranteed 100M Jackpot Pool. 18+ Play Responsibly.',
    badgeText: 'MATCH CENTRE SPONSOR',
    ctaText: 'Predict & Play',
    targetUrl: 'https://betika.com/jackpot',
    imageUrl: '/images/ads/betika-ad.svg',
    themeBg: 'from-[#14532D] to-[#052E16]',
    accentColor: '#F59E0B',
    priority: 2,
    status: 'Active',
    startDate: '2026-09-10',
    endDate: '2026-10-31',
    impressions: 112000,
    clicks: 4980,
    deviceTargeting: 'All'
  },
  {
    id: 104,
    title: 'Puma African Nations Speed Boot Collection',
    sponsorId: 4,
    sponsorName: 'Puma Africa',
    sponsorLogo: '/images/ads/logo-puma.svg',
    type: 'Sponsored Prediction Card',
    placementId: 'match_prediction',
    headline: 'PUMA ULTRA 5: CRAFTED FOR AFRICAN PITCHES',
    subtext: 'Engineered for blinding acceleration. Official boot of African champions. Shop online with free pan-African delivery.',
    badgeText: 'OFFICIAL KIT PARTNER',
    ctaText: 'Shop Puma Ultra',
    targetUrl: 'https://puma.com/africa/ultra',
    imageUrl: '/images/ads/puma-ad.svg',
    themeBg: 'from-[#7F1D1D] to-[#181822]',
    accentColor: '#EF4444',
    priority: 2,
    status: 'Active',
    startDate: '2026-09-01',
    endDate: '2026-10-15',
    impressions: 89000,
    clicks: 3410,
    deviceTargeting: 'All'
  },
  {
    id: 105,
    title: 'Standard Chartered Pan-African Wealth & Matchday Hospitality',
    sponsorId: 5,
    sponsorName: 'Standard Chartered',
    sponsorLogo: '/images/ads/logo-sc.svg',
    type: 'In-Article Advertisement',
    placementId: 'article_inline_1',
    headline: 'EXPERIENCE ANFIELD HOSPITALITY WITH STANDARD CHARTERED',
    subtext: 'Open a Priority Account today and unlock VIP travel experiences to Liverpool FC home fixtures.',
    badgeText: 'OFFICIAL MAIN CLUB PARTNER',
    ctaText: 'Learn More',
    targetUrl: 'https://sc.com/priority-football',
    imageUrl: '/images/ads/sc-ad.svg',
    themeBg: 'from-[#064E3B] to-[#042F2E]',
    accentColor: '#10B981',
    priority: 2,
    status: 'Active',
    startDate: '2026-09-05',
    endDate: '2026-11-20',
    impressions: 94000,
    clicks: 2980,
    deviceTargeting: 'All'
  },
  {
    id: 106,
    title: 'MTN Pulse Football Data Bundles',
    sponsorId: 6,
    sponsorName: 'MTN Group',
    sponsorLogo: '/images/ads/logo-mtn.svg',
    type: 'Footer Advertisement',
    placementId: 'footer_banner',
    headline: 'NEVER MISS A GOAL WITH MTN EVERYWHERE YOU GO',
    subtext: 'Unlimited live match streaming with zero buffering across Nigeria, Ghana, South Africa and Uganda.',
    badgeText: 'PAN-AFRICAN NETWORK',
    ctaText: 'Get MTN Pulse',
    targetUrl: 'https://mtn.com/football',
    imageUrl: '/images/ads/mtn-ad.svg',
    themeBg: 'from-[#78350F] to-[#1C1917]',
    accentColor: '#F59E0B',
    priority: 1,
    status: 'Active',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    impressions: 167000,
    clicks: 4120,
    deviceTargeting: 'All'
  },
  {
    id: 107,
    title: 'Kenya Airways — The Pride of Africa Sports Travel',
    sponsorId: 1,
    sponsorName: 'Kenya Airways',
    sponsorLogo: '/images/ads/logo-safaricom.svg',
    type: 'Sidebar Advertisement',
    placementId: 'sidebar_rectangle',
    headline: 'FLY WITH THE PRIDE OF AFRICA TO CAF CHAMPIONS LEAGUE MATCHES',
    subtext: 'Direct daily flights between Nairobi, Lagos, Johannesburg, and Cairo for passionate traveling supporters.',
    badgeText: 'OFFICIAL AIRLINE PARTNER',
    ctaText: 'Book Flight',
    targetUrl: 'https://kenya-airways.com/sports',
    imageUrl: '/images/ads/safaricom-ad.svg',
    themeBg: 'from-[#831843] to-[#1F2937]',
    accentColor: '#F43F5E',
    priority: 2,
    status: 'Active',
    startDate: '2026-09-15',
    endDate: '2026-11-15',
    impressions: 72000,
    clicks: 2150,
    deviceTargeting: 'Desktop'
  },
  {
    id: 108,
    title: 'TotalEnergies AFCON 2027 East Africa Countdown',
    sponsorId: 2,
    sponsorName: 'TotalEnergies CAF',
    sponsorLogo: '/images/ads/logo-totalenergies.svg',
    type: 'Popup Advertisement',
    placementId: 'promotional_popup',
    headline: 'AFCON 2027 IS COMING TO KENYA, UGANDA & TANZANIA!',
    subtext: 'Sign up to the Official East Africa Supporter Pass for priority match ticket pre-sales and commemorative merchandise.',
    badgeText: 'EXCLUSIVE PROMOTION',
    ctaText: 'Claim Supporter Pass',
    targetUrl: 'https://totalenergies.com/afcon2027',
    imageUrl: '/images/ads/totalenergies-ad.svg',
    themeBg: 'from-[#047857] via-[#0F766E] to-[#0B0B0F]',
    accentColor: '#10B981',
    priority: 2,
    status: 'Paused',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    impressions: 45000,
    clicks: 1820,
    deviceTargeting: 'All'
  },
  {
    id: 109,
    title: 'Betika Mega Jackpot — Predict 17 Matches & Win 100M KES',
    sponsorId: 3,
    sponsorName: 'Betika Sports',
    sponsorLogo: '/images/ads/logo-betika.svg',
    type: 'In-Article Advertisement',
    placementId: 'article_inline_2',
    headline: 'BETIKA MEGA JACKPOT: PREDICT 17 MATCHES & WIN 100M',
    subtext: 'Instant 0-fee M-PESA withdrawals. Highest betting odds across CAF and European football leagues.',
    badgeText: 'EXCLUSIVE MATCHDAY SPONSOR',
    ctaText: 'Play Mega Jackpot',
    targetUrl: 'https://betika.com/jackpot',
    imageUrl: '/images/ads/betika-ad.svg',
    themeBg: 'from-[#14532D] to-[#052E16]',
    accentColor: '#F59E0B',
    priority: 2,
    status: 'Active',
    startDate: '2026-09-10',
    endDate: '2026-12-31',
    impressions: 78000,
    clicks: 3120,
    deviceTargeting: 'All'
  }
];

export const GEOGRAPHIC_TRAFFIC_DATA = [
  { country: 'Kenya', flag: '🇰🇪', impressions: 382000, clicks: 14200, ctr: '3.72%', share: 42 },
  { country: 'Nigeria', flag: '🇳🇬', impressions: 254000, clicks: 9650, ctr: '3.80%', share: 28 },
  { country: 'South Africa', flag: '🇿🇦', impressions: 128000, clicks: 4720, ctr: '3.69%', share: 14 },
  { country: 'Ghana', flag: '🇬🇭', impressions: 82000, clicks: 2890, ctr: '3.52%', share: 9 },
  { country: 'Uganda & Tanzania', flag: '🇺🇬 🇹🇿', impressions: 64000, clicks: 2210, ctr: '3.45%', share: 7 }
];

export const DEVICE_METRICS = {
  mobile: { percent: 68, impressions: 618800, clicks: 22900, ctr: '3.70%' },
  desktop: { percent: 27, impressions: 245700, clicks: 9100, ctr: '3.70%' },
  tablet: { percent: 5, impressions: 45500, clicks: 1670, ctr: '3.67%' }
};

// LocalStorage Persistence Keys (v2 with local SVG creatives)
const ADS_STORAGE_KEY = 'sportsarena_ads_v2';
const SPONSORS_STORAGE_KEY = 'sportsarena_sponsors_v2';

// Service Helper to get persisted ads or fallback to defaults
export function getStoredAds() {
  try {
    const raw = localStorage.getItem(ADS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migrate any old external Unsplash URLs to local SVGs
      const migrated = parsed.map(ad => {
        if (!ad.imageUrl || ad.imageUrl.includes('unsplash.com')) {
          const match = INITIAL_ADS.find(init => init.placementId === ad.placementId);
          return {
            ...ad,
            imageUrl: match?.imageUrl || '/images/ads/safaricom-ad.svg',
            sponsorLogo: match?.sponsorLogo || '/images/ads/logo-safaricom.svg'
          };
        }
        return ad;
      });
      // Ensure article_inline_2 ad is present
      if (!migrated.some(a => a.placementId === 'article_inline_2')) {
        const ad2 = INITIAL_ADS.find(a => a.placementId === 'article_inline_2');
        if (ad2) migrated.push(ad2);
      }
      return migrated;
    }
  } catch {
    // fallback
  }
  return INITIAL_ADS;
}

export function saveStoredAds(ads) {
  try {
    localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(ads));
    window.dispatchEvent(new Event('sportsarena_ads_updated'));
  } catch (e) {
    console.error('Failed to save ads', e);
  }
}

export function getStoredSponsors() {
  try {
    const raw = localStorage.getItem(SPONSORS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const migrated = parsed.map(sp => {
        if (!sp.logo || sp.logo.includes('unsplash.com')) {
          const match = INITIAL_SPONSORS.find(init => init.id === sp.id);
          return {
            ...sp,
            logo: match?.logo || '/images/ads/logo-safaricom.svg'
          };
        }
        return sp;
      });
      return migrated;
    }
  } catch {
    // fallback
  }
  return INITIAL_SPONSORS;
}

export function saveStoredSponsors(sponsors) {
  try {
    localStorage.setItem(SPONSORS_STORAGE_KEY, JSON.stringify(sponsors));
    window.dispatchEvent(new Event('sportsarena_sponsors_updated'));
  } catch (e) {
    console.error('Failed to save sponsors', e);
  }
}

// Track an ad impression
export function recordAdImpression(adId) {
  const ads = getStoredAds();
  const updated = ads.map(a => a.id === adId ? { ...a, impressions: (a.impressions || 0) + 1 } : a);
  saveStoredAds(updated);
}

// Track an ad click
export function recordAdClick(adId) {
  const ads = getStoredAds();
  const updated = ads.map(a => a.id === adId ? { ...a, clicks: (a.clicks || 0) + 1 } : a);
  saveStoredAds(updated);
}
