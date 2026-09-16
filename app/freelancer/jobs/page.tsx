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
  Tag,
  X
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { fetchOpenJobs, submitProposal, Job } from '@/lib/marketplace';

export default function FreelancerJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  // Proposal Form State
  const [proposalRate, setProposalRate] = useState<string>('');
  const [proposalCover, setProposalCover] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [proposalNotif, setProposalNotif] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    setIsLoading(true);
    try {
      const data = await fetchOpenJobs();
      setJobs(data);
    } catch (e) {
      console.error('Failed to load open jobs:', e);
    } finally {
      setIsLoading(false);
    }
  }

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setProposalRate(job.budget.toString());
    setProposalCover('');
    setProposalNotif(null);
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob || !user) return;

    setSubmitting(true);
    setProposalNotif(null);

    try {
      const rateNum = parseFloat(proposalRate) || selectedJob.budget;
      const res = await submitProposal(selectedJob.id, {
        freelancerUserId: user.id,
        freelancerName: user.name,
        coverLetter: proposalCover,
        proposedRate: rateNum
      });

      if (res.success) {
        setProposalNotif('🎉 Proposal submitted successfully to the client!');
        setTimeout(() => {
          setSelectedJob(null);
          setProposalNotif(null);
          loadJobs();
        }, 2500);
      } else {
        setProposalNotif(`❌ Failed: ${res.error || 'Could not submit proposal'}`);
      }
    } catch (err: any) {
      setProposalNotif(`❌ Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || job.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-purple-500/20">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Find Client Jobs</span>
              <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full border border-purple-500/20">
                Live Open Postings
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Browse client job requests, submit custom proposals, and win new contracts.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search job titles, skills, or requirements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {['All', 'video_editing', 'graphic_design', 'social_management'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat === 'All' ? 'All Categories' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Job Cards */}
      {isLoading ? (
        <div className="text-center py-20 text-slate-400 text-sm">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          Loading available jobs...
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">No Open Jobs Available</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Check back soon or adjust your search filter to find new client projects.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 rounded-3xl p-6 transition-all shadow-sm hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {job.title}
                  </h3>
                  <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full border border-purple-500/20">
                    {job.category}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {job.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                    <Building className="w-3.5 h-3.5 text-purple-500" />
                    Client: {job.client_name || 'Verified Client'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 shrink-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Budget</div>
                  <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    ${job.budget}
                  </div>
                </div>

                <button
                  onClick={() => handleApplyClick(job)}
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-500/20 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Apply / Proposal
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Apply / Proposal Form */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              Submit Proposal
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Job: <span className="font-semibold text-purple-500">{selectedJob.title}</span> (Budget: ${selectedJob.budget})
            </p>

            {proposalNotif && (
              <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 text-xs font-semibold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{proposalNotif}</span>
              </div>
            )}

            <form onSubmit={handleSubmitProposal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Proposed Rate ($ USD)
                </label>
                <input
                  type="number"
                  required
                  value={proposalRate}
                  onChange={(e) => setProposalRate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cover Letter / Proposal Details
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain why you're the best fit for this project, your turn-around time, and relevant experience..."
                  value={proposalCover}
                  onChange={(e) => setProposalCover(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Submitting...' : 'Send Proposal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
