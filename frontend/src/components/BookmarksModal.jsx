import React from 'react';
import { X, Bookmark, Trash2, ArrowRight, Clock, Eye, Sparkles } from 'lucide-react';

export default function BookmarksModal({
  isOpen,
  onClose,
  bookmarks = {},
  articles = [],
  onSelectArticle,
  onRemoveBookmark,
  onClearAll
}) {
  if (!isOpen) return null;

  const bookmarkedArticles = articles.filter(art => !!bookmarks[art.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0B0B0F] border border-[#232332] rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl text-white">
        
        {/* Header */}
        <div className="p-6 border-b border-[#232332] flex items-center justify-between bg-[#121218]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D90429]/20 border border-[#D90429]/40 flex items-center justify-center text-[#EF233C]">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight font-['Montserrat']">
                Saved Articles & Reading List
              </h3>
              <p className="text-xs text-[#A1A1AA]">
                {bookmarkedArticles.length} {bookmarkedArticles.length === 1 ? 'story' : 'stories'} saved for offline reading
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {bookmarkedArticles.length > 0 && onClearAll && (
              <button
                onClick={onClearAll}
                className="text-[11px] font-bold text-gray-400 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-white/5 transition flex items-center gap-1"
                title="Clear all saved articles"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#181822] text-[#A1A1AA] hover:text-white hover:bg-[#232332] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {bookmarkedArticles.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#181822] text-[#777788] flex items-center justify-center mx-auto">
                <Bookmark className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase font-['Montserrat']">
                  Your Reading List is Empty
                </h4>
                <p className="text-xs text-[#A1A1AA] max-w-sm mx-auto mt-1 leading-relaxed">
                  Click the bookmark icon on any article card  across Sports Arena Afrika to save stories for later.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarkedArticles.map((art) => (
                <div
                  key={art.id}
                  className="bg-[#121218] border border-[#232332] hover:border-[#D90429]/50 rounded-2xl p-4 flex items-center gap-4 transition group"
                >
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-[#181822]"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-black uppercase text-[#EF233C] tracking-wider font-['Montserrat']">
                      {art.category}
                    </span>
                    <h4
                      onClick={() => {
                        onSelectArticle(art);
                        onClose();
                      }}
                      className="text-sm font-bold text-white group-hover:text-[#EF233C] transition line-clamp-2 cursor-pointer mt-0.5"
                    >
                      {art.title}
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] text-[#A1A1AA] mt-1.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {art.readTime || '3 min'}
                      </span>
                      <span>•</span>
                      <span>{art.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        onSelectArticle(art);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl bg-sports-gradient text-white hover:opacity-90 transition shadow-sports-glow"
                      title="Read Article"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemoveBookmark(art.id)}
                      className="p-2.5 rounded-xl bg-[#181822] text-[#A1A1AA] hover:text-red-400 hover:bg-red-500/10 transition"
                      title="Remove from bookmarks"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#232332] bg-[#0E0E14] flex items-center justify-between text-xs text-[#A1A1AA]">
          <span>Saved stories are cached offline on your device</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#181822] hover:bg-[#232332] text-white font-bold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
