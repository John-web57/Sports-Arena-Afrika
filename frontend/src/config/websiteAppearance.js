export const defaultWebsiteAppearance = {
  theme: 'dark',
  layoutPreset: 'news',
  homepageSections: ['breaking', 'hero', 'latest', 'kenya', 'africa', 'otherSports', 'features', 'interviews', 'events', 'categories', 'transfers', 'women', 'videos', 'community', 'newsletter'],
  primaryColor: '#0B6E4F',
  primaryDarkColor: '#064B38',
  accentColor: '#F4B400',
  breakingColor: '#D62828',
  backgroundColor: '#101817',
  textColor: '#F5F7F7',
  stickyHeader: true,
  showSearch: true,
  showSocial: true,
  articleLayout: 'standard',
  showSidebar: true,
  headingFont: 'Montserrat',
  bodyFont: 'Poppins',
  navigationItems: ['Home', 'Sports', 'Africa', 'Global', 'News', 'Features', 'More']
};

export const getCachedWebsiteAppearance = () => {
  try {
    const cached = JSON.parse(localStorage.getItem('sportsarena_website_appearance') || 'null');
    return cached ? { ...defaultWebsiteAppearance, ...cached } : defaultWebsiteAppearance;
  } catch {
    return defaultWebsiteAppearance;
  }
};

export const applyWebsiteAppearance = (appearance) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const theme = appearance?.theme === 'light' ? 'light' : 'dark';
  root.dataset.theme = theme;
  const values = {
    '--brand-primary': appearance?.primaryColor,
    '--brand-dark': appearance?.primaryDarkColor,
    '--surface-bg': theme === 'light' ? '#FFFFFF' : '#17211F',
    '--brand-tint': theme === 'light' ? '#E7F2EE' : '#203B33',
    '--accent-color': appearance?.accentColor,
    '--breaking-color': appearance?.breakingColor,
    '--page-bg': appearance?.backgroundColor,
    '--text-primary': appearance?.textColor,
    '--heading-font': appearance?.headingFont ? `'${appearance.headingFont}', sans-serif` : undefined,
    '--body-font': appearance?.bodyFont ? `'${appearance.bodyFont}', sans-serif` : undefined
  };
  Object.entries(values).forEach(([key, value]) => {
    if (value) root.style.setProperty(key, value);
  });
  try { localStorage.setItem('sportsarena_website_appearance', JSON.stringify(appearance)); } catch { /* Cache is optional. */ }
};
