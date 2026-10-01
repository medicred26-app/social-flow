'use client';

import React, { useEffect, useState } from 'react';
import { Cloud, HardDrive, KeyRound, Upload } from 'lucide-react';
import { DriveWorkspace } from '@/components/drive/DriveWorkspace';
import { GenerateWithKeyPanel } from '@/components/videos/GenerateWithKeyPanel';
import { UploadVideoPanel } from '@/components/videos/UploadVideoPanel';
import { VideoMethod } from '@/lib/video-sources';

const METHODS: { id: VideoMethod; title: string; blurb: string; icon: typeof HardDrive }[] = [
  {
    id: 'drive',
    title: '1. Drive pointer',
    blurb: 'Use a video that already lives in their Drive. We store only the file address.',
    icon: HardDrive,
  },
  {
    id: 'generate',
    title: '2. Generate with their API key',
    blurb: 'They paste a Gemini key, write a prompt, and Veo renders on their quota.',
    icon: KeyRound,
  },
  {
    id: 'upload',
    title: '3. Upload to our storage',
    blurb: 'They upload an MP4. SocialFlow keeps a copy for preview and publish.',
    icon: Upload,
  },
];

export function VideoMethodsPage() {
  const [method, setMethod] = useState<VideoMethod>('drive');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const next = new URLSearchParams(window.location.search).get('method');
    if (next === 'generate' || next === 'upload' || next === 'drive') setMethod(next);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-sky-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-sky-500/20">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Videos</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Three ways to get a video into SocialFlow: Drive address, generate on their Gemini key, or upload a file we store.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {METHODS.map((item) => {
          const Icon = item.icon;
          const active = method === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setMethod(item.id)}
              className={`text-left rounded-2xl border p-4 transition-all ${
                active
                  ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Icon className="w-4 h-4 text-indigo-500" />
                {item.title}
              </p>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{item.blurb}</p>
            </button>
          );
        })}
      </div>

      {method === 'drive' && <DriveWorkspace compact />}
      {method === 'generate' && <GenerateWithKeyPanel />}
      {method === 'upload' && <UploadVideoPanel />}
    </div>
  );
}
