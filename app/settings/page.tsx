'use client';

import React, { useState } from 'react';
import { Settings, User, Bell, CheckCircle2, Save } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function SettingsPage() {
  const { user } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoSchedule, setAutoSchedule] = useState(true);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-slate-700 via-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg shadow-indigo-500/20">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Account &amp; Workspace Settings</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Manage profile preferences, notifications, and platform defaults</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save Preferences
        </button>
      </div>

      {savedMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Settings saved successfully! Account preferences updated.</span>
        </div>
      )}

      {/* User Account Profile Details */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Profile Overview</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Your account identity and assigned platform role</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
          <div>
            <label className="text-[11px] text-slate-500 font-semibold block mb-1">Account Name</label>
            <input
              type="text"
              readOnly
              value={user?.name || 'SocialFlow User'}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-medium"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 font-semibold block mb-1">Email Address</label>
            <input
              type="text"
              readOnly
              value={user?.email || 'user@socialflow.app'}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-medium"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 font-semibold block mb-1">Account Role</label>
            <span className="inline-block px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold rounded-lg border border-purple-500/20 uppercase text-[10px]">
              {user?.role || 'customer'}
            </span>
          </div>
          <div>
            <label className="text-[11px] text-slate-500 font-semibold block mb-1">Authentication Type</label>
            <span className="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold rounded-lg border border-indigo-500/20 uppercase text-[10px]">
              {user?.provider === 'google' ? 'Google OAuth 2.0' : 'Email Password'}
            </span>
          </div>
        </div>
      </div>

      {/* Notifications & Automation Preferences */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications &amp; Automation</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Configure email alerts and queue scheduling behavior</p>
          </div>
        </div>

        <div className="space-y-4 pt-1 text-xs">
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">Email Deliverable &amp; Publishing Alerts</span>
              <span className="text-slate-500 text-[11px]">Receive emails when a freelancer submits a project deliverable or post publishes.</span>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">Smart Auto-Scheduling Optimization</span>
              <span className="text-slate-500 text-[11px]">Automatically pick peak engagement times when scheduling social media posts.</span>
            </div>
            <input
              type="checkbox"
              checked={autoSchedule}
              onChange={(e) => setAutoSchedule(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
