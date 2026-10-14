import React, { useState, useRef } from 'react';
import { Image, Video, Shield, Upload, Search, Trash2, CheckCircle2, UploadCloud, Check, FileImage } from 'lucide-react';

export default function MediaLibraryPage() {
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const [mediaItems, setMediaItems] = useState([
    { id: 1, name: "sports_arena_logo.png", type: "Club Logos", size: "1.2 MB", date: "Today", src: "/images/logo.png", isOffline: false },
    { id: 2, name: "hero-stadium.jpg", type: "Images", size: "874 KB", date: "Yesterday", src: "/images/hero-stadium.jpg", isOffline: false },
    { id: 3, name: "news-saka.jpg", type: "Images", size: "898 KB", date: "2 days ago", src: "/images/news-saka.jpg", isOffline: false },
    { id: 4, name: "news-liverpool.jpg", type: "Images", size: "944 KB", date: "3 days ago", src: "/images/news-liverpool.jpg", isOffline: false }
  ]);

  const handleFileUpload = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert("Please upload a valid offline image file (JPG, PNG, WebP, SVG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const sizeFormatted = file.size > 1024 * 1024
        ? (file.size / (1024 * 1024)).toFixed(2) + ' MB'
        : Math.round(file.size / 1024) + ' KB';

      const newItem = {
        id: Date.now(),
        name: file.name,
        type: "Images",
        size: sizeFormatted,
        date: "Just now (Offline)",
        src: dataUrl,
        isOffline: true
      };

      setMediaItems(prev => [newItem, ...prev]);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 4000);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteItem = (id) => {
    setMediaItems(prev => prev.filter(item => item.id !== id));
  };

  const filteredItems = mediaItems.filter(item => {
    const matchesFilter = filter === 'ALL' || item.type.toUpperCase() === filter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 sm:p-8 space-y-8 bg-[#0B0B0F] min-h-screen text-[#F9FAFB]">
      
      {/* Hidden file input for native offline image picking */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#232332] gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#EF233C] font-['Montserrat']">
            DIGITAL ASSET MANAGEMENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Montserrat'] uppercase mt-1">
            MEDIA LIBRARY
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2.5 rounded-full bg-sports-gradient text-white font-black text-xs uppercase tracking-wider font-['Montserrat'] shadow-sports-glow flex items-center gap-2 self-start sm:self-auto hover:brightness-110 transition active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>UPLOAD OFFLINE ASSET</span>
          </button>
        </div>
      </div>

      {/* Upload Notification */}
      {uploadSuccess && (
        <div className="p-4 rounded-xl bg-green-950/40 border border-green-500/40 text-green-400 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-bold">Offline image successfully added to Media Library & browser cache!</span>
          </div>
          <span className="text-[10px] text-green-300 font-mono">Ready for SEO & Articles</span>
        </div>
      )}

      {/* Drag & Drop Offline Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
        }}
        className="border-2 border-dashed border-[#232332] hover:border-[#EF233C] rounded-2xl p-6 text-center bg-[#121218]/60 hover:bg-[#181822] cursor-pointer transition group"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-[#181822] border border-[#232332] flex items-center justify-center text-[#EF233C] group-hover:scale-110 transition">
            <UploadCloud className="w-6 h-6" />
          </div>
          <span className="font-bold text-white text-sm">
            Drag & Drop Offline Image or <span className="text-[#EF233C]">Browse from PC / Mobile</span>
          </span>
          <span className="text-xs text-[#A1A1AA]">
            Supports JPG, PNG, WebP, SVG • Instantly accessible without internet connection
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {['ALL', 'IMAGES', 'CLUB LOGOS'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider font-['Montserrat'] transition ${
                filter === f
                  ? 'bg-[#D90429] text-white shadow-sports-glow'
                  : 'bg-[#181822] text-[#A1A1AA] hover:text-white border border-[#232332]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-1.5 rounded-full bg-[#181822] border border-[#232332] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D90429]"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group rounded-2xl overflow-hidden bg-[#121218] border border-[#232332] hover:border-[#D90429]/60 transition flex flex-col justify-between shadow-lg relative"
          >
            <div className="aspect-square w-full bg-[#181822] overflow-hidden relative">
              <img src={item.src} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute top-2 left-2 flex gap-1 items-center">
                <span className="px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold">
                  {item.type}
                </span>
                {item.isOffline && (
                  <span className="px-2 py-0.5 rounded bg-green-600 text-white text-[9px] font-black uppercase tracking-wider">
                    OFFLINE
                  </span>
                )}
              </div>

              {/* Hover actions */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }}
                  className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white shadow-md transition"
                  title="Delete asset"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-1">
              <span className="text-xs font-bold text-white truncate block" title={item.name}>
                {item.name}
              </span>
              <div className="flex justify-between text-[11px] text-[#A1A1AA]">
                <span>{item.size}</span>
                <span>{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
