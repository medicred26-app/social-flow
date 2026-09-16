'use client';

import React from 'react';
import { Sliders, Shield, MessageSquare, Download, PlaySquare, CheckCircle2, Lock, Eye, Users } from 'lucide-react';
import { PostConfiguration } from '@/types';

interface ConfigurePanelProps {
  config: PostConfiguration;
  onChangeConfig: (updated: PostConfiguration) => void;
}

export function ConfigurePanel({ config, onChangeConfig }: ConfigurePanelProps) {
  const handleChange = (field: keyof PostConfiguration, value: any) => {
    onChangeConfig({
      ...config,
      [field]: value,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-500" />
          <span>Publishing &amp; Audience Configuration</span>
        </h2>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
          Section 4 PDF Specs
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Privacy Setting */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Privacy Setting</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'public', label: 'Public' },
              { id: 'unlisted', label: 'Unlisted' },
              { id: 'private', label: 'Private' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleChange('privacy', p.id)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  config.privacy === p.id
                    ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Target Audience Visibility */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-500" />
            <span>Audience Visibility</span>
          </label>
          <select
            value={config.audienceVisibility}
            onChange={(e) => handleChange('audienceVisibility', e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Everyone / All Followers</option>
            <option value="subscribers">Paid Subscribers Only</option>
            <option value="targeted">Targeted Geo/Demographics</option>
          </select>
        </div>
      </div>

      {/* Permissions Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Allow Audience Comments</span>
          </div>
          <input
            type="checkbox"
            checked={config.allowComments}
            onChange={(e) => handleChange('allowComments', e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Allow Media Downloads</span>
          </div>
          <input
            type="checkbox"
            checked={config.allowDownloads}
            onChange={(e) => handleChange('allowDownloads', e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
        </label>
      </div>

      {/* YouTube Specific Options */}
      <div>
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1.5">
          <PlaySquare className="w-3.5 h-3.5 text-rose-500" />
          <span>YouTube Playlist (Optional)</span>
        </label>
        <select
          value={config.youtubePlaylist || ''}
          onChange={(e) => handleChange('youtubePlaylist', e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="">-- No Playlist Selected --</option>
          <option value="Product Launch 2026">Product Launch 2026</option>
          <option value="Social Media AI Tutorials">Social Media AI Tutorials</option>
          <option value="Weekly Growth Tips">Weekly Growth Tips</option>
        </select>
      </div>

      {/* Usage Rights Confirmation Checkbox */}
      <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-start gap-3">
        <input
          type="checkbox"
          id="rightsCheck"
          checked={config.usagePermissionConfirmed}
          onChange={(e) => handleChange('usagePermissionConfirmed', e.target.checked)}
          className="w-4 h-4 mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
        />
        <label htmlFor="rightsCheck" className="text-xs text-slate-700 dark:text-slate-300 leading-snug cursor-pointer">
          <strong className="text-slate-900 dark:text-white">Content Rights &amp; Guidelines Confirmation</strong>: I confirm I own or have licensed all media, audio, and visual assets used in this post for commercial social publishing.
        </label>
      </div>
    </div>
  );
}
