'use client';

import React, { useState } from 'react';
import { Upload, X, Check, AlertCircle, FileText, Video, Image as ImageIcon, Sparkles, FolderPlus } from 'lucide-react';
import { UploadMetadata, MediaItem } from '@/types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (media: MediaItem, metadata: UploadMetadata) => void;
}

export function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const [contentType, setContentType] = useState<'video' | 'image' | 'ppt' | 'pdf'>('video');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Product Showcase');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('SocialMedia, SaaS, Automation');
  const [language, setLanguage] = useState('English (US)');
  const [file, setFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // File validation
    const maxMb = 50;
    if (selected.size > maxMb * 1024 * 1024) {
      setError(`File size exceeds limit of ${maxMb}MB.`);
      return;
    }

    setError(null);
    setFile(selected);

    // Default title if empty
    if (!title) {
      const nameNoExt = selected.name.replace(/\.[^/.]+$/, '');
      setTitle(nameNoExt.replace(/[-_]/g, ' '));
    }

    // Generate object URL for preview if image/video
    if (selected.type.startsWith('image/') || selected.type.startsWith('video/')) {
      const url = URL.createObjectURL(selected);
      setFilePreviewUrl(url);
    } else {
      setFilePreviewUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title for the uploaded asset.');
      return;
    }

    setIsUploading(true);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean)
      .map((t) => `#${t}`);

    const fallbackUrl =
      contentType === 'video'
        ? 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&auto=format&fit=crop&q=80';

    const finalUrl = filePreviewUrl || fallbackUrl;

    const mediaItem: MediaItem = {
      id: `m-upload-${Date.now()}`,
      url: finalUrl,
      type: contentType === 'video' ? 'video' : 'image',
      name: file ? file.name : `${title.toLowerCase().replace(/\s+/g, '_')}.${contentType === 'video' ? 'mp4' : contentType === 'pdf' ? 'pdf' : 'png'}`,
      size: file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : '4.2 MB',
    };

    const metadata: UploadMetadata = {
      title,
      category,
      description,
      tags,
      language,
      contentType,
      previewUrl: finalUrl,
    };

    setTimeout(() => {
      setIsUploading(false);
      onUploadSuccess(mediaItem, metadata);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-xl w-full space-y-6 shadow-2xl animate-in zoom-in-95 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white rounded-2xl shadow-lg shadow-indigo-500/20">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                Upload Content Asset
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload videos, PPT slides, images or PDF documents with metadata validation
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Type Switcher */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Select Asset Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'video', label: 'Video', icon: Video },
                { id: 'image', label: 'Image', icon: ImageIcon },
                { id: 'ppt', label: 'PPT / Slides', icon: FileText },
                { id: 'pdf', label: 'PDF Document', icon: FileText },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setContentType(t.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      contentType === t.id
                        ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Drag & Drop Box */}
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl p-6 text-center space-y-2 bg-slate-50 dark:bg-slate-950 transition-colors relative cursor-pointer">
            <input
              type="file"
              onChange={handleFileDrop}
              accept={
                contentType === 'video'
                  ? 'video/*'
                  : contentType === 'image'
                  ? 'image/*'
                  : contentType === 'pdf'
                  ? '.pdf'
                  : '.ppt,.pptx,.pdf'
              }
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {file ? (
              <div className="space-y-1">
                <Check className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold text-slate-900 dark:text-white">{file.name}</p>
                <p className="text-[11px] text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready</p>
              </div>
            ) : (
              <div className="space-y-1">
                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Drag &amp; drop your {contentType.toUpperCase()} file here
                </p>
                <p className="text-[11px] text-slate-500">Supports up to 50MB files (MP4, MOV, PNG, JPG, PDF, PPTX)</p>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Metadata Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Asset Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Q4 Growth Strategy Deck"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Product Showcase">Product Showcase</option>
                <option value="Educational / How-To">Educational / How-To</option>
                <option value="Behind The Scenes">Behind The Scenes</option>
                <option value="Event / Webinar">Event / Webinar</option>
                <option value="Client Testimonial">Client Testimonial</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context or key summary points for AI enhancement..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Tags (Comma Separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="SocialFlow, Tech, SaaS"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="English (US)">English (US)</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs rounded-xl shadow-md hover:opacity-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isUploading ? (
                <>Processing File...</>
              ) : (
                <>
                  <FolderPlus className="w-4 h-4" />
                  <span>Attach Asset &amp; Continue Workflow</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
