'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowUpRight, 
  FileText, 
  UserCheck, 
  TrendingUp, 
  Percent,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Job, FreelancerProfile, fetchMyFreelancerProfile } from '@/lib/marketplace';

export default function FreelancerDashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusMsg, setStatusMsg] = useState<string>('');

  useEffect(() => {
    loadFreelancerData();
  }, [user]);

  async function loadFreelancerData() {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const userId = user.id || user.email;

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const [flProfile, jobsRes] = await Promise.all([
        fetchMyFreelancerProfile(userId),
        fetch(`${backendUrl}/api/marketplace/jobs?userId=${encodeURIComponent(userId)}`).then(r => r.json())
      ]);

      setProfile(flProfile);
      setJobs(jobsRes.jobs || []);
    } catch (e) {
      console.error('Failed to load freelancer dashboard data:', e);
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpdateStatus = async (jobId: string, status: string) => {
    setStatusMsg('');
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/marketplace/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg(`Job request updated to ${status}.`);
        loadFreelancerData();
      } else {
        alert(data.error || 'Failed to update job status.');
      }
    } catch (e: any) {
      alert(e.message || 'Failed to connect to server.');
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-medium">Loading freelancer workspace...</p>
      </div>
    );
  }

  const pendingRequests = jobs.filter(j => j.status === 'requested' || j.status === 'pending');
  const activeJobs = jobs.filter(j => j.status === 'accepted' || j.status === 'in_progress' || j.status === 'submitted');
  const completedJobs = jobs.filter(j => j.status === 'completed');

  const totalEarnings = completedJobs.reduce((sum, j) => sum + Number(j.freelancer_amount || 0), 0);
  const pendingEarnings = activeJobs.reduce((sum, j) => sum + Number(j.freelancer_amount || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/20 p-6 md:p-8 overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              Freelancer Partner Dashboard
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || 'Partner'}! 💼
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
              Manage your job requests, submit deliverables to clients, and track your Net Earnings.
            </p>
          </div>

          <Link
            href="/services/become-freelancer"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <span>Edit Profile</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Net Earnings</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">₹{totalEarnings.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> After 15% platform fee
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Pending Earnings</span>
          <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">₹{pendingEarnings.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-slate-400">In active projects</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Active Projects</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{activeJobs.length}</p>
          <p className="text-[11px] text-slate-400">In progress / submitted</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Completed Jobs</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{completedJobs.length}</p>
          <p className="text-[11px] text-slate-400">Successfully delivered</p>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* New Job Requests Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" /> New Job Requests
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
            {pendingRequests.length}
          </span>
        </h2>

        {pendingRequests.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Pending Requests</h3>
            <p className="text-xs text-slate-400">You currently have no new client job requests.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((job) => (
              <div
                key={job.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{job.title}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      {job.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{job.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                    <span>Client: <strong className="text-slate-700 dark:text-slate-200">{job.client_name}</strong></span>
                    <span>•</span>
                    <span>Deadline: {job.deadline_days} days</span>
                  </div>
                </div>

                <div className="space-y-3 flex-shrink-0 text-right w-full md:w-auto">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Your Earnings</span>
                    <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                      ₹{Number(job.freelancer_amount).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 block">(Gross ₹{Number(job.budget).toLocaleString('en-IN')})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateStatus(job.id, 'accepted')}
                      className="flex-1 md:flex-initial px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Accept Job
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(job.id, 'cancelled')}
                      className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Projects Workspace Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-500" /> Active Projects & Workspace
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            {activeJobs.length}
          </span>
        </h2>

        {activeJobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-2">
            <Layers className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Active Projects</h3>
            <p className="text-xs text-slate-400">Accepted job requests will appear here for work submission.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{job.title}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      {job.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{job.description}</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    ₹{Number(job.freelancer_amount).toLocaleString('en-IN')}
                  </span>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Job Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
