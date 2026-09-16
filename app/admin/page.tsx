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
  Users,
  Settings,
  RefreshCw,
  Zap,
  Activity,
  Key,
  Database,
  Lock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Server,
  LogOut,
  Globe,
  Radio
} from 'lucide-react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { useAuth } from '@/lib/auth-context';
import { ALLOWED_ADMIN_EMAILS } from '@/lib/admin';
import { 
  FreelancerProfile, 
  fetchPendingFreelancers, 
  verifyFreelancer, 
  fetchPlatformSettings, 
  updateCommissionPercentage 
} from '@/lib/marketplace';

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboardContent />
    </AdminGuard>
  );
}

function AdminDashboardContent() {
  const { user, logout, googleClientId, setGoogleClientId } = useAuth();
  const [activeTab, setActiveTab] = useState<'marketplace' | 'integrations' | 'security' | 'system'>('marketplace');
  const [pendingFreelancers, setPendingFreelancers] = useState<FreelancerProfile[]>([]);
  const [commissionRate, setCommissionRate] = useState<number>(15);
  const [newCommissionInput, setNewCommissionInput] = useState<string>('15');
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [apiConnected, setApiConnected] = useState<boolean>(true);
  const [clientIdInput, setClientIdInput] = useState<string>(googleClientId || '');
  const [isSavingClientId, setIsSavingClientId] = useState<boolean>(false);

  useEffect(() => {
    loadAllAdminData();
    checkBackendHealth();
  }, []);

  useEffect(() => {
    setClientIdInput(googleClientId || '');
  }, [googleClientId]);

  async function checkBackendHealth() {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/health`);
      setApiConnected(res.ok);
    } catch (e) {
      setApiConnected(false);
    }
  }

  async function loadAllAdminData() {
    setIsLoadingData(true);
    try {
      const [pending, settings] = await Promise.all([
        fetchPendingFreelancers(),
        fetchPlatformSettings()
      ]);
      setPendingFreelancers(pending);
      setCommissionRate(settings.commissionPercentage || 15);
      setNewCommissionInput(String(settings.commissionPercentage || 15));
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoadingData(false);
    }
  }

  const handleVerify = async (id: string, status: 'approved' | 'rejected') => {
    setStatusMessage('');
    const res = await verifyFreelancer(id, status);
    if (res.success) {
      setStatusMessage(`Freelancer profile has been ${status}.`);
      loadAllAdminData();
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

  const handleSaveGoogleClientId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientIdInput.trim()) return;
    setIsSavingClientId(true);
    setGoogleClientId(clientIdInput.trim());
    setTimeout(() => {
      setIsSavingClientId(false);
      setStatusMessage('Google OAuth Client ID updated successfully.');
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16 px-4 sm:px-6">
      {/* Top Banner & Active Admin Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Active Admin Pill */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-2xl shadow-sm text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-slate-500 dark:text-slate-400">Authenticated Admin:</span>
            <strong className="text-slate-900 dark:text-white font-mono">{user?.email}</strong>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase">
            Google OAuth Verified
          </span>
          <button
            onClick={logout}
            title="Sign out of Admin Session"
            className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer ml-2"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Admin Hero Card */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/80 p-8 overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -top-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              SocialFlow Super Admin Control Center
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Platform Administration & Governance
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Verify freelancer applications, set global marketplace commission rates, monitor server status, and manage system security configurations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                loadAllAdminData();
                checkBackendHealth();
              }}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin' : ''}`} />
              Refresh Dashboard
            </button>

            <Link
              href="/admin/marketplace"
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/30"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Full Marketplace View
            </Link>
          </div>
        </div>
      </div>

      {/* Operational Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Freelancers</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {pendingFreelancers.length}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              pendingFreelancers.length > 0 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            }`}>
              {pendingFreelancers.length > 0 ? 'Requires Action' : 'All Clear'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Applications awaiting admin approval</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Marketplace Fee</span>
            <Percent className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {commissionRate}%
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              Active Fee
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Retained on marketplace hires</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Backend API Health</span>
            <Server className={`w-4 h-4 ${apiConnected ? 'text-emerald-500' : 'text-amber-500'}`} />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {apiConnected ? 'Online' : 'Offline'}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              apiConnected ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}>
              Port 5000
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Express Node.js background server</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Admin Policy</span>
            <ShieldCheck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {ALLOWED_ADMIN_EMAILS.length} Accounts
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
              Google Only
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Strict Google OAuth whitelist</p>
        </div>
      </div>

      {/* Notification Banner */}
      {statusMessage && (
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300 text-xs font-semibold flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage('')} className="text-indigo-400 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'marketplace'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" /> Marketplace & Freelancer Approvals
          {pendingFreelancers.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-extrabold">
              {pendingFreelancers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('integrations')}
          className={`py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'integrations'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Key className="w-4 h-4" /> Google OAuth & API Configuration
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'security'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Security & Admin Whitelist
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'system'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" /> System Health & Logs
        </button>
      </div>

      {/* Tab 1 Content: Marketplace Management */}
      {activeTab === 'marketplace' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Commission Configuration Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Percent className="w-5 h-5 text-indigo-500" /> Platform Commission Rate
              </h2>
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                Current Global Rate: {commissionRate}%
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
                Update Commission Percentage
              </button>
            </form>
          </div>

          {/* Pending Freelancer Verification Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                Pending Freelancer Profile Verification Applications
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  {pendingFreelancers.length}
                </span>
              </h2>
            </div>

            {isLoadingData ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400 font-medium">Fetching pending freelancer profile applications...</p>
              </div>
            ) : pendingFreelancers.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">All Freelancer Applications Reviewed</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">There are no pending freelancer profiles awaiting administrator approval.</p>
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
                            Pending Approval
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{fl.professional_title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl line-clamp-2">{fl.bio}</p>
                        
                        <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-400">
                          <span>Rate: <strong>₹{fl.hourly_rate}/hr</strong></span>
                          <span>•</span>
                          <span>Email: <strong>{fl.user_email}</strong></span>
                          <span>•</span>
                          <span>Skills: <strong>{fl.skills?.join(', ') || 'General'}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <button
                        onClick={() => handleVerify(fl.id, 'approved')}
                        className="flex-1 md:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve Profile
                      </button>
                      <button
                        onClick={() => handleVerify(fl.id, 'rejected')}
                        className="flex-1 md:flex-none px-5 py-2.5 bg-rose-600/10 hover:bg-rose-600/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2 Content: Google OAuth Client ID Configuration */}
      {activeTab === 'integrations' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                <Key className="w-4 h-4" /> Google OAuth 2.0 Client Configuration
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Active Google OAuth Client ID
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                This Client ID is used across SocialFlow for authenticating both regular users and platform administrators via Google OAuth 2.0 Popups.
              </p>
            </div>

            <form onSubmit={handleSaveGoogleClientId} className="space-y-4 max-w-2xl">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Google Client ID String
                </label>
                <input
                  type="text"
                  value={clientIdInput}
                  onChange={(e) => setClientIdInput(e.target.value)}
                  placeholder="1234567890-xyz.apps.googleusercontent.com"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSavingClientId}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSavingClientId ? 'Updating...' : 'Save Google Client ID'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3 Content: Security & Admin Whitelist */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" /> Strictly Enforced Whitelist
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Authorized Administrator Accounts
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                Access to the Admin Portal is strictly restricted to users who sign in via Google OAuth matching these exact email addresses.
              </p>
            </div>

            <div className="space-y-3 max-w-2xl">
              {ALLOWED_ADMIN_EMAILS.map((email) => {
                const isCurrent = user?.email?.toLowerCase() === email.toLowerCase();
                return (
                  <div
                    key={email}
                    className={`p-4 rounded-2xl border flex items-center justify-between ${
                      isCurrent
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800">
                        <Lock className="w-4 h-4 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-xs font-mono">{email}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Google OAuth Permitted Admin</p>
                      </div>
                    </div>

                    {isCurrent && (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                        Active Session
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4 Content: System Health & Logs */}
      {activeTab === 'system' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                <Radio className="w-4 h-4 animate-pulse" /> Live Infrastructure Status
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                SocialFlow Infrastructure Diagnostics
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Express API Health (`/api/health`)</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${apiConnected ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {apiConnected ? 'Healthy' : 'Disconnected'}
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Target: {process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Database Layer</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/10 text-indigo-400">
                    Supabase / Memory Hybrid
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Dual mode with automatic local fallback
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
