'use client';

import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  Download, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Calendar,
  Sparkles
} from 'lucide-react';

export default function FreelancerEarningsPage() {
  const [withdrawalAmount, setWithdrawalAmount] = useState('1250');
  const [withdrawalNotif, setWithdrawalNotif] = useState<string | null>(null);

  const transactions = [
    { id: 'tx-101', project: 'Instagram Reels Campaign (10 Short Videos)', client: 'TechVision Media', date: '2026-09-04', amount: 800, netAmount: 680, status: 'completed' },
    { id: 'tx-102', project: 'Social Media Graphic Design Templates', client: 'Aura Lifestyle', date: '2026-09-01', amount: 500, netAmount: 425, status: 'completed' },
    { id: 'tx-103', project: 'LinkedIn Ghostwriting (12 Articles)', client: 'SaaS Scale AI', date: '2026-08-25', amount: 1200, netAmount: 1020, status: 'completed' },
    { id: 'tx-104', project: 'YouTube Banner & Thumbnails Pack', client: 'Crypto Pulse Channel', date: '2026-08-18', amount: 300, netAmount: 255, status: 'completed' },
  ];

  const totalEarned = transactions.reduce((acc, t) => acc + t.netAmount, 0);
  const pendingPayout = 425;
  const platformFeePercentage = 15;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawalNotif(`✅ Payout request for $${withdrawalAmount} processed to your connected Stripe / Bank Account!`);
    setTimeout(() => setWithdrawalNotif(null), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Earnings &amp; Payouts</span>
              <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">
                Stripe Direct Payout
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track net revenue, platform commission breakdowns (15%), and initiate instant bank withdrawals.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Encrypted Financial Ledger</span>
        </div>
      </div>

      {withdrawalNotif && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{withdrawalNotif}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Net Earnings</span>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">${totalEarned.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +24% growth vs last month
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Available for Withdrawal</span>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">$1,380</p>
          <p className="text-[11px] text-slate-400">Ready to transfer to bank</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Escrow</span>
          <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">${pendingPayout}</p>
          <p className="text-[11px] text-slate-400">Releases upon client deliverable approval</p>
        </div>
      </div>

      {/* Main Grid: Withdrawal Form & Transaction Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (5 cols): Instant Bank Withdrawal Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Instant Payout Request
              </h3>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Withdrawal Amount ($)
                </label>
                <input
                  type="number"
                  max={1380}
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Max available balance: $1,380</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Payout Method
                </label>
                <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500">
                  <option>Bank Account (Stripe Connect •••• 4242)</option>
                  <option>PayPal Account (freelancer@socialflow.app)</option>
                  <option>Wise Direct Transfer</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Gross Payout:</span>
                  <span className="font-bold text-slate-900 dark:text-white">${withdrawalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee (0%):</span>
                  <span className="font-bold text-emerald-500">$0.00</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
                  <span>Estimated Bank Arrival:</span>
                  <span className="text-purple-600 dark:text-purple-400">Within 24 Hours</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Withdraw Funds to Bank</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (7 cols): Transaction History Table */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
              <span>Payout History &amp; Earnings Ledger</span>
              <span className="text-xs text-slate-400 font-normal">15% platform fee deducted</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-extrabold text-slate-400">
                    <th className="pb-3">Project / Client</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Gross</th>
                    <th className="pb-3 text-right">Net Payout</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 pr-2">
                        <span className="font-extrabold text-slate-900 dark:text-white block">{tx.project}</span>
                        <span className="text-[10px] text-slate-400">{tx.client}</span>
                      </td>
                      <td className="py-3.5 text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">
                        {tx.date}
                      </td>
                      <td className="py-3.5 text-slate-500 dark:text-slate-400 font-medium">
                        ${tx.amount}
                      </td>
                      <td className="py-3.5 text-right font-extrabold text-emerald-600 dark:text-emerald-400">
                        +${tx.netAmount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
