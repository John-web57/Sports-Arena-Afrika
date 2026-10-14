import React from 'react';
import { Video, Film } from 'lucide-react';

export default function VideoBlock({ videoUrl, caption, title = "Match Highlights & Video Action", className = "" }) {
  if (!videoUrl) return null;

  // Helper to extract YouTube video ID
  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
    return match ? match[1] : null;
  };

  // Helper to extract Vimeo video ID
  const getVimeoId = (url) => {
    if (!url) return null;
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
    return match ? match[1] : null;
  };

  const isDirectVideo = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(videoUrl) || videoUrl.startsWith('blob:') || videoUrl.startsWith('data:video');
  const ytId = getYouTubeId(videoUrl);
  const vimeoId = getVimeoId(videoUrl);

  return (
    <div className={`my-6 space-y-2.5 ${className}`}>
      {/* Video Block Header Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-[#D90429] text-white">
            <Video className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-white font-['Montserrat']">
            {title}
          </span>
        </div>
        <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
          <Film className="w-3 h-3 text-[#F59E0B]" />
          <span>HD Video</span>
        </span>
      </div>

      {/* 16:9 Video Viewport */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[#232332] shadow-2xl flex items-center justify-center">
        {ytId ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1`}
            title="Video Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : vimeoId ? (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?title=0&byline=0`}
            title="Video Player"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : isDirectVideo ? (
          <video
            src={videoUrl}
            controls
            playsInline
            className="w-full h-full object-cover"
          >
            Your browser does not support HTML5 video.
          </video>
        ) : (
          <iframe
            src={videoUrl}
            title="Embedded Video"
            allowFullScreen
            className="w-full h-full border-0"
          />
        )}
      </div>

      {/* Video Caption & Source Note */}
      <div className="flex items-center justify-between text-[11px] text-gray-400 px-1 pt-0.5">
        <span className="truncate max-w-[80%] italic">
          {caption || "Match replay highlights, press conference statements & key moments"}
        </span>
        <span className="text-[10px] text-gray-500 font-mono flex-shrink-0">
          Sports Arena Video
        </span>
      </div>
    </div>
  );
}
