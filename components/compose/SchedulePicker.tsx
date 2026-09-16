'use client';

import React from 'react';
import { Calendar, Clock, Send, Zap } from 'lucide-react';

interface SchedulePickerProps {
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onPublishNow: () => void;
  onScheduleLater: () => void;
  onSaveDraft?: () => void;
  isSubmitting: boolean;
  canSubmit: boolean;
}

export function SchedulePicker({
  scheduledDate,
  scheduledTime,
  onDateChange,
  onTimeChange,
  onPublishNow,
  onScheduleLater,
  onSaveDraft,
  isSubmitting,
  canSubmit,
}: SchedulePickerProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          <span>Publishing Schedule</span>
        </h3>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          💡 Best Time: 10:00 AM &amp; 6:30 PM
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Date Input */}
        <div>
          <label className="text-[11px] text-slate-400 font-medium mb-1 block">Date</label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Time Input */}
        <div>
          <label className="text-[11px] text-slate-400 font-medium mb-1 block">Time</label>
          <div className="relative">
            <Clock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => onTimeChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        {onSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            Save Draft
          </button>
        )}

        <button
          type="button"
          onClick={onPublishNow}
          disabled={!canSubmit || isSubmitting}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>Publish Now</span>
        </button>

        <button
          type="button"
          onClick={onScheduleLater}
          disabled={!canSubmit || isSubmitting}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
        >
          <Send className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
          <span>{isSubmitting ? 'Processing...' : 'Schedule Queue'}</span>
        </button>
      </div>
    </div>
  );
}
