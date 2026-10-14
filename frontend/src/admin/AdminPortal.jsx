import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import WriteArticlePage from './WriteArticlePage';
import AllPostsPage from './AllPostsPage';
import UsersManagementPage from './UsersManagementPage';
import MediaLibraryPage from './MediaLibraryPage';
import AnalyticsPage from './AnalyticsPage';
import CommunityModerationPage from './CommunityModerationPage';
import AdvertisementManagerPage from './AdvertisementManagerPage';
import CategoriesTagsManagerPage from './CategoriesTagsManagerPage';
import GoogleSeoDashboard from './GoogleSeoDashboard';
import WebsiteAppearancePage from './WebsiteAppearancePage';
import BrandLogo from '../components/BrandLogo';
import ChangePasswordModal from './ChangePasswordModal';
import {
  LayoutDashboard, Edit3, Image, BarChart3, MessageSquare,
  ArrowLeft, Globe, ExternalLink, DollarSign, Tag, FileText, Users, Key, SearchCheck, Palette
} from 'lucide-react';

export default function AdminPortal({ onExitAdmin, articles, onSaveArticle, onPublishArticle, onDeleteArticle, appearance, onAppearanceChanged }) {
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const [editingArticle, setEditingArticle] = useState(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const canPublishArticles = ['ROLE_SUPER_ADMIN', 'ROLE_EDITOR'].includes(sessionStorage.getItem('arena_role'));

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setActiveRoute('write');
  };

  const handleNavigateToWrite = () => {
    setEditingArticle(null);
    setActiveRoute('write');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'posts', label: 'All Posts', icon: FileText },
    { id: 'write', label: 'Write Article', icon: Edit3 },
    { id: 'seo', label: 'Google SEO & Ranking', icon: SearchCheck },
    { id: 'users', label: 'Users & Staff', icon: Users },
    { id: 'appearance', label: 'Website Appearance', icon: Palette },
    { id: 'taxonomy', label: 'Categories & Tags', icon: Tag },
    { id: 'ads', label: 'Ad Manager', icon: DollarSign },
    { id: 'media', label: 'Media Library', icon: Image },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'moderation', label: 'Community Desk', icon: MessageSquare }
  ];
  return (
    <div className="min-h-screen bg-[#0B0B0F] flex flex-col md:flex-row text-[#F9FAFB]">
      <aside className="w-full md:w-64 bg-[#121218] border-r border-[#232332] flex flex-col justify-between flex-shrink-0">
        <div>
          <div className="p-5 border-b border-[#232332] flex items-center justify-between">
            <div className="flex items-center gap-2.5"><BrandLogo size="sm" showText={false}/><div><span className="text-xs font-black uppercase text-white block">SPORTSARENA</span><span className="text-[10px] text-[#EF233C] font-black tracking-widest uppercase block">ADMIN CMS</span></div></div>
            <button onClick={onExitAdmin} className="p-1.5 rounded-lg bg-[#181822] text-[#A1A1AA] hover:text-white" title="Exit"><ArrowLeft className="w-4 h-4"/></button>
          </div>
          <nav className="p-3 space-y-1">{navItems.filter(item => !['users', 'appearance'].includes(item.id) || sessionStorage.getItem('arena_role') === 'ROLE_SUPER_ADMIN').map(item=>{const Icon=item.icon;return <button key={item.id} onClick={()=>{if(item.id==='write')setEditingArticle(null);setActiveRoute(item.id)}} className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-black uppercase tracking-wider transition ${activeRoute===item.id?'bg-[#D90429] text-white':'text-[#A1A1AA] hover:bg-[#181822] hover:text-white'}`}><Icon className="w-4 h-4"/><span>{item.label}</span></button>})}</nav>
        </div>
        <div className="p-4 border-t border-[#232332] space-y-2">
          <button 
            type="button"
            onClick={() => setIsChangePasswordOpen(true)} 
            className="w-full py-2.5 px-3 rounded-xl bg-[#181824] hover:bg-[#202030] text-amber-400 hover:text-amber-300 text-xs font-bold flex items-center justify-center gap-2 border border-[#2F2F44] hover:border-amber-400/40 transition shadow-sm"
          >
            <Key className="w-3.5 h-3.5 text-amber-400"/>
            <span>SET / CHANGE PASSWORD</span>
          </button>
          <div className="text-[11px] text-[#A1A1AA] flex items-center justify-between"><span>Portal:</span><span className="text-[#16A34A] font-bold">sportsarenaafrika.com</span></div>
          <button onClick={() => window.location.href = '/'} className="w-full py-2.5 px-3 rounded-xl bg-[#181822] text-white text-xs font-bold flex items-center justify-center gap-2 border border-[#232332] hover:bg-[#232332] transition"><Globe className="w-3.5 h-3.5 text-[#2563EB]"/>VIEW READER WEBSITE<ExternalLink className="w-3 h-3 text-[#A1A1AA]"/></button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden min-h-screen">
        {activeRoute==='dashboard' && <AdminDashboard articles={articles} onNavigateToWrite={handleNavigateToWrite} onEditArticle={handleEditArticle} onPublishArticle={canPublishArticles ? onPublishArticle : null}/>} 
        {activeRoute==='posts' && <AllPostsPage articles={articles} onNavigateToWrite={handleNavigateToWrite} onEditArticle={handleEditArticle} onPublishArticle={canPublishArticles ? onPublishArticle : null} onDeleteArticle={onDeleteArticle}/>}
        {activeRoute==='write' && <WriteArticlePage articles={articles} onSaveArticle={onSaveArticle} editingArticle={editingArticle} onBackToDashboard={()=>{setEditingArticle(null);setActiveRoute('dashboard');}}/>} 
        {activeRoute==='seo' && <GoogleSeoDashboard articles={articles}/>}
        {activeRoute==='users' && <UsersManagementPage articles={articles}/>}
        {activeRoute==='appearance' && sessionStorage.getItem('arena_role') === 'ROLE_SUPER_ADMIN' && <WebsiteAppearancePage appearance={appearance} onApply={onAppearanceChanged}/>}
        {activeRoute==='taxonomy' && <CategoriesTagsManagerPage articles={articles}/>} 
        {activeRoute==='ads' && <AdvertisementManagerPage/>}
        {activeRoute==='media' && <MediaLibraryPage/>}
        {activeRoute==='analytics' && <AnalyticsPage/>}
        {activeRoute==='moderation' && <CommunityModerationPage/>}
      </main>

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        username={sessionStorage.getItem('arena_username') || 'admin'}
      />
    </div>
  );
}
