import React, { useState, useMemo } from 'react';
import { 
  FileText, Eye, MessageSquare, TrendingUp, Plus, Bell, 
  CheckCircle2, Clock, Flame, FolderKanban, ArrowUpRight,
  Filter, Sparkles, Check
} from 'lucide-react';
import NotificationBroadcasterModal from './NotificationBroadcasterModal';

export default function AdminDashboard({ articles = [], onNavigateToWrite, onPublishArticle, onEditArticle }) {
  const [isBroadcasterOpen, setIsBroadcasterOpen] = useState(false);
  const [articleFilter, setArticleFilter] = useState('ALL'); // 'ALL' | 'PUBLISHED' | 'DRAFT' (unpublished)

  // Dynamic calculations directly from current articles store
  const drafts = useMemo(() => 
    articles.filter(a => String(a.status || '').toUpperCase() !== 'PUBLISHED'), 
    [articles]
  );

  const published = useMemo(() => 
    articles.filter(a => String(a.status || 'PUBLISHED').toUpperCase() === 'PUBLISHED'), 
    [articles]
  );

  const breakingCount = useMemo(() => 
    articles.filter(a => Boolean(a.isBreaking || a.breaking)).length, 
    [articles]
  );

  const topStoriesCount = useMemo(() => 
    articles.filter(a => Boolean(a.isTopNews || a.featured)).length, 
    [articles]
  );

  const totalViews = useMemo(() => 
    articles.reduce((acc, a) => acc + (Number(a.viewsCount || a.views) || 0), 0), 
    [articles]
  );

  const totalComments = useMemo(() => 
    articles.reduce((acc, a) => acc + (Number(a.commentsCount) || 0), 0), 
    [articles]
  );

  // Category distribution calculation
  const categoryCounts = useMemo(() => {
    const counts = {};
    articles.forEach(a => {
      const cat = a.categoryName || a.category || 'General Sports';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [articles]);

  // Filtered recent articles
  const displayedArticles = useMemo(() => {
    if (articleFilter === 'DRAFT') return drafts;
    if (articleFilter === 'PUBLISHED') return published;
    return articles;
  }, [articles, articleFilter, drafts, published]);

  return (
    <div className="p-6 sm:p-8 space-y-8 bg-[#0B0B0F] min-h-screen text-[#F9FAFB]">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#232332] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#EF233C]">
              SPORTS ARENA AFRIKA EDITORIAL NEWSROOM
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase mt-1 font-['Montserrat']">
            Editorial Command Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setIsBroadcasterOpen(true)} 
            className="px-4 py-2.5 rounded-xl bg-[#181822] hover:bg-[#232332] text-white border border-[#232332] text-xs font-black uppercase tracking-wider flex items-center gap-2 transition active:scale-95 shadow-md font-['Montserrat']"
          >
            <Bell className="w-4 h-4 text-[#EF233C]"/>
            <span>Broadcast Alert</span>
          </button>

          <button 
            type="button"
            onClick={onNavigateToWrite} 
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D90429] to-[#EF233C] hover:from-red-700 hover:to-red-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-sports-glow transition active:scale-95 font-['Montserrat']"
          >
            <Plus className="w-4 h-4"/>
            <span>Write New Story</span>
          </button>
        </div>
      </div>

      {/* Dynamic Key Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { 
            label: 'Total Articles', 
            value: articles.length, 
            sub: `${published.length} published • ${drafts.length} drafts`, 
            icon: FileText,
            color: 'text-white'
          },
          { 
            label: 'Drafts in Queue', 
            value: drafts.length, 
            sub: drafts.length > 0 ? 'Action required' : 'Queue cleared', 
            icon: Clock,
            color: drafts.length > 0 ? 'text-[#F59E0B]' : 'text-gray-400'
          },
          { 
            label: 'Breaking News', 
            value: breakingCount, 
            sub: 'Active ticker stories', 
            icon: Flame,
            color: 'text-[#EF233C]'
          },
          { 
            label: 'Top Featured', 
            value: topStoriesCount, 
            sub: 'Hero spotlight slots', 
            icon: TrendingUp,
            color: 'text-[#16A34A]'
          },
          { 
            label: 'Estimated Readers', 
            value: totalViews.toLocaleString(), 
            sub: 'All published articles', 
            icon: Eye,
            color: 'text-[#2563EB]'
          },
          { 
            label: 'Fan Engagement', 
            value: totalComments.toLocaleString(), 
            sub: 'Reader discussion replies', 
            icon: MessageSquare,
            color: 'text-[#8B5CF6]'
          }
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-[#121218] border border-[#232332] rounded-2xl p-4 flex flex-col justify-between shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#A1A1AA] uppercase font-['Montserrat']">
                  {item.label}
                </span>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div>
                <div className="text-2xl font-black text-white font-['Montserrat']">
                  {item.value}
                </div>
                <span className="text-[10px] text-[#A1A1AA] mt-1 block truncate">
                  {item.sub}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Editorial Queue + Category Distribution & Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols on LG): Article Management */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Editorial Queue (Drafts) */}
          <section className="bg-[#121218] border border-[#232332] rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#232332] pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#F59E0B]" />
                <h3 className="text-base font-black uppercase font-['Montserrat'] text-white">
                  Editorial Review Queue
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] text-xs font-bold font-['Montserrat']">
                {drafts.length} unpublished {drafts.length === 1 ? 'article' : 'articles'}
              </span>
            </div>

            {drafts.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#A1A1AA] bg-[#181822]/40 rounded-2xl border border-dashed border-[#232332]">
                <CheckCircle2 className="w-8 h-8 text-[#16A34A] mx-auto mb-2 opacity-80" />
                <p className="font-bold text-sm text-gray-300">All submissions reviewed</p>
                <p className="mt-0.5 text-gray-500">There are no unpublished draft articles in the review pipeline.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {drafts.slice(0, 6).map(a => (
                  <div 
                    key={a.id} 
                    className="p-3.5 rounded-2xl bg-[#181822] border border-[#232332] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#EF233C]/50 transition"
                  >
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-white line-clamp-1">{a.title}</div>
                      <div className="text-[11px] text-[#A1A1AA] mt-1 flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${String(a.status).toUpperCase() === 'APPROVED' ? 'bg-green-500/20 text-green-300' : 'bg-amber-500/20 text-amber-300'}`}>{a.status || 'DRAFT'}</span>
                        <span>{a.categoryName || a.category || 'News'}</span>
                        <span>•</span>
                        <span>{a.authorName || a.author || 'Editorial Desk'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {onEditArticle && (
                        <button 
                          type="button"
                          onClick={() => onEditArticle(a)} 
                          className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-bold uppercase transition font-['Montserrat']"
                        >
                          Edit
                        </button>
                      )}
                      {String(a.status).toUpperCase() === 'APPROVED' && onPublishArticle && (
                        <button 
                          type="button"
                          onClick={() => onPublishArticle(a.id)} 
                          className="px-3.5 py-1.5 rounded-xl bg-[#16A34A] hover:bg-green-600 text-white text-xs font-black uppercase transition font-['Montserrat'] shadow-sm"
                        >
                          Publish Now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* All Articles Feed with Filter Tabs */}
          <section className="bg-[#121218] border border-[#232332] rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#232332] pb-4 mb-4 gap-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#EF233C]" />
                <h3 className="text-base font-black uppercase font-['Montserrat'] text-white">
                  Content Library
                </h3>
                <span className="text-xs text-[#A1A1AA]">({articles.length})</span>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-[#0B0B0F] p-1 rounded-xl border border-[#232332]">
                {[
                  { id: 'ALL', label: `All (${articles.length})` },
                  { id: 'PUBLISHED', label: `Published (${published.length})` },
                  { id: 'DRAFT', label: `Unpublished (${drafts.length})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setArticleFilter(tab.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition font-['Montserrat'] uppercase ${
                      articleFilter === tab.id
                        ? 'bg-[#EF233C] text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {displayedArticles.slice(0, 8).map(a => {
                const articleStatus = String(a.status || 'DRAFT').toUpperCase();
                return (
                  <div 
                    key={a.id} 
                    className="p-3.5 rounded-2xl bg-[#181822] border border-[#232332] flex items-center justify-between gap-3 hover:border-gray-600 transition"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs sm:text-sm font-bold text-white line-clamp-1">{a.title}</div>
                      <div className="text-[11px] text-[#A1A1AA] mt-1 flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          articleStatus === 'PUBLISHED' ? 'bg-green-500/20 text-green-300' : articleStatus === 'APPROVED' ? 'bg-blue-500/20 text-blue-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {articleStatus}
                        </span>
                        <span className="text-gray-300">{a.categoryName || a.category || 'News'}</span>
                        <span>•</span>
                        <span>{a.viewsCount || a.views || 0} views</span>
                        {a.isBreaking && (
                          <span className="text-red-400 font-bold uppercase text-[10px] flex items-center gap-1">
                            <Flame className="w-3 h-3 text-[#EF233C]" /> Breaking
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {onEditArticle && (
                        <button 
                          type="button"
                          onClick={() => onEditArticle(a)} 
                          className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white text-[11px] font-bold uppercase transition"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

        </div>

        {/* Right Column: Category Breakdown & Newsroom Telemetry */}
        <div className="space-y-6">
          
          {/* Category Distribution Card */}
          <section className="bg-[#121218] border border-[#232332] rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 border-b border-[#232332] pb-4 mb-4">
              <FolderKanban className="w-5 h-5 text-[#16A34A]" />
              <h3 className="text-sm font-black uppercase font-['Montserrat'] text-white">
                Category Distribution
              </h3>
            </div>

            <div className="space-y-3">
              {categoryCounts.map(([catName, count]) => {
                const percent = Math.round((count / (articles.length || 1)) * 100);
                return (
                  <div key={catName} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-300">{catName}</span>
                      <span className="text-white font-mono">{count} stories ({percent}%)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#181822] overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#D90429] to-[#EF233C] rounded-full" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Quick Newsroom Actions */}
          <section className="bg-[#121218] border border-[#232332] rounded-3xl p-6 shadow-xl">
            <h3 className="text-sm font-black uppercase font-['Montserrat'] text-white mb-3">
              Editorial Workflow
            </h3>
            <div className="space-y-2.5 text-xs text-gray-300">
              <div className="p-3 rounded-xl bg-[#181822] border border-[#232332] flex items-center justify-between">
                <span>Breaking News Status</span>
                <span className="font-bold text-[#EF233C]">{breakingCount} Live Alerts</span>
              </div>
              <div className="p-3 rounded-xl bg-[#181822] border border-[#232332] flex items-center justify-between">
                <span>Featured Hero Carousel</span>
                <span className="font-bold text-[#16A34A]">{topStoriesCount} Assigned</span>
              </div>
              <div className="p-3 rounded-xl bg-[#181822] border border-[#232332] flex items-center justify-between">
                <span>Review Backlog</span>
                <span className={`font-bold ${drafts.length > 0 ? 'text-[#F59E0B]' : 'text-gray-400'}`}>
                  {drafts.length} Pending
                </span>
              </div>
            </div>
          </section>

        </div>

      </div>

      <NotificationBroadcasterModal 
        isOpen={isBroadcasterOpen} 
        onClose={() => setIsBroadcasterOpen(false)} 
        articles={articles}
      />
    </div>
  );
}
