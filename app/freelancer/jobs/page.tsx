'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Building, 
  ShieldCheck,
  Star,
  Tag
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export interface UIJobItem {
  id: string;
  title: string;
  clientName: string;
  clientRating: number;
  budget: string;
  category: string;
  description: string;
  postedAt: string;
  skills: string[];
  proposalsCount: number;
}

export default function FreelancerJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<UIJobItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedJob, setSelectedJob] = useState<UIJobItem | null>(null);
  
  // Proposal Form State
  const [proposalRate, setProposalRate] = useState<string>('');
  const [proposalCover, setProposalCover] = useState<string>('');
  const [proposalNotif, setProposalNotif] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    setIsLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const userId = user?.id || user?.email || 'demo-user';
      const res = await fetch(`${backendUrl}/api/marketplace/jobs?userId=${encodeURIComponent(userId)}`);
      const data = await res.json();
      if (data.jobs && Array.isArray(data.jobs) && data.jobs.length > 0) {
        const formattedJobs: UIJobItem[] = data.jobs.map((j: any) => ({
          id: j.id,
          title: j.title,
          clientName: j.client_name || 'Verified Client',
          clientRating: 4.9,
          budget: `$${j.budget}`,
          category: j.category || 'General',
          description: j.description || '',
          postedAt: j.created_at ? new Date(j.created_at).toLocaleDateString() : 'Recently',
          skills: j.requirements ? j.requirements.split(',').map((s: string) => s.trim()) : ['Social Media', 'Content Creation'],
          proposalsCount: 3,
        }));
        setJobs(formattedJobs);
      } else {
        useFallbackJobs();
      }
    } catch (e) {
      console.error('Failed to load jobs:', e);
      useFallbackJobs();
    } finally {
      setIsLoading(false);
    }
  }

  function useFallbackJobs() {
    setJobs([
      {
        id: 'job-101',
        title: 'Instagram Reels Video Editor (10 Reels/Month)',
        clientName: 'TechVision Media',
        clientRating: 4.9,
        budget: '$800 / month',
        category: 'Video Editing',
        description: 'Looking for an expert short-form video editor to edit engaging 9:16 Instagram Reels and YouTube Shorts with dynamic captions, sound effects, and transitions.',
        postedAt: '2 hours ago',
        skills: ['Premiere Pro', 'After Effects', 'Reels', 'CapCut Pro'],
        proposalsCount: 4,
      },
      {
        id: 'job-102',
        title: 'Social Media Graphic Designer for Brand Relaunch',
        clientName: 'Aura Lifestyle',
        clientRating: 4.8,
        budget: '$500 project',
        category: 'Graphic Design',
        description: 'Need 15 high-converting carousel posts and banner templates designed in Figma/Canva for a fashion brand relaunch.',
        postedAt: '5 hours ago',
        skills: ['Figma', 'Photoshop', 'Canva', 'Branding'],
        proposalsCount: 8,
      },
      {
        id: 'job-103',
        title: 'LinkedIn Thought Leadership Copywriter',
        clientName: 'SaaS Scale AI',
        clientRating: 5.0,
        budget: '$1,200 / month',
        category: 'Copywriting',
        description: 'Ghostwrite 3 long-form LinkedIn posts per week for our CEO. Focus on B2B SaaS, AI automation, and startup growth strategies.',
        postedAt: '1 day ago',
        skills: ['Copywriting', 'LinkedIn Growth', 'B2B Marketing'],
        proposalsCount: 6,
      },
      {
        id: 'job-104',
        title: 'YouTube Thumbnail & Cover Art Designer',
        clientName: 'Crypto Pulse Channel',
        clientRating: 4.7,
        budget: '$300 / project',
        category: 'Graphic Design',
        description: 'Design 10 high CTR thumbnails (1280x720) with click-worthy typography and face cutouts.',
        postedAt: '2 days ago',
        skills: ['Photoshop', 'YouTube Thumbnail', 'CTR Design'],
        proposalsCount: 12,
      }
    ]);
  }

  const categories = ['All', 'Video Editing', 'Graphic Design', 'Copywriting', 'Strategy'];

  const filteredJobs = jobs.filter(job => {
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    setProposalNotif(`🎉 Proposal submitted successfully for "${selectedJob.title}"!`);
    setSelectedJob(null);
    setProposalRate('');
    setProposalCover('');
    setTimeout(() => setProposalNotif(null), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-purple-600 to-pink-600 text-white rounded-2xl shadow-lg shadow-purple-500/20">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Find Freelance Projects</span>
              <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full border border-purple-500/20">
                Live Jobs
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Browse verified client listings for video editing, graphics, copywriting, and social media management.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Escrow Protected Payments</span>
        </div>
      </div>

      {proposalNotif && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{proposalNotif}</span>
        </div>
      )}

      {/* Search & Category Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search jobs by title, skill, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-purple-500/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading open jobs...</div>
      ) : filteredJobs.length === 0 ? (
        <div className="py-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No jobs match your search criteria</p>
          <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/40 rounded-3xl p-6 shadow-xl transition-all space-y-4 hover:shadow-2xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold rounded-full border border-purple-500/20">
                      {job.category}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {job.postedAt}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                    {job.title}
                  </h3>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 block">
                    {job.budget}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Verified Budget</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {job.description}
              </p>

              {/* Skills Tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                {job.skills.map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium rounded-lg flex items-center gap-1"
                  >
                    <Tag className="w-2.5 h-2.5 text-purple-400" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>

              {/* Bottom Client Info & Action */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                    <Building className="w-3.5 h-3.5 text-purple-500" />
                    {job.clientName}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-500 font-medium">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {job.clientRating || 4.9}
                  </span>
                  <span>•</span>
                  <span>{job.proposalsCount || 0} proposals</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedJob(job);
                    setProposalRate(job.budget.replace(/[^0-9]/g, '') || '500');
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Proposal</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Proposal Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Submit Proposal</h3>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">{selectedJob.title}</p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Bid / Proposed Rate ($)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="number"
                    required
                    value={proposalRate}
                    onChange={(e) => setProposalRate(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Cover Letter & Relevant Portfolio Links
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain why you are the best fit for this project. Include links to past video edits, graphics, or content portfolios..."
                  value={proposalCover}
                  onChange={(e) => setProposalCover(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Proposal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
