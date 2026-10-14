import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Clock, Eye, MessageSquare, Share2, Heart, Send, Bookmark, CheckCheck, 
  Sparkles, Volume2, VolumeX, Type, Calendar, User, Quote, ThumbsUp, ArrowLeft,
  ArrowUp, Flame, Tag, CheckCircle2, ChevronRight
} from 'lucide-react';
import { notificationService } from '../services/notificationService';
import VideoBlock from './VideoBlock';

export default function ArticleModal({ 
  article, 
  onClose, 
  onToggleBookmark, 
  isBookmarked,
  articles = [],
  onSelectArticle
}) {
  if (!article) return null;

  const modalContentRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [fontSizeLevel, setFontSizeLevel] = useState('normal'); // 'normal' | 'large' | 'xl'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const storageCommentKey = `sportsarena_comments_${article.id}`;
  const storageLikeKey = `sportsarena_like_${article.id}`;

  const defaultComments = [
    {
      id: 1,
      author: 'Maina Kamau',
      location: 'Nairobi',
      time: '15 mins ago',
      content: 'Bukayo Saka and Gabriel Martinelli continue to prove they belong in the world-class conversation every single weekend under Arteta.'
    },
    {
      id: 2,
      author: 'Kofi Mensah',
      location: 'Accra',
      time: '28 mins ago',
      content: 'African football representation at the top of the Premier League and CAF has never been stronger. Pure quality on display.'
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

  // Handle Browser Back button (popstate), device gestures, and ESC key
  useEffect(() => {
    // Push browser history state so pressing browser Back or mobile swipe back closes the article
    const hashTag = `#story-${article.slug || article.id || 'view'}`;
    if (!window.location.hash.startsWith('#story-')) {
      window.history.pushState({ articleModalOpen: true, id: article.id }, '', hashTag);
    }

    const handlePopState = () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      document.body.style.overflow = '';
      onClose();
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleBack();
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    // Lock body scroll while reading
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (window.location.hash.startsWith('#story-')) {
        try {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        } catch (e) {}
      }
    };
  }, [article.id, article.slug]);

  // Dynamic Google News & NewsArticle Schema SEO Head Injection
  useEffect(() => {
    if (!article) return;
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
        },
        "sameAs": [
          "https://www.facebook.com/Sportsarenas",
          "https://facebook.com/groups/999503631665020/",
          "https://x.com/SportsArena26",
          "https://t.me/SportsArenaAfrica",
          "https://www.linkedin.com/company/sports-arena-africa/",
          "https://www.linkedin.com/groups/19483036"
        ]
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

    return () => {
      document.title = originalTitle;
      const s = document.getElementById(scriptId);
      if (s) s.remove();
      const l = document.getElementById(canonicalId);
      if (l) l.remove();
    };
  }, [article]);

  const handleBack = () => {
    document.body.style.overflow = '';
    if (isSpeaking && window.speechSynthesis) window.speechSynthesis.cancel();
    if (window.location.hash.startsWith('#story-')) {
      try {
        window.history.back();
      } catch (e) {
        window.location.hash = '';
      }
    }
    onClose();
  };

  // Scroll progress listener inside the modal
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight <= clientHeight) {
      setScrollProgress(0);
      return;
    }
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(Math.min(100, Math.max(0, progress)));
  };

  // Save comments to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageCommentKey, JSON.stringify(commentsList));
    } catch (e) {}
  }, [commentsList, storageCommentKey]);

  // Like handler
  const handleLike = () => {
    const nextHasLiked = !hasLiked;
    const nextCount = nextHasLiked ? likes + 1 : Math.max(0, likes - 1);
    setHasLiked(nextHasLiked);
    setLikes(nextCount);

    try {
      localStorage.setItem(storageLikeKey, JSON.stringify({ count: nextCount, hasLiked: nextHasLiked }));
    } catch (e) {}

    if (nextHasLiked) {
      notificationService.showToast({
        title: '❤️ Story Liked',
        body: `You liked "${article.title}"`,
        type: 'SYSTEM',
        category: article.categoryName || 'Sports'
      });
    }
  };

  // Text-to-speech audio reader
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      notificationService.showToast({
        title: 'Audio Narrator',
        body: 'Audio narration is not supported in this browser.',
        type: 'SYSTEM'
      });
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const narrative = `${article.title}. By ${article.authorName || 'Sports Arena Afrika'}. ${article.summary || article.excerpt || ''}. ${article.content || ''}`;
      const utterance = new SpeechSynthesisUtterance(narrative);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      author: 'Sports Fan (You)',
      location: 'Arena Member',
      time: 'Just now',
      content: commentText.trim()
    };

    setCommentsList([newComment, ...commentsList]);
    setCommentText('');

    notificationService.showToast({
      title: '💬 Perspective Shared',
      body: 'Your perspective is live in the fan arena debate.',
      type: 'SYSTEM',
      category: 'Community'
    });
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
    if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
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
        body: 'Article link copied to clipboard. Ready to paste.',
        type: 'SYSTEM',
        category: 'Share'
      });
    } catch (e) {
      alert(`Share this story: ${shareUrl}`);
    }
  };

  const articleImage = article.featuredImage || article.image || '/images/hero-stadium.jpg';
  const categoryLabel = article.categoryName || article.category || 'Football';
  const authorLabel = article.authorName || article.author || 'Sports Arena Editorial Desk';
  const dateLabel = article.publishedAt || article.date || 'September 29, 2026';
  const readsCount = (article.viewsCount || article.views || 14820).toLocaleString();
  const summaryText = article.summary || article.excerpt || '';

  // Font size scale class
  const contentFontSizeClass = 
    fontSizeLevel === 'large' 
      ? 'text-lg sm:text-xl leading-[2.0]' 
      : fontSizeLevel === 'xl' 
        ? 'text-xl sm:text-2xl leading-[2.2]' 
        : 'text-base sm:text-lg leading-[1.85]';

  // Recommended stories
  const relatedStories = (articles || [])
    .filter(a => String(a.id) !== String(article.id))
    .slice(0, 3);

  // Markdown-like paragraph parser
  const renderArticleParagraph = (par, i) => {
    const trimmed = par.trim();
    if (!trimmed) return null;

    // Inline Video tag: [video: URL | optional caption] or standalone video URL
    const videoTagMatch = trimmed.match(/^\[video:\s*(https?:\/\/[^\]|\s]+)(?:\s*\|\s*([^\]]*))?\]$/i);
    const isStandaloneVideoUrl = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)[^\s]+$/i.test(trimmed) || /\.(mp4|webm|mov)(\?.*)?$/i.test(trimmed);

    if (videoTagMatch || isStandaloneVideoUrl) {
      const extractedUrl = videoTagMatch ? videoTagMatch[1] : trimmed;
      const extractedCaption = (videoTagMatch && videoTagMatch[2]) ? videoTagMatch[2].trim() : "Embedded Match Highlights";
      return <VideoBlock key={i} videoUrl={extractedUrl} caption={extractedCaption} />;
    }

    // Heading H2: ## Heading
    if (trimmed.startsWith('## ')) {
      return (
        <div key={i} className="pt-5 pb-1">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white font-['Montserrat'] tracking-tight flex items-center gap-3">
            <span className="w-1.5 h-6 rounded-full bg-[#EF233C] inline-block flex-shrink-0"></span>
            <span>{trimmed.replace(/^##\s+/, '')}</span>
          </h2>
        </div>
      );
    }

    // Heading H3: ### Heading
    if (trimmed.startsWith('### ')) {
      return (
        <div key={i} className="pt-4 pb-1">
          <h3 className="text-lg sm:text-xl font-bold text-gray-100 font-['Montserrat'] tracking-tight flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-[#F59E0B] inline-block flex-shrink-0"></span>
            <span>{trimmed.replace(/^###\s+/, '')}</span>
          </h3>
        </div>
      );
    }

    // Pullquote: > Quote or "..."
    if (trimmed.startsWith('> ') || trimmed.startsWith('“')) {
      const quoteText = trimmed.replace(/^[>“"]+\s*/, '').replace(/["”]+$/, '');
      return (
        <div key={i} className="my-6 p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-[#181826] via-[#14141E] to-[#12121A] border-l-4 border-[#EF233C] border-y border-r border-[#232332] shadow-2xl relative overflow-hidden">
          <Quote className="absolute -bottom-2 -right-2 w-20 h-20 text-[#232332]/40 pointer-events-none" />
          <p className="text-base sm:text-lg italic font-semibold text-gray-100 leading-relaxed font-serif">
            "{quoteText}"
          </p>
          <div className="mt-3 text-[11px] font-bold uppercase tracking-wider text-[#EF233C] font-['Montserrat'] flex items-center gap-1.5">
            <span className="w-2 h-0.5 bg-[#EF233C]"></span>
            <span>Tactical Analysis Insight</span>
          </div>
        </div>
      );
    }

    // Bullet list: - or *
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items = trimmed.split('\n').filter(Boolean);
      return (
        <ul key={i} className="my-4 space-y-2.5 pl-2 bg-[#12121A] p-4 rounded-2xl border border-[#232332]">
          {items.map((it, idx) => (
            <li key={idx} className="flex items-start gap-3 text-gray-200 text-sm sm:text-base">
              <span className="w-2 h-2 rounded-full bg-[#EF233C] mt-2 flex-shrink-0 shadow-sm"></span>
              <span>{it.replace(/^[-*]\s+/, '')}</span>
            </li>
          ))}
        </ul>
      );
    }

    // Regular paragraph
    const isFirstPar = i === 0 && !article.videoUrl;
    return (
      <p 
        key={i} 
        className={isFirstPar 
          ? "first-letter:float-left first-letter:text-5xl sm:first-letter:text-6xl first-letter:pr-4 first-letter:font-black first-letter:text-[#EF233C] first-letter:font-['Montserrat'] first-letter:leading-none text-gray-100 font-normal" 
          : "text-gray-300 font-normal"
        }
      >
        {trimmed}
      </p>
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/90 backdrop-blur-2xl overflow-hidden animate-fade-in"
      onClick={handleBack}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0B0B10] border-0 sm:border border-[#232332] w-full sm:max-w-4xl lg:max-w-5xl h-[100dvh] sm:h-[92vh] max-h-[100dvh] sm:max-h-[94vh] rounded-none sm:rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.95)] text-white flex flex-col relative"
      >
        {/* Dynamic Reading Progress Bar at the Top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#181822] z-40">
          <div 
            className="h-full bg-gradient-to-r from-[#D90429] via-[#EF233C] to-[#F59E0B] transition-all duration-150 shadow-[0_0_10px_#EF233C]"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Sticky Top Reader Navigation Bar */}
        <header className="px-4 sm:px-8 py-3.5 bg-[#0B0B10]/95 backdrop-blur-xl border-b border-[#1E1E2A] flex items-center justify-between z-30 select-none flex-shrink-0">
          
          {/* Left: Prominent Back Button & Breadcrumbs */}
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-[#181822] hover:bg-[#D90429] text-white border border-[#2D2D3E] hover:border-[#EF233C] text-xs font-black font-['Montserrat'] uppercase tracking-wider transition-all shadow-md group transform active:scale-95 flex-shrink-0"
              title="Return to Sports Arena feed (ESC)"
            >
              <ArrowLeft className="w-4 h-4 text-[#EF233C] group-hover:text-white transition-transform group-hover:-translate-x-1" />
              <span>Back</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-black/40 text-[9px] text-gray-400 group-hover:text-white font-mono">ESC</span>
            </button>

            {/* Breadcrumb Navigation per Section 37 */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 font-medium truncate max-w-md">
              <span className="hover:text-white cursor-pointer transition font-bold" onClick={handleBack}>Home</span>
              <span className="text-gray-600">/</span>
              <span className="text-[#EF233C] font-semibold truncate">{categoryLabel}</span>
              {article.country && (
                <>
                  <span className="text-gray-600">/</span>
                  <span className="text-gray-300 truncate">{article.country}</span>
                </>
              )}
            </div>
          </div>

          {/* Right: Reader Toolbar Controls (Audio, Font, Bookmark, Share, Close) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            {/* Audio Narrator */}
            <button
              type="button"
              onClick={handleToggleSpeech}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 border ${
                isSpeaking 
                  ? 'bg-[#EF233C] text-white border-[#EF233C] shadow-sports-glow animate-pulse'
                  : 'bg-[#181822] text-[#A1A1AA] hover:text-white border-[#232332] hover:bg-[#232332]'
              }`}
              title={isSpeaking ? "Pause audio narration" : "Listen to audio story"}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#F59E0B]" />}
              <span className="hidden md:inline">{isSpeaking ? 'Narrating' : 'Listen'}</span>
            </button>

            {/* Font Size Toggle Button */}
            <button
              type="button"
              onClick={() => {
                setFontSizeLevel(prev => prev === 'normal' ? 'large' : prev === 'large' ? 'xl' : 'normal');
              }}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-full bg-[#181822] hover:bg-[#232332] text-[#A1A1AA] hover:text-white border border-[#232332] text-xs font-bold flex items-center gap-1 transition"
              title="Toggle reading text size"
            >
              <Type className="w-3.5 h-3.5 text-[#EF233C]" />
              <span className="text-[10px] uppercase font-mono font-bold">{fontSizeLevel === 'normal' ? '1x' : fontSizeLevel === 'large' ? '1.2x' : '1.4x'}</span>
            </button>

            {/* Bookmark */}
            <button
              type="button"
              onClick={() => onToggleBookmark && onToggleBookmark(article.id)}
              className={`p-2 rounded-full border transition flex items-center justify-center text-xs font-bold ${
                isBookmarked 
                  ? 'bg-[#181822] border-[#EF233C] text-[#EF233C]' 
                  : 'bg-[#181822] hover:bg-[#232332] text-[#A1A1AA] hover:text-white border-[#232332]'
              }`}
              title={isBookmarked ? "Saved in Bookmarks" : "Save for offline reading"}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current text-[#EF233C]' : ''}`} />
            </button>

            {/* Share Quick Button */}
            <button
              type="button"
              onClick={() => handleShare('copy')}
              className="p-2 rounded-full bg-[#181822] hover:bg-[#232332] text-[#A1A1AA] hover:text-white border border-[#232332] text-xs font-bold transition flex items-center justify-center"
              title="Share story"
            >
              {copiedShare ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-[#EF233C]" />}
            </button>

            {/* Close X Button */}
            <button
              type="button"
              onClick={handleBack}
              className="w-8 h-8 rounded-full bg-[#181822] hover:bg-[#D90429] text-[#A1A1AA] hover:text-white flex items-center justify-center transition border border-[#232332] shadow-sm ml-1"
              title="Close reader (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Article Body Surface */}
        <div 
          ref={modalContentRef}
          onScroll={handleScroll}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 sm:px-12 md:px-16 py-6 sm:py-10 space-y-8 scrollbar-thin scrollbar-thumb-[#232332] scrollbar-track-transparent"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >

          {/* ======================================================== */}
          {/* ARTICLE EDITORIAL HEADER                                 */}
          {/* ======================================================== */}
          <div className="space-y-4 max-w-4xl mx-auto">
            
            {/* Category / Desk Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-[#D90429] to-[#EF233C] text-white text-xs font-black uppercase tracking-wider font-['Montserrat'] shadow-sports-glow">
                {categoryLabel}
              </span>

              {article.country && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#181822] text-gray-300 border border-[#232332] text-[11px] font-bold uppercase tracking-wider font-['Montserrat']">
                  {article.country} Desk
                </span>
              )}

              {article.isBreaking && (
                <span className="px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#EF233C]" />
                  <span>Breaking Story</span>
                </span>
              )}
            </div>

            {/* Commanding Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-['Montserrat'] leading-[1.18] tracking-tight">
              {article.title}
            </h1>

            {/* Editorial Byline & Live Statistics Bar */}
            <div className="flex items-center justify-between gap-4 text-xs text-[#A1A1AA] flex-wrap pt-4 border-t border-[#1E1E2A]">
              
              {/* Author Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D90429] to-[#F59E0B] p-0.5 shadow-md flex-shrink-0">
                  <div className="w-full h-full rounded-full bg-[#181822] flex items-center justify-center text-white font-bold text-sm">
                    {authorLabel.charAt(0)}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-sm leading-none">{authorLabel}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                  </div>
                  <span className="text-[11px] text-gray-400 mt-0.5 block">Senior Sports Correspondent</span>
                </div>
              </div>

              {/* Publication Meta Pills */}
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-gray-300 font-mono text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#EF233C]" />
                  <span>{dateLabel}</span>
                </span>

                <span className="text-[#3F3F46]">•</span>

                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>{article.readingTime || 4} min read</span>
                </span>

                <span className="text-[#3F3F46]">•</span>

                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>{readsCount} readers</span>
                </span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* FEATURED MEDIA (VIDEO BLOCK OR HIGH-RES HERO IMAGE)      */}
          {/* ======================================================== */}
          <div className="space-y-2 max-w-4xl mx-auto">
            {article.videoUrl ? (
              <VideoBlock 
                videoUrl={article.videoUrl} 
                caption={article.videoCaption} 
                title={article.videoTitle || "Match Highlights & Tactical Video Breakdown"}
              />
            ) : (
              <div className="space-y-2">
                <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-[#181822] border border-[#232332] shadow-2xl group">
                  <img
                    src={articleImage}
                    alt={article.title}
                    className="w-full h-full object-cover object-center filter brightness-[0.95] contrast-105 group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                </div>
                <div className="text-[11px] text-gray-400 font-medium px-2 flex items-center justify-between">
                  <span className="truncate max-w-[80%] italic">
                    {summaryText || article.title}
                  </span>
                  <span className="font-mono text-gray-500 flex-shrink-0 text-[10px]">
                    Photo: Sports Arena Afrika
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* ARTICLE BODY & EDITORIAL INFORMATION                     */}
          {/* ======================================================== */}
          <div className="space-y-7 max-w-4xl mx-auto pt-2">
            
            {/* Standfirst / Lead Story Paragraph in Emphasized Editorial Callout */}
            {summaryText && (
              <div className="border-l-4 border-[#EF233C] pl-5 sm:pl-6 py-2.5 bg-gradient-to-r from-[#EF233C]/10 via-[#EF233C]/5 to-transparent rounded-r-2xl">
                <p className="font-semibold text-white text-lg sm:text-xl lg:text-2xl leading-relaxed italic text-gray-100 font-serif">
                  "{summaryText}"
                </p>
              </div>
            )}

            {/* Story Paragraphs with Rich Drop-Caps, Subheadings, Pullquotes & Inline Videos */}
            <div className={`space-y-6 text-gray-200 ${contentFontSizeClass}`}>
              {article.content ? (
                article.content.split(/\n\s*\n/).map((par, i) => renderArticleParagraph(par, i))
              ) : (
                <>
                  <p className="first-letter:float-left first-letter:text-5xl sm:first-letter:text-6xl first-letter:pr-4 first-letter:font-black first-letter:text-[#EF233C] first-letter:font-['Montserrat'] first-letter:leading-none text-gray-100 font-normal">
                    In a defining tactical masterclass that reverberated across African football and the global sporting landscape, performance metrics confirmed historic stamina, relentless pressing, and clinical execution in the final third.
                  </p>
                  <p className="text-gray-300 font-normal">
                    Sports lovers witnessed another high-stakes clash this weekend. Across Nairobi, Lagos, Johannesburg, and Cairo, thousands gathered in local viewing spots and community hubs to watch their favourite stars battle under the floodlights.
                  </p>
                  <p className="text-gray-300 font-normal">
                    Tactical discipline in transition proved decisive. As the match progressed into the critical closing stages, defensive cohesion turned defensive stops into lethal counter-attacking opportunities, leaving supporters breathless until the final whistle.
                  </p>
                </>
              )}
            </div>

            {/* Social Share & Reader Interaction Action Bar */}
            <div className="py-6 border-y border-[#232332] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Like Button */}
                <button
                  type="button"
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition font-['Montserrat'] text-xs font-bold ${
                    hasLiked
                      ? 'bg-[#D90429] border-[#D90429] text-white shadow-sports-glow'
                      : 'bg-[#181822] border-[#232332] text-gray-300 hover:border-white hover:text-white'
                  }`}
                  title="Like this story"
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current text-white' : 'text-[#EF233C]'}`} />
                  <span>{likes} Likes</span>
                </button>

                {/* Bookmark Button */}
                <button
                  type="button"
                  onClick={() => onToggleBookmark && onToggleBookmark(article.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition font-['Montserrat'] text-xs font-bold ${
                    isBookmarked
                      ? 'bg-[#181822] border-[#D90429] text-[#EF233C]'
                      : 'bg-[#181822] border-[#232332] text-gray-300 hover:border-white hover:text-white'
                  }`}
                  title={isBookmarked ? "Saved in bookmarks" : "Save for offline reading"}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-[#F59E0B]' : 'text-[#F59E0B]'}`} />
                  <span>{isBookmarked ? "Saved" : "Save Story"}</span>
                </button>
              </div>

              {/* Share Channels */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-xs text-gray-400 font-medium mr-1 hidden sm:inline">Share:</span>
                
                <button
                  type="button"
                  onClick={() => handleShare('whatsapp')}
                  className="px-3 py-1.5 rounded-full bg-[#128C7E]/20 hover:bg-[#128C7E] text-emerald-400 hover:text-white border border-[#128C7E]/40 text-xs font-bold transition flex items-center gap-1 shadow-sm"
                  title="Share on WhatsApp"
                >
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleShare('twitter')}
                  className="px-3 py-1.5 rounded-full bg-[#1DA1F2]/20 hover:bg-[#1DA1F2] text-sky-400 hover:text-white border border-[#1DA1F2]/40 text-xs font-bold transition flex items-center gap-1 shadow-sm"
                  title="Share on X / Twitter (@SportsArena26)"
                >
                  <span>X</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleShare('telegram')}
                  className="px-3 py-1.5 rounded-full bg-[#2AABEE]/20 hover:bg-[#2AABEE] text-cyan-400 hover:text-white border border-[#2AABEE]/40 text-xs font-bold transition flex items-center gap-1 shadow-sm"
                  title="Share on Telegram (@SportsArenaAfrica)"
                >
                  <span>Telegram</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleShare('facebook')}
                  className="px-3 py-1.5 rounded-full bg-[#1877F2]/20 hover:bg-[#1877F2] text-blue-400 hover:text-white border border-[#1877F2]/40 text-xs font-bold transition flex items-center gap-1 shadow-sm"
                  title="Share on Facebook"
                >
                  <span>Facebook</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleShare('linkedin')}
                  className="px-3 py-1.5 rounded-full bg-[#0A66C2]/20 hover:bg-[#0A66C2] text-blue-300 hover:text-white border border-[#0A66C2]/40 text-xs font-bold transition flex items-center gap-1 shadow-sm"
                  title="Share on LinkedIn"
                >
                  <span>LinkedIn</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleShare('copy')}
                  className="px-3 py-1.5 rounded-full bg-[#181822] hover:bg-[#232332] text-white border border-[#232332] text-xs font-bold transition flex items-center gap-1 shadow-sm"
                  title="Copy link to clipboard"
                >
                  {copiedShare ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-[#EF233C]" />}
                  <span>{copiedShare ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* ======================================================== */}
            {/* RECOMMENDED NEXT STORIES GRID                            */}
            {/* ======================================================== */}
            {relatedStories.length > 0 && (
              <div className="pt-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#232332]">
                  <h3 className="text-sm font-black uppercase tracking-wider text-white font-['Montserrat'] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D90429]"></span>
                    <span>More High-Impact Stories</span>
                  </h3>
                  <span className="text-xs text-[#A1A1AA] font-mono">Trending In Sports</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {relatedStories.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => {
                        if (onSelectArticle) {
                          onSelectArticle(rel);
                          modalContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className="group cursor-pointer bg-[#14141E] hover:bg-[#181824] p-3 rounded-2xl border border-[#232332] hover:border-[#EF233C]/60 transition-all duration-300 flex flex-col justify-between space-y-2.5"
                    >
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-gray-800">
                        <img 
                          src={rel.featuredImage || rel.image || '/images/hero-stadium.jpg'} 
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                        />
                        {rel.videoUrl && (
                          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#EF233C] text-white text-[9px] font-bold uppercase font-mono">
                            Video
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-[#EF233C] font-['Montserrat'] block">
                          {rel.categoryName || rel.category || 'News'}
                        </span>
                        <h4 className="text-xs font-bold text-white line-clamp-2 group-hover:text-[#60A5FA] transition">
                          {rel.title}
                        </h4>
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono flex items-center justify-between pt-1 border-t border-gray-800/80">
                        <span>{rel.readingTime || 3} min read</span>
                        <span className="group-hover:translate-x-1 transition text-[#EF233C]">Read →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* FAN ARENA DEBATE & COMMUNITY COMMENTS                    */}
            {/* ======================================================== */}
            <div className="space-y-5 pt-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#232332]">
                <h3 className="text-base font-black uppercase tracking-wider text-white font-['Montserrat'] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#16A34A]" />
                  <span>Fan Arena Debate ({commentsList.length})</span>
                </h3>
                <span className="text-xs text-gray-500 font-mono">Join the conversation</span>
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your tactical perspective or match reaction..."
                  className="flex-1 bg-[#14141E] border border-[#232332] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#EF233C] transition"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#D90429] hover:bg-[#EF233C] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition font-['Montserrat'] rounded-xl shadow-sports-glow flex-shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post</span>
                </button>
              </form>

              {/* Comments Thread */}
              <div className="space-y-3 pt-1">
                {commentsList.map((c) => (
                  <div key={c.id} className="bg-[#14141E] p-4 rounded-2xl border border-[#232332] space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#232332] to-[#34344A] text-gray-200 font-bold flex items-center justify-center text-xs shadow-inner">
                          {c.author.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-white font-['Montserrat'] block leading-none">{c.author}</span>
                          {c.location && (
                            <span className="text-[10px] text-gray-500">{c.location}</span>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] text-gray-500 font-mono">{c.time}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pl-9">
                      {c.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* ======================================================== */}
              {/* BOTTOM NAVIGATION & RETURN ACTION                        */}
              {/* ======================================================== */}
              <div className="pt-8 pb-4 border-t border-[#232332] flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#D90429] to-[#EF233C] hover:from-red-700 hover:to-red-600 text-white font-black text-xs uppercase tracking-wider font-['Montserrat'] shadow-sports-glow transition-all active:scale-95 group"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1.5" />
                  <span>Back to News Feed</span>
                </button>

                <button
                  type="button"
                  onClick={() => modalContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white font-bold transition font-['Montserrat'] uppercase tracking-wider"
                >
                  <ArrowUp className="w-3.5 h-3.5 text-[#EF233C]" />
                  <span>Back to Top</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Floating Quick-Back Button when reader is engaged in deep reading */}
      {scrollProgress > 3 && (
        <div className="fixed bottom-6 left-6 z-40 sm:bottom-8 sm:left-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#14141E]/95 backdrop-blur-xl border border-[#2D2D3E] hover:border-[#EF233C] text-white hover:bg-[#D90429] shadow-2xl transition-all font-['Montserrat'] text-xs font-black uppercase tracking-wider group active:scale-95"
            title="Go back to news feed"
          >
            <ArrowLeft className="w-4 h-4 text-[#EF233C] group-hover:text-white transition-transform group-hover:-translate-x-1" />
            <span>Back to Feed</span>
          </button>
        </div>
      )}

    </div>
  );
}
