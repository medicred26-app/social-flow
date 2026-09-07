'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  FileText, 
  ArrowLeft, 
  ShieldCheck, 
  DollarSign, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Job } from '@/lib/marketplace';

export default function JobWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const jobId = resolvedParams.id;
  const { user } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deliverableInput, setDeliverableInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>('');

  useEffect(() => {
    loadJobDetails();
  }, [jobId]);

  async function loadJobDetails() {
    setIsLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/marketplace/jobs/${jobId}`);
      const data = await res.json();
      setJob(data.job || null);
      if (data.job?.deliverable_notes) {
        setDeliverableInput(data.job.deliverable_notes);
      }
    } catch (e) {
      console.error('Failed to load job workspace:', e);
    } finally {
      setIsLoading(false);
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    setStatusMsg('');
    setIsSubmitting(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/marketplace/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: newStatus,
          deliverableNotes: deliverableInput 
        })
      });
      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        setStatusMsg(`Job status updated to ${newStatus}.`);
        loadJobDetails();
      } else {
        alert(data.error || 'Failed to update job status.');
      }
    } catch (e: any) {
      setIsSubmitting(false);
      alert(e.message || 'Failed to connect to server.');
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-medium">Loading Job Workspace...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Job Not Found</h2>
        <p className="text-xs text-slate-400">The requested job workspace does not exist or has been removed.</p>
        <Link href="/services" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold">
          <ArrowLeft className="w-4 h-4" /> Return to Marketplace
        </Link>
      </div>
    );
  }

  const isClient = user?.id === job.client_id || user?.email === job.client_email;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Navigation */}
      <Link
        href={isClient ? '/client/projects' : '/freelancer'}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Header Workspace Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                {job.status.replace('_', ' ')}
              </span>
              <span className="text-xs font-semibold text-slate-400">{job.category}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {job.title}
            </h1>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-right">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Job Budget</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">₹{Number(job.budget).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Status Alert */}
        {statusMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Project Overview */}
        <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Requirements</h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            {job.description}
          </p>
        </div>

        {/* Financial Breakdown Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Platform Escrow & Financial Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-slate-600 dark:text-slate-400">
            <div>Client Payment: <strong className="text-slate-900 dark:text-white">₹{Number(job.budget).toLocaleString('en-IN')}</strong></div>
            <div>Platform Fee ({job.commission_percentage}%): <strong className="text-slate-900 dark:text-white">₹{Number(job.platform_fee).toLocaleString('en-IN')}</strong></div>
            <div>Freelancer Net Payout: <strong className="text-indigo-600 dark:text-indigo-400">₹{Number(job.freelancer_amount).toLocaleString('en-IN')}</strong></div>
          </div>
        </div>

        {/* Deliverables & Actions Workspace */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Work Deliverables & Submissions</h3>

          <textarea
            rows={4}
            value={deliverableInput}
            onChange={(e) => setDeliverableInput(e.target.value)}
            placeholder="Enter work submission links (e.g. Google Drive, Dropbox, YouTube video link) or deliverable notes..."
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

          {/* Action Buttons based on User Role & Job Status */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {job.status === 'requested' && (
              <button
                onClick={() => handleStatusUpdate('accepted')}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
              >
                Accept Job & Start Work
              </button>
            )}

            {(job.status === 'accepted' || job.status === 'in_progress' || job.status === 'revision_requested') && (
              <button
                onClick={() => handleStatusUpdate('submitted')}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer"
              >
                Submit Deliverable for Client Review
              </button>
            )}

            {job.status === 'submitted' && (
              <>
                <button
                  onClick={() => handleStatusUpdate('completed')}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                >
                  Approve Deliverable & Complete Job
                </button>

                <button
                  onClick={() => handleStatusUpdate('revision_requested')}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs cursor-pointer"
                >
                  Request Revision
                </button>
              </>
            )}

            {job.status === 'completed' && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Job Completed & Funds Released!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
