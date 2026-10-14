import React, { useState, useEffect } from 'react';
import { initialPolls } from '../data/mockData';
import { BarChart3, CheckCircle2, Flame, Users } from 'lucide-react';
import { notificationService } from '../services/notificationService';

export default function OpinionPollSection() {
  const [polls, setPolls] = useState(() => {
    try {
      const saved = localStorage.getItem('sportsarena_opinion_polls');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialPolls;
  });

  useEffect(() => {
    try {
      localStorage.setItem('sportsarena_opinion_polls', JSON.stringify(polls));
    } catch (e) {}
  }, [polls]);

  const handleVote = (pollId, optionId) => {
    setPolls(prev => prev.map(p => {
      if (p.id !== pollId || p.userVoted) return p;

      const newTotal = p.totalVotes + 1;
      const updatedOptions = p.options.map(opt => {
        const newVotes = opt.id === optionId ? opt.votes + 1 : opt.votes;
        return {
          ...opt,
          votes: newVotes,
          percent: Math.round((newVotes / newTotal) * 100)
        };
      });

      const selectedOpt = p.options.find(o => o.id === optionId);
      notificationService.showToast({
        title: '📊 Poll Vote Recorded',
        body: `You voted "${selectedOpt?.label || 'Option'}" in "${p.question}"`,
        type: 'SYSTEM',
        category: 'Polls'
      });

      return {
        ...p,
        totalVotes: newTotal,
        options: updatedOptions,
        userVoted: optionId
      };
    }));
  };

  return (
    <section id="opinion-polls" className="py-14 bg-[#0B0B0F] border-b border-[#232332]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#232332] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <BarChart3 className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#F59E0B] font-['Montserrat']">
                COMMUNITY VOICE
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#F9FAFB] uppercase tracking-tight font-['Montserrat']">
              INTERACTIVE OPINION POLLS
            </h2>
          </div>
          <span className="text-xs text-[#A1A1AA]">
            Real-time percentage calculations • Vote now to see live stats
          </span>
        </div>

        {/* Poll Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {polls.map((poll) => {
            const hasVoted = !!poll.userVoted;

            return (
              <div
                key={poll.id}
                className="bg-[#121218] border border-[#232332] rounded-2xl p-6 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#A1A1AA] mb-3">
                    <span className="font-bold uppercase tracking-wider text-[#F59E0B] font-['Montserrat']">
                      Active Poll
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{poll.totalVotes.toLocaleString()} votes</span>
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white font-['Montserrat'] leading-snug mb-5">
                    {poll.question}
                  </h3>

                  {/* Options List */}
                  <div className="space-y-3">
                    {poll.options.map((option) => {
                      const isSelected = poll.userVoted === option.id;

                      return (
                        <button
                          key={option.id}
                          disabled={hasVoted}
                          onClick={() => handleVote(poll.id, option.id)}
                          className={`w-full text-left rounded-xl p-3.5 relative overflow-hidden transition border ${
                            isSelected
                              ? 'bg-[#181822] border-[#D90429]'
                              : hasVoted
                              ? 'bg-[#181822] border-[#232332] cursor-default'
                              : 'bg-[#181822] hover:bg-[#232332] border-[#232332] hover:border-[#D90429]/60 cursor-pointer'
                          }`}
                        >
                          {/* Progress fill bar if voted */}
                          {hasVoted && (
                            <div
                              className="absolute top-0 bottom-0 left-0 bg-[#D90429]/20 transition-all duration-700"
                              style={{ width: `${option.percent}%` }}
                            ></div>
                          )}

                          <div className="relative z-10 flex items-center justify-between text-xs sm:text-sm font-semibold">
                            <div className="flex items-center gap-2">
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-[#D90429] flex-shrink-0" />}
                              <span className="text-[#F9FAFB]">{option.text}</span>
                            </div>

                            {hasVoted && (
                              <span className="font-bold font-mono text-[#F59E0B] ml-2">
                                {option.percent}%
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-[#232332] text-[11px] text-[#A1A1AA] flex items-center justify-between">
                  <span>{hasVoted ? "✓ You voted" : "Tap an option to cast your vote"}</span>
                  <span className="text-[#EF233C] font-bold">SportsArena.africa Poll</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
