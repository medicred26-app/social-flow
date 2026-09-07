'use client';

import React, { useState } from 'react';
import { Sparkles, X, Check, RefreshCw, AlertCircle, Hash, MessageSquare, Target, Smile, ArrowRight } from 'lucide-react';
import { SocialPlatform } from '@/types';

interface AIPostEnhancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCaption: string;
  onApply: (enhancedCaption: string) => void;
  defaultPlatform?: SocialPlatform;
}

export type AITone = 'professional' | 'friendly' | 'educational' | 'promotional' | 'casual';
export type AIGoal = 'engagement' | 'reach' | 'traffic' | 'conversions' | 'awareness';

interface AIEnhancementResult {
  improved_caption: string;
  hook: string;
  cta: string;
  hashtags: string[];
  suggestions: string[];
}

export function AIPostEnhancerModal({
  isOpen,
  onClose,
  initialCaption,
  onApply,
  defaultPlatform = 'instagram',
}: AIPostEnhancerModalProps) {
  const [captionInput, setCaptionInput] = useState(initialCaption);
  const [platform, setPlatform] = useState<SocialPlatform>(defaultPlatform);
  const [tone, setTone] = useState<AITone>('professional');
  const [goal, setGoal] = useState<AIGoal>('engagement');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIEnhancementResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEnhance = async () => {
    if (!captionInput.trim()) return;

    setIsLoading(true);
    setError(null);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

    try {
      const response = await fetch(`${backendUrl}/api/ai/enhance-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: captionInput,
          platform,
          tone,
          goal,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to enhance post with AI.');
      }

      setResult(data.data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while connecting to AI Engine.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseVersion = () => {
    if (result?.improved_caption) {
      onApply(result.improved_caption);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full space-y-6 shadow-2xl animate-in zoom-in-95 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-purple-500 via-indigo-500 to-pink-500 text-white rounded-2xl shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>AI Post Enhancer</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">
                  AI Engine 1.0
                </span>
              </h2>
              <p className="text-xs text-slate-400">Optimize hook, caption structure, CTA, tone & hashtags for maximum reach</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input & Parameters Controls */}
        <div className="space-y-4">
          {/* Post Textarea Input */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Draft Post Content
            </label>
            <textarea
              rows={3}
              value={captionInput}
              onChange={(e) => setCaptionInput(e.target.value)}
              placeholder="e.g. We launched our new clinic today."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Target Platform */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Target Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 capitalize focus:outline-none focus:border-indigo-500"
              >
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="x">X (Twitter)</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>

            {/* Tone of Voice */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Tone of Voice</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as AITone)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 capitalize focus:outline-none focus:border-indigo-500"
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="educational">Educational</option>
                <option value="promotional">Promotional</option>
                <option value="casual">Casual</option>
              </select>
            </div>

            {/* Content Goal */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Primary Goal</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as AIGoal)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 capitalize focus:outline-none focus:border-indigo-500"
              >
                <option value="engagement">Engagement</option>
                <option value="reach">Reach</option>
                <option value="traffic">Traffic</option>
                <option value="conversions">Conversions</option>
                <option value="awareness">Awareness</option>
              </select>
            </div>
          </div>

          {/* Action Trigger Button */}
          {!result && !isLoading && (
            <button
              type="button"
              onClick={handleEnhance}
              disabled={!captionInput.trim()}
              className="w-full py-3 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white font-bold rounded-2xl text-xs shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>✨ Improve with AI</span>
            </button>
          )}
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800/80 space-y-3">
            <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-200">Analyzing post & crafting platform optimizations...</p>
            <p className="text-[11px] text-slate-500">Generating hook, caption structure, CTA, and strategy insights</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs space-y-2 text-rose-300">
            <div className="flex items-center gap-2 font-bold text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>AI Engine Request Failed</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">{error}</p>
            <button
              onClick={handleEnhance}
              className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors mt-2"
            >
              <RefreshCw className="w-3 h-3" /> Retry Generation
            </button>
          </div>
        )}

        {/* AI Result Card */}
        {result && !isLoading && (
          <div className="space-y-4 bg-slate-950 border border-slate-800 rounded-2xl p-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Check className="w-4 h-4" /> AI Optimized Version
              </span>
              <button
                type="button"
                onClick={handleEnhance}
                className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 font-medium"
              >
                <RefreshCw className="w-3 h-3" /> Regenerate
              </button>
            </div>

            {/* Hook */}
            {result.hook && (
              <div className="bg-purple-950/30 border border-purple-800/40 rounded-xl p-3 space-y-1">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Optimized Hook</span>
                <p className="text-xs text-purple-200 font-medium">{result.hook}</p>
              </div>
            )}

            {/* Improved Caption */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Improved Caption</span>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 leading-relaxed whitespace-pre-wrap">
                {result.improved_caption}
              </div>
            </div>

            {/* Call to Action */}
            {result.cta && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Call-To-Action (CTA)</span>
                <p className="text-xs text-indigo-300 bg-indigo-950/30 border border-indigo-900/40 p-2.5 rounded-xl font-medium">
                  {result.cta}
                </p>
              </div>
            )}

            {/* Recommended Hashtags */}
            {result.hashtags && result.hashtags.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recommended Hashtags</span>
                <div className="flex flex-wrap gap-1.5">
                  {result.hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-900 border border-slate-800 text-purple-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions / Strategy Tips */}
            {result.suggestions && result.suggestions.length > 0 && (
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AI Strategy Insights</span>
                <ul className="space-y-1 text-[11px] text-slate-400">
                  {result.suggestions.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-purple-400 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Decision CTAs */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                Keep Original
              </button>
              <button
                type="button"
                onClick={handleEnhance}
                className="px-4 py-2 rounded-xl text-xs font-medium text-purple-300 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Regenerate
              </button>
              <button
                type="button"
                onClick={handleUseVersion}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Use This Version
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
