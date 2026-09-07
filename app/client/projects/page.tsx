'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Plus, 
  Layers,
  FileText
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Job } from '@/lib/marketplace';

export default function ClientProjectsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      if (!user) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const userId = user.id || user.email;
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        const res = await fetch(`${backendUrl}/api/marketplace/jobs?userId=${encodeURIComponent(userId)}`);
        const data = await res.json();
        setJobs(data.jobs || []);
      } catch (e) {
        console.error('Failed to load client jobs:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-medium">Loading hired projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 border border-indigo-500/20 p-6 md:p-8 overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              Client Project Management
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              My Hired SocialFlow Projects 🚀
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
              Track project progress, communicate requirements, review work deliverables, and approve project completion.
            </p>
          </div>

          <Link
            href="/services"
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Hire Professional</span>
          </Link>
        </div>
      </div>

      {/* Projects List */}
      {jobs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto">
          <Briefcase className="w-12 h-12 text-indigo-500 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Hired Projects Yet</h3>
            <p className="text-xs text-slate-400">Browse SocialFlow Services to hire video editors, designers, or marketers for your campaigns.</p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
          >
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{job.title}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    {job.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">{job.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                  <span>Budget: <strong className="text-slate-900 dark:text-white">₹{Number(job.budget).toLocaleString('en-IN')}</strong></span>
                  <span>•</span>
                  <span>Deadline: {job.deadline_days} days</span>
                </div>
              </div>

              <Link
                href={`/jobs/${job.id}`}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Project Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
