import React from 'react';
import { ArrowRight } from 'lucide-react';

const categories = [
  'FOOTBALL',
  'KENYA',
  'AFRICAN FOOTBALL',
  'ATHLETICS',
  'RUGBY',
  'BASKETBALL',
  'MOTORSPORT',
  'BOXING',
  'ANALYSIS',
  'TRANSFERS'
];

const matchesCategory = (article, category) => {
  const name = String(article.categoryName || article.category || '').toUpperCase();
  const league = String(article.league || '').toUpperCase();
  const country = String(article.country || '').toUpperCase();
  const tags = Array.isArray(article.tags)
    ? article.tags.map(tag => String(tag).toUpperCase())
    : [];

  if (category === 'FOOTBALL') {
    return ['FOOTBALL', 'PREMIER LEAGUE', 'CHAMPIONS LEAGUE', 'LA LIGA', 'FKF']
      .some(term => name.includes(term) || league.includes(term));
  }

  if (category === 'KENYA') {
    return country === 'KENYA' || name.includes('KENYA') ||
      tags.some(tag => ['KENYA', 'GOR MAHIA', 'HARAMBEE STARS'].includes(tag));
  }

  if (category === 'AFRICAN FOOTBALL') {
    return name.includes('AFRICAN FOOTBALL') ||
      (name.includes('FOOTBALL') && country !== 'ENGLAND') ||
      (league.includes('CAF') && !name.includes('PREMIER LEAGUE'));
  }

  return name.includes(category) || league.includes(category) || tags.includes(category);
};

export default function CategoryNewsBlocks({ articles = [], onSelectArticle }) {
  const publishedArticles = articles.filter(article =>
    article && String(article.status || '').toUpperCase() !== 'ARCHIVED'
  );

  return (
    <section id="category-news-blocks" className="py-12 bg-[#0E0E14] border-b border-[#232332]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 pb-4 border-b border-[#232332]">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#EF233C] font-['Montserrat']">
            Browse by sport
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-['Montserrat']">
            Category News
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {categories.map(category => {
            const categoryArticles = publishedArticles
              .filter(article => matchesCategory(article, category))
              .slice(0, 2);

            return (
              <section
                key={category}
                aria-label={`${category} news`}
                className="rounded-2xl border border-[#232332] bg-[#121218] p-5"
              >
                <div className="mb-3 flex items-center justify-between border-b border-[#232332] pb-3">
                  <h3 className="text-sm font-black uppercase tracking-wider text-white font-['Montserrat']">
                    {category}
                  </h3>
                  <span className="text-[10px] font-bold text-[#EF233C]">
                    {categoryArticles.length} {categoryArticles.length === 1 ? 'STORY' : 'STORIES'}
                  </span>
                </div>

                {categoryArticles.length > 0 ? (
                  <ul className="space-y-3">
                    {categoryArticles.map(article => (
                      <li key={article.id}>
                        <button
                          type="button"
                          onClick={() => onSelectArticle?.(article)}
                          className="group flex w-full items-start justify-between gap-3 text-left"
                        >
                          <span className="text-sm font-bold leading-snug text-gray-200 transition group-hover:text-[#EF233C]">
                            {article.title}
                          </span>
                          <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#EF233C] transition-transform group-hover:translate-x-1" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[#A1A1AA]">No stories in this category yet.</p>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
