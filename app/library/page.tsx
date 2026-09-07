'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FolderKanban, 
  Wand2, 
  Send, 
  UserPlus, 
  Trash2, 
  Copy, 
  Download, 
  Sparkles, 
  Video, 
  Image as ImageIcon, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import { ContentItem } from '@/types';
import { getStoredLibraryItems, saveStoredLibraryItems } from '@/lib/store';

export default function ContentLibraryPage() {
  const router = useRouter();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [filterSource, setFilterSource] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notif, setNotif] = useState<string | null>(null);

  useEffect(() => {
    setItems(getStoredLibraryItems());
  }, []);

  const handleDeleteItem = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    saveStoredLibraryItems(updated);
    setNotif('Content item removed from library.');
    setTimeout(() => setNotif(null), 2500);
  };

  const handleDuplicateItem = (item: ContentItem) => {
    const dup: ContentItem = {
      ...item,
      id: `lib-${Date.now()}`,
      title: `${item.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [dup, ...items];
    setItems(updated);
    saveStoredLibraryItems(updated);
    setNotif('Content item duplicated successfully!');
    setTimeout(() => setNotif(null), 2500);
  };

  const handleSendToPublisher = (item: ContentItem) => {
    if (typeof window !== 'undefined') {
      const payload = {
        title: item.title,
        mediaUrl: item.media[0]?.url || '',
        thumbnailUrl: item.thumbnailUrl || '',
        caption: item.caption,
        hashtags: item.hashtags
      };
      sessionStorage.setItem('socialflow_studio_draft', JSON.stringify(payload));
    }
    router.push('/compose?fromLibrary=true');
  };

  const handleHireForAsset = (item: ContentItem) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('socialflow_hire_context', JSON.stringify({
        title: item.title,
        mediaUrl: item.media[0]?.url || '',
        category: 'video_editing'
      }));
    }
    router.push('/services?category=video_editing');
  };

  const filteredItems = items.filter(i => {
    const matchesSource = filterSource === 'all' || i.creationSource === filterSource;
    const matchesSearch = i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          i.caption.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSource && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white rounded-2xl shadow-lg shadow-indigo-500/20">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Content Library
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Central repository connecting AI Content Studio, Freelancer Services, and Multi-Channel Publishing
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push('/content-studio')}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
        >
          <Wand2 className="w-4 h-4" />
          <span>Create New in Studio</span>
        </button>
      </div>

      {notif && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notif}</span>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
          {[
            { id: 'all', label: 'All Content' },
            { id: 'ai_generated', label: '🤖 AI Created' },
            { id: 'freelancer_delivered', label: '👥 Freelancer Work' },
            { id: 'user_upload', label: '📤 Uploads' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterSource(tab.id)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                filterSource === tab.id
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search library assets..."
            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Content Library Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <FolderKanban className="w-12 h-12 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No content items found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Create a video in Content Studio or hire a freelancer to populate your central Content Library.
            </p>
          </div>
          <button
            onClick={() => router.push('/content-studio')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            <span>Open Content Studio</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail / Media Header */}
                <div className="relative aspect-video bg-slate-950 overflow-hidden">
                  <img
                    src={item.thumbnailUrl || item.media[0]?.url || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wider border border-slate-700">
                      {item.contentType}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.creationSource === 'ai_generated'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : item.creationSource === 'freelancer_delivered'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    }`}>
                      {item.creationSource.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Card Content Info */}
                <div className="p-5 space-y-3">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {item.caption}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.hashtags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer Controls */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => router.push(`/content-studio?id=${item.id}`)}
                    title="Open in Content Studio"
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Wand2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleHireForAsset(item)}
                    title="Hire Someone to Improve This"
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicateItem(item)}
                    title="Duplicate Item"
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    title="Delete Item"
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => handleSendToPublisher(item)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
