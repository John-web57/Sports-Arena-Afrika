import React from 'react';
import { Mic, MessageCircle, Star, Quote, ArrowRight, Play, CheckCircle } from 'lucide-react';

export default function InterviewsSection({ articles = [], onSelectArticle }) {
  // Find interview articles
  const interviewArticles = articles.filter(a => {
    if (!a) return false;
    const cat = String(a.categoryName || a.category || '').toUpperCase();
    const tags = Array.isArray(a.tags) ? a.tags.map(t => String(t).toUpperCase()) : [];
    return cat.includes('INTERVIEW') || tags.includes('INTERVIEWS') || String(a.title).toLowerCase().includes('interview');
  });

  const featuredInterview = interviewArticles[0] || articles.find(a => String(a.title).toLowerCase().includes('faith kipyegon')) || articles[0];
  const otherInterviews = interviewArticles.slice(1, 4).length > 0 ? interviewArticles.slice(1, 4) : [
    {
      id: 'mock-int-1',
      title: 'Mikel Arteta: "African Footballers Bring an Unmatched Resilience and Passion to the Premier League"',
      person: 'Mikel Arteta',
      role: 'Arsenal Manager',
      category: 'Interviews',
      date: 'Yesterday'
    },
    {
      id: 'mock-int-2',
      title: 'Michael Olunga: "Our Eyes Are Fixed on Bringing Continental Glory to Kenya at AFCON 2027"',
      person: 'Michael Olunga',
      role: 'Harambee Stars Captain',
      category: 'Interviews',
      date: '2 days ago'
    },
    {
      id: 'mock-int-3',
      title: 'Kevin Wambua: "The Tactical Discipline That Revived Kenya Shujaa 7s Back to the Top Table"',
      person: 'Kevin Wambua',
      role: 'Kenya Sevens Head Coach',
      category: 'Interviews',
      date: '3 days ago'
    }
  ];

  return (
    <section id="interviews" className="py-14 bg-[#0B0B0F] border-b border-[#232332]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 border-b border-[#232332] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Mic className="w-4 h-4 text-[#F97316]" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#F97316] font-['Montserrat']">
                EXCLUSIVE 1-ON-1 CONVERSATIONS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight font-['Montserrat']">
              ATHLETE & COACH INTERVIEWS
            </h2>
            <p className="text-xs text-[#A1A1AA] mt-1">
              Unfiltered access to Africa's champions, visionary tacticians, and sports leaders shaping the continent.
            </p>
          </div>

          <span className="text-xs text-[#A1A1AA] font-mono">
            Exclusive Dialogues & Audio Q&As
          </span>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Featured Interview Hero Card */}
          {featuredInterview && (
            <div
              onClick={() => onSelectArticle && onSelectArticle(featuredInterview)}
              className="lg:col-span-8 bg-gradient-to-br from-[#181824] via-[#12121A] to-[#0E0E14] border border-[#232332] hover:border-[#F97316]/60 rounded-3xl p-6 sm:p-10 transition-all duration-300 group cursor-pointer shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-5 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1 rounded-full bg-[#F97316] text-white text-[11px] font-black uppercase tracking-wider font-['Montserrat'] shadow">
                    Exclusive Interview
                  </span>
                  <span className="text-xs text-gray-400 font-medium">Recorded at Kaptagat Camp</span>
                </div>

                <div className="relative pl-6 border-l-2 border-[#F97316]">
                  <Quote className="w-8 h-8 text-[#F97316]/40 absolute -top-4 -left-3" />
                  <p className="text-lg sm:text-2xl font-black text-white leading-snug font-['Montserrat'] italic">
                    "Motherhood gave me superpowers. When I step onto the final 100 meters, I run with my daughter's future in my heart."
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#F97316] transition-colors leading-snug font-['Montserrat']">
                    {featuredInterview.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A1A1AA] line-clamp-2">
                    {featuredInterview.summary || featuredInterview.excerpt || ''}
                  </p>
                </div>

                <div className="pt-5 border-t border-[#232332] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F97316]/20 border border-[#F97316] flex items-center justify-center text-white">
                      <Mic className="w-5 h-5 text-[#F97316]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Faith Kipyegon</div>
                      <div className="text-[11px] text-gray-400">3x Olympic & World 1500m Champion</div>
                    </div>
                  </div>

                  <span className="px-4 py-2 rounded-full bg-[#181822] group-hover:bg-[#F97316] text-white text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 font-['Montserrat']">
                    <span>Read Q&A</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Secondary Interviews Column */}
          <div className="lg:col-span-4 space-y-4">
            {otherInterviews.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => {
                  const match = articles.find(a => a.id === item.id || (item.title && a.title === item.title));
                  if (match && onSelectArticle) onSelectArticle(match);
                  else if (onSelectArticle) onSelectArticle(featuredInterview);
                }}
                className="bg-[#121218] border border-[#232332] hover:border-[#F97316]/40 rounded-2xl p-4 transition group cursor-pointer flex gap-3.5 items-start"
              >
                <div className="w-10 h-10 rounded-full bg-[#181822] border border-[#232332] flex items-center justify-center flex-shrink-0 mt-1 text-[#F97316]">
                  <MessageCircle className="w-4 h-4" />
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-[#F97316] font-['Montserrat']">Interview</span>
                    <span className="text-[10px] text-gray-500">•</span>
                    <span className="text-[10px] text-gray-400">{item.role || item.date || 'Recent'}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#F97316] transition-colors leading-snug line-clamp-2 font-['Montserrat']">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
