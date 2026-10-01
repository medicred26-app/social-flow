'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Send, Upload } from 'lucide-react';
import { getStoredLibraryItems, saveStoredLibraryItems } from '@/lib/store';
import { mediaToLibraryItem, resolveStudioUrl, uploadDirectVideo } from '@/lib/video-sources';
import { VideoPreviewPlayer } from '@/components/studio/VideoPreviewPlayer';

export function UploadVideoPanel() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const data = await uploadDirectVideo(file, setProgress);
      const url = resolveStudioUrl(data.item?.url || data.item?.streamUrl);
      setVideoUrl(url);
      const itemTitle = title.trim() || file.name;
      saveStoredLibraryItems([
        mediaToLibraryItem(
          {
            id: data.item?.id || `up-${Date.now()}`,
            url,
            type: 'video',
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            stored: true,
          },
          {
            title: itemTitle,
            caption: `Uploaded to SocialFlow storage: ${file.name}`,
            creationSource: 'user_upload',
            description: 'Direct upload. The file is stored in SocialFlow, not only as a Drive pointer.',
          }
        ),
        ...getStoredLibraryItems(),
      ]);
      setMessage(data.message || 'Video stored in SocialFlow.');
    } catch (err: any) {
      setError(err.message || 'Upload failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div className="xl:col-span-5 space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Upload className="w-4 h-4 text-emerald-500" />
          Upload to SocialFlow storage
        </h3>
        <p className="text-[11px] text-slate-500">
          This is the copy-in method. We keep the file so you can preview and publish even if Drive is disconnected. MP4, MOV, or WebM up to 80 MB.
        </p>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs"
        />
        <label className="block rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center cursor-pointer hover:border-emerald-400">
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime,.mp4,.mov,.webm"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            {file ? file.name : 'Click to choose a video'}
          </p>
          {file && (
            <p className="text-[11px] text-slate-500 mt-1">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
          )}
        </label>
        {busy && (
          <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || busy}
          className="w-full py-3 rounded-xl text-xs font-bold bg-emerald-600 text-white disabled:opacity-50"
        >
          {busy ? 'Uploading…' : 'Upload to SocialFlow'}
        </button>
      </div>

      <div className="xl:col-span-7 space-y-4">
        {(message || error) && (
          <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
            error ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
          }`}>
            <CheckCircle2 className="w-4 h-4" />
            <span>{error || message}</span>
          </div>
        )}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5">
          {videoUrl ? (
            <>
              <VideoPreviewPlayer title={title || file?.name || 'Uploaded video'} videoUrl={videoUrl} aspectRatio="16:9" />
              <button
                type="button"
                onClick={() => {
                  sessionStorage.setItem('socialflow_studio_draft', JSON.stringify({
                    title: title || file?.name,
                    mediaUrl: videoUrl,
                    caption: `Uploaded video: ${file?.name || title}`,
                    hashtags: ['#SocialFlow'],
                  }));
                  router.push('/compose?fromUpload=true');
                }}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white"
              >
                <Send className="w-4 h-4" />
                Send to Publisher
              </button>
            </>
          ) : (
            <p className="text-xs text-slate-500">After upload, the stored file plays here. This is a real copy, not a Drive pointer.</p>
          )}
        </div>
      </div>
    </div>
  );
}
