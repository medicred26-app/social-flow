'use client';

import React from 'react';
import { 
  PenSquare, 
  Video, 
  ImageIcon, 
  FileText, 
  Link as LinkIcon, 
  Upload, 
  Wand2, 
  Layout, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { CreateStartType } from '@/types';

interface CreateTypeSelectorProps {
  selectedType: CreateStartType;
  onSelectType: (type: CreateStartType) => void;
  onOpenAIVideoModal: () => void;
  onOpenUploadModal: () => void;
  onOpenTemplatesModal: () => void;
  onOpenRepurposeModal: () => void;
}

export function CreateTypeSelector({
  selectedType,
  onSelectType,
  onOpenAIVideoModal,
  onOpenUploadModal,
  onOpenTemplatesModal,
  onOpenRepurposeModal,
}: CreateTypeSelectorProps) {
  const OPTIONS: {
    id: CreateStartType;
    label: string;
    description: string;
    icon: any;
    badge?: string;
    action?: () => void;
  }[] = [
    {
      id: 'post',
      label: 'Standard Post',
      description: 'Text caption, links, emojis & hashtags',
      icon: PenSquare,
    },
    {
      id: 'reel',
      label: 'Short Video / Reel',
      description: '9:16 vertical video for Reels, Shorts & TikTok',
      icon: Video,
      badge: '9:16',
    },
    {
      id: 'image',
      label: 'Image / Carousel',
      description: 'Photos, graphics, or multi-slide graphics',
      icon: ImageIcon,
    },
    {
      id: 'document',
      label: 'Document / PDF / PPT',
      description: 'Carousel PDF for LinkedIn, Slides & Docs',
      icon: FileText,
      badge: 'PDF/PPT',
    },
    {
      id: 'link',
      label: 'Link / Event Promo',
      description: 'Article link, blog post, webinars & events',
      icon: LinkIcon,
    },
    {
      id: 'upload',
      label: 'Upload File',
      description: 'Video, PPT, PDF, high-res photos',
      icon: Upload,
      action: onOpenUploadModal,
    },
    {
      id: 'ai_video',
      label: 'Create with AI Video',
      description: 'Generate script, scenes, voice-over & storyboard',
      icon: Wand2,
      badge: 'AI Script',
      action: onOpenAIVideoModal,
    },
    {
      id: 'template',
      label: 'Start from Template',
      description: 'Product launches, carousels, testimonials',
      icon: Layout,
      action: onOpenTemplatesModal,
    },
    {
      id: 'repurpose',
      label: 'Repurpose Content',
      description: 'Turn 1 video into 5 platform-tailored versions',
      icon: RefreshCw,
      badge: 'Multi-Channel',
      action: onOpenRepurposeModal,
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Select Content Creation Format</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Choose how you want to start creating or importing your master content asset
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selectedType === opt.id;

          return (
            <div
              key={opt.id}
              onClick={() => {
                onSelectType(opt.id);
                if (opt.action) opt.action();
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 group interactive-panel ${
                isSelected
                  ? 'bg-indigo-500/10 dark:bg-indigo-600/15 border-indigo-500 ring-2 ring-indigo-500/20 text-slate-900 dark:text-white shadow-md'
                  : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-xl ${
                  isSelected
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 group-hover:text-indigo-500 border border-slate-200 dark:border-slate-800'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                {opt.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    {opt.badge}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">{opt.label}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">{opt.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
