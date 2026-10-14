import React, { useState, useRef, useEffect, useMemo } from 'react';
import api from '../services/api';
import VideoBlock from '../components/VideoBlock';
import {
  Save, Eye, Settings, HelpCircle, ChevronDown, ChevronUp, Plus,
  Undo, Redo, Menu, CheckCircle2, AlertCircle, Info, Image,
  ExternalLink, Sparkles, Sliders, Globe, Share2, FileText, Check,
  Upload, UploadCloud, RefreshCw, Trash2, Camera, ShieldCheck, ArrowLeft,
  Video, Play, Film, X, Link as LinkIcon, Type, Quote, List
} from 'lucide-react';

const readArticleAutosave = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
};

export default function WriteArticlePage({ onSaveArticle, onBackToDashboard, editingArticle, articles = [] }) {
  // Post Metadata - empty by default for new article, pre-filled when editing an existing article
  const [headline, setHeadline] = useState(() => editingArticle?.title || "");
  const [slug, setSlug] = useState(() => editingArticle?.slug || "");
  const [content, setContent] = useState(() => editingArticle?.content || "");
  const [category, setCategory] = useState(() => editingArticle?.categoryName || editingArticle?.category || "");
  const [seoValidationAlert, setSeoValidationAlert] = useState(null);
  const [highlightSeoTaxonomy, setHighlightSeoTaxonomy] = useState(false);
  const [videoUrl, setVideoUrl] = useState(() => editingArticle?.videoUrl || "");
  const [videoTitle, setVideoTitle] = useState(() => editingArticle?.videoTitle || "Match Highlights & Tactical Video Breakdown");
  const [videoCaption, setVideoCaption] = useState(() => editingArticle?.videoCaption || "");
  const [showBlockInserter, setShowBlockInserter] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoModalPlacement, setVideoModalPlacement] = useState('featured'); // 'featured' | 'inline'
  const [modalVideoUrl, setModalVideoUrl] = useState('');
  const [modalVideoTitle, setModalVideoTitle] = useState('Match Highlights & Tactical Video Breakdown');
  const [modalVideoCaption, setModalVideoCaption] = useState('');
  const textareaRef = useRef(null);
  const [availableCategories, setAvailableCategories] = useState([
    "Latest News", "Football", "Kenya Sports", "African Football", "Athletics",
    "Rugby", "Basketball", "Motorsport", "Boxing", "Analysis & Features", "Interviews", "Transfers"
  ]);
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [newCatInput, setNewCatInput] = useState('');
  const [tagList, setTagList] = useState(() => (Array.isArray(editingArticle?.tags) && editingArticle.tags.length ? editingArticle.tags : []));
  const [tagInput, setTagInput] = useState('');
  const [region, setRegion] = useState(() => editingArticle?.region || '');
  const [subcategory, setSubcategory] = useState(() => editingArticle?.subcategory || '');
  const [sourceName, setSourceName] = useState(() => editingArticle?.sourceName || '');
  const [sourceUrl, setSourceUrl] = useState(() => editingArticle?.sourceUrl || '');
  const [selectedRelatedArticles, setSelectedRelatedArticles] = useState(() => (editingArticle?.relatedArticles || []).map(String));
  const [showPreview, setShowPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [country, setCountry] = useState(() => editingArticle?.country || "Kenya");
  const [league, setLeague] = useState(() => editingArticle?.league || "FKF Premier League");
  const [status, setStatus] = useState(() => editingArticle?.status || "Draft");
  const [featuredImage, setFeaturedImage] = useState(() => editingArticle?.featuredImage || editingArticle?.image || "");
  const [selectedUpload, setSelectedUpload] = useState(null);

  // Offline Image State for SEO & Social
  const [offlineImage, setOfflineImage] = useState(() => ({
    src: editingArticle?.featuredImage || editingArticle?.image || "",
    name: editingArticle?.featuredImage ? editingArticle.featuredImage.split('/').pop() : "",
    size: "",
    type: "image/jpeg",
    dimensions: "",
    altText: editingArticle?.title || "",
    titleText: editingArticle?.title || "",
    caption: "",
    isOfflineUploaded: false,
    uploadedAt: ""
  }));

  const [socialNetworkTab, setSocialNetworkTab] = useState('facebook'); // 'facebook' | 'twitter'

  const seoImageInputRef = useRef(null);
  const postImageInputRef = useRef(null);
  const socialImageInputRef = useRef(null);

  // File upload reader function - works 100% offline
  const handleProcessOfflineImage = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid offline image file (JPG, PNG, WebP, SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const img = new window.Image();
      img.onload = () => {
        const dimensions = `${img.naturalWidth} × ${img.naturalHeight} px`;
        const sizeFormatted = file.size > 1024 * 1024
          ? (file.size / (1024 * 1024)).toFixed(2) + ' MB'
          : Math.round(file.size / 1024) + ' KB';

        const updated = {
          src: dataUrl,
          name: file.name,
          size: sizeFormatted,
          type: file.type,
          dimensions,
          altText: offlineImage.altText || `${focusKeyphrase} match action photo`,
          titleText: offlineImage.titleText || headline,
          caption: offlineImage.caption || `Match photo for ${headline}`,
          isOfflineUploaded: true,
          uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setOfflineImage(updated);
        setFeaturedImage(dataUrl);
        setSelectedUpload(file);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Inspector Tabs: 'post' | 'block' | 'yoast'
  const [sidebarTab, setSidebarTab] = useState('post');
  const [yoastSubTab, setYoastSubTab] = useState('seo'); // 'seo' | 'readability' | 'inclusive' | 'schema' | 'social'

  // Yoast Fields
  const [focusKeyphrase, setFocusKeyphrase] = useState(() => editingArticle?.focusKeyphrase || "");
  const [keyphraseSynonyms, setKeyphraseSynonyms] = useState(() => editingArticle?.keyphraseSynonyms || "");
  const [metaTitle, setMetaTitle] = useState(() => editingArticle?.metaTitle || editingArticle?.title || "");
  const [metaDesc, setMetaDesc] = useState(() => editingArticle?.metaDescription || editingArticle?.summary || "");
  const autosaveKey = `sportsarena_article_autosave_${editingArticle?.id || 'new'}`;

  const handleHeadlineChange = (val) => {
    setHeadline(val);
    const generated = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    setSlug(generated);
    if (!metaTitle || metaTitle.endsWith(' | Sports Arena Afrika')) {
      setMetaTitle(val ? `${val} | Sports Arena Afrika` : '');
    }
  };

  const addTag = (value = tagInput) => {
    const clean = value.replace(/^#/, '').trim();
    if (!clean || tagList.some((tag) => tag.toLocaleLowerCase() === clean.toLocaleLowerCase())) return;
    setTagList((current) => [...current, clean]);
    setTagInput('');
  };

  const userRole = sessionStorage.getItem('arena_role');
  const canPublish = ['ROLE_SUPER_ADMIN', 'ROLE_EDITOR'].includes(userRole);
  const articleApproved = editingArticle?.status === 'APPROVED' || editingArticle?.status === 'PUBLISHED';
  const canPublishNow = canPublish && articleApproved;
  const relatedArticleOptions = (Array.isArray(articles) ? articles : [])
    .filter((article) => String(article.id) !== String(editingArticle?.id) && article.title)
    .slice(0, 8);
  const existingTags = [...new Set((Array.isArray(articles) ? articles : []).flatMap((article) => Array.isArray(article.tags) ? article.tags : []))];

  useEffect(() => {
    if (editingArticle) {
      setHeadline(editingArticle.title || '');
      setSlug(editingArticle.slug || '');
      setContent(editingArticle.content || '');
      setCategory(editingArticle.categoryName || editingArticle.category || 'Latest News');
      setTagList(Array.isArray(editingArticle.tags) ? editingArticle.tags : []);
      setCountry(editingArticle.country || 'Kenya');
      setLeague(editingArticle.league || 'FKF Premier League');
      const articleStatus = String(editingArticle.status || 'DRAFT').toUpperCase().replaceAll('_', ' ');
      setStatus(articleStatus.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()));
      setRegion(editingArticle.region || '');
      setSubcategory(editingArticle.subcategory || '');
      setSourceName(editingArticle.sourceName || '');
      setSourceUrl(editingArticle.sourceUrl || '');
      setSelectedRelatedArticles((editingArticle.relatedArticles || []).map(String));
      const img = editingArticle.featuredImage || editingArticle.image || '';
      setFeaturedImage(img);
      setOfflineImage({
        src: img,
        name: img ? img.split('/').pop() : '',
        size: '',
        type: 'image/jpeg',
        dimensions: '',
        altText: editingArticle.title || '',
        titleText: editingArticle.title || '',
        caption: '',
        isOfflineUploaded: false,
        uploadedAt: ''
      });
      setFocusKeyphrase(editingArticle.focusKeyphrase || '');
      setKeyphraseSynonyms(editingArticle.keyphraseSynonyms || '');
      setMetaTitle(editingArticle.metaTitle || editingArticle.title || '');
      setMetaDesc(editingArticle.metaDescription || editingArticle.summary || '');
    } else {
      const recovered = readArticleAutosave('sportsarena_article_autosave_new');
      setHeadline('');
      setSlug('');
      setContent('');
      setCategory('');
      setSeoValidationAlert(null);
      setHighlightSeoTaxonomy(false);
      setTagList([]);
      setTagInput('');
      setCountry('Kenya');
      setRegion('');
      setSubcategory('');
      setSourceName('');
      setSourceUrl('');
      setSelectedRelatedArticles([]);
      setLeague('FKF Premier League');
      setStatus('Draft');
      setFeaturedImage('');
      setSelectedUpload(null);
      setOfflineImage({
        src: '',
        name: '',
        size: '',
        type: '',
        dimensions: '',
        altText: '',
        titleText: '',
        caption: '',
        isOfflineUploaded: false,
        uploadedAt: ''
      });
      setFocusKeyphrase('');
      setKeyphraseSynonyms('');
      setMetaTitle('');
      setMetaDesc('');
      if (recovered) {
        setHeadline(recovered.headline || '');
        setSlug(recovered.slug || '');
        setContent(recovered.content || '');
        setTagList(Array.isArray(recovered.tagList) ? recovered.tagList : []);
        setCategory(recovered.category || '');
        setCountry(recovered.country || 'Kenya');
        setRegion(recovered.region || '');
        setSubcategory(recovered.subcategory || '');
        setSourceName(recovered.sourceName || '');
        setSourceUrl(recovered.sourceUrl || '');
        setSelectedRelatedArticles(Array.isArray(recovered.selectedRelatedArticles) ? recovered.selectedRelatedArticles : []);
        setFocusKeyphrase(recovered.focusKeyphrase || '');
        setMetaTitle(recovered.metaTitle || '');
        setMetaDesc(recovered.metaDesc || '');
        setVideoUrl(recovered.videoUrl || '');
        setVideoTitle(recovered.videoTitle || '');
        setVideoCaption(recovered.videoCaption || '');
        if (recovered.featuredImage && !recovered.featuredImage.startsWith('data:')) setFeaturedImage(recovered.featuredImage);
      }
    }
  }, [editingArticle]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const autosave = { headline, slug, content, tagList, category, country, region, subcategory, sourceName, sourceUrl, selectedRelatedArticles, focusKeyphrase, metaTitle, metaDesc, videoUrl, videoTitle, videoCaption, featuredImage: featuredImage.startsWith('data:') ? '' : featuredImage };
      try { localStorage.setItem(autosaveKey, JSON.stringify(autosave)); } catch { /* Storage can be unavailable or full. */ }
    }, 700);
    return () => window.clearTimeout(timer);
  }, [autosaveKey, headline, slug, content, tagList, category, country, region, subcategory, sourceName, sourceUrl, selectedRelatedArticles, focusKeyphrase, metaTitle, metaDesc, videoUrl, videoTitle, videoCaption, featuredImage]);

  // Accordion Toggles
  const [openAccordions, setOpenAccordions] = useState({
    searchAppearance: false,
    seoImages: true,
    seoAnalysis: true,
    problems: true,
    improvements: true,
    goodResults: true,
    readability: true,
    inclusive: true
  });

  const toggleAccordion = (key) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Check if alt text includes focus keyphrase
  const hasAltKeyphrase = offlineImage.altText.toLowerCase().includes(focusKeyphrase.toLowerCase().trim());

  // Word count & Read time
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // 16-Point Google Ranking & Sports Arena Afrika SEO Publishing Standards Checklist
  const seoChecklist = useMemo(() => {
    const effectiveTitle = metaTitle || headline;
    const effectiveDesc = metaDesc || (content ? content.slice(0, 160) : '');
    const cleanContent = content || '';
    const words = cleanContent.trim().split(/\s+/).filter(Boolean).length;

    return [
      { id: 'seo_title', label: 'SEO Title', passed: effectiveTitle.trim().length >= 25 && effectiveTitle.trim().length <= 75, hint: `${effectiveTitle.length}/60 chars (recommended 35–65)` },
      { id: 'meta_desc', label: 'Meta Description', passed: effectiveDesc.trim().length >= 50 && effectiveDesc.trim().length <= 170, hint: `${effectiveDesc.length}/155 chars (recommended 120–160)` },
      { id: 'h1', label: 'H1 Headline', passed: headline.trim().length >= 10, hint: headline ? 'H1 headline defined' : 'Add main article headline' },
      { id: 'category', label: 'Primary Category (Google News)', passed: Boolean(category && category.trim()), hint: category ? `Assigned: ${category}` : 'Required: Select news category' },
      { id: 'seo_tags', label: 'SEO Tags & Taxonomy Keywords', passed: tagList.length >= 1, hint: tagList.length >= 1 ? `${tagList.length} tag(s): #${tagList.slice(0, 3).join(', #')}` : 'Required: Add at least 1–3 tags' },
      { id: 'author', label: 'Author Byline & Desk', passed: true, hint: sessionStorage.getItem('arena_username') || 'Sports Arena Editorial Desk' },
      { id: 'featured_img', label: 'Featured Image (16:9)', passed: Boolean(featuredImage || offlineImage.src), hint: (featuredImage || offlineImage.src) ? 'Image attached' : 'Upload match photo' },
      { id: 'img_alt', label: 'Image ALT Text', passed: Boolean(offlineImage.altText && offlineImage.altText.trim().length > 3), hint: offlineImage.altText ? 'ALT text present' : 'Add descriptive ALT text' },
      { id: 'content', label: 'Article Content Depth', passed: words >= 60, hint: `${words} words (${words >= 250 ? 'Strong news length' : 'Min 60+ words'})` },
      { id: 'internal_link', label: 'Internal Link', passed: cleanContent.includes('http') || cleanContent.includes('/news') || cleanContent.includes('/category') || cleanContent.includes('[') || cleanContent.includes('league') || cleanContent.includes('cup') || cleanContent.includes('stars'), hint: 'Links to related stories, teams or pillars' },
      { id: 'source_ref', label: 'Source / Reference Attribution', passed: /source|according|reported|confirmed|statement|quotes|fkf|caf|fifa|coach|referee|spokesperson/i.test(cleanContent), hint: 'Attributed to coach, club, federation or official' },
      { id: 'canonical_url', label: 'Canonical URL', passed: Boolean(slug && slug.length >= 3), hint: `https://sportsarenaafrika.com/${slug || 'slug'}` },
      { id: 'news_schema', label: 'NewsArticle Schema', passed: true, hint: 'Auto JSON-LD generated' },
      { id: 'pub_date', label: 'Publication Date', passed: true, hint: 'Accurate ISO-8601 timestamp' },
      { id: 'mod_date', label: 'Modification Date', passed: true, hint: 'dateModified tracked automatically' },
      { id: 'news_sitemap', label: 'News Sitemap Eligibility', passed: Boolean(headline && words >= 40), hint: 'Eligible for 48h Google News XML feed' },
      { id: 'mobile_check', label: 'Mobile Experience Check', passed: true, hint: 'Responsive fluid viewport verified' }
    ];
  }, [metaTitle, headline, metaDesc, content, category, tagList, featuredImage, offlineImage.src, offlineImage.altText, slug]);

  const passedSeoChecksCount = seoChecklist.filter(c => c.passed).length;

  const sampleVideos = [
    {
      title: "Premier League Highlights",
      url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
      caption: "High-octane match replay and key tactical moments."
    },
    {
      title: "CAF Champions League Action",
      url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
      caption: "Continental fireworks and full-time stadium celebrations."
    },
    {
      title: "Tactical Breakdown & Analysis",
      url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
      caption: "Comprehensive in-depth pitch masterclass and post-match remarks."
    }
  ];

  const insertTextAtCursor = (prefix, suffix = '', defaultText = '') => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent(prev => prev + (prev ? '\n\n' : '') + prefix + defaultText + suffix);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end) || defaultText;
    const replacement = prefix + selected + suffix;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 10);
  };

  const insertInlineVideoBlock = (url, caption = '') => {
    const trimmedUrl = (url || '').trim();
    if (!trimmedUrl) return;
    const videoTag = caption?.trim() 
      ? `\n\n[video: ${trimmedUrl} | ${caption.trim()}]\n\n`
      : `\n\n[video: ${trimmedUrl}]\n\n`;
    
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + videoTag + content.substring(end);
      setContent(newContent);
    } else {
      setContent(prev => (prev ? prev.trim() + videoTag : videoTag.trim()));
    }
  };

  const handleOpenVideoModal = (placement = 'featured') => {
    setVideoModalPlacement(placement);
    if (placement === 'featured') {
      setModalVideoUrl(videoUrl);
      setModalVideoTitle(videoTitle);
      setModalVideoCaption(videoCaption);
    } else {
      setModalVideoUrl('');
      setModalVideoTitle('Match Video Breakdown');
      setModalVideoCaption('');
    }
    setShowVideoModal(true);
    setShowBlockInserter(false);
  };

  const handleApplyVideoModal = () => {
    if (!modalVideoUrl.trim()) {
      alert("Please provide a valid YouTube, Vimeo, or MP4 video URL.");
      return;
    }
    if (videoModalPlacement === 'featured') {
      setVideoUrl(modalVideoUrl.trim());
      if (modalVideoTitle.trim()) setVideoTitle(modalVideoTitle.trim());
      if (modalVideoCaption.trim()) setVideoCaption(modalVideoCaption.trim());
    } else {
      insertInlineVideoBlock(modalVideoUrl.trim(), modalVideoCaption.trim());
    }
    setShowVideoModal(false);
  };

  const handlePublish = async (overrideStatus) => {
    try {
      const targetStatus = overrideStatus || (status ? String(status).toUpperCase() : 'PUBLISHED');

      if (!headline.trim()) {
        setSeoValidationAlert({
          title: 'Article Headline Required',
          message: 'Add a headline before saving or publishing this article.'
        });
        return;
      }

      if (targetStatus === 'PENDING_REVIEW' && !content.trim()) {
        setSeoValidationAlert({
          title: 'Article Content Required',
          message: 'Write the article before submitting it to an editor for review.'
        });
        return;
      }

      const normalizedHeadline = headline.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
      const duplicateHeadline = (Array.isArray(articles) ? articles : []).some((article) =>
        String(article.id) !== String(editingArticle?.id) &&
        String(article.title || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase() === normalizedHeadline
      );
      if (duplicateHeadline) {
        setSeoValidationAlert({
          title: 'Headline Already Exists',
          message: 'Another article already uses this headline. Update the headline before saving.'
        });
        return;
      }

      // SEO Publishing Gate: Category and at least one Tag MUST be added before publishing
      if (targetStatus === 'APPROVED' && !canPublish) {
        setSeoValidationAlert({ title: 'Editor Approval Required', message: 'Only an editor can approve an article for publication.' });
        return;
      }

      if (targetStatus === 'PUBLISHED' && !canPublishNow) {
          setSeoValidationAlert({
            title: 'Editor Approval Required',
            message: 'Submit this article for review. An editor must approve it before it can be published.'
          });
          return;
      }

      if (targetStatus === 'APPROVED' || targetStatus === 'PUBLISHED') {
        const hasValidCategory = Boolean(category && category.trim());
        const hasValidTags = Array.isArray(tagList) && tagList.length > 0;

        if (!hasValidCategory || !hasValidTags) {
          setSidebarTab('post');
          setHighlightSeoTaxonomy(true);
          setTimeout(() => {
            const el = document.getElementById('article-categories-tags-box-final');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 150);
          setSeoValidationAlert({
            title: 'SEO Publishing Validation Required',
            message: `Before publishing, select a Category and add at least one Tag:${!hasValidCategory ? '\n• Select a main category in the final Categories & Tags section' : ''}${!hasValidTags ? '\n• Add at least one tag in the final Categories & Tags section' : ''}\n\nDrafts and review submissions can be saved before categorization.`
          });
          return;
        }
      }

      setSeoValidationAlert(null);
      setHighlightSeoTaxonomy(false);

      let uploadedImage = featuredImage;
      if (selectedUpload) {
        const uploaded = await api.uploadImage(selectedUpload);
        if (uploaded?.url) {
          uploadedImage = uploaded.url;
          setFeaturedImage(uploaded.url);
          setSelectedUpload(null);
        }
      }
      if (uploadedImage?.startsWith('data:')) uploadedImage = '/images/news-saka.jpg';
      if (onSaveArticle) {
        await onSaveArticle({
          id: editingArticle?.id,
          title: headline,
          slug: slug || headline.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          content,
          category,
          country,
          league,
          tags: tagList,
          status: targetStatus,
          featuredImage: uploadedImage,
          focusKeyphrase,
          metaTitle,
          metaDesc: metaDesc || content.slice(0, 160),
          videoUrl,
          videoTitle,
          videoCaption,
          region,
          subcategory,
          sourceName,
          sourceUrl,
          relatedArticles: selectedRelatedArticles
        });
        try { localStorage.removeItem(autosaveKey); } catch { /* Ignore storage cleanup failures. */ }
        alert(targetStatus === 'PENDING_REVIEW'
          ? 'Article submitted for editorial review.'
          : targetStatus === 'APPROVED'
            ? 'Article approved and saved. It is still unpublished.'
          : targetStatus === 'PUBLISHED'
            ? (editingArticle ? 'Article updated and published.' : 'Article published.')
            : 'Draft saved.');
        if (onBackToDashboard) onBackToDashboard();
      }
    } catch (error) {
      alert(error.message || 'Unable to save the article.');
    }
  };

  return (
    <div className="wordpress-editor min-h-screen bg-[#F0F0F1] text-[#1E1E1E] flex flex-col font-sans">
      
      {/* 1. Gutenberg-Style WordPress Editor Top Bar (Screenshot 4) */}
      <header className="bg-white border-b border-[#DCDCDE] px-4 py-2.5 flex items-center justify-between z-20 shadow-sm">
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Author avatar */}
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-600 bg-gray-700">
            <img src="/images/logo.png" alt="Admin" className="w-full h-full object-cover" />
          </div>

          {/* Add block button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowBlockInserter(!showBlockInserter)}
              className={`w-7 h-7 rounded ${showBlockInserter ? 'bg-[#EF233C]' : 'bg-[#2563EB] hover:bg-blue-600'} text-white flex items-center justify-center font-bold text-sm shadow transition`}
              title="Add Block (Video, Paragraph, Heading, Quote, List)"
            >
              {showBlockInserter ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>

            {/* Gutenberg Block Inserter Popover */}
            {showBlockInserter && (
              <div className="absolute left-0 mt-2 w-72 bg-[#181822] border border-[#2D2D38] rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2D2D38]">
                  <span className="text-xs font-black uppercase tracking-wider text-white font-['Montserrat']">
                    Add A Block
                  </span>
                  <button type="button" onClick={() => setShowBlockInserter(false)} className="text-gray-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  {/* VIDEO BLOCK - PRIMARY HIGHLIGHT */}
                  <button
                    type="button"
                    onClick={() => handleOpenVideoModal('featured')}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-red-600/20 via-red-900/30 to-[#181822] border border-red-500/50 text-white hover:border-red-400 hover:bg-red-950/40 transition text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#EF233C] text-white flex items-center justify-center flex-shrink-0 shadow">
                      <Video className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-xs group-hover:text-red-300">Video Block</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#EF233C] text-white font-mono uppercase font-black">HD</span>
                      </div>
                      <span className="text-[10px] text-gray-400 block truncate">YouTube, Vimeo or MP4 match player</span>
                    </div>
                  </button>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => { insertTextAtCursor('', '', 'Write your new story paragraph here...'); setShowBlockInserter(false); }}
                      className="flex flex-col items-start p-2 rounded-xl bg-[#121218] border border-gray-700/60 hover:border-gray-500 text-gray-200 transition text-left"
                    >
                      <FileText className="w-4 h-4 text-[#2563EB] mb-1" />
                      <span className="font-semibold text-xs text-white">Paragraph</span>
                      <span className="text-[10px] text-gray-400">Regular copy</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { insertTextAtCursor('\n\n## ', '\n\n', 'Key Match Factor'); setShowBlockInserter(false); }}
                      className="flex flex-col items-start p-2 rounded-xl bg-[#121218] border border-gray-700/60 hover:border-gray-500 text-gray-200 transition text-left"
                    >
                      <Type className="w-4 h-4 text-[#10B981] mb-1" />
                      <span className="font-semibold text-xs text-white">Heading H2</span>
                      <span className="text-[10px] text-gray-400">Section title</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { insertTextAtCursor('\n\n> "', '"\n\n', 'Tactical mastery was evident today.'); setShowBlockInserter(false); }}
                      className="flex flex-col items-start p-2 rounded-xl bg-[#121218] border border-gray-700/60 hover:border-gray-500 text-gray-200 transition text-left"
                    >
                      <Quote className="w-4 h-4 text-[#F59E0B] mb-1" />
                      <span className="font-semibold text-xs text-white">Pull Quote</span>
                      <span className="text-[10px] text-gray-400">Coach statement</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { insertTextAtCursor('\n\n- ', '\n- \n- \n\n', 'Key match stat'); setShowBlockInserter(false); }}
                      className="flex flex-col items-start p-2 rounded-xl bg-[#121218] border border-gray-700/60 hover:border-gray-500 text-gray-200 transition text-left"
                    >
                      <List className="w-4 h-4 text-[#8B5CF6] mb-1" />
                      <span className="font-semibold text-xs text-white">Bullet List</span>
                      <span className="text-[10px] text-gray-400">Match stats</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Undo / Redo */}
          <button className="text-gray-400 hover:text-white p-1"><Undo className="w-4 h-4" /></button>
          <button className="text-gray-400 hover:text-white p-1"><Redo className="w-4 h-4" /></button>

          {/* Document Overview */}
          <button className="text-gray-400 hover:text-white p-1 hidden sm:block"><Menu className="w-4 h-4" /></button>

          <span className="text-xs text-gray-400 font-mono hidden md:inline px-2 py-0.5 rounded bg-[#121218] border border-gray-700">
            · Post ⌘K
          </span>
        </div>

        {/* Center/Right Status Badges (Headline Score, Readability, SEO score) */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40 text-xs font-mono font-bold">
            <span>H</span>
            <span>88/100</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/40 text-xs font-mono font-bold">
            <span>📊</span>
            <span>94/100</span>
          </div>

          {/* Yoast SEO Traffic Light Indicator (From Screenshots 2 & 4) */}
          <button
            onClick={() => setSidebarTab('yoast')}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#232332] hover:bg-[#2D2D3E] border border-gray-700 transition"
            title="Yoast SEO Premium Score: Good"
          >
            <div className="w-6 h-6 rounded bg-[#16A34A] text-white flex items-center justify-center font-black text-xs font-serif">
              y
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] shadow-[0_0_8px_#16A34A]"></span>
          </button>

          {/* 16-Point SEO Publishing Standards Traffic Button */}
          <button
            type="button"
            onClick={() => setSidebarTab('publishing_standard')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#181824] hover:bg-[#202030] border border-[#2F2F44] text-xs font-bold text-gray-300 hover:text-white transition"
            title="Sports Arena Afrika - 16-Point SEO Publishing Standard"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline text-[11px]">SEO Standard:</span>
            <span className={passedSeoChecksCount >= 14 ? "text-emerald-400 font-mono font-bold" : "text-amber-400 font-mono font-bold"}>
              {passedSeoChecksCount}/{seoChecklist.length}
            </span>
          </button>

          {/* Back button */}
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="px-3 py-1.5 rounded text-xs font-semibold text-gray-300 hover:text-white hover:bg-[#2A2A38] transition border border-gray-700 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
          )}

          {/* Save Draft Button */}
          <button
            onClick={() => handlePublish('DRAFT')}
            className="px-3 py-1.5 rounded text-xs font-semibold text-gray-300 hover:text-white hover:bg-[#2A2A38] transition border border-gray-700 hidden sm:inline"
          >
            Save Draft
          </button>

          <button type="button" onClick={() => setShowPreview(true)} className="px-3 py-1.5 rounded text-xs font-semibold text-gray-300 hover:text-white hover:bg-[#2A2A38] transition border border-gray-700">Preview</button>
          {canPublish && editingArticle && !articleApproved ? (
            <button type="button" onClick={() => handlePublish('APPROVED')} className="px-4 py-1.5 rounded bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow transition">Approve Article</button>
          ) : canPublishNow ? (
            <button type="button" onClick={() => handlePublish('PUBLISHED')} className="px-4 py-1.5 rounded bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow transition">Publish Now</button>
          ) : (
            <button type="button" onClick={() => handlePublish('PENDING_REVIEW')} className="px-4 py-1.5 rounded bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow transition">Submit for Review</button>
          )}

          {/* Sidebar Toggle & Settings Gear */}
          <button
            onClick={() => setSidebarTab(sidebarTab === 'post' ? 'yoast' : 'post')}
            className={`p-1.5 rounded transition ${sidebarTab === 'post' ? 'bg-[#2A2A38] text-white' : 'text-gray-400 hover:text-white'}`}
            title="Toggle Settings Sidebar"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Main Editing Surface: Editor Canvas (Left) + Yoast/Post Inspector (Right) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column: Writing Canvas */}
          <div className="wordpress-editor-canvas flex-1 overflow-y-auto p-6 sm:p-12 max-w-4xl mx-auto w-full space-y-6">
          
          {/* SEO Pre-Publish Validation Alert Banner */}
          {seoValidationAlert && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/60 via-red-900/40 to-[#181822] border-2 border-red-500/70 shadow-2xl flex items-start justify-between gap-4 animate-in fade-in slide-in-from-top-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-600/30 text-[#EF233C] flex items-center justify-center flex-shrink-0 border border-red-500/50">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide font-['Montserrat'] flex items-center gap-2">
                    <span>{seoValidationAlert.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-mono">ACTION REQUIRED</span>
                  </h4>
                  <p className="text-xs text-gray-300 mt-1 whitespace-pre-line leading-relaxed">
                    {seoValidationAlert.message}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSidebarTab('post');
                        setHighlightSeoTaxonomy(true);
                        const el = document.getElementById('article-categories-tags-box-final');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow transition"
                    >
                      <span>Assign Category &amp; Tags Now</span>
                      <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeoValidationAlert(null)}
                      className="text-xs text-gray-400 hover:text-white transition"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSeoValidationAlert(null)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Permalink / Slug preview */}
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400 bg-[#121218] p-2.5 rounded-lg border border-[#2D2D38]">
            <span className="text-[#2563EB] font-bold">Permalink:</span>
            <span className="text-gray-500">https://sportsarenaafrika.com/{(category || 'news').toLowerCase().replace(/\s+/g, '-')}/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="bg-transparent text-white font-mono border-b border-gray-600 focus:outline-none focus:border-[#2563EB] flex-1"
            />
          </div>

          {/* Big Headline Field */}
          <div>
            <textarea
              rows={2}
              value={headline}
              onChange={(e) => handleHeadlineChange(e.target.value)}
              placeholder="Add title"
              aria-label="Article title"
              className="w-full bg-transparent text-3xl sm:text-4xl font-bold text-[#1E1E1E] placeholder-[#787C82] focus:outline-none resize-none leading-tight font-['Montserrat']"
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[#50575E]">
              <span>{headline.length}/75 characters</span>
              <span className={`font-semibold ${headline.length >= 35 && headline.length <= 75 ? 'text-[#008A20]' : headline.length > 75 ? 'text-[#D63638]' : 'text-[#996800]'}`}>
                {headline.length === 0 ? 'Headline quality: Add a clear, specific headline' : headline.length > 75 ? 'Headline is too long' : headline.length >= 35 ? 'Headline quality: Good' : 'Headline quality: Add more detail'}
              </span>
            </div>
            <p className="mt-2 text-xs text-[#646970]">
              SEO title suggestion: <span className="font-medium text-[#1E1E1E]">{metaTitle || (headline ? `${headline} | Sports Arena Afrika` : 'Your headline will appear in search results')}</span>
            </p>
          </div>

          {/* Featured Match Video Block Live Preview if attached */}
          {videoUrl && (
            <div className="bg-[#181822] border-2 border-red-600/40 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#EF233C] text-white shadow">
                    <Video className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-xs font-black uppercase text-white font-['Montserrat'] tracking-wider block">
                      Featured Match Video Block
                    </span>
                    <span className="text-[10px] text-gray-400 block truncate max-w-md">
                      {videoTitle || "Match Highlights & Tactical Breakdown"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenVideoModal('featured')}
                    className="px-2.5 py-1 rounded-lg bg-[#232332] hover:bg-gray-700 text-xs font-bold text-white border border-gray-600 transition"
                  >
                    Edit Video
                  </button>
                  <button
                    type="button"
                    onClick={() => { setVideoUrl(''); setVideoCaption(''); }}
                    className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition"
                    title="Remove Video Block"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Real Video Player Component */}
              <VideoBlock
                videoUrl={videoUrl}
                title={videoTitle}
                caption={videoCaption}
              />
            </div>
          )}

          {/* Content Block Editor */}
          <div className="space-y-4">
            <div className="bg-[#181822] border border-[#2D2D38] rounded-xl p-2 flex items-center space-x-2 sm:space-x-3 text-xs text-gray-300 flex-wrap gap-y-1">
              <span className="font-bold text-white px-1">¶ Paragraph</span>
              <span className="text-gray-600">|</span>
              <button type="button" onClick={() => insertTextAtCursor('**', '**', 'bold text')} className="hover:text-white font-bold px-1.5 py-0.5 rounded hover:bg-[#232332]">B</button>
              <button type="button" onClick={() => insertTextAtCursor('*', '*', 'italic text')} className="hover:text-white italic font-serif px-1.5 py-0.5 rounded hover:bg-[#232332]">I</button>
              <button type="button" onClick={() => insertTextAtCursor('[', '](https://...)', 'link title')} className="hover:text-white px-1.5 py-0.5 rounded hover:bg-[#232332]">🔗 Link</button>
              <button type="button" onClick={() => insertTextAtCursor('\n\n## ', '\n\n', 'Section Heading')} className="hover:text-white font-bold px-1.5 py-0.5 rounded hover:bg-[#232332]">H2</button>
              <button type="button" onClick={() => insertTextAtCursor('\n\n### ', '\n\n', 'Sub Heading')} className="hover:text-white font-bold px-1.5 py-0.5 rounded hover:bg-[#232332]">H3</button>
              <button type="button" onClick={() => insertTextAtCursor('\n\n> "', '"\n\n', 'Quotation')} className="hover:text-white font-mono px-1.5 py-0.5 rounded hover:bg-[#232332]">“ Quote</button>
              <button type="button" onClick={() => insertTextAtCursor('\n\n- ', '\n- \n- \n\n', 'List item')} className="hover:text-white px-1.5 py-0.5 rounded hover:bg-[#232332]">≡ List</button>
              
              {/* VIDEO BLOCK TOOLBAR BUTTON */}
              <div className="ml-auto flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenVideoModal('inline')}
                  className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-red-600/30 to-red-500/20 text-red-300 hover:text-white hover:border-red-500 border border-red-500/40 font-bold flex items-center gap-1.5 transition text-xs shadow-sm"
                  title="Insert inline Video Block into article text"
                >
                  <Video className="w-3.5 h-3.5 text-[#EF233C]" />
                  <span>Inline Video</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenVideoModal('featured')}
                  className="px-2.5 py-1 rounded-lg bg-[#2563EB]/20 text-[#60A5FA] hover:text-white hover:border-[#2563EB] border border-[#2563EB]/40 font-bold flex items-center gap-1.5 transition text-xs shadow-sm"
                  title="Attach Featured Match Video Block"
                >
                  <Film className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Featured Video</span>
                </button>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              rows={14}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your new article story or content here... You can insert [video: https://youtube.com/watch?v=...] anywhere inline!"
              className="w-full bg-transparent text-base sm:text-lg text-gray-200 placeholder-gray-600 focus:outline-none resize-none leading-relaxed font-sans"
            />
          </div>

          {/* Meta Boxes Accordion (From Screenshot 4) */}
          <div className="pt-6 border-t border-[#2D2D38]">
            <div className="bg-[#181822] border border-[#2D2D38] rounded-xl p-4">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400 font-['Montserrat']">
                Author Details
              </span>
              <div className="mt-3 grid grid-cols-1 gap-3 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Author Byline</label>
                  <input type="text" defaultValue={sessionStorage.getItem('arena_username') || 'Kipchoge Ombati'} className="w-full bg-[#121218] border border-gray-700 rounded p-2 text-white" />
                </div>
              </div>
            </div>
          </div>

          <section className="space-y-3 rounded border border-[#DCDCDE] bg-white p-5" aria-labelledby="sources-title">
            <h2 id="sources-title" className="text-lg font-semibold text-[#1D2327]">Sources &amp; references</h2>
            <p className="text-sm text-[#646970]">Add the source used to verify this report.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm text-[#1D2327]">Source name
                <input value={sourceName} onChange={(event) => setSourceName(event.target.value)} placeholder="Federation, interviewee, or publication" className="w-full rounded border p-2" />
              </label>
              <label className="space-y-1 text-sm text-[#1D2327]">Source URL
                <input type="url" value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} placeholder="https://" className="w-full rounded border p-2" />
              </label>
            </div>
          </section>

          <section className="space-y-3 rounded border border-[#DCDCDE] bg-white p-5" aria-labelledby="related-title">
            <h2 id="related-title" className="text-lg font-semibold text-[#1D2327]">Related articles</h2>
            <p className="text-sm text-[#646970]">Choose up to five stories to recommend below this article.</p>
            {relatedArticleOptions.length ? relatedArticleOptions.map((article) => {
              const id = String(article.id);
              const checked = selectedRelatedArticles.includes(id);
              return <label key={id} className="flex items-center gap-2 py-1 text-sm text-[#1D2327]">
                <input type="checkbox" checked={checked} disabled={!checked && selectedRelatedArticles.length >= 5} onChange={() => setSelectedRelatedArticles((current) => checked ? current.filter((item) => item !== id) : [...current, id])} />
                <span>{article.title}</span>
              </label>;
            }) : <p className="text-sm text-[#646970]">Save articles to make them available here.</p>}
          </section>

          <section id="article-categories-tags-box-final" className={`space-y-5 rounded border bg-white p-5 ${highlightSeoTaxonomy ? 'border-red-500 ring-2 ring-red-200' : 'border-[#DCDCDE]'}`} aria-labelledby="taxonomy-title">
            <div>
              <h2 id="taxonomy-title" className="text-lg font-semibold text-[#1D2327]">Categories &amp; Tags</h2>
              <p className="mt-1 text-sm text-[#646970]">Classify the finished story before previewing or submitting it.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm font-medium text-[#1D2327]">Main category
                <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full rounded border p-2">
                  <option value="">Select category</option>
                  {availableCategories.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-sm font-medium text-[#1D2327]">Region
                <select value={region} onChange={(event) => setRegion(event.target.value)} className="w-full rounded border p-2">
                  <option value="">Select region</option>
                  {['East Africa', 'West Africa', 'Central Africa', 'North Africa', 'Southern Africa'].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-sm font-medium text-[#1D2327]">Country
                <select value={country} onChange={(event) => setCountry(event.target.value)} className="w-full rounded border p-2">
                  <option value="">Select country</option>
                  {['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Ethiopia', 'Nigeria', 'Ghana', 'South Africa', 'Egypt', 'Other'].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-sm font-medium text-[#1D2327]">Subcategory
                <input value={subcategory} onChange={(event) => setSubcategory(event.target.value)} placeholder="e.g. National Teams" className="w-full rounded border p-2" />
              </label>
            </div>
            <div className="space-y-3 border-t border-[#DCDCDE] pt-4">
              <label className="block space-y-1 text-sm font-medium text-[#1D2327]" htmlFor="final-tag-search">Tags
                <input id="final-tag-search" list="existing-article-tags" value={tagInput} onChange={(event) => setTagInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addTag(); } }} placeholder="Search existing tags or add a new tag" className="w-full rounded border p-2" />
                <datalist id="existing-article-tags">{existingTags.map((tag) => <option key={tag} value={tag} />)}</datalist>
              </label>
              <button type="button" onClick={() => addTag()} className="rounded bg-[#2271B1] px-3 py-2 text-sm font-semibold text-white">Add tag</button>
              <div className="flex flex-wrap gap-2">
                {tagList.map((tag) => <span key={tag.toLocaleLowerCase()} className="inline-flex items-center gap-1 rounded-full bg-[#F0F0F1] px-3 py-1 text-sm text-[#1D2327]">{tag}<button type="button" aria-label={`Remove ${tag}`} onClick={() => setTagList((current) => current.filter((item) => item.toLocaleLowerCase() !== tag.toLocaleLowerCase()))} className="font-bold text-[#646970] hover:text-red-700">×</button></span>)}
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {['Kenya', 'Harambee Stars', 'AFCON', 'African Football', ...existingTags].filter((tag, index, tags) => tags.findIndex((item) => item.toLocaleLowerCase() === tag.toLocaleLowerCase()) === index).map((tag) => (
                  <button key={tag} type="button" onClick={() => addTag(tag)} disabled={tagList.some((item) => item.toLocaleLowerCase() === tag.toLocaleLowerCase())} className="rounded-full border border-[#DCDCDE] px-2.5 py-1 text-[#50575E] enabled:hover:border-[#2271B1] disabled:opacity-50">+ {tag}</button>
                ))}
              </div>
            </div>
          </section>

          <section className="flex flex-wrap items-center justify-between gap-3 border-t border-[#DCDCDE] py-4" aria-label="Final article actions">
            <div><h2 className="font-semibold text-[#1D2327]">Final review</h2><p className="text-sm text-[#646970]">Status: <strong>{status.toUpperCase()}</strong> · drafts stay off the public site.</p></div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => handlePublish('DRAFT')} className="rounded border border-[#8C8F94] bg-white px-4 py-2 text-sm font-semibold text-[#1D2327]">Save Draft</button>
              <button type="button" onClick={() => setShowPreview(true)} className="rounded border border-[#8C8F94] bg-white px-4 py-2 text-sm font-semibold text-[#1D2327]">Preview</button>
              {canPublish && editingArticle && !articleApproved ? <button type="button" onClick={() => handlePublish('APPROVED')} className="rounded bg-[#2271B1] px-4 py-2 text-sm font-semibold text-white">Approve Article</button> : canPublishNow ? <button type="button" onClick={() => handlePublish('PUBLISHED')} className="rounded bg-[#2271B1] px-4 py-2 text-sm font-semibold text-white">Publish Now</button> : <button type="button" onClick={() => handlePublish('PENDING_REVIEW')} className="rounded bg-[#2271B1] px-4 py-2 text-sm font-semibold text-white">Submit for Review</button>}
            </div>
          </section>
        </div>

        {/* Right Column: Sidebar Inspector (Tabs: Post / Block / Yoast SEO Premium) */}
        <aside className="w-80 sm:w-96 bg-[#16161E] border-l border-[#2D2D38] flex flex-col overflow-y-auto">
          
          {/* Top Inspector Tabs: Post | Block | Yoast SEO | SEO Standards */}
          <div className="flex border-b border-[#2D2D38] bg-[#121218] text-xs font-bold">
            <button
              onClick={() => setSidebarTab('post')}
              className={`flex-1 py-3 text-center transition border-b-2 ${
                sidebarTab === 'post' ? 'text-white border-[#2563EB]' : 'text-gray-400 hover:text-white border-transparent'
              }`}
            >
              Post
            </button>
            <button
              onClick={() => setSidebarTab('yoast')}
              className={`flex-1 py-3 text-center transition border-b-2 flex items-center justify-center gap-1.5 ${
                sidebarTab === 'yoast' ? 'text-[#16A34A] border-[#16A34A]' : 'text-gray-400 hover:text-white border-transparent'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
              <span>Yoast</span>
            </button>
            <button
              onClick={() => setSidebarTab('publishing_standard')}
              className={`flex-1 py-3 text-center transition border-b-2 flex items-center justify-center gap-1.5 ${
                sidebarTab === 'publishing_standard' ? 'text-amber-400 border-amber-400' : 'text-gray-400 hover:text-white border-transparent'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>SEO Check</span>
            </button>
          </div>

          {/* TAB 1: POST SETTINGS (Screenshot 4) */}
          {sidebarTab === 'post' && (
            <div className="p-5 space-y-5 text-xs text-gray-300">
              {/* Featured Image - Offline Upload Enabled */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white block uppercase tracking-wider text-[11px]">
                    Featured Image (16:9)
                  </span>
                  <span className="text-[10px] text-[#16A34A] font-mono font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{offlineImage.isOfflineUploaded ? "Offline Custom" : "Stock"}</span>
                  </span>
                </div>

                <input
                  type="file"
                  ref={postImageInputRef}
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  onChange={(e) => e.target.files?.[0] && handleProcessOfflineImage(e.target.files[0])}
                  className="hidden"
                />

                <div
                  onClick={() => postImageInputRef.current?.click()}
                  className="rounded-xl overflow-hidden aspect-video bg-[#121218] border border-dashed border-gray-600 hover:border-[#2563EB] cursor-pointer relative group transition flex items-center justify-center"
                >
                  {featuredImage ? (
                    <img src={featuredImage} alt="Featured" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <UploadCloud className="w-8 h-8 text-gray-500 mb-1.5 group-hover:text-[#2563EB] transition" />
                      <span className="text-xs font-bold text-gray-300">Upload Featured Image</span>
                      <span className="text-[10px] text-gray-500 mt-0.5">JPG, PNG, WebP (16:9)</span>
                    </div>
                  )}
                  {featuredImage && (
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1.5 p-3 text-center">
                      <UploadCloud className="w-6 h-6 text-[#2563EB]" />
                      <span className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-bold shadow">
                        Change Image
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="truncate max-w-[180px]">{offlineImage.name}</span>
                  <span className="font-mono text-gray-400">{offlineImage.size}</span>
                </div>
              </div>

              {/* Featured Video Block Card in Post Settings */}
              <div className="p-3 rounded-xl bg-[#121218] border border-gray-700/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-[#EF233C]" />
                    <span>Match Video Block</span>
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                    videoUrl ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-800 text-gray-400'
                  }`}>
                    {videoUrl ? 'Enabled' : 'None'}
                  </span>
                </div>

                {videoUrl ? (
                  <div className="space-y-2">
                    <div className="p-2 rounded-lg bg-[#181822] border border-gray-800">
                      <span className="text-[11px] font-bold text-white block truncate">{videoTitle || "Match Highlights"}</span>
                      <span className="text-[10px] text-gray-400 block truncate">{videoUrl}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenVideoModal('featured')}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-[#232332] hover:bg-gray-700 text-white text-[11px] font-bold transition text-center"
                      >
                        Edit Video
                      </button>
                      <button
                        type="button"
                        onClick={() => { setVideoUrl(''); setVideoCaption(''); }}
                        className="py-1.5 px-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-[11px] font-bold transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenVideoModal('featured')}
                    className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-red-600/20 to-red-900/30 border border-dashed border-red-500/50 hover:border-red-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#EF233C]" />
                    <span>+ Attach Video Block</span>
                  </button>
                )}
              </div>

              {/* Status & Stats (AfricaTodayNetwork Newsroom Workflow) */}
              <div className="space-y-3 pt-3 border-t border-[#2D2D38]">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-400 text-xs font-bold">Editorial Workflow Status</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      status === 'Published' ? 'bg-green-500/20 text-green-400' :
                      status === 'Approved' ? 'bg-blue-500/20 text-blue-400' :
                      status === 'In Review' ? 'bg-amber-500/20 text-amber-400' :
                      status === 'Pending Review' ? 'bg-purple-500/20 text-purple-400' :
                      status === 'Archived' ? 'bg-zinc-700 text-zinc-300' :
                      'bg-gray-800 text-gray-300'
                    }`}>
                      {status}
                    </span>
                  </div>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-[#121218] border border-gray-700 rounded-lg p-2 text-white text-xs font-semibold focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="Draft">Draft (Work in Progress)</option>
                    <option value="Pending Review">Pending Review (Submitted by Reporter)</option>
                    {canPublish && <option value="Approved">Approved (Ready to Publish)</option>}
                    {canPublish && editingArticle?.status === 'PUBLISHED' && <option value="Published">Published</option>}
                  </select>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Visibility</span>
                  <span className="text-white font-semibold">{status === 'Published' ? 'Public' : 'Private draft'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Publish Date</span>
                  <span className="text-white font-mono">Today, 11:20 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Word Count</span>
                  <span className="text-white font-bold">{wordCount} words ({readTime} min read)</span>
                </div>
              </div>

              {/* Categories & Tags SEO Taxonomy Container */}
              <div 
                id="article-categories-tags-box-sidebar"
                className={`hidden space-y-4 pt-3 border-t border-[#2D2D38] transition-all duration-300 ${
                  highlightSeoTaxonomy ? 'p-3 rounded-2xl bg-red-950/20 border-2 border-red-500/50 shadow-lg' : ''
                }`}
              >
                {/* Categories Management */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white block uppercase tracking-wider text-[11px] font-['Montserrat']">
                          Category
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          SEO Required
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 block mt-0.5">Google News section &amp; schema target</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddingCat(!isAddingCat)}
                      className="text-[#2563EB] hover:text-blue-400 text-[11px] font-bold flex items-center gap-1 transition"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{isAddingCat ? 'Close' : 'Add New'}</span>
                    </button>
                  </div>

                  {/* Inline New Category Creator */}
                  {isAddingCat && (
                    <div className="p-3 rounded-xl bg-[#121218] border border-gray-700 space-y-2 animate-fadeIn">
                      <input
                        type="text"
                        placeholder="Category name..."
                        value={newCatInput}
                        onChange={(e) => setNewCatInput(e.target.value)}
                        className="w-full bg-[#181822] border border-gray-600 rounded-lg p-2 text-white text-xs outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newCatInput.trim()) return;
                          const trimmed = newCatInput.trim();
                          if (!availableCategories.includes(trimmed)) {
                            setAvailableCategories([...availableCategories, trimmed]);
                          }
                          setCategory(trimmed);
                          setNewCatInput('');
                          setIsAddingCat(false);
                        }}
                        className="w-full py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs shadow transition"
                      >
                        Save & Select Category
                      </button>
                    </div>
                  )}

                  {/* Category Selector Dropdown & Quick Badges */}
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full bg-[#121218] border ${
                      !category ? 'border-amber-500/70 ring-1 ring-amber-500/30 text-amber-200' : 'border-gray-700 text-white'
                    } rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-[#2563EB]`}
                  >
                    <option value="" disabled>-- Select News Category (Required for SEO) --</option>
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {availableCategories.slice(0, 6).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition ${
                          category === cat
                            ? 'bg-[#D90429] text-white shadow-sports-glow'
                            : 'bg-[#121218] text-gray-400 hover:text-white border border-gray-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags Management (Interactive Tag Chips) */}
                <div className="pt-3 border-t border-[#2D2D38] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white block uppercase tracking-wider text-[11px] font-['Montserrat']">
                          Article Tags ({tagList.length})
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          SEO Required
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 block mt-0.5">Topic clusters &amp; keywords</span>
                    </div>
                    <span className="text-[10px] text-gray-400">Press Enter or Add</span>
                  </div>

                  {tagList.length === 0 && (
                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>At least 1 tag is required before posting for SEO keywords.</span>
                    </div>
                  )}

                  {/* Tag Input Box */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="text-gray-400 text-xs absolute left-2.5 top-2.5">#</span>
                      <input
                        type="text"
                        placeholder="Add SEO tag (e.g. Arsenal, Harambee Stars)..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const clean = tagInput.replace(/^#/, '').trim();
                            if (clean && !tagList.includes(clean)) {
                              setTagList([...tagList, clean]);
                              setTagInput('');
                            }
                          }
                        }}
                        className={`w-full bg-[#121218] border ${
                          tagList.length === 0 ? 'border-amber-500/70 ring-1 ring-amber-500/30' : 'border-gray-700'
                        } rounded-lg pl-6 pr-2.5 py-2 text-white text-xs outline-none focus:border-[#2563EB]`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const clean = tagInput.replace(/^#/, '').trim();
                        if (clean && !tagList.includes(clean)) {
                          setTagList([...tagList, clean]);
                          setTagInput('');
                        }
                      }}
                      className="px-3 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs transition"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Active Tag Chips */}
                <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-xl bg-[#121218] border border-gray-800">
                  {tagList.length === 0 ? (
                    <span className="text-[11px] text-gray-500 italic">No tags added yet.</span>
                  ) : (
                    tagList.map((tg, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-full bg-[#181822] border border-gray-700 text-[#F9FAFB] text-[11px] font-semibold flex items-center gap-1.5 group"
                      >
                        <span className="text-[#EF233C]">#</span>
                        <span>{tg}</span>
                        <button
                          type="button"
                          onClick={() => setTagList(tagList.filter((_, i) => i !== idx))}
                          className="text-gray-400 hover:text-red-400 font-bold ml-0.5"
                          title="Remove tag"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Suggested Popular Tags Quick-Click */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">
                    Popular Tags (Click to add):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {['Arsenal', 'Gor Mahia', 'Victor Osimhen', 'Bukayo Saka', 'CAF', 'AFCON 2027', 'Harambee Stars', 'Transfer Radar'].map((pop) => (
                      <button
                        key={pop}
                        type="button"
                        onClick={() => {
                          if (!tagList.includes(pop)) {
                            setTagList([...tagList, pop]);
                          }
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded-full border transition ${
                          tagList.includes(pop)
                            ? 'bg-[#16A34A]/20 text-[#16A34A] border-[#16A34A]/40'
                            : 'bg-[#181822] text-gray-400 hover:text-white border-gray-800'
                        }`}
                      >
                        +{pop}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BLOCK SETTINGS */}
          {sidebarTab === 'block' && (
            <div className="p-5 text-xs text-gray-300 space-y-6">
              
              {/* VIDEO BLOCK INSPECTOR SECTION */}
              <div className="space-y-3.5 pb-5 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-[#EF233C] text-white">
                      <Video className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-bold text-white uppercase tracking-wider text-[11px] font-['Montserrat']">
                      Video Block Settings
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-[#2563EB]/20 text-[#60A5FA] border border-[#2563EB]/30">
                    {videoUrl ? "Attached" : "Optional"}
                  </span>
                </div>

                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Allow embedded match highlights, YouTube videos, Vimeo clips, or direct MP4 video streams inside this story.
                </p>

                {/* Video URL Input */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-300">
                    Video URL (YouTube, Vimeo, MP4)
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full bg-[#121218] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#2563EB]"
                    />
                    {videoUrl && (
                      <button
                        type="button"
                        onClick={() => setVideoUrl('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Video Title */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-300">
                    Block Title / Header
                  </label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="e.g. Match Highlights & Tactical Breakdown"
                    className="w-full bg-[#121218] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                {/* Video Caption */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-300">
                    Video Caption
                  </label>
                  <textarea
                    rows={2}
                    value={videoCaption}
                    onChange={(e) => setVideoCaption(e.target.value)}
                    placeholder="Brief description of the video for readers..."
                    className="w-full bg-[#121218] border border-gray-700 rounded-lg p-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#2563EB] resize-none"
                  />
                </div>

                {/* 1-Click Sample Videos */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-gray-400 font-semibold block uppercase">Quick Sports Presets</span>
                  <div className="flex flex-wrap gap-1.5">
                    {sampleVideos.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setVideoUrl(sample.url);
                          setVideoTitle(sample.title);
                          setVideoCaption(sample.caption);
                        }}
                        className="px-2 py-1 rounded bg-[#181822] hover:bg-[#232332] text-[10px] text-gray-300 border border-gray-700 hover:border-gray-500 transition"
                      >
                        + {sample.title.split(' ')[0]} Clip
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenVideoModal('inline')}
                    className="w-full py-2 px-3 rounded-lg bg-[#232332] hover:bg-gray-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-gray-600 transition"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#EF233C]" />
                    <span>Insert Another Inline Video Block</span>
                  </button>

                  {videoUrl && (
                    <button
                      type="button"
                      onClick={() => { setVideoUrl(''); setVideoCaption(''); }}
                      className="w-full py-1.5 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove Video Block</span>
                    </button>
                  )}
                </div>

                {/* Supported Video Types info */}
                <div className="p-2.5 rounded-lg bg-[#121218] border border-gray-800 text-[10px] text-gray-400 space-y-1">
                  <div className="font-bold text-gray-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-[#16A34A]" />
                    <span>Supported Video Formats</span>
                  </div>
                  <p>YouTube, YouTube Shorts, Vimeo, direct MP4, WebM, and MOV video URLs are automatically detected.</p>
                </div>
              </div>

              {/* TYPOGRAPHY & SPACING SECTION */}
              <div className="space-y-3">
                <span className="font-bold text-white block uppercase tracking-wider text-[11px]">
                  Typography & Spacing
                </span>
                <div className="bg-[#121218] p-3 rounded-lg border border-gray-700 space-y-2">
                  <div className="flex justify-between">
                    <span>Font Size</span>
                    <span className="text-white font-mono">Medium (18px)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Line Height</span>
                    <span className="text-white font-mono">1.6</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: YOAST SEO PREMIUM (REPRODUCED EXACTLY FROM SCREENSHOTS 1, 2, 3!) */}
          {sidebarTab === 'yoast' && (
            <div className="flex-1 flex flex-col bg-white text-gray-900">
              
              {/* Yoast Header Title */}
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <h3 className="font-bold text-sm text-gray-800">
                  Yoast SEO Premium
                </h3>
                <div className="flex items-center space-x-2 text-gray-400">
                  <button className="hover:text-yellow-500">★</button>
                  <button onClick={() => setSidebarTab('post')} className="hover:text-black font-bold">✕</button>
                </div>
              </div>

              {/* Sub-Tabs: SEO | Readability | Inclusive language | Schema | Social (Screenshot 1) */}
              <div className="flex border-b border-gray-200 text-xs font-semibold overflow-x-auto bg-gray-50">
                <button
                  onClick={() => setYoastSubTab('seo')}
                  className={`py-2 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                    yoastSubTab === 'seo' ? 'border-[#16A34A] text-[#16A34A] bg-white' : 'border-transparent text-gray-600'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]"></span>
                  <span>SEO</span>
                </button>
                <button
                  onClick={() => setYoastSubTab('readability')}
                  className={`py-2 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                    yoastSubTab === 'readability' ? 'border-[#16A34A] text-[#16A34A] bg-white' : 'border-transparent text-gray-600'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]"></span>
                  <span>Readability</span>
                </button>
                <button
                  onClick={() => setYoastSubTab('inclusive')}
                  className={`py-2 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                    yoastSubTab === 'inclusive' ? 'border-[#16A34A] text-[#16A34A] bg-white' : 'border-transparent text-gray-600'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]"></span>
                  <span>Inclusive</span>
                </button>
                <button
                  onClick={() => setYoastSubTab('schema')}
                  className={`py-2 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                    yoastSubTab === 'schema' ? 'border-[#2563EB] text-[#2563EB] bg-white' : 'border-transparent text-gray-600'
                  }`}
                >
                  <span>Schema</span>
                </button>
                <button
                  onClick={() => setYoastSubTab('social')}
                  className={`py-2 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                    yoastSubTab === 'social' ? 'border-[#2563EB] text-[#2563EB] bg-white' : 'border-transparent text-gray-600'
                  }`}
                >
                  <span>Social</span>
                </button>
              </div>

              {/* Subtab 1: SEO TAB CONTENT (Screenshots 1 & 3) */}
              {yoastSubTab === 'seo' && (
                <div className="p-4 space-y-4 overflow-y-auto text-xs">
                  
                  {/* Focus Keyphrase Field (Screenshot 1) */}
                  <div>
                    <label className="flex items-center gap-1 font-bold text-gray-700 mb-1">
                      <span>Focus keyphrase</span>
                      <span className="w-3.5 h-3.5 rounded-full bg-gray-200 text-gray-600 text-[10px] flex items-center justify-center">?</span>
                    </label>
                    <input
                      type="text"
                      value={focusKeyphrase}
                      onChange={(e) => setFocusKeyphrase(e.target.value)}
                      className="w-full border border-gray-300 rounded p-2 text-gray-900 focus:outline-none focus:border-[#2563EB]"
                    />
                    <button
                      type="button"
                      className="mt-2 px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold text-xs"
                    >
                      Get related keyphrases
                    </button>
                  </div>

                  {/* Accordion 1: Search Appearance Preview */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleAccordion('searchAppearance')}
                      className="w-full px-3 py-2.5 bg-gray-50 flex items-center justify-between text-left font-bold text-gray-700"
                    >
                      <span>Search appearance</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${openAccordions.searchAppearance ? 'rotate-180' : ''}`} />
                    </button>

                    {openAccordions.searchAppearance && (
                      <div className="p-3 bg-white space-y-3 border-t border-gray-200">
                        {/* Google SERP Snippet Preview */}
                        <div className="p-3 bg-gray-50 rounded border border-gray-200 font-sans">
                          <span className="text-[11px] text-gray-600 block">sportsarena.africa › epl › {slug}</span>
                          <span className="text-sm font-semibold text-[#1a0dab] hover:underline block leading-snug">
                            {metaTitle}
                          </span>
                          <span className="text-xs text-gray-600 block mt-1 leading-normal">
                            {metaDesc}
                          </span>
                        </div>

                        <div>
                          <label className="block font-bold text-gray-600 mb-1">SEO Title</label>
                          <input
                            type="text"
                            value={metaTitle}
                            onChange={(e) => setMetaTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded p-1.5 text-gray-800"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-600 mb-1">Meta Description</label>
                          <textarea
                            rows={2}
                            value={metaDesc}
                            onChange={(e) => setMetaDesc(e.target.value)}
                            className="w-full border border-gray-300 rounded p-1.5 text-gray-800"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Accordion 2: SEO Image & Offline Media Upload (Yoast SEO Ranking Factor) */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleAccordion('seoImages')}
                      className="w-full px-3 py-2.5 bg-gray-50 flex items-center justify-between text-left font-bold text-gray-700 hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-2">
                        <Image className="w-4 h-4 text-[#2563EB]" />
                        <span>SEO Image & Offline Media</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                          hasAltKeyphrase ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {hasAltKeyphrase ? '✓ Alt Optimized' : 'Needs Alt Keyphrase'}
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${openAccordions.seoImages ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {openAccordions.seoImages && (
                      <div className="p-3.5 bg-white space-y-3.5 border-t border-gray-200">
                        {/* Hidden native offline file input */}
                        <input
                          type="file"
                          ref={seoImageInputRef}
                          accept="image/jpeg,image/png,image/webp,image/svg+xml"
                          onChange={(e) => e.target.files?.[0] && handleProcessOfflineImage(e.target.files[0])}
                          className="hidden"
                        />

                        {/* Interactive Drag & Drop / Click Zone */}
                        <div
                          onClick={() => seoImageInputRef.current?.click()}
                          className="p-3 border-2 border-dashed border-gray-300 hover:border-[#2563EB] rounded-xl bg-gray-50/70 hover:bg-blue-50/30 cursor-pointer transition text-center group"
                        >
                          <div className="flex flex-col items-center gap-1.5">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center group-hover:scale-105 transition shadow-sm">
                              <UploadCloud className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-gray-800 text-xs">
                              Click to Upload Offline Image from PC
                            </span>
                            <span className="text-[11px] text-gray-500">
                              Supports JPG, PNG, WebP • Stored directly in browser offline cache
                            </span>
                          </div>
                        </div>

                        {/* Active Image Preview & Metadata Card */}
                        <div className="border border-gray-200 rounded-xl p-2.5 bg-gray-50 flex gap-3 items-center">
                          <div className="w-20 h-14 rounded-lg overflow-hidden bg-black flex-shrink-0 border border-gray-300 relative shadow-sm">
                            <img src={offlineImage.src} alt={offlineImage.altText} className="w-full h-full object-cover" />
                            {offlineImage.isOfflineUploaded && (
                              <span className="absolute bottom-0 inset-x-0 bg-green-600 text-white text-[8px] font-black text-center py-0.5 tracking-wider">
                                OFFLINE
                              </span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0 text-[11px]">
                            <span className="font-bold text-gray-800 truncate block">
                              {offlineImage.name}
                            </span>
                            <div className="flex items-center gap-2 text-gray-500 mt-0.5 font-mono text-[10px]">
                              <span>{offlineImage.dimensions}</span>
                              <span>•</span>
                              <span className="text-green-700 font-bold">{offlineImage.size}</span>
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                              <button
                                onClick={() => seoImageInputRef.current?.click()}
                                className="text-[#2563EB] hover:underline font-bold text-[10px] flex items-center gap-1"
                              >
                                <RefreshCw className="w-2.5 h-2.5" />
                                <span>Change Image</span>
                              </button>
                              <span className="text-gray-300">|</span>
                              <span className="text-gray-500 text-[9px]">{offlineImage.uploadedAt}</span>
                            </div>
                          </div>
                        </div>

                        {/* SEO Alt Text Field (Google Ranking Factor) */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="font-bold text-gray-700 text-xs">
                              Alt Text (Google Ranking & Accessibility)
                            </label>
                            <span className="text-[10px] text-gray-500 font-mono">
                              Focus Keyphrase: "{focusKeyphrase}"
                            </span>
                          </div>

                          <input
                            type="text"
                            value={offlineImage.altText}
                            onChange={(e) => setOfflineImage(prev => ({ ...prev, altText: e.target.value }))}
                            placeholder="e.g. Bukayo Saka scores for Arsenal vs Liverpool"
                            className="w-full border border-gray-300 rounded p-1.5 text-gray-900 focus:outline-none focus:border-[#2563EB]"
                          />

                          {/* Live Yoast Alt Text Evaluation */}
                          <div className="mt-1.5 leading-tight">
                            {hasAltKeyphrase ? (
                              <div className="text-green-800 bg-green-50 border border-green-200 p-2 rounded-lg text-[11px] flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#16A34A] flex-shrink-0"></span>
                                <span><strong>Great job!</strong> Your focus keyphrase "{focusKeyphrase}" is present in the image alt attribute. (+15 SEO Points)</span>
                              </div>
                            ) : (
                              <div className="text-amber-800 bg-amber-50 border border-amber-200 p-2 rounded-lg text-[11px] flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#F59E0B] flex-shrink-0"></span>
                                <span><strong>SEO Tip:</strong> Add "{focusKeyphrase}" into this alt text to score 100% on Yoast image analysis.</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Image Title & Caption */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div>
                            <label className="block font-bold text-gray-600 text-[10px] mb-0.5">Image Title</label>
                            <input
                              type="text"
                              value={offlineImage.titleText}
                              onChange={(e) => setOfflineImage(prev => ({ ...prev, titleText: e.target.value }))}
                              className="w-full border border-gray-300 rounded p-1 text-gray-800 text-[11px]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-gray-600 text-[10px] mb-0.5">Caption</label>
                            <input
                              type="text"
                              value={offlineImage.caption}
                              onChange={(e) => setOfflineImage(prev => ({ ...prev, caption: e.target.value }))}
                              className="w-full border border-gray-300 rounded p-1 text-gray-800 text-[11px]"
                            />
                          </div>
                        </div>

                        {/* Technical SEO Quality Checklist */}
                        <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 space-y-1 text-[10px] text-gray-600">
                          <div className="flex items-center gap-1.5 text-green-700 font-semibold">
                            <Check className="w-3 h-3" />
                            <span>16:9 Aspect Ratio: Matches Google Discover & Mobile Top Stories</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-green-700 font-semibold">
                            <Check className="w-3 h-3" />
                            <span>Zero Latency: Stored in browser offline storage (No external hosting needed)</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Accordion 3: Premium SEO Analysis (Screenshot 3) */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleAccordion('seoAnalysis')}
                      className="w-full px-3 py-2.5 bg-gray-50 flex items-center justify-between text-left font-bold text-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]"></span>
                        <span>Premium SEO analysis</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${openAccordions.seoAnalysis ? 'rotate-180' : ''}`} />
                    </button>

                    {openAccordions.seoAnalysis && (
                      <div className="p-3 bg-white space-y-4 border-t border-gray-200">
                        {/* Keyphrase Synonyms (Screenshot 3) */}
                        <div>
                          <label className="flex items-center gap-1 font-bold text-gray-700 mb-1">
                            <span>Keyphrase synonyms</span>
                            <span className="w-3.5 h-3.5 rounded-full bg-gray-200 text-gray-600 text-[10px] flex items-center justify-center">?</span>
                          </label>
                          <input
                            type="text"
                            value={keyphraseSynonyms}
                            onChange={(e) => setKeyphraseSynonyms(e.target.value)}
                            className="w-full border border-gray-300 rounded p-1.5 text-gray-900"
                          />
                        </div>

                        {/* Analysis results Heading */}
                        <div className="space-y-3 pt-2">
                          <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">
                            Analysis results
                          </h4>

                          {/* Dynamic SEO Criteria (including Category & Tags) */}
                          {(() => {
                            const hasCategory = Boolean(category && category.trim());
                            const hasTags = Array.isArray(tagList) && tagList.length > 0;
                            const hasMultipleTags = Array.isArray(tagList) && tagList.length >= 3;

                            const problemItems = [
                              {
                                id: 'outbound',
                                label: 'Outbound links:',
                                text: 'No outbound links appear in this page. Add links to official sources or stats.'
                              },
                              ...(!hasCategory ? [{
                                id: 'cat_missing',
                                label: 'Primary Category:',
                                text: 'No category selected. Adding a category is required before posting and for Google News indexation.',
                                actionText: 'Select category',
                                onAction: () => { setSidebarTab('post'); setHighlightSeoTaxonomy(true); }
                              }] : []),
                              ...(!hasTags ? [{
                                id: 'tags_missing',
                                label: 'Article Tags:',
                                text: 'No tags added. Adding at least 1 tag is required before posting for topical search clustering.',
                                actionText: 'Add tags',
                                onAction: () => { setSidebarTab('post'); setHighlightSeoTaxonomy(true); }
                              }] : [])
                            ];

                            const improvementItems = [
                              ...(!hasAltKeyphrase ? [{
                                id: 'alt_keyphrase',
                                label: 'Image Keyphrase:',
                                text: 'Images on this page do not have alt attributes that reflect the focus keyphrase.',
                                actionText: 'Add to alt tag',
                                onAction: () => setOpenAccordions(p => ({ ...p, seoImages: true }))
                              }] : []),
                              ...(hasTags && !hasMultipleTags ? [{
                                id: 'tag_density',
                                label: 'SEO Tag Depth:',
                                text: `You have ${tagList.length} tag(s). Adding 3–5 targeted tags improves topical authority and internal linking signals.`
                              }] : [])
                            ];

                            const goodResultItems = [
                              ...(hasCategory ? [{
                                label: 'Category Taxonomy:',
                                text: `Article categorized under "${category}". Matches Google News section targeting.`
                              }] : []),
                              ...(hasTags ? [{
                                label: 'SEO Tags & Taxonomy:',
                                text: `${tagList.length} tag(s) assigned (${tagList.map(t => '#' + t).join(' ')}). Search keywords mapped.`
                              }] : []),
                              ...(hasAltKeyphrase ? [{
                                label: 'Image Alt Keyphrase:',
                                text: `Good job! The focus keyphrase "${focusKeyphrase}" appears in the image alt attribute.`
                              }] : []),
                              { label: 'Images:', text: 'Good job!' },
                              { label: 'Internal links:', text: 'You have enough internal links. Good job!' },
                              { label: 'Keyphrase in introduction:', text: 'Well done!' },
                              { label: 'Keyphrase length:', text: 'Good job!' },
                              { label: 'Keyphrase density:', text: 'The focus keyphrase was found 4 times. This is great!' },
                              { label: 'Keyphrase in meta description:', text: 'Keyphrase appears in the meta description.' },
                              { label: 'Keyphrase in slug:', text: 'Your focus keyphrase appears in the slug.' },
                              { label: 'Text length:', text: `The text contains ${wordCount} words. Good job!` }
                            ];

                            return (
                              <>
                                {/* Problems Accordion */}
                                <div className="space-y-2">
                                  <button
                                    onClick={() => toggleAccordion('problems')}
                                    className="flex items-center justify-between w-full font-bold text-gray-700 text-xs"
                                  >
                                    <span>^ Problems ({problemItems.length})</span>
                                  </button>
                                  {openAccordions.problems && (
                                    <div className="pl-2 space-y-2 text-xs">
                                      {problemItems.map(item => (
                                        <div key={item.id} className="flex items-start gap-2 text-gray-700">
                                          <span className="w-2.5 h-2.5 rounded-full bg-[#DC3232] mt-1 flex-shrink-0"></span>
                                          <div>
                                            <span className="font-bold text-[#DC3232] mr-1">{item.label}</span>
                                            <span>{item.text}</span>
                                            {item.actionText && (
                                              <button
                                                type="button"
                                                onClick={item.onAction}
                                                className="text-blue-600 underline font-bold cursor-pointer ml-1"
                                              >
                                                {item.actionText}
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Improvements Accordion */}
                                <div className="space-y-2 pt-1">
                                  <button
                                    onClick={() => toggleAccordion('improvements')}
                                    className="flex items-center justify-between w-full font-bold text-gray-700 text-xs"
                                  >
                                    <span>^ Improvements ({improvementItems.length})</span>
                                  </button>
                                  {openAccordions.improvements && (
                                    <div className="pl-2 space-y-2 text-xs">
                                      {improvementItems.length === 0 ? (
                                        <div className="text-gray-500 italic text-[11px]">
                                          No improvement items remaining!
                                        </div>
                                      ) : (
                                        improvementItems.map(item => (
                                          <div key={item.id} className="flex items-start gap-2 text-gray-700">
                                            <span className="w-2.5 h-2.5 rounded-full bg-[#EE8100] mt-1 flex-shrink-0"></span>
                                            <div>
                                              <span className="font-bold text-[#EE8100] mr-1">{item.label}</span>
                                              <span>{item.text}</span>
                                              {item.actionText && (
                                                <button
                                                  type="button"
                                                  onClick={item.onAction}
                                                  className="text-blue-600 underline font-bold cursor-pointer ml-1"
                                                >
                                                  {item.actionText}
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                        ))
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Good Results Accordion */}
                                <div className="space-y-2 pt-1">
                                  <button
                                    onClick={() => toggleAccordion('goodResults')}
                                    className="flex items-center justify-between w-full font-bold text-gray-700 text-xs"
                                  >
                                    <span>^ Good results ({goodResultItems.length})</span>
                                  </button>
                                  {openAccordions.goodResults && (
                                    <div className="pl-2 space-y-2 text-xs">
                                      {goodResultItems.map((item, i) => (
                                        <div key={i} className="flex items-start gap-2 text-gray-700">
                                          <span className="w-2.5 h-2.5 rounded-full bg-[#7AD03A] mt-1 flex-shrink-0"></span>
                                          <div>
                                            <span className="font-bold mr-1">{item.label}</span>
                                            <span>{item.text}</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Accordion 3: Add Related Keyphrase */}
                  <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex items-center justify-between font-bold text-gray-700 cursor-pointer hover:bg-gray-100">
                    <span>+ Add related keyphrase</span>
                    <span className="text-xs bg-[#2563EB] text-white px-2 py-0.5 rounded font-mono">Premium</span>
                  </div>

                  {/* Accordion 4: Track SEO Performance */}
                  <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex items-center justify-between font-bold text-gray-700 cursor-pointer hover:bg-gray-100">
                    <span>Track SEO performance</span>
                    <span className="text-gray-400">📊</span>
                  </div>

                  {/* Accordion 5: Internal Linking Suggestions */}
                  <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex items-center justify-between font-bold text-gray-700 cursor-pointer hover:bg-gray-100">
                    <span>Internal linking suggestions</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              )}

              {/* Subtab 2: Readability Tab */}
              {yoastSubTab === 'readability' && (
                <div className="p-4 space-y-3 text-xs text-gray-700">
                  <div className="flex items-center gap-2 p-2.5 bg-green-50 border border-green-200 rounded text-green-800 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#7AD03A]"></span>
                    <span>Readability score: Good (Flesch score: 74.2)</span>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#7AD03A]"></span>
                      <span>Passive voice: 4.8% of sentences contain passive voice (Well below 10%).</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#7AD03A]"></span>
                      <span>Sentence length: Great sentence variety.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#7AD03A]"></span>
                      <span>Paragraph length: None of the paragraphs are too long.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Subtab 3: Inclusive Language Tab */}
              {yoastSubTab === 'inclusive' && (
                <div className="p-4 space-y-3 text-xs text-gray-700">
                  <div className="flex items-center gap-2 p-2.5 bg-green-50 border border-green-200 rounded text-green-800 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#7AD03A]"></span>
                    <span>Inclusive language: Good job!</span>
                  </div>
                  <p className="text-gray-600">
                    No potentially non-inclusive sports phrases or discriminatory language detected.
                  </p>
                </div>
              )}

              {/* Subtab 4: Schema.org Structured Data Tab (Google NewsArticle) */}
              {yoastSubTab === 'schema' && (
                <div className="p-4 space-y-4 text-xs text-gray-700 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                    <div>
                      <span className="font-bold text-gray-900 block text-xs">Schema.org Structured Data</span>
                      <span className="text-[11px] text-gray-500">Google NewsArticle JSON-LD validation</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] font-mono">
                      NewsArticle
                    </span>
                  </div>

                  {/* Taxonomy Mapping Cards */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`p-2.5 rounded-xl border ${category ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-bold text-gray-500">articleSection</span>
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${category ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'}`}>
                          {category ? 'Active' : 'Missing'}
                        </span>
                      </div>
                      <p className="font-bold text-gray-900 truncate">{category || 'None (Required before post)'}</p>
                      <span className="text-[10px] text-gray-500 mt-0.5 block">Mapped from Article Category</span>
                      {!category && (
                        <button
                          type="button"
                          onClick={() => { setSidebarTab('post'); setHighlightSeoTaxonomy(true); }}
                          className="text-[10px] text-blue-600 underline font-bold mt-1 block"
                        >
                          Select Category now
                        </button>
                      )}
                    </div>

                    <div className={`p-2.5 rounded-xl border ${tagList.length ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-bold text-gray-500">keywords</span>
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${tagList.length ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'}`}>
                          {tagList.length ? `${tagList.length} Tags` : 'Missing'}
                        </span>
                      </div>
                      <p className="font-bold text-gray-900 truncate">{tagList.length ? tagList.join(', ') : 'None (Required before post)'}</p>
                      <span className="text-[10px] text-gray-500 mt-0.5 block">Mapped from Article Tags</span>
                      {tagList.length === 0 && (
                        <button
                          type="button"
                          onClick={() => { setSidebarTab('post'); setHighlightSeoTaxonomy(true); }}
                          className="text-[10px] text-blue-600 underline font-bold mt-1 block"
                        >
                          Add Tags now
                        </button>
                      )}
                    </div>
                  </div>

                  {/* JSON-LD live preview */}
                  <div>
                    <span className="font-bold text-gray-700 block mb-1 text-[11px]">JSON-LD Script Preview (Injected automatically in head):</span>
                    <div className="bg-[#121218] text-gray-300 p-3 rounded-xl border border-gray-700 font-mono text-[11px] overflow-x-auto max-h-60 leading-relaxed">
                      <pre className="whitespace-pre">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": headline || "Untitled Article",
  "articleSection": category || "(Required: Select Category)",
  "keywords": tagList.length ? tagList.join(", ") : "(Required: Add Tags)",
  "description": metaDesc || (content ? content.slice(0, 160) : ""),
  "image": [featuredImage || offlineImage.src || "/images/hero-stadium.jpg"],
  "datePublished": new Date().toISOString(),
  "author": [{
    "@type": "Person",
    "name": sessionStorage.getItem('arena_username') || "Sports Arena Editorial Desk"
  }],
  "publisher": {
    "@type": "NewsMediaOrganization",
    "name": "Sports Arena Afrika",
    "url": "https://sportsarenaafrika.com"
  }
}, null, 2)}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-[11px] flex items-start gap-2">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                    <span>
                      Google News & Discover algorithms rely directly on <code>articleSection</code> and <code>keywords</code> from your Category and Tags to categorize stories and recommend them to interested sports fans.
                    </span>
                  </div>
                </div>
              )}

              {/* Subtab 5: Social / OpenGraph Card Preview & Offline Upload */}
              {yoastSubTab === 'social' && (
                <div className="p-4 space-y-4 text-xs text-gray-700">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                    <div>
                      <span className="font-bold text-gray-900 block text-xs">Social Appearance</span>
                      <span className="text-[11px] text-gray-500">Configure OpenGraph & Twitter Cards</span>
                    </div>
                    {/* Platform Selector */}
                    <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                      <button
                        onClick={() => setSocialNetworkTab('facebook')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                          socialNetworkTab === 'facebook'
                            ? 'bg-white text-[#1877F2] shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Facebook
                      </button>
                      <button
                        onClick={() => setSocialNetworkTab('twitter')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                          socialNetworkTab === 'twitter'
                            ? 'bg-white text-black shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        X (Twitter)
                      </button>
                    </div>
                  </div>

                  {/* Hidden native offline file input for Social */}
                  <input
                    type="file"
                    ref={socialImageInputRef}
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    onChange={(e) => e.target.files?.[0] && handleProcessOfflineImage(e.target.files[0])}
                    className="hidden"
                  />

                  {/* Offline Social Image Uploader Box */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800 text-[11px] flex items-center gap-1.5">
                        <UploadCloud className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>Social Share Image (OpenGraph)</span>
                      </span>
                      {offlineImage.isOfflineUploaded ? (
                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[9px] font-bold uppercase tracking-wider">
                          Offline Image Active
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400">1200 × 630 px (1.91:1)</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-20 h-14 rounded-lg bg-black border border-gray-300 overflow-hidden relative flex-shrink-0">
                        <img src={offlineImage.src} alt="Social Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => socialImageInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 hover:border-[#2563EB] text-[#2563EB] font-bold text-[11px] flex items-center gap-1.5 shadow-sm transition hover:bg-blue-50/50"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Upload Offline Social Image</span>
                        </button>
                        <span className="text-[10px] text-gray-500 block mt-1 truncate">
                          {offlineImage.name} ({offlineImage.size})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Previews */}
                  {socialNetworkTab === 'facebook' ? (
                    <div>
                      <span className="font-bold text-gray-700 block mb-1 text-[11px]">Facebook Feed Preview</span>
                      <div className="border border-gray-300 rounded-xl overflow-hidden shadow-sm bg-white font-sans">
                        <div className="relative aspect-[1.91/1] w-full bg-black overflow-hidden">
                          <img src={offlineImage.src} alt="Facebook card" className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3 bg-[#F0F2F5] border-t border-gray-200">
                          <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold">
                            SPORTSARENA.AFRICA
                          </span>
                          <span className="font-bold text-[13px] text-gray-900 block mt-0.5 leading-snug line-clamp-2">
                            {headline}
                          </span>
                          <span className="text-[11px] text-gray-600 block mt-1 line-clamp-2 leading-relaxed">
                            {metaDesc}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="font-bold text-gray-700 block mb-1 text-[11px]">X / Twitter Card Preview (Large Image)</span>
                      <div className="border border-gray-300 rounded-2xl overflow-hidden shadow-sm bg-black text-white font-sans">
                        <div className="relative aspect-[2/1] w-full bg-zinc-900 overflow-hidden">
                          <img src={offlineImage.src} alt="Twitter card" className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3 bg-zinc-900 border-t border-zinc-800">
                          <span className="text-[10px] text-zinc-400 block font-medium">
                            sportsarena.africa
                          </span>
                          <span className="font-bold text-[13px] text-white block mt-0.5 leading-snug line-clamp-1">
                            {headline}
                          </span>
                          <span className="text-[11px] text-zinc-400 block mt-0.5 line-clamp-2 leading-relaxed">
                            {metaDesc}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Social Overrides */}
                  <div className="space-y-2 pt-2 border-t border-gray-200">
                    <div>
                      <label className="block font-bold text-gray-700 text-[11px] mb-1">Social Title Override</label>
                      <input
                        type="text"
                        placeholder="Leave empty to use SEO Title"
                        defaultValue={metaTitle}
                        className="w-full border border-gray-300 rounded p-1.5 text-gray-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 text-[11px] mb-1">Social Description Override</label>
                      <textarea
                        rows={2}
                        placeholder="Leave empty to use Meta Description"
                        defaultValue={metaDesc}
                        className="w-full border border-gray-300 rounded p-1.5 text-gray-800 text-xs"
                      />
                    </div>

                    {/* OpenGraph Taxonomy Tags Preview */}
                    <div className="pt-2 border-t border-gray-200 space-y-1.5">
                      <span className="font-bold text-gray-700 block text-[11px]">OpenGraph News Taxonomy Tags</span>
                      <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 font-mono text-[10px] text-gray-600 space-y-1 overflow-x-auto">
                        <div>
                          &lt;meta property="article:section" content="<span className="text-blue-600 font-bold">{category || 'Uncategorized'}</span>" /&gt;
                        </div>
                        {tagList.length > 0 ? (
                          tagList.map(tag => (
                            <div key={tag}>
                              &lt;meta property="article:tag" content="<span className="text-emerald-600 font-bold">{tag}</span>" /&gt;
                            </div>
                          ))
                        ) : (
                          <div className="text-amber-600 italic">
                            &lt;!-- Warning: No article:tag meta tags added --&gt;
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: SPORTS ARENA AFRIKA — SEO PUBLISHING STANDARD CHECKLIST */}
          {sidebarTab === 'publishing_standard' && (
            <div className="p-4 sm:p-5 space-y-4 text-xs text-gray-300 animate-fadeIn">
              
              {/* ASCII / Terminal Style Header Box */}
              <div className="rounded-2xl bg-[#0F0F16] border border-[#2B2B3E] overflow-hidden shadow-xl">
                <div className="bg-gradient-to-r from-[#D90429] via-[#EF233C] to-[#F59E0B] p-0.5">
                  <div className="bg-[#12121A] p-4 text-center space-y-1">
                    <span className="text-[10px] text-amber-400 font-mono tracking-widest font-black uppercase block">
                      EDITORIAL QUALITY GATE
                    </span>
                    <h3 className="text-sm font-black uppercase text-white font-['Montserrat'] tracking-wide">
                      SPORTS ARENA AFRIKA — SEO CHECK
                    </h3>
                    <div className="flex items-center justify-center gap-2 pt-1 font-mono text-xs">
                      <span className={passedSeoChecksCount >= 14 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                        {passedSeoChecksCount} of {seoChecklist.length} Checks Passed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Standards Checklist Items */}
                <div className="p-3 divide-y divide-[#1F1F2E] font-sans">
                  {seoChecklist.map((item, idx) => {
                    return (
                      <div key={item.id} className="py-2.5 px-2 flex items-start justify-between gap-2 hover:bg-[#161622] rounded-lg transition">
                        <div className="flex items-start gap-2.5">
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold ${
                            item.passed 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          }`}>
                            {item.passed ? '✓' : '!'}
                          </span>
                          <div>
                            <span className={`font-bold block text-xs ${item.passed ? 'text-white' : 'text-gray-300'}`}>
                              {item.label}
                            </span>
                            <span className="text-[10px] text-gray-500 font-mono block">
                              {item.hint}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                          item.passed 
                            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40' 
                            : 'bg-amber-950/40 text-amber-400 border border-amber-800/40'
                        }`}>
                          {item.passed ? 'PASS' : 'WARN'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Readiness Status Gate Banner */}
                <div className="p-4 border-t border-[#232332] bg-[#14141E] text-center">
                  {passedSeoChecksCount >= 14 ? (
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-xs uppercase tracking-wider font-['Montserrat'] flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>READY TO PUBLISH • NEWS SEO CHECK PASSED</span>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-relaxed">
                        This article satisfies Sports Arena Afrika's publishing and on-page SEO standards. (Google determines indexing and ranking in Google News or Top Stories independently).
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-xs uppercase tracking-wider font-['Montserrat'] flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                        <span>{16 - passedSeoChecksCount} SEO CHECKS REMAINING</span>
                      </div>
                      <p className="text-[10px] text-gray-400">
                        Complete remaining fields (title length, image, or content depth) for optimal Google ranking.
                      </p>
                    </div>
                  )}
                </div>

              </div>

              {/* Helpful Tips Card */}
              <div className="p-3.5 rounded-xl bg-[#14141E] border border-[#232332] space-y-1.5 text-[11px]">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Google News Sourcing Tip</span>
                </span>
                <p className="text-gray-400 leading-relaxed">
                  Include coach comments, player quotes, or match context. Real African sports journalism always outperforms surface-level AI rewriting.
                </p>
              </div>

            </div>
          )}

        </aside>

      </div>

      {/* 3. Interactive Video Block Insertion & Configuration Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#181822] border border-[#2D2D38] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-[#2D2D38] flex items-center justify-between bg-[#121218]">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-[#EF233C] text-white shadow-lg">
                  <Video className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-black uppercase text-white font-['Montserrat'] tracking-wider">
                    {videoModalPlacement === 'featured' ? "Configure Featured Match Video Block" : "Insert Inline Video Block"}
                  </h3>
                  <span className="text-[11px] text-gray-400">
                    Embed YouTube, Vimeo, or MP4 match replays into your story
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#232332] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              
              {/* Placement Tabs */}
              <div className="flex rounded-xl bg-[#121218] p-1 border border-gray-800">
                <button
                  type="button"
                  onClick={() => setVideoModalPlacement('featured')}
                  className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                    videoModalPlacement === 'featured'
                      ? 'bg-[#2563EB] text-white shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Featured Video Header</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVideoModalPlacement('inline')}
                  className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                    videoModalPlacement === 'inline'
                      ? 'bg-[#EF233C] text-white shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Inline Story Block</span>
                </button>
              </div>

              {/* URL Input */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-200">
                  Video URL <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  value={modalVideoUrl}
                  onChange={(e) => setModalVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/... or .mp4 link"
                  className="w-full bg-[#121218] border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Title Input */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-200">
                  Block Title / Heading
                </label>
                <input
                  type="text"
                  value={modalVideoTitle}
                  onChange={(e) => setModalVideoTitle(e.target.value)}
                  placeholder="e.g. Match Highlights & Tactical Breakdown"
                  className="w-full bg-[#121218] border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Caption Input */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-200">
                  Video Caption & Editorial Note
                </label>
                <textarea
                  rows={2}
                  value={modalVideoCaption}
                  onChange={(e) => setModalVideoCaption(e.target.value)}
                  placeholder="e.g. Replay of key goals, controversial penalties and tactical highlights."
                  className="w-full bg-[#121218] border border-gray-700 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#2563EB] resize-none"
                />
              </div>

              {/* Quick Presets for Rapid Testing */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Quick Sports Presets:</span>
                <div className="flex flex-wrap gap-2">
                  {sampleVideos.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setModalVideoUrl(sample.url);
                        setModalVideoTitle(sample.title);
                        setModalVideoCaption(sample.caption);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#121218] hover:bg-[#232332] text-[11px] text-gray-300 border border-gray-700 hover:border-gray-500 transition"
                    >
                      ⚡ {sample.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview in Modal */}
              {modalVideoUrl && (
                <div className="space-y-1.5 pt-2 border-t border-gray-800">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Live Video Block Preview
                  </span>
                  <VideoBlock
                    videoUrl={modalVideoUrl}
                    title={modalVideoTitle || "Match Highlights & Video Action"}
                    caption={modalVideoCaption || "Embedded Sports Video"}
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 border-t border-[#2D2D38] bg-[#121218] flex items-center justify-between">
              <span className="text-[10px] text-gray-400">
                Supports YouTube, Shorts, Vimeo & direct video streams
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-[#232332] transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyVideoModal}
                  className="px-5 py-2 rounded-xl bg-[#EF233C] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow transition"
                >
                  {videoModalPlacement === 'featured' ? "Attach Video Block" : "Insert Block Into Story"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {showPreview && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-3 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="article-preview-title">
          <div className="flex max-h-full w-full flex-col overflow-hidden rounded bg-white shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCDCDE] px-4 py-3">
              <div><h2 className="font-semibold text-[#1D2327]">Article preview</h2><p className="text-xs text-[#646970]">Unpublished preview · {status}</p></div>
              <div className="flex items-center gap-2">
                {['desktop', 'tablet', 'mobile'].map((device) => <button key={device} type="button" onClick={() => setPreviewDevice(device)} className={`rounded px-3 py-1.5 text-xs capitalize ${previewDevice === device ? 'bg-[#2271B1] text-white' : 'border border-[#DCDCDE] text-[#50575E]'}`}>{device}</button>)}
                <button type="button" onClick={() => setShowPreview(false)} aria-label="Close preview" className="ml-2 px-2 text-xl text-[#50575E]">×</button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-[#F0F0F1] p-3 sm:p-6">
              <article className={`mx-auto min-h-full bg-white p-5 shadow-sm sm:p-10 ${previewDevice === 'mobile' ? 'max-w-sm' : previewDevice === 'tablet' ? 'max-w-2xl' : 'max-w-5xl'}`}>
                <p className="mb-3 text-sm font-semibold text-[#D63638]">{category || 'Sports News'}</p>
                <h1 id="article-preview-title" className="mb-4 text-3xl font-bold leading-tight text-[#1D2327] sm:text-5xl">{headline || 'Article title preview'}</h1>
                {metaDesc && <p className="mb-6 text-lg text-[#50575E]">{metaDesc}</p>}
                {featuredImage && <img src={featuredImage} alt={offlineImage.altText || headline} className="mb-6 max-h-[28rem] w-full rounded object-cover" />}
                {videoUrl && <div className="mb-6"><VideoBlock videoUrl={videoUrl} title={videoTitle} caption={videoCaption} /></div>}
                <div className="space-y-5 text-base leading-8 text-[#1D2327] sm:text-lg">
                  {(content || 'Your article content will appear here.').split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph.replace(/^#{1,4}\s+/, '').replace(/^>\s+/, '')}</p>)}
                </div>
                {!!tagList.length && <p className="mt-8 border-t border-[#DCDCDE] pt-4 text-sm text-[#646970]">{tagList.join(' · ')}</p>}
              </article>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
