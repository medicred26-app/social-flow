'use client';

import React from 'react';
import { 
  Star, 
  ThumbsUp, 
  MessageSquare, 
  ShieldCheck, 
  Award,
  Sparkles,
  UserCheck
} from 'lucide-react';

export default function FreelancerReviewsPage() {
  const reviews = [
    {
      id: 'rev-1',
      clientName: 'TechVision Media',
      clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      projectTitle: 'Instagram Reels Campaign (10 Short Videos)',
      rating: 5.0,
      date: 'September 4, 2026',
      comment: 'Alex delivered incredible video edits! The captions and dynamic sound effects boosted our Reel engagement by 340%. Will definitely rehire for our next campaign.',
    },
    {
      id: 'rev-2',
      clientName: 'Aura Lifestyle',
      clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      projectTitle: 'Social Media Graphic Design Templates',
      rating: 4.8,
      date: 'September 1, 2026',
      comment: 'Super crisp Figma templates and very fast turnaround time. Delivered 2 days ahead of schedule.',
    },
    {
      id: 'rev-3',
      clientName: 'SaaS Scale AI',
      clientAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      projectTitle: 'LinkedIn Ghostwriting (12 Articles)',
      rating: 5.0,
      date: 'August 25, 2026',
      comment: 'Captured our CEO’s voice perfectly. High level of professionalism and deep understanding of B2B marketing.',
    },
    {
      id: 'rev-4',
      clientName: 'Crypto Pulse Channel',
      clientAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
      projectTitle: 'YouTube Banner & Thumbnails Pack',
      rating: 4.9,
      date: 'August 18, 2026',
      comment: 'Thumbnails had high CTR. Loved working with Alex!',
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-amber-500 to-purple-600 text-white rounded-2xl shadow-lg shadow-amber-500/20">
            <Star className="w-6 h-6 fill-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Client Reviews &amp; Ratings</span>
              <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full border border-amber-500/20">
                4.9 ★ Rating
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified feedback from clients who ordered your content creation services.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Top Rated Freelancer (99% Job Success)</span>
        </div>
      </div>

      {/* Ratings Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overall Rating</span>
          <p className="text-3xl font-extrabold text-amber-500 flex items-center gap-1">
            <span>4.9</span>
            <Star className="w-6 h-6 fill-amber-400" />
          </p>
          <p className="text-[11px] text-slate-400">Based on 48 completed client orders</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Job Success Score</span>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">99%</p>
          <p className="text-[11px] text-slate-400">100% on-time deliverable submission</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Repeat Clients</span>
          <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">84%</p>
          <p className="text-[11px] text-slate-400">Clients rehire for recurring content</p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={rev.clientAvatar}
                  alt={rev.clientName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{rev.clientName}</h4>
                  <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">{rev.projectTitle}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{rev.rating}</span>
                </div>
                <span className="text-[10px] text-slate-400">{rev.date}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
              "{rev.comment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
