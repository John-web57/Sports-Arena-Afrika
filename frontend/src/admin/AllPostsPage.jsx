import React, { useState, useMemo } from 'react';
import {
  FileText, Plus, Search, Filter, Trash2, Edit3, Eye, CheckCircle2,
  Clock, Flame, Star, AlertCircle, ArrowUpDown, ChevronRight, X, ExternalLink, Video
} from 'lucide-react';

export default function AllPostsPage({
  articles = [],
  onNavigateToWrite,
  onEditArticle,
  onPublishArticle,
  onDeleteArticle
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'PUBLISHED' | 'DRAFT' | 'BREAKING'
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'views' | 'title'
  const [previewArticle, setPreviewArticle] = useState(null);
  const [articleToDelete, setArticleToDelete] = useState(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set();
    articles.forEach(a => {
      const cat = a.categoryName || a.category;
      if (cat) set.add(cat);
    });
    return Array.from(set);
  }, [articles]);

  // Filter & Sort
  const filteredArticles = useMemo(() => {
    return articles.filter(a => {
      const term = searchQuery.toLowerCase().trim();
      const matchesSearch = !term ||
        (a.title && a.title.toLowerCase().includes(term)) ||
        (a.summary && a.summary.toLowerCase().includes(term)) ||
        (a.categoryName && a.categoryName.toLowerCase().includes(term)) ||
        (a.category && a.category.toLowerCase().includes(term)) ||
        (a.authorName && a.authorName.toLowerCase().includes(term));

      const artStatus = String(a.status || 'PUBLISHED').toUpperCase();
      let matchesStatus = true;
      if (statusFilter === 'PUBLISHED') matchesStatus = artStatus === 'PUBLISHED';
      else if (statusFilter === 'DRAFT') matchesStatus = artStatus !== 'PUBLISHED';
      else if (statusFilter === 'BREAKING') matchesStatus = Boolean(a.isBreaking);

      const matchesCat = categoryFilter === 'ALL' ||
        (a.categoryName === categoryFilter || a.category === categoryFilter);

      return matchesSearch && matchesStatus && matchesCat;
    }).sort((a, b) => {
      if (sortBy === 'newest') return (new Date(b.publishedAt || 0)) - (new Date(a.publishedAt || 0));
      if (sortBy === 'oldest') return (new Date(a.publishedAt || 0)) - (new Date(b.publishedAt || 0));
      if (sortBy === 'views') return (b.viewsCount || 0) - (a.viewsCount || 0);
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      return 0;
    });
  }, [articles, searchQuery, statusFilter, categoryFilter, sortBy]);

  const totalCount = articles.length;
  const publishedCount = articles.filter(a => String(a.status || 'PUBLISHED').toUpperCase() === 'PUBLISHED').length;
  const draftCount = articles.filter(a => String(a.status || '').toUpperCase() !== 'PUBLISHED').length;
  const breakingCount = articles.filter(a => a.isBreaking).length;

  const confirmDelete = () => {
    if (articleToDelete && onDeleteArticle) {
      onDeleteArticle(articleToDelete.id);
      setArticleToDelete(null);
    }
  };

  const handleDirectPublish = (article) => {
    if (String(article.status || '').toUpperCase() !== 'APPROVED') {
      alert('An editor must review and approve this article before it can be published.');
      if (onEditArticle) onEditArticle(article);
      return;
    }
    const hasCategory = Boolean(article.categoryName || article.category);
    const hasTags = Array.isArray(article.tags) && article.tags.length > 0;
    if (!hasCategory || !hasTags) {
      alert(`Cannot publish "${article.title}":\n\nCategories and tags are required for SEO before posting.\n${!hasCategory ? '• Missing News Category\n' : ''}${!hasTags ? '• Missing SEO Tags\n' : ''}\nPlease edit this story to assign categories and tags before publishing.`);
      if (onEditArticle) onEditArticle(article);
      return;
    }
    if (onPublishArticle) onPublishArticle(article.id);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 bg-[#0B0B0F] min-h-screen text-[#F9FAFB]">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#232332] gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#EF233C]">EDITORIAL CMS</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase mt-1">All Posts & Articles</h1>
          <p className="text-xs text-[#A1A1AA] mt-1">Manage, search, edit, and publish your sports news stories.</p>
        </div>
        <button
          onClick={onNavigateToWrite}
          className="px-5 py-2.5 rounded-xl bg-[#D90429] hover:bg-[#EF233C] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 transition self-start sm:self-auto shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#121218] border border-[#232332] rounded-xl p-4">
          <span className="text-[11px] font-bold text-[#A1A1AA] uppercase block">Total Articles</span>
          <span className="text-2xl font-black text-white mt-1 block">{totalCount}</span>
        </div>
        <div className="bg-[#121218] border border-[#232332] rounded-xl p-4">
          <span className="text-[11px] font-bold text-[#16A34A] uppercase block">Published Live</span>
          <span className="text-2xl font-black text-[#16A34A] mt-1 block">{publishedCount}</span>
        </div>
        <div className="bg-[#121218] border border-[#232332] rounded-xl p-4">
          <span className="text-[11px] font-bold text-[#EAB308] uppercase block">Unpublished In Workflow</span>
          <span className="text-2xl font-black text-[#EAB308] mt-1 block">{draftCount}</span>
        </div>
        <div className="bg-[#121218] border border-[#232332] rounded-xl p-4">
          <span className="text-[11px] font-bold text-[#EF233C] uppercase block">Breaking Stories</span>
          <span className="text-2xl font-black text-[#EF233C] mt-1 block">{breakingCount}</span>
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="bg-[#121218] border border-[#232332] rounded-2xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search articles by title, topic, author, excerpt..."
              className="w-full bg-[#181822] border border-[#232332] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#2563EB]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-[#181822] border border-[#232332] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#2563EB]"
            >
              <option value="ALL">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-[#181822] border border-[#232332] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#2563EB]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="views">Most Viewed</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Status Pill Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#232332] overflow-x-auto text-xs">
          {[
            { id: 'ALL', label: `All (${totalCount})` },
            { id: 'PUBLISHED', label: `Published (${publishedCount})` },
            { id: 'DRAFT', label: `Unpublished (${draftCount})` },
            { id: 'BREAKING', label: `Breaking (${breakingCount})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-[#181822] text-[#A1A1AA] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles List / Table */}
      <div className="bg-[#121218] border border-[#232332] rounded-2xl overflow-hidden shadow-xl">
        {filteredArticles.length === 0 ? (
          <div className="p-12 text-center text-[#A1A1AA] space-y-3">
            <FileText className="w-12 h-12 text-gray-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No articles found</h3>
            <p className="text-xs text-gray-500">Try adjusting your search query or filter settings.</p>
            <button
              onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); setCategoryFilter('ALL'); }}
              className="px-4 py-2 rounded-xl bg-[#181822] text-xs font-bold text-white border border-[#232332] hover:bg-[#20202E]"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#232332]">
            {filteredArticles.map(article => {
              const articleStatus = String(article.status || 'DRAFT').toUpperCase();
              const thumb = article.featuredImage || article.image || '/images/hero-stadium.jpg';
              return (
                <div
                  key={article.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#151520] transition group"
                >
                  {/* Left: Thumbnail & Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-[#232332] relative">
                      <img src={thumb} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      {article.isBreaking && (
                        <div className="absolute top-1 left-1 bg-[#EF233C] text-white p-0.5 rounded shadow">
                          <Flame className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#2563EB]/20 text-[#60A5FA] border border-[#2563EB]/30">
                          {article.categoryName || article.category || 'News'}
                        </span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          articleStatus !== 'PUBLISHED'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {articleStatus}
                        </span>
                        {article.isTopNews && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                            <Star className="w-2.5 h-2.5" /> Hero Story
                          </span>
                        )}
                        {(article.videoUrl || (article.content && /\[video:/i.test(article.content))) && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                            <Video className="w-2.5 h-2.5" /> Video Block
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white truncate max-w-2xl group-hover:text-[#60A5FA] transition">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[11px] text-[#A1A1AA] flex-wrap">
                        <span>By <strong className="text-gray-300">{article.authorName || article.author || 'Sports Arena Staff'}</strong></span>
                        <span>·</span>
                        <span>{article.viewsCount || article.views || 0} views</span>
                        <span>·</span>
                        <span>{article.readingTime || 3} min read</span>
                        {article.slug && (
                          <>
                            <span>·</span>
                            <span className="font-mono text-gray-500 truncate max-w-[150px]">/{article.slug}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                    <button
                      onClick={() => setPreviewArticle(article)}
                      className="p-2 rounded-xl bg-[#181822] text-[#A1A1AA] hover:text-white hover:bg-[#20202E] border border-[#232332] transition"
                      title="Quick Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {onEditArticle && (
                      <button
                        onClick={() => onEditArticle(article)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition shadow"
                        title="Edit Article"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    )}
                    {articleStatus === 'APPROVED' && onPublishArticle && (
                      <button
                        onClick={() => handleDirectPublish(article)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#16A34A] hover:bg-green-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition shadow"
                        title="Publish Article"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Publish</span>
                      </button>
                    )}
                    {onDeleteArticle && (
                      <button
                        onClick={() => setArticleToDelete(article)}
                        className="p-2 rounded-xl bg-[#181822] text-gray-500 hover:text-red-400 hover:bg-red-950/20 border border-[#232332] transition"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Preview Modal */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121218] border border-[#232332] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-[#232332] flex items-center justify-between bg-[#181822]">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Article Preview</span>
              <button onClick={() => setPreviewArticle(null)} className="p-1 rounded-lg text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              {/* 1. Title First */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-[#2563EB]/20 text-[#60A5FA]">
                    {previewArticle.categoryName || previewArticle.category || 'News'}
                  </span>
                  <span className="text-xs text-gray-400">By {previewArticle.authorName || previewArticle.author || 'Sports Arena Staff'}</span>
                  <span>·</span>
                  <span className="text-xs text-gray-400 font-mono">{previewArticle.readingTime || 3} min read</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">{previewArticle.title}</h2>
              </div>

              {/* 2. Followed by Image */}
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-[#232332]">
                <img
                  src={previewArticle.featuredImage || previewArticle.image || '/images/hero-stadium.jpg'}
                  alt={previewArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 3. Followed by Full Information */}
              {previewArticle.summary && (
                <p className="text-sm font-semibold text-gray-300 italic border-l-2 border-[#EF233C] pl-3">
                  {previewArticle.summary}
                </p>
              )}
              <div className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                {previewArticle.content}
              </div>
              {Array.isArray(previewArticle.tags) && previewArticle.tags.length > 0 && (
                <div className="pt-4 border-t border-[#232332] flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-500 font-bold">Tags:</span>
                  {previewArticle.tags.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-[#181822] border border-[#232332] text-gray-300">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-[#232332] flex items-center justify-end gap-3 bg-[#181822]">
              <button
                onClick={() => setPreviewArticle(null)}
                className="px-4 py-2 rounded-xl bg-[#121218] text-xs font-bold text-gray-400 hover:text-white border border-[#232332]"
              >
                Close Preview
              </button>
              {onEditArticle && (
                <button
                  onClick={() => {
                    const art = previewArticle;
                    setPreviewArticle(null);
                    onEditArticle(art);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#2563EB] text-xs font-bold text-white hover:bg-blue-600"
                >
                  Edit This Article
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {articleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121218] border border-red-900/40 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-500">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-black uppercase text-white">Delete Article?</h3>
            </div>
            <p className="text-xs text-gray-300">
              Are you sure you want to delete <strong className="text-white">"{articleToDelete.title}"</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setArticleToDelete(null)}
                className="px-4 py-2 rounded-xl bg-[#181822] text-xs font-bold text-gray-400 hover:text-white border border-[#232332]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-[#EF233C] text-xs font-bold text-white hover:bg-red-700 shadow"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
