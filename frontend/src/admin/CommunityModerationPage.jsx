import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, Trash2, Pin, MessageSquare, Flame } from 'lucide-react';

export default function CommunityModerationPage() {
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "Otieno Fanatic",
      club: "Gor Mahia",
      text: "AFC Leopards fans were crying in the stands! Gor Mahia is the undisputed king of East African football!",
      time: "10 mins ago",
      flagged: false,
      pinned: true
    },
    {
      id: 2,
      user: "LiverpoolSupporter_KE",
      club: "Liverpool",
      text: "Michael Oliver gave Arsenal every soft call today. Title race is rigged!",
      time: "24 mins ago",
      flagged: true,
      pinned: false
    },
    {
      id: 3,
      user: "CairoUltras",
      club: "Al Ahly",
      text: "Sundowns can never survive Cairo International Stadium. 80,000 red eagles waiting!",
      time: "1 hour ago",
      flagged: false,
      pinned: false
    }
  ]);

  const handleDelete = (id) => {
    setComments(comments.filter(c => c.id !== id));
  };

  const handleTogglePin = (id) => {
    setComments(comments.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c));
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 bg-[#0B0B0F] min-h-screen text-[#F9FAFB]">
      
      {/* Header */}
      <div className="pb-6 border-b border-[#232332]">
        <span className="text-xs font-black uppercase tracking-[0.2em] text-[#EF233C] font-['Montserrat']">
          FAN ARENA & ARTICLE COMMENTS
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-['Montserrat'] uppercase mt-1">
          COMMUNITY MODERATION DESK
        </h1>
      </div>

      {/* Moderation Cards */}
      <div className="space-y-4">
        {comments.map((comm) => (
          <div
            key={comm.id}
            className={`p-5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              comm.flagged
                ? 'bg-[#181216] border-[#EF233C]/60 shadow-[0_0_15px_rgba(239,35,60,0.2)]'
                : 'bg-[#121218] border-[#232332]'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-black text-white font-['Montserrat']">{comm.user}</span>
                <span className="text-[#A1A1AA]">({comm.club} Supporter)</span>
                <span>•</span>
                <span className="text-[#A1A1AA]">{comm.time}</span>
                {comm.pinned && (
                  <span className="px-2 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] font-bold text-[10px]">
                    PINNED
                  </span>
                )}
                {comm.flagged && (
                  <span className="px-2 py-0.5 rounded bg-[#D90429]/20 text-[#EF233C] font-bold text-[10px] flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    <span>REPORTED BY USERS</span>
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-3xl">
                "{comm.text}"
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => handleTogglePin(comm.id)}
                className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition ${
                  comm.pinned
                    ? 'bg-[#F59E0B] text-black border-[#F59E0B]'
                    : 'bg-[#181822] text-[#A1A1AA] hover:text-white border-[#232332]'
                }`}
                title="Pin Comment"
              >
                <Pin className="w-3.5 h-3.5" />
                <span>{comm.pinned ? "Pinned" : "Pin"}</span>
              </button>

              <button
                onClick={() => handleDelete(comm.id)}
                className="p-2 rounded-xl bg-[#181822] hover:bg-[#D90429] text-[#A1A1AA] hover:text-white border border-[#232332] hover:border-[#D90429] text-xs font-bold transition flex items-center gap-1"
                title="Delete comment"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
