import React, { useState } from 'react';
import {
  Tag, Folder, Plus, Trash2, Edit2, Check, X, Search,
  TrendingUp, Sparkles, AlertCircle, CheckCircle2, Hash, Layers
} from 'lucide-react';
import { initialCategories, initialTags } from '../data/mockData';

export default function CategoriesTagsManagerPage({ articles = [] }) {
  const [activeTab, setActiveTab] = useState('categories'); // 'categories' | 'tags'
  const [categories, setCategories] = useState(initialCategories);
  const [tags, setTags] = useState(initialTags);
  const [searchTerm, setSearchTerm] = useState('');

  // Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatColor, setNewCatColor] = useState('#D90429');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Tag Form State
  const [newTagName, setNewTagName] = useState('');
  const [newTagSlug, setNewTagSlug] = useState('');
  const [newTagTrending, setNewTagTrending] = useState(true);

  // Success Notice
  const [notice, setNotice] = useState(null);

  const showNotice = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const slug = newCatSlug.trim() || newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const created = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      slug,
      color: newCatColor,
      count: 0,
      description: newCatDesc.trim() || `Articles covering ${newCatName.trim()} across SportsArena.africa`
    };

    setCategories([created, ...categories]);
    setNewCatName('');
    setNewCatSlug('');
    setNewCatDesc('');
    showNotice(`✓ Category "${created.name}" created successfully!`);
  };

  const handleDeleteCategory = (id) => {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    if (confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      setCategories(categories.filter(c => c.id !== id));
      showNotice(`Category "${cat.name}" deleted.`);
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    const cleanName = newTagName.replace(/^#/, '').trim();
    const slug = newTagSlug.trim() || cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const created = {
      id: `tag-${Date.now()}`,
      name: cleanName,
      slug,
      count: 0,
      trending: newTagTrending
    };

    setTags([created, ...tags]);
    setNewTagName('');
    setNewTagSlug('');
    showNotice(`✓ Tag "#${created.name}" added to tags index!`);
  };

  const handleDeleteTag = (id) => {
    const t = tags.find(x => x.id === id);
    if (!t) return;
    setTags(tags.filter(x => x.id !== id));
    showNotice(`Tag "#${t.name}" deleted.`);
  };

  const handleToggleTrending = (id) => {
    setTags(tags.map(t => t.id === id ? { ...t, trending: !t.trending } : t));
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTags = tags.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8 space-y-8 bg-[#0B0B0F] min-h-screen text-[#F9FAFB]">
      
      {/* Top Welcome & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#232332] gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#EF233C] font-['Montserrat'] flex items-center gap-2">
            <span>TAXONOMY & CONTENT ARCHITECTURE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Montserrat'] uppercase mt-1">
            Categories & Tags Manager
          </h1>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 bg-[#121218] p-1.5 rounded-2xl border border-[#232332]">
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider font-['Montserrat'] transition flex items-center gap-2 ${
              activeTab === 'categories'
                ? 'bg-[#D90429] text-white shadow-sports-glow'
                : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <Folder className="w-4 h-4" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tags')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider font-['Montserrat'] transition flex items-center gap-2 ${
              activeTab === 'tags'
                ? 'bg-[#D90429] text-white shadow-sports-glow'
                : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Tags ({tags.length})</span>
          </button>
        </div>
      </div>

      {/* Confirmation Notice */}
      {notice && (
        <div className="p-4 rounded-xl bg-[#16A34A]/20 border border-[#16A34A] text-white text-xs font-black flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
          <span>{notice}</span>
        </div>
      )}

      {/* CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (4 cols): Create Category Form */}
          <div className="lg:col-span-4 bg-[#121218] border border-[#232332] rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#232332]">
              <Folder className="w-4 h-4 text-[#EF233C]" />
              <h3 className="text-sm font-black uppercase text-white font-['Montserrat']">
                Add New Category
              </h3>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#A1A1AA] font-['Montserrat'] mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. CAF Confederations Cup"
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    if (!newCatSlug) {
                      setNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  className="w-full bg-[#181822] border border-[#232332] focus:border-[#EF233C] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#A1A1AA] font-['Montserrat'] mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="e.g. caf-confederations-cup"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  className="w-full bg-[#181822] border border-[#232332] focus:border-[#EF233C] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#A1A1AA] font-['Montserrat'] mb-1">
                  Brand Color Badge
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newCatColor}
                    onChange={(e) => setNewCatColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={newCatColor}
                    onChange={(e) => setNewCatColor(e.target.value)}
                    className="flex-1 bg-[#181822] border border-[#232332] rounded-xl px-3 py-2 text-xs text-white font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#A1A1AA] font-['Montserrat'] mb-1">
                  Description (SEO & Meta)
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly summarize what stories belong to this category..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full bg-[#181822] border border-[#232332] focus:border-[#EF233C] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-sports-gradient hover:opacity-95 text-white font-black text-xs uppercase tracking-wider font-['Montserrat'] shadow-sports-glow transition flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Save New Category</span>
              </button>
            </form>
          </div>

          {/* Right Column (8 cols): Existing Categories List Table */}
          <div className="lg:col-span-8 bg-[#121218] border border-[#232332] rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#232332] gap-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#16A34A]" />
                <h3 className="text-sm font-black uppercase text-white font-['Montserrat']">
                  Active Sports Categories ({filteredCategories.length})
                </h3>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#A1A1AA] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#181822] border border-[#232332] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white outline-none w-56"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-[#181822] text-[#A1A1AA] uppercase font-bold text-[10px] tracking-wider font-['Montserrat']">
                  <tr>
                    <th className="p-3 rounded-l-xl">Category Name</th>
                    <th className="p-3">Slug</th>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-center">Stories</th>
                    <th className="p-3 text-right rounded-r-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232332]">
                  {filteredCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-[#181822]/60 transition group">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                            style={{ backgroundColor: cat.color }}
                          ></span>
                          <span className="font-bold text-white uppercase font-['Montserrat']">
                            {cat.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-[#A1A1AA]">
                        /{cat.slug}
                      </td>
                      <td className="p-3 text-[11px] text-[#A1A1AA] max-w-xs truncate">
                        {cat.description}
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-[#181822] border border-[#232332] text-[10px] font-black font-mono text-white">
                          {cat.count || 12}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-[#EF233C] hover:bg-[#181822] transition"
                          title="Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAGS TAB */}
      {activeTab === 'tags' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (4 cols): Create Tag Form */}
          <div className="lg:col-span-4 bg-[#121218] border border-[#232332] rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#232332]">
              <Tag className="w-4 h-4 text-[#EF233C]" />
              <h3 className="text-sm font-black uppercase text-white font-['Montserrat']">
                Add New Sports Tag
              </h3>
            </div>

            <form onSubmit={handleAddTag} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#A1A1AA] font-['Montserrat'] mb-1">
                  Tag Name (without #)
                </label>
                <div className="relative">
                  <Hash className="w-3.5 h-3.5 text-[#A1A1AA] absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. VictorOsimhen"
                    value={newTagName}
                    onChange={(e) => {
                      setNewTagName(e.target.value);
                      if (!newTagSlug) {
                        setNewTagSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                      }
                    }}
                    className="w-full bg-[#181822] border border-[#232332] focus:border-[#EF233C] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#A1A1AA] font-['Montserrat'] mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="e.g. victor-osimhen"
                  value={newTagSlug}
                  onChange={(e) => setNewTagSlug(e.target.value)}
                  className="w-full bg-[#181822] border border-[#232332] focus:border-[#EF233C] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#181822] border border-[#232332]">
                <div>
                  <span className="font-bold text-xs text-white block">Trending Tag Spotlight</span>
                  <span className="text-[10px] text-[#A1A1AA] block">Promote in breaking news & search ribbon</span>
                </div>
                <button
                  type="button"
                  onClick={() => setNewTagTrending(!newTagTrending)}
                  className={`w-10 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    newTagTrending ? 'bg-[#16A34A]' : 'bg-[#232332]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      newTagTrending ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-sports-gradient hover:opacity-95 text-white font-black text-xs uppercase tracking-wider font-['Montserrat'] shadow-sports-glow transition flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Save New Tag</span>
              </button>
            </form>
          </div>

          {/* Right Column (8 cols): Interactive Tags Cloud & Directory */}
          <div className="lg:col-span-8 bg-[#121218] border border-[#232332] rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#232332] gap-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#F59E0B]" />
                <h3 className="text-sm font-black uppercase text-white font-['Montserrat']">
                  Sports Tags Directory ({filteredTags.length})
                </h3>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#A1A1AA] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#181822] border border-[#232332] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white outline-none w-56"
                />
              </div>
            </div>

            {/* Interactive Tag Cloud */}
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#A1A1AA] font-['Montserrat'] block mb-3">
                Live Interactive Tag Cloud
              </span>
              <div className="flex flex-wrap gap-2">
                {filteredTags.map((tag) => (
                  <div
                    key={tag.id}
                    className={`px-3 py-1.5 rounded-full border text-xs font-bold font-['Montserrat'] flex items-center gap-2 transition group ${
                      tag.trending
                        ? 'bg-[#D90429]/15 border-[#D90429]/40 text-[#EF233C] hover:bg-[#D90429] hover:text-white'
                        : 'bg-[#181822] border-[#232332] text-zinc-300 hover:border-gray-500'
                    }`}
                  >
                    <span>#{tag.name}</span>
                    <span className="text-[10px] font-mono opacity-60">({tag.count || 14})</span>
                    <button
                      onClick={() => handleToggleTrending(tag.id)}
                      className="opacity-0 group-hover:opacity-100 transition text-[10px] hover:text-yellow-400"
                      title={tag.trending ? "Unmark trending" : "Mark trending"}
                    >
                      ★
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
                      className="opacity-0 group-hover:opacity-100 transition text-[10px] hover:text-red-400"
                      title="Delete tag"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tag List Details Table */}
            <div className="pt-4 border-t border-[#232332] overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-[#181822] text-[#A1A1AA] uppercase font-bold text-[10px] tracking-wider font-['Montserrat']">
                  <tr>
                    <th className="p-3 rounded-l-xl">Tag</th>
                    <th className="p-3">Slug</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Stories</th>
                    <th className="p-3 text-right rounded-r-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232332]">
                  {filteredTags.map((tag) => (
                    <tr key={tag.id} className="hover:bg-[#181822]/60 transition">
                      <td className="p-3 font-bold text-white font-['Montserrat']">
                        #{tag.name}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-[#A1A1AA]">
                        /{tag.slug}
                      </td>
                      <td className="p-3 text-center">
                        {tag.trending ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/30 text-[9px] font-black uppercase">
                            Trending 🔥
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-[#232332] text-[#A1A1AA] text-[9px] font-black uppercase">
                            Standard
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center font-mono">
                        {tag.count || 12}
                      </td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => handleToggleTrending(tag.id)}
                          className="p-1 rounded hover:bg-[#232332] text-xs text-[#F59E0B]"
                          title="Toggle Trending"
                        >
                          ★
                        </button>
                        <button
                          onClick={() => handleDeleteTag(tag.id)}
                          className="p-1 rounded hover:bg-[#232332] text-xs text-[#EF233C]"
                          title="Delete Tag"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
