import React, { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import LiveTicker, { defaultBreakingNewsItems } from './components/LiveTicker';
import HeroBanner from './sections/HeroBanner';
import TrendingTagsRibbon from './components/TrendingTagsRibbon';
import LatestNewsSection from './sections/LatestNewsSection';
import CategoryNewsBlocks from './sections/CategoryNewsBlocks';
import KenyaSportsSection from './sections/KenyaSportsSection';
import AfricanFootballHubSection from './sections/AfricanFootballHubSection';
import OtherSportsSection from './sections/OtherSportsSection';
import AnalysisFeaturesSection from './sections/AnalysisFeaturesSection';
import InterviewsSection from './sections/InterviewsSection';
import UpcomingEventsSection from './sections/UpcomingEventsSection';
import FeaturedCategoriesGrid from './sections/FeaturedCategoriesGrid';
import TransferCentreSection from './sections/TransferCentreSection';
import WomensFootballSection from './sections/WomensFootballSection';
import VideoPodcastSection from './sections/VideoPodcastSection';
import FanArenaSection from './sections/FanArenaSection';
import OpinionPollSection from './sections/OpinionPollSection';
import NewsletterSection from './sections/NewsletterSection';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import ArticleModal from './components/ArticleModal';
import ArticlePage from './components/ArticlePage';
import BookmarksModal from './components/BookmarksModal';
import MobileBottomNav from './components/MobileBottomNav';
import AdminPortal from './admin/AdminPortal';
import AdminLogin from './admin/AdminLogin';
import AdPlacement from './components/AdPlacement';
import PromotionalPopupAd from './components/PromotionalPopupAd';
import PwaInstallPrompt from './components/PwaInstallPrompt';
import NotificationToastContainer from './components/NotificationToastContainer';
import NotificationCenterModal from './components/NotificationCenterModal';
import ErrorBoundary from './components/ErrorBoundary';
import { notificationService } from './services/notificationService';
import api from './services/api';
import { initialFanPosts, initialArticles } from './data/mockData';
import { applyWebsiteAppearance, getCachedWebsiteAppearance } from './config/websiteAppearance';

const normalizeArticle = (item) => {
  const title = item.title || 'Untitled Article';
  const slug = item.slug || (item.title ? item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'untitled');
  const summary = item.summary || item.excerpt || (item.content ? item.content.slice(0, 160) : '');
  const content = item.content || item.summary || '';
  const image = item.featuredImage || item.image || '/images/hero-stadium.jpg';
  const category = item.categoryName || item.category || 'Latest News';
  const categorySlug = item.categorySlug || String(category).toLowerCase().replace(/\s+/g, '-');
  const author = item.authorName || item.author || 'Sports Arena Afrika';
  const isBreaking = Boolean(item.isBreaking ?? item.breaking);
  const isTopNews = Boolean(item.isTopNews ?? item.featured);
  const views = Number(item.viewsCount ?? item.views) || 0;
  const readingTime = Number(item.readingTime) || 3;
  const status = item.status ? String(item.status).toUpperCase() : 'PUBLISHED';
  const tags = Array.isArray(item.tags) ? item.tags : ['Sports', 'Africa'];
  const country = item.country || 'Kenya';
  const league = item.league || 'Premier League';
  const date = item.publishedAt || item.date || new Date().toISOString();

  return {
    id: item.id || `local-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title,
    slug,
    summary,
    excerpt: summary,
    content,
    featuredImage: image,
    image,
    categoryName: category,
    category,
    categorySlug,
    authorName: author,
    author,
    editedBy: item.editedBy || '',
    authorUsername: item.authorUsername || '',
    isBreaking,
    breaking: isBreaking,
    isTopNews,
    featured: isTopNews,
    viewsCount: views,
    views,
    readingTime,
    status,
    metaTitle: item.metaTitle || title,
    metaDescription: item.metaDescription || item.metaDesc || summary,
    tags,
    country,
    league,
    videoUrl: item.videoUrl || '',
    videoTitle: item.videoTitle || '',
    videoCaption: item.videoCaption || '',
    region: item.region || '',
    subcategory: item.subcategory || '',
    sourceName: item.sourceName || '',
    sourceUrl: item.sourceUrl || '',
    relatedArticles: Array.isArray(item.relatedArticles) ? item.relatedArticles : [],
    publishedAt: date,
    date
  };
};

const mergeArticles = (backendList, storedList) => {
  const map = new Map();
  (backendList || []).forEach(item => {
    const norm = normalizeArticle(item);
    map.set(String(norm.id), norm);
    if (norm.slug) map.set(norm.slug, norm);
  });
  (storedList || []).forEach(item => {
    const norm = normalizeArticle(item);
    map.set(String(norm.id), norm);
    if (norm.slug) map.set(norm.slug, norm);
  });
  const unique = Array.from(new Set(map.values()));
  return unique.sort((a, b) => {
    const isLocalA = String(a.id).startsWith('local-');
    const isLocalB = String(b.id).startsWith('local-');
    if (isLocalA && !isLocalB) return -1;
    if (!isLocalA && isLocalB) return 1;
    const timeA = new Date(a.publishedAt || a.date || 0).getTime() || 0;
    const timeB = new Date(b.publishedAt || b.date || 0).getTime() || 0;
    return timeB - timeA;
  });
};

const getInitialArticles = () => {
  try {
    const stored = localStorage.getItem('sportsarena_articles');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed.map(normalizeArticle);
    }
  } catch (e) {}
  return (initialArticles || []).map(normalizeArticle);
};

const getSlugFromPath = () => {
  try {
    const p = window.location.pathname;
    if (p.startsWith('/news/')) return decodeURIComponent(p.replace('/news/', '').replace(/\/$/, ''));
    if (p.startsWith('/article/')) return decodeURIComponent(p.replace('/article/', '').replace(/\/$/, ''));
  } catch (e) {}
  return null;
};

function App(){
 const isAdminPath=window.location.pathname.startsWith('/admin');
 const [authenticated,setAuthenticated]=useState(()=>Boolean(sessionStorage.getItem('arena_authenticated')));
 const [websiteAppearance,setWebsiteAppearance]=useState(getCachedWebsiteAppearance);
 const [articles,setArticles]=useState(getInitialArticles); const readerArticles=useMemo(()=>articles.filter(a=>String(a.status||'PUBLISHED').toUpperCase()==='PUBLISHED'),[articles]); const [tickerList,setTickerList]=useState(defaultBreakingNewsItems);
 const [isSearchOpen,setIsSearchOpen]=useState(false); const [isBookmarksOpen,setIsBookmarksOpen]=useState(false); 
 const [selectedArticle,setSelectedArticle]=useState(null);
 const [currentArticleSlug,setCurrentArticleSlug]=useState(()=>getSlugFromPath());
 const [bookmarks,setBookmarks]=useState(()=>{try{return JSON.parse(localStorage.getItem('sportsarena_bookmarks')||'{}')}catch{return {}}});
 const [mobileTab,setMobileTab]=useState('home'); const [isNotificationOpen,setIsNotificationOpen]=useState(false); const [notificationList,setNotificationList]=useState(notificationService.getNotifications());
 const [filterTag,setFilterTag]=useState(null); const [filterCategory,setFilterCategory]=useState('ALL');

 useEffect(()=>{applyWebsiteAppearance(websiteAppearance)},[websiteAppearance]);
 useEffect(()=>{let active=true;api.getWebsiteAppearance().then(settings=>{if(active&&settings&&typeof settings==='object'){setWebsiteAppearance(current=>({...current,...settings}));}});return()=>{active=false}},[]);
 useEffect(()=>{
   const syncAppearance = (event) => {
     if (event.key !== 'sportsarena_website_appearance' || !event.newValue) return;
     try {
       const next = JSON.parse(event.newValue);
       if (next && typeof next === 'object') setWebsiteAppearance(current => ({ ...current, ...next }));
     } catch { /* Ignore incomplete or malformed cross-tab cache updates. */ }
   };
   window.addEventListener('storage', syncAppearance);
   return () => window.removeEventListener('storage', syncAppearance);
 },[]);
 
 useEffect(()=>{
   const handlePopState = () => {
     const slug = getSlugFromPath();
     setCurrentArticleSlug(slug);
     if (!slug) {
       setSelectedArticle(null);
     } else {
       const found = readerArticles.find(a => a.slug === slug || String(a.id) === slug);
       if (found) setSelectedArticle(found);
     }
   };
   window.addEventListener('popstate', handlePopState);
   return () => window.removeEventListener('popstate', handlePopState);
 }, [readerArticles]);

 useEffect(()=>{let mounted=true;(async()=>{try{const data=await api.getArticles();if(mounted&&Array.isArray(data)&&data.length>0){const stored=getInitialArticles();const merged=mergeArticles(data,stored);setArticles(merged);try{localStorage.setItem('sportsarena_articles',JSON.stringify(merged))}catch{}}}catch{}try{const breaking=await api.getBreakingNews();if(mounted&&Array.isArray(breaking)&&breaking.length)setTickerList(breaking)}catch{}})();return()=>{mounted=false}},[]);
 useEffect(()=>{if(!isAdminPath||!authenticated)return;let mounted=true;(async()=>{const role=sessionStorage.getItem('arena_role');const username=sessionStorage.getItem('arena_username');const canReview=['ROLE_SUPER_ADMIN','ROLE_EDITOR'].includes(role);let data=canReview?await api.getEditorialArticles():await api.getMyArticles();if(!canReview&&Array.isArray(data)){const published=await api.getArticles();data=[...(Array.isArray(published)?published:[]),...data];}if(mounted&&Array.isArray(data)){const localArticles=getInitialArticles();const visibleLocal=canReview?localArticles:localArticles.filter(article=>article.authorUsername===username||article.authorName===username);const merged=mergeArticles(data,visibleLocal);setArticles(merged);try{localStorage.setItem('sportsarena_articles',JSON.stringify(merged))}catch{}}})();return()=>{mounted=false}},[isAdminPath,authenticated]);
 useEffect(()=>{const unsub=notificationService.subscribeToHistory(setNotificationList);return()=>unsub()},[]);
 useEffect(()=>{if(!selectedArticle && !currentArticleSlug){document.body.style.overflow='';}},[selectedArticle, currentArticleSlug]);
 
 const handleOpenArticle = (art) => {
   if (!art || String(art.status || 'PUBLISHED').toUpperCase() !== 'PUBLISHED') return;
   const targetSlug = art.slug || String(art.id);
   window.history.pushState({ slug: targetSlug }, '', `/news/${targetSlug}`);
   setCurrentArticleSlug(targetSlug);
   setSelectedArticle(art);
 };

 const handleCloseArticlePage = () => {
   window.history.pushState({}, '', '/');
   setCurrentArticleSlug(null);
   setSelectedArticle(null);
 };

 const handleSelectTag=(tag)=>{setFilterTag(tag);document.getElementById('latest-news')?.scrollIntoView({behavior:'smooth'})};
 const handleSelectCategory=(cat)=>{setFilterCategory(cat);document.getElementById('latest-news')?.scrollIntoView({behavior:'smooth'})};
 const handleNavigateToSection=(href)=>{
   window.setTimeout(()=>document.querySelector(href)?.scrollIntoView({behavior:'smooth',block:'start'}),0);
 };
 const toggleBookmark=(id)=>setBookmarks(prev=>{const next={...prev};if(next[id])delete next[id];else next[id]=true;try{localStorage.setItem('sportsarena_bookmarks',JSON.stringify(next))}catch{}return next});
 const publishArticle=async(id)=>{const result=await api.publishArticle(id);if(!result?.id){alert('Could not publish this article. Confirm it has editor approval and try again.');return;}const updated=normalizeArticle(result);setArticles(prev=>{const next=prev.map(a=>String(a.id)===String(id)?updated:a);try{localStorage.setItem('sportsarena_articles',JSON.stringify(next))}catch{}return next;});};
 const approveArticle=async(id)=>{const result=await api.approveArticle(id);if(!result?.id){alert('Could not approve this article. Try again.');return;}const updated=normalizeArticle(result);setArticles(prev=>{const next=prev.map(a=>String(a.id)===String(id)?updated:a);try{localStorage.setItem('sportsarena_articles',JSON.stringify(next))}catch{}return next;});};
 const saveArticle=async(a)=>{
   let saved=null;
   const targetStatus=a.status?String(a.status).toUpperCase():'DRAFT';
   try {
     const categories=await api.getCategories();
     const category=Array.isArray(categories)?categories.find(c=>c.name===a.category||c.slug===String(a.category||'').toLowerCase().replace(/\s+/g,'-')):null;
     const payload={title:a.title,summary:a.metaDesc||a.excerpt||a.summary||'',content:a.content,featuredImage:a.featuredImage||a.image||'/images/hero-stadium.jpg',categoryId:category?.id||1,isBreaking:Boolean(a.isBreaking),isTopNews:Boolean(a.isHeroFeatured||a.isTopNews||a.featured),readingTime:Number(a.readTime||a.readingTime)||3,metaTitle:a.metaTitle||a.title,metaDescription:a.metaDesc||a.summary||'',videoUrl:a.videoUrl||'',videoTitle:a.videoTitle||'',videoCaption:a.videoCaption||''};
     if(a.id&&!String(a.id).startsWith('local-')&&!String(a.id).startsWith('art-')) saved=await api.updateArticle(a.id,payload);
     else saved=await api.createArticle(payload);
     if(targetStatus==='APPROVED'){
       if(!saved?.id) throw new Error('Approval requires a saved server article.');
       saved=await api.approveArticle(saved.id);
       if(!saved?.id) throw new Error('Only an editor can approve this article.');
     }
     if(targetStatus==='PENDING_REVIEW'){
       if(!saved?.id) throw new Error('Save the draft online before submitting it for review.');
       saved=await api.submitArticleForReview(saved.id);
       if(!saved?.id) throw new Error('The draft was saved, but could not be submitted for review.');
     }
     if(targetStatus==='PUBLISHED'){
       if(!saved?.id) throw new Error('Publishing requires a saved server article.');
       if(saved.status!=='APPROVED'&&saved.status!=='PUBLISHED') saved=await api.approveArticle(saved.id);
       if(!saved?.id) throw new Error('Only an editor can approve this article for publishing.');
       if(saved.status!=='PUBLISHED') saved=await api.publishArticle(saved.id);
       if(!saved?.id) throw new Error('The approved article could not be published.');
     }
   } catch(error) {
     if(targetStatus==='PENDING_REVIEW'||targetStatus==='APPROVED'||targetStatus==='PUBLISHED') throw error;
   }
   const normalized=normalizeArticle({...a,...(saved||{}),authorUsername:a.authorUsername||sessionStorage.getItem('arena_username')||'',id:saved?.id||a.id||`local-${Date.now()}`,status:targetStatus,publishedAt:targetStatus==='PUBLISHED'?(saved?.publishedAt||new Date().toISOString()):null});
   setArticles(prev=>{
     const idx=prev.findIndex(x=>String(x.id)===String(normalized.id)||(normalized.slug&&x.slug===normalized.slug));
     const next=idx>=0?[...prev]:[normalized,...prev];
     if(idx>=0) next[idx]={...next[idx],...normalized};
     try{localStorage.setItem('sportsarena_articles',JSON.stringify(next))}catch{}
     return next;
   });
   return normalized;
 };
 const deleteArticle=async(id)=>{try{await api.deleteArticle(id);}catch(e){}setArticles(prev=>{const next=prev.filter(a=>String(a.id)!==String(id));try{localStorage.setItem('sportsarena_articles',JSON.stringify(next))}catch{}return next;});};
 const handleSelectNewsItem=(item)=>{if(item?.articleId){const match=readerArticles.find(a=>String(a.id)===String(item.articleId));if(match){handleOpenArticle(match);return;}}if(item?.text){const lower=item.text.toLowerCase();const match=readerArticles.find(a=>{const titleLower=(a.title||'').toLowerCase();return (titleLower.includes('arsenal')&&lower.includes('arsenal'))||(titleLower.includes('gor mahia')&&lower.includes('gor mahia'))||(titleLower.includes('osimhen')&&lower.includes('osimhen'))||(titleLower.includes('harambee')&&lower.includes('harambee'))||(titleLower.includes('al ahly')&&lower.includes('al ahly'));});if(match){handleOpenArticle(match);return;}}document.getElementById('latest-news')?.scrollIntoView({behavior:'smooth'});};
 if(isAdminPath){if(!authenticated)return <AdminLogin onLogin={()=>setAuthenticated(true)} onBack={()=>{window.location.href='/'}}/>;return <AdminPortal appearance={websiteAppearance} onAppearanceChanged={setWebsiteAppearance} onPublishArticle={publishArticle} onDeleteArticle={deleteArticle} onExitAdmin={()=>{api.logout?.();sessionStorage.removeItem('arena_role');sessionStorage.removeItem('arena_authenticated');setAuthenticated(false);window.location.href='/'}} articles={articles} onSaveArticle={saveArticle}/>;}

 // Direct standalone article URL rendering
 const activeArticleForPage = currentArticleSlug 
   ? (readerArticles.find(a => a.slug === currentArticleSlug || String(a.id) === currentArticleSlug) || readerArticles[0])
   : null;

 if (currentArticleSlug && activeArticleForPage) {
   return (
     <ArticlePage 
       article={activeArticleForPage}
       onBack={handleCloseArticlePage}
       articles={readerArticles}
       onSelectArticle={handleOpenArticle}
       bookmarks={bookmarks}
       onToggleBookmark={toggleBookmark}
       appearance={websiteAppearance}
       onSelectCategory={(cat) => { handleCloseArticlePage(); handleSelectCategory(cat); }}
       onSelectTag={(tag) => { handleCloseArticlePage(); handleSelectTag(tag); }}
     />
   );
 }
 const configuredSections = websiteAppearance.homepageSections || [];
 const renderHomepageSection = (id) => {
   switch (id) {
     case 'hero': return <HeroBanner articles={readerArticles} onSelectArticle={handleOpenArticle} onJoinArena={() => document.getElementById('fan-arena')?.scrollIntoView({ behavior: 'smooth' })} />;
     case 'latest': return <LatestNewsSection articles={readerArticles} onSelectArticle={handleOpenArticle} bookmarks={bookmarks} onToggleBookmark={toggleBookmark} filterTag={filterTag} onTagChange={setFilterTag} filterCategory={filterCategory} onCategoryChange={setFilterCategory} />;
     case 'categories': return <><CategoryNewsBlocks articles={readerArticles} onSelectArticle={handleOpenArticle} /><FeaturedCategoriesGrid onSelectCategory={handleSelectCategory} /></>;
     case 'kenya': return <KenyaSportsSection articles={readerArticles} onSelectArticle={handleOpenArticle} />;
     case 'africa': return <AfricanFootballHubSection onSelectCountryStory={handleOpenArticle} />;
     case 'otherSports': return <OtherSportsSection articles={readerArticles} onSelectArticle={handleOpenArticle} />;
     case 'features': return <AnalysisFeaturesSection articles={readerArticles} onSelectArticle={handleOpenArticle} />;
     case 'interviews': return <InterviewsSection articles={readerArticles} onSelectArticle={handleOpenArticle} />;
     case 'events': return <UpcomingEventsSection articles={readerArticles} onSelectArticle={handleOpenArticle} />;
     case 'transfers': return <TransferCentreSection onSelectArticle={handleOpenArticle} />;
     case 'women': return <WomensFootballSection />;
     case 'videos': return <VideoPodcastSection />;
     case 'community': return <><FanArenaSection fanPosts={initialFanPosts} /><OpinionPollSection /></>;
     case 'newsletter': return <NewsletterSection />;
     default: {
       const block = (websiteAppearance.customHomepageBlocks || []).find(item => item.id === id);
       return block ? <section key={block.id} className="mx-auto my-8 max-w-7xl px-4 sm:px-6 lg:px-8"><div className="rounded-2xl border border-[var(--brand-primary)]/30 bg-[var(--brand-primary)]/10 p-6 sm:p-8"><h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{block.title}</h2>{block.body && <p className="mt-3 max-w-3xl text-base leading-7 opacity-80">{block.body}</p>}</div></section> : null;
     }
   }
 };
  return (
    <div className="reader-site min-h-screen flex flex-col overflow-x-hidden w-full max-w-[100vw]" style={{ backgroundColor: 'var(--page-bg)', color: 'var(--text-primary)' }}>
      {/* 1. Sticky Header with Top Breaking Bar, Navbar & LiveTicker */}
      <header className={`${websiteAppearance.stickyHeader ? 'sticky top-0' : 'relative'} z-50 shadow-[0_4px_25px_rgba(0,0,0,0.25)]`} style={{ backgroundColor: 'var(--page-bg)' }}>
        <Navbar 
          onOpenSearch={() => setIsSearchOpen(true)} 
          bookmarkCount={Object.keys(bookmarks).length} 
          onOpenBookmarks={() => setIsBookmarksOpen(true)} 
          onOpenNotifications={() => setIsNotificationOpen(true)} 
          unreadNotificationCount={notificationList.filter(n => !n.read).length}
          onSelectCategory={setFilterCategory}
          onNavigate={handleNavigateToSection}
          showSearch={websiteAppearance.showSearch}
          showSocial={websiteAppearance.showSocial}
          navigationItems={websiteAppearance.navigationItems}
        />
        {configuredSections.includes('breaking') && <LiveTicker items={tickerList} onSelectNews={handleSelectNewsItem} />}
      </header>

      {/* Main Publishing Feed */}
      <ErrorBoundary title="Sports Arena Afrika Feed Unavailable">
        <main className="flex-1 pb-24 md:pb-0">
          {configuredSections.filter(sectionId => sectionId !== 'breaking').map(sectionId => <React.Fragment key={sectionId}>{renderHomepageSection(sectionId)}</React.Fragment>)}

          <AdPlacement placementId="top_sticky" />
        </main>
      </ErrorBoundary>

      <AdPlacement placementId="footer_banner" />
      <Footer />
      <PromotionalPopupAd />
      <MobileBottomNav activeTab={mobileTab} onSelectTab={setMobileTab} />

      {/* Global Modals */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        articles={readerArticles} 
        onSelectTopic={topic => typeof topic === 'object' ? handleOpenArticle(topic) : handleSelectTag(topic)} 
      />

      <ArticleModal 
        article={selectedArticle} 
        onClose={() => setSelectedArticle(null)} 
        isBookmarked={selectedArticle ? Boolean(bookmarks[selectedArticle.id]) : false} 
        onToggleBookmark={toggleBookmark} 
        onSelectTag={handleSelectTag} 
        articles={readerArticles} 
        onSelectArticle={handleOpenArticle} 
      />

      <BookmarksModal 
        isOpen={isBookmarksOpen} 
        onClose={() => setIsBookmarksOpen(false)} 
        bookmarks={bookmarks} 
        articles={readerArticles} 
        onSelectArticle={handleOpenArticle} 
        onRemoveBookmark={toggleBookmark} 
        onClearAll={() => {
          setBookmarks({});
          localStorage.removeItem('sportsarena_bookmarks');
        }} 
      />

      <NotificationCenterModal 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
        onSelectArticle={id => {
          const a = readerArticles.find(x => String(x.id) === String(id));
          if (a) handleOpenArticle(a);
        }} 
      />

      <NotificationToastContainer 
        onSelectNotification={n => {
          const a = readerArticles.find(x => String(x.id) === String(n.data?.articleId));
          if (a) handleOpenArticle(a);
        }} 
      />

      <PwaInstallPrompt />
    </div>
  );
}
export default App;
