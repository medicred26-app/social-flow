'use client';

import React, { useState, useEffect } from 'react';
import { SocialPlatform, PlatformVariant } from '@/types';
import { PLATFORM_CONFIGS } from '@/lib/constants';
import { Layers, Sparkles, Check, Edit3, MessageSquare, AlertCircle } from 'lucide-react';

interface PlatformAdaptationEditorProps {
  masterCaption: string;
  selectedPlatforms: SocialPlatform[];
  variants: PlatformVariant[];
  onChangeVariants: (updated: PlatformVariant[]) => void;
}

export function PlatformAdaptationEditor({
  masterCaption,
  selectedPlatforms,
  variants,
  onChangeVariants,
}: PlatformAdaptationEditorProps) {
  const [activePlatform, setActivePlatform] = useState<SocialPlatform>(selectedPlatforms[0] || 'instagram');

  useEffect(() => {
    if (selectedPlatforms.length > 0 && !selectedPlatforms.includes(activePlatform)) {
      setActivePlatform(selectedPlatforms[0]);
    }

    // Auto-generate variants for selected platforms if missing
    const updatedVariants: PlatformVariant[] = [...variants];
    let changed = false;

    selectedPlatforms.forEach((p) => {
      const exists = updatedVariants.find((v) => v.platform === p);
      if (!exists) {
        changed = true;
        const limits = PLATFORM_CONFIGS[p] || { displayName: p, maxCharacters: 2000 };

        // Platform-tailored adaptation logic
        let adaptedCaption = masterCaption;
        let hashtags = ['#SocialFlow', '#Automation'];

        if (p === 'x') {
          adaptedCaption = masterCaption.slice(0, 260);
          hashtags = ['#Tech', '#SaaS'];
        } else if (p === 'linkedin') {
          adaptedCaption = `💡 Professional Insight:\n\n${masterCaption}\n\nWhat are your thoughts on this strategy?`;
          hashtags = ['#Leadership', '#Innovation', '#BusinessGrowth'];
        } else if (p === 'instagram') {
          adaptedCaption = `${masterCaption}\n\n👇 Drop a comment below!`;
          hashtags = ['#InstaReels', '#ContentCreator', '#ViralPost'];
        } else if (p === 'youtube') {
          adaptedCaption = `🎬 Full Walkthrough:\n${masterCaption}\n\nSubscribe for weekly video tutorials!`;
          hashtags = ['#Shorts', '#YouTubeShorts', '#Tutorial'];
        }

        updatedVariants.push({
          platform: p,
          caption: adaptedCaption,
          hashtags,
          aspectRatio: p === 'youtube' || p === 'instagram' ? '9:16' : '16:9',
        });
      }
    });

    if (changed) {
      onChangeVariants(updatedVariants);
    }
  }, [selectedPlatforms, masterCaption]);

  if (selectedPlatforms.length === 0) {
    return (
      <div className="p-6 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
        Please select at least 1 social platform above to edit platform-tailored adaptations.
      </div>
    );
  }

  const currentVariant = variants.find((v) => v.platform === activePlatform) || {
    platform: activePlatform,
    caption: masterCaption,
    hashtags: [],
  };

  const activeLimits = PLATFORM_CONFIGS[activePlatform] || { displayName: activePlatform, maxCharacters: 2000 };

  const handleUpdateCaption = (newCaption: string) => {
    const updated = variants.map((v) => (v.platform === activePlatform ? { ...v, caption: newCaption } : v));
    onChangeVariants(updated);
  };

  const handleUpdateHashtags = (tagsStr: string) => {
    const tags = tagsStr
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean)
      .map((t) => `#${t}`);

    const updated = variants.map((v) => (v.platform === activePlatform ? { ...v, hashtags: tags } : v));
    onChangeVariants(updated);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-500" />
            <span>Platform-Specific Content Adaptation</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tailor captions, character limits, and hashtags independently per social network
          </p>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
          Smart Adaptation
        </span>
      </div>

      {/* Platform Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {selectedPlatforms.map((p) => {
          const limits = PLATFORM_CONFIGS[p] || { displayName: p };
          const isSelected = activePlatform === p;

          return (
            <button
              key={p}
              type="button"
              onClick={() => setActivePlatform(p)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>{limits.displayName}</span>
            </button>
          );
        })}
      </div>

      {/* Active Platform Editor */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
            <span>Editing {activeLimits.displayName} Variant</span>
          </span>

          <span
            className={`text-[11px] font-bold ${
              currentVariant.caption.length > activeLimits.maxCharacters ? 'text-rose-500' : 'text-slate-400'
            }`}
          >
            {currentVariant.caption.length} / {activeLimits.maxCharacters} chars
          </span>
        </div>

        <div>
          <textarea
            rows={4}
            value={currentVariant.caption}
            onChange={(e) => handleUpdateCaption(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Platform Specific Hashtags
          </label>
          <input
            type="text"
            value={(currentVariant.hashtags || []).join(', ')}
            onChange={(e) => handleUpdateHashtags(e.target.value)}
            placeholder="#Reels, #Growth, #Tech"
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
