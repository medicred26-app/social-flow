'use client';

import React from 'react';
import { Layout, X, Sparkles, ArrowRight, Check } from 'lucide-react';
import { INITIAL_TEMPLATES, SocialTemplate } from '@/lib/store';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: SocialTemplate) => void;
}

export function TemplatesModal({ isOpen, onClose, onSelectTemplate }: TemplatesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-2xl w-full space-y-6 shadow-2xl animate-in zoom-in-95 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white rounded-2xl shadow-lg shadow-indigo-500/20">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                High-Converting Social Templates
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select a pre-designed layout structure to jumpstart your multi-platform post
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {INITIAL_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => {
                onSelectTemplate(tpl);
                onClose();
              }}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-950 transition-all cursor-pointer space-y-3 flex flex-col justify-between group interactive-panel"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-xs text-slate-900 dark:text-white">{tpl.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    {tpl.aspectRatio}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{tpl.description}</p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                "{tpl.suggestedCaption}"
              </div>

              <button className="w-full py-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">
                <span>Use Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
