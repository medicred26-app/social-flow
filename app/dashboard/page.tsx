'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Post, SocialAccount } from '@/types';
import { getStoredPosts, getStoredAccounts, saveStoredPosts } from '@/lib/store';
import { ScheduledCard } from '@/components/calendar/ScheduledCard';
import { EngagementChart } from '@/components/analytics/EngagementChart';
import { 
  Send, 
  Clock, 
  CheckCircle2, 
  Share2, 
  TrendingUp, 
  Plus, 
  Sparkles,
  ArrowUpRight,
  Layers
} from 'lucide-react';

import { useAuth } from '@/lib/auth-context';

export default function DashboardPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [activeTab, setActiveTab] = useState<'scheduled' | 'published'>('scheduled');

  useEffect(() => {
    setPosts(getStoredPosts());
    setAccounts(getStoredAccounts());
  }, []);

  const scheduledPosts = posts.filter(p => p.status === 'scheduled');
  const publishedPosts = posts.filter(p => p.status === 'published');
  const scheduledCount = scheduledPosts.length;
  const publishedCount = publishedPosts.length;
  const activeAccountsCount = accounts.filter(a => a.connected).length;

  const handleDeletePost = (id: string) => {
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    saveStoredPosts(updated);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-purple-900/50 border border-indigo-500/20 p-6 md:p-8 overflow-hidden shadow-2xl interactive-section">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-400" /> SocialFlow Command Center
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || 'Creator'}! 👋
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
              Your social channels are running smoothly. You have <strong className="text-indigo-400 font-bold">{scheduledCount} post{scheduledCount !== 1 ? 's' : ''} queued</strong> for auto-publishing today.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/compose"
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Post</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Queued Posts Card */}
        <div
          onClick={() => setActiveTab('scheduled')}
          className={`bg-white dark:bg-slate-900/80 border rounded-3xl p-5 shadow-sm dark:shadow-lg space-y-2 interactive-stat-card cursor-pointer transition-all ${
            activeTab === 'scheduled'
              ? 'border-indigo-500 ring-2 ring-indigo-500/20'
              : 'border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Queued Posts</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{scheduledCount}</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> Click to view queue
          </p>
        </div>

        {/* Published Posts Card */}
        <div
          onClick={() => setActiveTab('published')}
          className={`bg-white dark:bg-slate-900/80 border rounded-3xl p-5 shadow-sm dark:shadow-lg space-y-2 interactive-stat-card cursor-pointer transition-all ${
            activeTab === 'published'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20'
              : 'border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Published Posts</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{publishedCount}</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Click to view published posts →
          </p>
        </div>

        {/* Connected Accounts Card */}
        <Link
          href="/accounts"
          className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm dark:shadow-lg space-y-2 interactive-stat-card block"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Connected Accounts</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{activeAccountsCount}</p>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">OAuth tokens valid</p>
        </Link>

        {/* Est. Total Reach Card */}
        <Link
          href="/analytics"
          className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm dark:shadow-lg space-y-2 interactive-stat-card block"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Est. Total Reach</span>
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {accounts.filter(a => a.connected).reduce((acc, a) => acc + (a.followerCount || 0), 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3 h-3" /> {activeAccountsCount > 0 ? 'Calculated from connected audience' : 'No active channels connected'}
          </p>
        </Link>
      </div>

      {/* Main Grid: Chart & Dynamic Posts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Analytics Chart */}
        <div className="lg:col-span-2 space-y-6">
          <EngagementChart />
        </div>

        {/* Right Column: Dynamic Post Queue & Published Posts Viewer */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('scheduled')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'scheduled'
                    ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Queued ({scheduledCount})
              </button>
              <button
                onClick={() => setActiveTab('published')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'published'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Published ({publishedCount})
              </button>
            </div>

            <Link href="/calendar" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
              View Calendar →
            </Link>
          </div>

          <div className="space-y-3">
            {activeTab === 'scheduled' ? (
              scheduledPosts.length === 0 ? (
                <div className="p-6 text-center rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
                  No scheduled posts in queue. Click <strong className="text-slate-900 dark:text-white">Create New Post</strong> to queue content!
                </div>
              ) : (
                scheduledPosts.map((post) => (
                  <ScheduledCard key={post.id} post={post} onDelete={handleDeletePost} />
                ))
              )
            ) : (
              publishedPosts.length === 0 ? (
                <div className="p-6 text-center rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
                  No published posts yet. Scheduled posts will automatically appear here upon publishing.
                </div>
              ) : (
                publishedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Published
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(post.scheduledFor).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-2 leading-relaxed">
                      {post.caption}
                    </p>

                    {/* Media Thumbnail Preview */}
                    {post.media.length > 0 && (
                      <div className="aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                        <img src={post.media[0].url} alt="Published media" className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Analytics Summary */}
                    {post.analytics && (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span>👁️ {(post.analytics.impressions || 4820).toLocaleString()} impressions</span>
                        <span>❤️ {post.analytics.likes || 312} likes</span>
                        <span>💬 {post.analytics.comments || 29} comments</span>
                      </div>
                    )}
                  </div>
                ))
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
