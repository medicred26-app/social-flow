'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Percent, 
  AlertCircle, 
  ArrowLeft, 
  UserCheck, 
  UserX,
  Users,
  Settings,
  RefreshCw,
  Star
} from 'lucide-react';
import { 
  FreelancerProfile, 
  fetchPendingFreelancers, 
  verifyFreelancer, 
  fetchPlatformSettings, 
  updateCommissionPercentage 
} from '@/lib/marketplace';

export default function AdminMarketplacePage() {
  const [pendingFreelancers, setPendingFreelancers] = useState<FreelancerProfile[]>([]);
  const [commissionRate, setCommissionRate] = useState<number>(15);
  const [newCommissionInput, setNewCommissionInput] = useState<string>('15');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    setIsLoading(true);
    const [pending, settings] = await Promise.all([
      fetchPendingFreelancers(),
      fetchPlatformSettings()
    ]);
    setPendingFreelancers(pending);
    setCommissionRate(settings.commissionPercentage || 15);
    setNewCommissionInput(String(settings.commissionPercentage || 15));
    setIsLoading(false);
  }

  const handleVerify = async (id: string, status: 'approved' | 'rejected') => {
    setStatusMessage('');
    const res = await verifyFreelancer(id, status);
    if (res.success) {
      setStatusMessage(`Freelancer profile has been ${status}.`);
      loadAdminData();
    } else {
      setStatusMessage(`Failed to update freelancer: ${res.error}`);
    }
  };

  const handleSaveCommission = async (e: React.FormEvent) => {
    e.preventDefault();
    const rate = Number(newCommissionInput);
    if (isNaN(rate) || rate < 0 || rate > 50) {
      alert('Please enter a valid commission percentage between 0% and 50%.');
      return;
    }
    const res = await updateCommissionPercentage(rate);
    if (res.success) {
      setCommissionRate(rate);
      setStatusMessage(`Platform commission rate updated to ${rate}%.`);
    } else {
      alert(res.error || 'Failed to update commission rate.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Back Button */}
      <Link
        href="/services"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Services Marketplace
      </Link>

      {/* Admin Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/80 p-8 overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              SocialFlow Admin Control Panel
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Marketplace Verification & Settings
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
              Review freelancer profile applications, manage platform commission fees, and audit marketplace performance.
            </p>
          </div>

          <button
            onClick={loadAdminData}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {statusMessage && (
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Commission Rate Settings Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Percent className="w-5 h-5 text-indigo-500" /> Configurable Platform Commission
          </h2>
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
            Current Rate: {commissionRate}%
          </span>
        </div>

        <form onSubmit={handleSaveCommission} className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <div className="relative flex-1 w-full">
            <input
              type="number"
              min={0}
              max={50}
              value={newCommissionInput}
              onChange={(e) => setNewCommissionInput(e.target.value)}
              placeholder="Commission % (e.g. 15)"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Update Commission Rate
          </button>
        </form>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          Example calculation with {commissionRate}% commission: For a ₹10,000 job, SocialFlow retains ₹{(10000 * commissionRate / 100).toLocaleString('en-IN')} and the freelancer receives ₹{(10000 * (100 - commissionRate) / 100).toLocaleString('en-IN')}.
        </p>
      </div>

      {/* Pending Freelancer Verification Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            Pending Freelancer Applications
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
              {pendingFreelancers.length}
            </span>
          </h2>
        </div>

        {isLoading ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-medium">Fetching pending applications...</p>
          </div>
        ) : pendingFreelancers.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">All Clear!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">There are no pending freelancer profile applications awaiting verification.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingFreelancers.map((fl) => (
              <div
                key={fl.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={fl.user_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fl.user_email)}`}
                    alt={fl.user_name || fl.professional_title}
                    className="w-12 h-12 rounded-2xl object-cover border border-indigo-500/30 flex-shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {fl.user_name || fl.user_email.split('@')[0]}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 uppercase">
                        {fl.verification_status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {fl.professional_title}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                      {fl.bio}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {fl.skills.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={() => handleVerify(fl.id, 'approved')}
                    className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={() => handleVerify(fl.id, 'rejected')}
                    className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
