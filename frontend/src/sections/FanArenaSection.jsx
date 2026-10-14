import React, { useState, useEffect } from 'react';
import { Flame, MessageCircle, Heart, Send, Image, Smile, CheckCircle, Sparkles, Flag, ArrowUp, ArrowDown, Shield, Users, Radio, ThumbsUp } from 'lucide-react';
import { notificationService } from '../services/notificationService';

export default function FanArenaSection({ fanPosts = [], onNewPost, onSelectTeam }) {
  const [activeCommunityTab, setActiveCommunityTab] = useState('ALL'); // 'ALL' | 'Arsenal' | 'Gor Mahia' | 'Liverpool' | 'Al Ahly' | 'Mamelodi Sundowns'
  const [communityView, setCommunityView] = useState('threads'); // 'threads' | 'matchday' | 'banter'
  
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('sportsarena_fan_posts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return fanPosts;
  });

  const [newPostText, setNewPostText] = useState('');
  const [selectedClub, setSelectedClub] = useState('Gor Mahia');
  const [replyInput, setReplyInput] = useState({});

  const [votes, setVotes] = useState(() => {
    try {
      const saved = localStorage.getItem('sportsarena_fan_votes');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  const [reportedToast, setReportedToast] = useState(false);

  // Sync posts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sportsarena_fan_posts', JSON.stringify(posts));
    } catch (e) {}
  }, [posts]);

  // Sync votes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sportsarena_fan_votes', JSON.stringify(votes));
    } catch (e) {}
  }, [votes]);

  const handleVote = (postId, delta) => {
    const currentVote = votes[postId] || 0;
    const newVote = currentVote === delta ? 0 : delta; // toggle
    const scoreDiff = newVote - currentVote;

    setVotes(prev => ({ ...prev, [postId]: newVote }));
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, likes: Math.max(0, p.likes + scoreDiff) };
      }
      return p;
    }));
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost = {
      id: Date.now(),
      user: "Sports Fan (You)",
      handle: "@sportsarena_fan",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
      country: "🌍 Pan-Africa",
      club: selectedClub,
      verified: true,
      time: "Just now",
      text: newPostText,
      likes: 1,
      threadTag: communityView === 'matchday' ? 'Live Match Thread' : 'Club Lounge',
      replies: []
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');

    notificationService.showToast({
      title: '📣 Fan Post Published',
      body: `Your post is live in the ${selectedClub} community lounge.`,
      type: 'SYSTEM',
      category: 'Fan Arena'
    });
  };

  const handleAddReply = (postId) => {
    const text = replyInput[postId];
    if (!text || !text.trim()) return;

    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          replies: [
            ...p.replies,
            { id: Date.now().toString(), user: "You", text: text, time: "Just now", upvotes: 1 }
          ]
        };
      }
      return p;
    }));

    setReplyInput({ ...replyInput, [postId]: '' });

    notificationService.showToast({
      title: '💬 Reply Posted',
      body: 'Your reply has been added to the discussion thread.',
      type: 'SYSTEM',
      category: 'Fan Arena'
    });
  };

  const handleReportPost = (postId) => {
    setReportedToast(true);
    setTimeout(() => setReportedToast(false), 4000);
    notificationService.showToast({
      title: '🛡️ Post Reported',
      body: 'Thank you for keeping SportsArena.africa respectful. Moderation will review.',
      type: 'SYSTEM',
      category: 'Moderation'
    });
  };

  const filteredPosts = posts.filter(post => {
    if (activeCommunityTab === 'ALL') return true;
    return post.club.toLowerCase().includes(activeCommunityTab.toLowerCase());
  });

  const clubCommunities = [
    { id: 'ALL', name: 'All Arena Fans', count: '142K' },
    { id: 'Arsenal', name: 'r/Gunners Africa', icon: '🔴⚪', count: '48K' },
    { id: 'Gor Mahia', name: 'r/KOgalo Army', icon: '🟢⚪', count: '39K' },
    { id: 'Liverpool', name: 'r/TheKop Africa', icon: '🔴', count: '32K' },
    { id: 'Al Ahly', name: 'r/RedDevils Cairo', icon: '🦅', count: '29K' },
    { id: 'Mamelodi Sundowns', name: 'r/Masandawana', icon: '🟡🔵', count: '24K' }
  ];

  return (
    <section id="fan-arena" className="py-14 bg-[#121218] border-b border-[#232332]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-[#232332] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse"></span>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#16A34A] font-['Montserrat']">
                PAN-AFRICAN COMMUNITY (PHASE 6)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#F9FAFB] uppercase tracking-tight font-['Montserrat']">
              FAN ARENA • REDDIT-STYLE FOOTBALL FORUM
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCommunityView('threads')}
              className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider font-['Montserrat'] transition ${
                communityView === 'threads' ? 'bg-[#D90429] text-white' : 'bg-[#181822] text-zinc-400'
              }`}
            >
              All Threads
            </button>
            <button
              onClick={() => setCommunityView('matchday')}
              className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider font-['Montserrat'] transition flex items-center gap-1.5 ${
                communityView === 'matchday' ? 'bg-green-600 text-white shadow-lg' : 'bg-[#181822] text-zinc-400'
              }`}
            >
              <Radio className="w-3.5 h-3.5 animate-pulse text-white" />
              <span>Live Match Threads</span>
            </button>
          </div>
        </div>

        {/* Club Communities Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {clubCommunities.map((club) => (
            <button
              key={club.id}
              onClick={() => setActiveCommunityTab(club.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider font-['Montserrat'] whitespace-nowrap transition flex items-center gap-2 border ${
                activeCommunityTab === club.id
                  ? 'bg-white text-black border-white shadow-md'
                  : 'bg-[#0B0B0F] text-zinc-400 border-[#232332] hover:text-white hover:border-zinc-700'
              }`}
            >
              {club.icon && <span>{club.icon}</span>}
              <span>{club.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                activeCommunityTab === club.id ? 'bg-black/10 text-black' : 'bg-[#181822] text-zinc-500'
              }`}>
                {club.count}
              </span>
            </button>
          ))}
        </div>

        {/* Moderation Toast Notification */}
        {reportedToast && (
          <div className="mb-4 p-3 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-amber-400" />
              <span className="font-bold">Comment reported to the CMS Community Moderation Desk for review. Thank you for keeping the Arena clean!</span>
            </div>
            <span className="text-[10px] text-amber-400 font-mono">Status: Flagged</span>
          </div>
        )}

        {/* 2-Column Layout: Left Composer & Community Rules, Right Reddit Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (5 Cols): Post Composer & Rules */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-36">
            <div className="bg-[#0B0B0F] border border-[#232332] rounded-2xl p-5 sm:p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-[#D90429]" />
                <h3 className="text-base font-black text-white uppercase font-['Montserrat']">
                  Create Thread or Banter
                </h3>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#A1A1AA] uppercase mb-1.5 font-['Montserrat']">
                    Select Club Subreddit / Lounge
                  </label>
                  <select
                    value={selectedClub}
                    onChange={(e) => setSelectedClub(e.target.value)}
                    className="w-full bg-[#181822] border border-[#232332] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D90429]"
                  >
                    <option value="Gor Mahia">Gor Mahia (Kenya) • r/KOgalo</option>
                    <option value="Arsenal">Arsenal FC • r/Gunners</option>
                    <option value="Liverpool">Liverpool FC • r/TheKop</option>
                    <option value="Al Ahly">Al Ahly (Egypt) • r/RedDevils</option>
                    <option value="Mamelodi Sundowns">Mamelodi Sundowns • r/Masandawana</option>
                    <option value="Simba SC">Simba SC (Tanzania)</option>
                    <option value="Chelsea">Chelsea FC • r/Blues</option>
                  </select>
                </div>

                <div>
                  <textarea
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    placeholder="Share your match analysis, tactical opinion, or banter with African football fans..."
                    rows={4}
                    className="w-full bg-[#181822] border border-[#232332] rounded-xl p-3.5 text-xs text-white placeholder-[#777788] focus:outline-none focus:border-[#D90429] resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-[#A1A1AA]">
                    <button type="button" className="p-2 hover:text-white rounded-lg bg-[#181822] border border-[#232332] text-xs flex items-center gap-1">
                      <Image className="w-3.5 h-3.5" />
                      <span>Photo</span>
                    </button>
                    <button type="button" className="p-2 hover:text-white rounded-lg bg-[#181822] border border-[#232332] text-xs flex items-center gap-1">
                      <Smile className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>Emoji</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-sports-gradient text-white text-xs font-black uppercase tracking-wider font-['Montserrat'] shadow-sports-glow hover:opacity-90 flex items-center gap-1.5 transition active:scale-95"
                  >
                    <span>POST THREAD</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Community Guidelines Card */}
            <div className="bg-[#0B0B0F]/80 border border-[#232332] rounded-2xl p-4 text-xs text-zinc-400 space-y-2">
              <span className="font-bold text-white uppercase text-[11px] font-['Montserrat'] block">
                Arena Rules & Fair Play
              </span>
              <ul className="space-y-1 text-[11px] list-disc list-inside">
                <li>Passionate banter is encouraged; hate speech is strictly moderated.</li>
                <li>Live match threads update in real-time during kick-offs.</li>
                <li>Report spam or abusive comments directly to editors.</li>
              </ul>
            </div>
          </div>

          {/* Right Column (7 Cols): Reddit-Style Feed with Upvote/Downvote & Nested Replies */}
          <div className="lg:col-span-7 space-y-4">
            {filteredPosts.map((post) => {
              const currentVote = votes[post.id] || 0;

              return (
                <div
                  key={post.id}
                  className="bg-[#0B0B0F] border border-[#232332] hover:border-zinc-700 rounded-2xl p-4 sm:p-5 shadow-md transition flex gap-3 sm:gap-4 items-start"
                >
                  {/* Left: Reddit-style Upvote/Downvote Column */}
                  <div className="flex flex-col items-center bg-[#181822] border border-[#232332] rounded-xl p-1.5 text-zinc-400 flex-shrink-0">
                    <button
                      onClick={() => handleVote(post.id, 1)}
                      className={`p-1 rounded hover:bg-[#232332] transition ${
                        currentVote === 1 ? 'text-[#EF233C]' : 'hover:text-white'
                      }`}
                      aria-label="Upvote"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <span className={`text-xs font-black my-1 font-mono ${
                      currentVote === 1 ? 'text-[#EF233C]' : currentVote === -1 ? 'text-blue-400' : 'text-white'
                    }`}>
                      {post.likes}
                    </span>
                    <button
                      onClick={() => handleVote(post.id, -1)}
                      className={`p-1 rounded hover:bg-[#232332] transition ${
                        currentVote === -1 ? 'text-blue-400' : 'hover:text-white'
                      }`}
                      aria-label="Downvote"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Right: Post Content */}
                  <div className="flex-1 min-w-0 space-y-3">
                    {/* Header: Author & Club Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.avatar}
                          alt={post.user}
                          className="w-9 h-9 rounded-full object-cover border border-[#D90429]/40"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-black text-white font-['Montserrat']">
                              {post.user}
                            </span>
                            {post.verified && <CheckCircle className="w-3.5 h-3.5 text-[#16A34A]" />}
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#181822] text-[#EF233C] font-bold border border-[#232332]">
                              {post.club}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#A1A1AA]">{post.handle} • {post.country}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-500">{post.time}</span>
                        <button
                          onClick={() => handleReportPost(post.id)}
                          className="text-zinc-600 hover:text-amber-400 p-1 transition"
                          title="Report to Moderation"
                        >
                          <Flag className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Text Body */}
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans">
                      {post.text}
                    </p>

                    {/* Media Attachment if present */}
                    {post.media && (
                      <div className="rounded-xl overflow-hidden aspect-video w-full bg-[#181822] border border-[#232332]">
                        <img src={post.media} alt="Attachment" className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Action Toolbar */}
                    <div className="pt-2 border-t border-[#232332] flex items-center justify-between text-xs text-[#A1A1AA]">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 font-bold text-white text-[11px]">
                          <MessageCircle className="w-3.5 h-3.5 text-[#16A34A]" />
                          <span>{post.replies?.length || 0} Replies</span>
                        </span>

                        <span className="text-[10px] text-zinc-500">
                          Thread: {post.club} Fans Forum
                        </span>
                      </div>

                      <button
                        onClick={() => handleReportPost(post.id)}
                        className="text-[10px] text-zinc-500 hover:text-amber-400 transition"
                      >
                        Report Abuse
                      </button>
                    </div>

                    {/* Nested Replies Stream */}
                    {post.replies && post.replies.length > 0 && (
                      <div className="pt-2 pl-3 border-l-2 border-[#D90429]/40 space-y-2">
                        {post.replies.map((rep) => (
                          <div key={rep.id} className="bg-[#181822] p-2.5 rounded-xl text-xs space-y-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-bold text-[#F59E0B] font-['Montserrat']">{rep.user}</span>
                              <span className="text-zinc-500">{rep.time}</span>
                            </div>
                            <p className="text-zinc-300 text-[11px] leading-relaxed">{rep.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick Reply Bar */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Join the discussion... (Press Enter to post)"
                        value={replyInput[post.id] || ''}
                        onChange={(e) => setReplyInput({ ...replyInput, [post.id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddReply(post.id)}
                        className="flex-1 bg-[#181822] border border-[#232332] rounded-full px-4 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D90429]"
                      />
                      <button
                        onClick={() => handleAddReply(post.id)}
                        className="p-1.5 rounded-full bg-[#D90429] text-white hover:bg-[#EF233C] transition"
                        title="Send Reply"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
