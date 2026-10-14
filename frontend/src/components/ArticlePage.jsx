import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, Eye, MessageSquare, Share2, Heart, Send, Bookmark,
  Volume2, VolumeX, Type, Calendar, User, ArrowLeft,
  ChevronRight, Sparkles, Check
} from 'lucide-react';
import { notificationService } from '../services/notificationService';
import VideoBlock from './VideoBlock';
import AdPlacement from './AdPlacement';
import Navbar from './Navbar';
import Footer from './Footer';
import SearchModal from './SearchModal';

// Social platform SVG icons
const WhatsAppIcon = ({ className = "w-3.5 h-3.5 fill-current" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

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

export default function ArticlePage({ 
  article, 
  onBack, 
  articles = [], 
  onSelectArticle,
  bookmarks = {},
  onToggleBookmark,
  appearance = {},
  onSelectCategory,
  onSelectTag
}) {
  if (!article) return null;

  const [fontSizeLevel, setFontSizeLevel] = useState('normal'); // 'normal' | 'large' | 'xl'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const storageCommentKey = `sportsarena_comments_${article.id}`;
  const storageLikeKey = `sportsarena_like_${article.id}`;

  const defaultComments = [
    {
      id: 1,
      author: 'Maina Kamau',
      location: 'Nairobi',
      time: '15 mins ago',
      content: 'Great reporting and tactical breakdown. African sports talent is taking center stage worldwide!'
    },
    {
      id: 2,
      author: 'Kofi Mensah',
      location: 'Accra',
      time: '28 mins ago',
      content: 'African football representation at the top of continental and global competitions has never been stronger.'
    }
  ];

  const [likes, setLikes] = useState(() => {
    try {
      const saved = localStorage.getItem(storageLikeKey);
      if (saved) return JSON.parse(saved).count;
    } catch (e) {}
    return article.viewsCount ? Math.floor(article.viewsCount / 14) : 340;
  });

  const [hasLiked, setHasLiked] = useState(() => {
    try {
      const saved = localStorage.getItem(storageLikeKey);
      if (saved) return JSON.parse(saved).hasLiked;
    } catch (e) {}
    return false;
  });

  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState(() => {
    try {
      const saved = localStorage.getItem(storageCommentKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultComments;
  });

  const isBookmarked = Boolean(bookmarks[article.id]);

  // Dynamic Google News & NewsArticle Schema SEO Head Injection
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${article.title || 'Sports News'} | Sports Arena Afrika`;

    // Dynamic NewsArticle JSON-LD injection
    const scriptId = 'sportsarena-newsarticle-schema';
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": article.title,
      "articleSection": article.categoryName || article.category || "Sports News",
      "keywords": Array.isArray(article.tags) && article.tags.length ? article.tags.join(", ") : (article.category || "Sports, Football"),
      "description": article.metaDescription || article.summary || article.content?.slice(0, 160) || article.title,
      "image": [article.featuredImage || article.image],
      "datePublished": article.createdAt || article.publishedAt || new Date().toISOString(),
      "dateModified": article.updatedAt || article.createdAt || new Date().toISOString(),
      "author": [{
        "@type": "Person",
        "name": article.authorName || article.author || "Sports Arena Afrika Editorial Desk",
        "jobTitle": "Sports Correspondent",
        "url": `https://sportsarenaafrika.com/authors/${(article.author || 'editorial').toLowerCase().replace(/\s+/g, '-')}`
      }],
      "publisher": {
        "@type": "NewsMediaOrganization",
        "name": "Sports Arena Afrika",
        "url": "https://sportsarenaafrika.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://sportsarenaafrika.com/icons.svg"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://sportsarenaafrika.com/news/${article.slug || article.id}`
      }
    };
    script.textContent = JSON.stringify(schemaData);

    // Canonical Link Injection
    const canonicalId = 'sportsarena-canonical-link';
    let link = document.getElementById(canonicalId);
    if (!link) {
      link = document.createElement('link');
      link.id = canonicalId;
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = `https://sportsarenaafrika.com/news/${article.slug || article.id}`;

    // Meta Description Injection
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = article.metaDescription || article.summary || article.title;

    window.scrollTo(0, 0);

    return () => {
      document.title = originalTitle;
      const s = document.getElementById(scriptId);
      if (s) s.remove();
      const l = document.getElementById(canonicalId);
      if (l) l.remove();
    };
  }, [article]);

  const handleLike = () => {
    const nextLiked = !hasLiked;
    const nextCount = nextLiked ? likes + 1 : Math.max(0, likes - 1);
    setHasLiked(nextLiked);
    setLikes(nextCount);
    try {
      localStorage.setItem(storageLikeKey, JSON.stringify({ count: nextCount, hasLiked: nextLiked }));
    } catch (e) {}
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      author: 'Sports Fan',
      location: 'Nairobi',
      time: 'Just now',
      content: commentText.trim()
    };
    const updated = [newComment, ...commentsList];
    setCommentsList(updated);
    setCommentText('');
    try {
      localStorage.setItem(storageCommentKey, JSON.stringify(updated));
    } catch (e) {}
  };

  const handleShare = async (platform) => {
    const shareUrl = window.location.href;
    const shareText = `Read "${article.title}" on Sports Arena Afrika:`;

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
      return;
    }
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&via=SportsArena26`, '_blank');
      return;
    }
    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
      return;
    }
    if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, text: article.summary || article.excerpt, url: shareUrl });
        return;
      } catch (err) {}
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
      notificationService.showToast({
        title: '📋 Link Copied!',
        body: 'Article link copied to clipboard.',
        type: 'SYSTEM',
        category: 'Share'
      });
    } catch (e) {
      alert(`Share this story: ${shareUrl}`);
    }
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech audio is not supported in this browser.');
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const fullText = `${article.title}. ${article.summary || article.excerpt || ''}. ${article.content || ''}`;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Breadcrumb details
  const primaryCategory = article.categoryName || article.category || 'Football';
  const subCategoryLabel = article.subcategory || article.league || article.country || (Array.isArray(article.tags) && article.tags[0]) || 'African Football';

  // Author & Datetime details formatted as "7 October 2026 | 3:45 PM"
  const authorDisplay = article.authorName || article.author || 'John Omiti Joshua';
  const dateObj = article.publishedAt || article.createdAt || article.date ? new Date(article.publishedAt || article.createdAt || article.date) : new Date();
  const isValidDate = !isNaN(dateObj.getTime());
  const formattedDate = isValidDate 
    ? dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) 
    : '7 October 2026';
  const timeFormatted = isValidDate 
    ? dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) 
    : '3:45 PM';

  const readMins = article.readingTime || Math.max(2, Math.ceil((article.content || '').split(/\s+/).length / 200));

  // Typography scaling
  const contentFontSizeClass = 
    fontSizeLevel === 'large' 
      ? 'text-lg sm:text-xl leading-relaxed' 
      : fontSizeLevel === 'xl' 
      ? 'text-xl sm:text-2xl leading-loose' 
      : 'text-base sm:text-lg leading-relaxed';

  // Article Introduction (Lead / Excerpt)
  const articleIntroduction = article.summary || article.excerpt || article.leadIntroduction;

  // Split Article Body paragraphs for mid-article advertisement placement
  const allParagraphs = useMemo(() => {
    if (!article.content) return [];
    return article.content.split(/\n\s*\n/).filter(p => Boolean(p.trim()));
  }, [article.content]);

  const splitIndex = allParagraphs.length > 2 ? 2 : Math.max(1, Math.floor(allParagraphs.length / 2));
  const firstHalfParagraphs = allParagraphs.slice(0, splitIndex);
  const secondHalfParagraphs = allParagraphs.slice(splitIndex);

  // Tags list
  const tagsList = useMemo(() => {
    if (Array.isArray(article.tags) && article.tags.length > 0) return article.tags;
    return ['Football', article.country || 'Kenya', 'Africa'];
  }, [article.tags, article.country]);

  // Related Articles (3 stories for wireframe [Story] [Story] [Story])
  const relatedArticles = useMemo(() => {
    return articles
      .filter(a => String(a.id) !== String(article.id))
      .slice(0, 3);
  }, [articles, article.id]);

  // More Stories (next 4 stories)
  const moreStories = useMemo(() => {
    const relatedIds = new Set(relatedArticles.map(r => String(r.id)));
    return articles
      .filter(a => String(a.id) !== String(article.id) && !relatedIds.has(String(a.id)))
      .slice(0, 4);
  }, [articles, article.id, relatedArticles]);

  const imageCaptionText = article.imageCaption || article.caption || 'Match action & reporting photography';
  const imageCreditText = article.imageCredit || article.credit || 'Sports Arena Afrika Newsroom';

  return (
    <div className="reader-site min-h-screen flex flex-col w-full selection:bg-[#EF233C] selection:text-white" style={{ backgroundColor: 'var(--page-bg)', color: 'var(--text-primary)' }}>
      
      {/* ────────────────────────────────────────────── */}
      {/* 1. TOP NAVBAR: LOGO  HOME SPORTS AFRICA NEWS MORE 🔍 */}
      {/* ────────────────────────────────────────────── */}
      <header className={`${appearance.stickyHeader ? 'sticky top-0' : 'relative'} z-50 border-b border-[var(--border-color)] shadow-md`} style={{ backgroundColor: 'var(--page-bg)' }}>
        <Navbar 
          onOpenSearch={() => setIsSearchOpen(true)}
          bookmarkCount={Object.keys(bookmarks).length}
          onOpenBookmarks={() => {}}
          onOpenNotifications={() => {}}
          unreadNotificationCount={0}
          onSelectCategory={(cat) => {
            if (onSelectCategory) {
              onSelectCategory(cat);
            } else {
              onBack();
            }
          }}
          onNavigate={(href) => {
            if (href === '#home') {
              onBack();
            } else {
              onBack();
              setTimeout(() => {
                document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
              }, 120);
            }
          }}
          showSearch={appearance.showSearch !== false}
          showSocial={appearance.showSocial !== false}
          navigationItems={appearance.navigationItems || []}
        />

        {/* Reader Action Ribbon: Back to feed, Listen to audio, Font size, Bookmark */}
        <div className="bg-[#0B0B12] border-t border-[#1A1A26] px-4 sm:px-6 lg:px-8 py-2">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 text-xs">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14141E] hover:bg-[#1E1E2C] text-gray-300 hover:text-white border border-[#2B2B3E] font-bold transition group"
              title="Return to Sports Arena Afrika Homepage"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#EF233C] group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Stories</span>
            </button>

            <div className="flex items-center gap-2">
              {/* Text-to-Speech Listen */}
              <button
                type="button"
                onClick={handleSpeak}
                className={`px-2.5 py-1.5 rounded-lg font-bold border transition flex items-center gap-1.5 ${
                  isSpeaking 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse' 
                    : 'bg-[#14141E] text-gray-300 hover:text-white border-[#2B2B3E]'
                }`}
                title={isSpeaking ? "Stop audio reading" : "Listen to audio story"}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#EF233C]" />}
                <span className="hidden sm:inline">{isSpeaking ? 'Playing Audio' : 'Listen'}</span>
              </button>

              {/* Typography Size Adjuster */}
              <button
                type="button"
                onClick={() => setFontSizeLevel(fontSizeLevel === 'normal' ? 'large' : fontSizeLevel === 'large' ? 'xl' : 'normal')}
                className="px-2.5 py-1.5 rounded-lg bg-[#14141E] text-gray-300 hover:text-white border border-[#2B2B3E] font-bold transition flex items-center gap-1"
                title="Adjust text size"
              >
                <Type className="w-3.5 h-3.5 text-[#EF233C]" />
                <span className="text-[10px] font-mono">{fontSizeLevel === 'normal' ? '1x' : fontSizeLevel === 'large' ? '1.2x' : '1.4x'}</span>
              </button>

              {/* Bookmark story */}
              <button
                type="button"
                onClick={() => onToggleBookmark && onToggleBookmark(article.id)}
                className={`p-1.5 px-2.5 rounded-lg border font-bold transition flex items-center gap-1.5 ${
                  isBookmarked 
                    ? 'bg-[#181822] border-[#EF233C] text-[#EF233C]' 
                    : 'bg-[#14141E] text-gray-300 hover:text-white border-[#2B2B3E]'
                }`}
                title={isBookmarked ? "Saved in Bookmarks" : "Save for offline reading"}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current text-[#EF233C]' : ''}`} />
                <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ────────────────────────────────────────────── */}
      {/* MAIN ARTICLE CANONICAL CONTAINER */}
      {/* ────────────────────────────────────────────── */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
        
        {/* 2. BREADCRUMB: Home > Football > African Football */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-400 mb-4 flex-wrap font-['Montserrat']">
          <button 
            type="button" 
            onClick={onBack} 
            className="text-gray-300 hover:text-white transition font-medium"
          >
            Home
          </button>
          <span className="text-gray-500 font-bold">&gt;</span>
          <button 
            type="button"
            onClick={() => {
              if (onSelectCategory) onSelectCategory(primaryCategory);
              else onBack();
            }}
            className="text-gray-300 hover:text-white transition font-medium"
          >
            {primaryCategory}
          </button>
          <span className="text-gray-500 font-bold">&gt;</span>
          <span className="text-[#EF233C] font-semibold">{subCategoryLabel}</span>
        </nav>

        {/* 3. ARTICLE TITLE: Kenya's New Football Generation Is Ready... */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[var(--text-primary)] leading-[1.18] font-['Montserrat'] tracking-tight mb-4">
          {article.title}
        </h1>

        {/* 4. BYLINE & PUBLISHED DATE: By John Omiti Joshua | Published: 7 October 2026 | 3:45 PM */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-y border-[#232334] text-xs sm:text-sm text-gray-300 gap-2 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">By</span>
            <span className="font-bold text-white font-['Montserrat']">{authorDisplay}</span>
            {article.country && (
              <span className="ml-1 text-[11px] px-2 py-0.5 rounded bg-[#181824] border border-[#2B2B3E] text-gray-400 uppercase font-mono">
                {article.country}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5 text-xs text-gray-400 font-mono">
            <span>Published: <strong className="text-gray-300 font-mono">{formattedDate}</strong> | {timeFormatted}</span>
            <span className="hidden sm:inline text-gray-600">•</span>
            <span className="hidden sm:inline text-gray-400">{readMins} min read</span>
          </div>
        </div>

        {/* 5. FEATURED IMAGE: [ FEATURED IMAGE ] + Image caption / Credit */}
        {(article.featuredImage || article.image) && (
          <figure className="mb-6">
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-[#232334] bg-black shadow-2xl aspect-video w-full relative group">
              <img 
                src={article.featuredImage || article.image} 
                alt={article.title} 
                className="w-full h-full object-cover group-hover:scale-[1.01] transition duration-500"
              />
            </div>
            <figcaption className="mt-2.5 px-1 text-xs text-gray-400 flex flex-wrap items-center justify-between gap-2">
              <span className="italic">{imageCaptionText}</span>
              <span className="text-[11px] text-gray-500 font-mono">Credit: {imageCreditText}</span>
            </figcaption>
          </figure>
        )}

        {/* Embedded Video Block if attached */}
        {article.videoUrl && (
          <div className="rounded-2xl border border-[#EF233C]/40 bg-[#12121A] p-4 shadow-xl mb-6">
            <VideoBlock 
              videoUrl={article.videoUrl} 
              title={article.videoTitle || "Match Highlights & Tactical Breakdown"} 
              caption={article.videoCaption || "Watch comprehensive game action and pitch reaction."} 
            />
          </div>
        )}

        {/* 6. ARTICLE INTRODUCTION: Article introduction */}
        {articleIntroduction && (
          <div className="mb-6 text-lg sm:text-xl font-medium leading-relaxed text-gray-200 border-l-4 border-[#EF233C] pl-4 sm:pl-6 py-2 italic font-serif bg-gradient-to-r from-[#EF233C]/10 via-[#EF233C]/5 to-transparent rounded-r-xl">
            "{articleIntroduction}"
          </div>
        )}

        {/* 7. ARTICLE BODY (Part 1): Article body................ */}
        <article className={`space-y-6 text-[var(--text-primary)] ${contentFontSizeClass}`}>
          {firstHalfParagraphs.length > 0 ? (
            firstHalfParagraphs.map((par, i) => {
              if (par.startsWith('## ')) {
                return (
                  <h2 key={i} className="text-xl sm:text-2xl font-black text-white font-['Montserrat'] uppercase pt-4 pb-1 border-b border-[#232332]">
                    {par.replace(/^##\s+/, '')}
                  </h2>
                );
              }
              if (par.startsWith('### ')) {
                return (
                  <h3 key={i} className="text-lg font-black text-amber-400 font-['Montserrat'] uppercase pt-2">
                    {par.replace(/^###\s+/, '')}
                  </h3>
                );
              }
              if (par.startsWith('> ')) {
                return (
                  <blockquote key={i} className="border-l-4 border-amber-400 pl-4 py-2 italic font-serif text-gray-300 bg-[#14141E] rounded-r-xl">
                    {par.replace(/^>\s+/, '')}
                  </blockquote>
                );
              }
              return (
                <p key={i} className="leading-relaxed font-sans text-[var(--text-primary)]">
                  {par}
                </p>
              );
            })
          ) : (
            <p className="text-gray-300 leading-relaxed font-sans">
              Full match reporting and tactical breakdown in progress.
            </p>
          )}
        </article>

        {/* 8. MID-ARTICLE ADVERTISEMENT: [ADVERTISEMENT – if enabled] */}
        <div className="my-8">
          <AdPlacement placementId="article_inline_1" />
        </div>

        {/* 9. ARTICLE BODY (Part 2): Article body................ */}
        {secondHalfParagraphs.length > 0 && (
          <article className={`space-y-6 text-[var(--text-primary)] ${contentFontSizeClass}`}>
            {secondHalfParagraphs.map((par, i) => {
              if (par.startsWith('## ')) {
                return (
                  <h2 key={`p2-${i}`} className="text-xl sm:text-2xl font-black text-white font-['Montserrat'] uppercase pt-4 pb-1 border-b border-[#232332]">
                    {par.replace(/^##\s+/, '')}
                  </h2>
                );
              }
              if (par.startsWith('### ')) {
                return (
                  <h3 key={`p2-${i}`} className="text-lg font-black text-amber-400 font-['Montserrat'] uppercase pt-2">
                    {par.replace(/^###\s+/, '')}
                  </h3>
                );
              }
              if (par.startsWith('> ')) {
                return (
                  <blockquote key={`p2-${i}`} className="border-l-4 border-amber-400 pl-4 py-2 italic font-serif text-gray-300 bg-[#14141E] rounded-r-xl">
                    {par.replace(/^>\s+/, '')}
                  </blockquote>
                );
              }
              return (
                <p key={`p2-${i}`} className="leading-relaxed font-sans text-[var(--text-primary)]">
                  {par}
                </p>
              );
            })}
          </article>
        )}

        {/* 10. SOCIAL SHARE BAR: [ Share ] WhatsApp | Facebook | X | LinkedIn */}
        <div className="mt-10 py-5 border-t border-[#232334] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1.5 rounded-lg bg-[#EF233C]/20 border border-[#EF233C]/40 text-[#EF233C] text-xs font-black uppercase tracking-wider font-['Montserrat'] flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </span>

            {/* WhatsApp */}
            <button
              type="button"
              onClick={() => handleShare('whatsapp')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/40 text-xs font-bold transition shadow-sm"
              title="Share on WhatsApp"
            >
              <WhatsAppIcon />
              <span>WhatsApp</span>
            </button>

            {/* Facebook */}
            <button
              type="button"
              onClick={() => handleShare('facebook')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1877F2]/15 hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-[#1877F2]/40 text-xs font-bold transition shadow-sm"
              title="Share on Facebook"
            >
              <FacebookIcon />
              <span>Facebook</span>
            </button>

            {/* X / Twitter */}
            <button
              type="button"
              onClick={() => handleShare('twitter')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white text-gray-200 hover:text-black border border-white/20 text-xs font-bold transition shadow-sm"
              title="Share on X"
            >
              <TwitterXIcon />
              <span>X</span>
            </button>

            {/* LinkedIn */}
            <button
              type="button"
              onClick={() => handleShare('linkedin')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0A66C2]/15 hover:bg-[#0A66C2] text-[#0A66C2] hover:text-white border border-[#0A66C2]/40 text-xs font-bold transition shadow-sm"
              title="Share on LinkedIn"
            >
              <LinkedInIcon />
              <span>LinkedIn</span>
            </button>

            {/* Copy Link */}
            <button
              type="button"
              onClick={() => handleShare('copy')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#181822] hover:bg-[#232332] text-gray-300 hover:text-white border border-[#2B2B3E] text-xs font-bold transition"
              title="Copy Story Link"
            >
              <span>{copiedShare ? "Copied!" : "Copy Link"}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold transition ${
                hasLiked
                  ? 'bg-[#D90429] border-[#D90429] text-white shadow-sports-glow'
                  : 'bg-[#181822] border-[#2B2B3E] text-gray-300 hover:text-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current text-white' : 'text-[#EF233C]'}`} />
              <span>{likes}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleBookmark && onToggleBookmark(article.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold transition ${
                isBookmarked
                  ? 'bg-[#181822] border-[#EF233C] text-[#EF233C]'
                  : 'bg-[#181822] border-[#2B2B3E] text-gray-300 hover:text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current text-[#EF233C]' : ''}`} />
              <span>{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* 11. TAGS: Tags: Football, Kenya, Africa */}
        <div className="py-4 border-b border-[#232334] flex items-center gap-2 flex-wrap text-xs">
          <span className="text-gray-400 font-bold font-['Montserrat']">Tags:</span>
          {tagsList.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                if (onSelectTag) onSelectTag(tag);
                else onBack();
              }}
              className="px-3 py-1 rounded-full bg-[#181824] hover:bg-[#EF233C] text-gray-300 hover:text-white border border-[#2B2B3E] font-medium transition cursor-pointer text-xs"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* 12. RELATED ARTICLES: Related Articles [Story] [Story] [Story] */}
        {relatedArticles.length > 0 && (
          <section className="pt-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF233C]"></span>
              <h3 className="text-lg sm:text-xl font-black uppercase text-white font-['Montserrat'] tracking-wide">
                Related Articles
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <article
                  key={rel.id}
                  onClick={() => onSelectArticle && onSelectArticle(rel)}
                  className="group cursor-pointer rounded-2xl bg-[#12121A] border border-[#232334] hover:border-[#EF233C]/60 transition-all duration-300 p-3.5 flex flex-col justify-between shadow-md hover:-translate-y-0.5"
                >
                  <div>
                    <div className="aspect-video rounded-xl overflow-hidden mb-3 bg-black">
                      <img 
                        src={rel.featuredImage || rel.image || '/images/hero-stadium.jpg'} 
                        alt={rel.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                    <span className="text-[10px] text-[#EF233C] font-black uppercase tracking-wider font-['Montserrat'] block mb-1">
                      {rel.categoryName || rel.category || 'Football'}
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#EF233C] transition line-clamp-2 leading-snug">
                      {rel.title}
                    </h4>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-[#1E1E2C] flex items-center justify-between text-[11px] text-gray-400 font-mono">
                    <span>{rel.publishedAt || rel.date || 'Today'}</span>
                    <span className="text-[#EF233C] group-hover:translate-x-0.5 transition-transform font-bold">&rarr;</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 13. BOTTOM ADVERTISEMENT: [ADVERTISEMENT – if enabled] */}
        <div className="my-8">
          <AdPlacement placementId="article_inline_2" />
        </div>

        {/* 14. MORE STORIES: More Stories */}
        {moreStories.length > 0 && (
          <section className="pt-2 pb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF233C]"></span>
              <h3 className="text-lg sm:text-xl font-black uppercase text-white font-['Montserrat'] tracking-wide">
                More Stories
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {moreStories.map((story) => (
                <article
                  key={story.id}
                  onClick={() => onSelectArticle && onSelectArticle(story)}
                  className="group cursor-pointer rounded-2xl bg-[#12121A] border border-[#232334] hover:border-[#EF233C]/50 transition-all duration-300 p-3 flex flex-col justify-between shadow-sm hover:-translate-y-0.5"
                >
                  <div>
                    <div className="aspect-[16/10] rounded-xl overflow-hidden mb-2.5 bg-black">
                      <img 
                        src={story.featuredImage || story.image || '/images/hero-stadium.jpg'} 
                        alt={story.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                    <span className="text-[10px] text-[#EF233C] font-black uppercase tracking-wider font-['Montserrat'] block mb-1">
                      {story.categoryName || story.category || 'Sports'}
                    </span>
                    <h4 className="text-xs font-bold text-white group-hover:text-[#EF233C] transition line-clamp-2 leading-snug">
                      {story.title}
                    </h4>
                  </div>
                  <div className="mt-2.5 text-[10px] text-gray-500 font-mono">
                    <span>{story.publishedAt || story.date || 'Recent'}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Fan Discussion Comments Section */}
        <section className="p-6 rounded-3xl bg-[#12121A] border border-[#232334] space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#232332]">
            <h3 className="text-sm font-black uppercase text-white font-['Montserrat'] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#EF233C]" />
              <span>Reader Discussion ({commentsList.length})</span>
            </h3>
            <span className="text-[11px] text-gray-500">Moderated by Sports Arena Afrika Desk</span>
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add your sports perspective or match comment..."
              className="flex-1 bg-[#181824] border border-[#2B2B3E] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#EF233C]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#D90429] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider font-['Montserrat'] shadow transition"
            >
              Post
            </button>
          </form>

          <div className="space-y-3">
            {commentsList.map((comm) => (
              <div key={comm.id} className="p-3.5 rounded-xl bg-[#161622] border border-[#232332] space-y-1 text-xs">
                <div className="flex items-center justify-between text-gray-400 text-[11px]">
                  <strong className="text-white">{comm.author} ({comm.location})</strong>
                  <span>{comm.time}</span>
                </div>
                <p className="text-gray-300 leading-relaxed">{comm.content}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Global Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        articles={articles} 
        onSelectTopic={(topic) => {
          if (typeof topic === 'object') {
            onSelectArticle && onSelectArticle(topic);
            setIsSearchOpen(false);
          } else if (onSelectTag) {
            onSelectTag(topic);
            setIsSearchOpen(false);
          }
        }} 
      />

      {/* Brand Footer */}
      <Footer />
    </div>
  );
}
