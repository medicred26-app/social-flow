'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, KeyRound, RefreshCw, Send, Sparkles, Trash2 } from 'lucide-react';
import { getStoredLibraryItems, saveStoredLibraryItems } from '@/lib/store';
import {
  deleteClientApiKey,
  fetchClientKeyStatus,
  generateWithClientKey,
  mediaToLibraryItem,
  resolveStudioUrl,
  saveClientApiKey,
} from '@/lib/video-sources';
import { VideoPreviewPlayer } from '@/components/studio/VideoPreviewPlayer';

export function GenerateWithKeyPanel() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [masked, setMasked] = useState('');
  const [prompt, setPrompt] = useState('A bright 8-second product reel: a creator opens SocialFlow and one script becomes YouTube, Instagram, and Facebook clips.');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [durationSeconds, setDurationSeconds] = useState(8);
  const [videoUrl, setVideoUrl] = useState('');
  const [busy, setBusy] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClientKeyStatus()
      .then((data) => setMasked(data.masked || ''))
      .catch(() => undefined);
  }, []);

  const handleSaveKey = async () => {
    setBusy('key');
    setError('');
    try {
      const data = await saveClientApiKey(apiKey);
      setMasked(data.masked || '');
      setApiKey('');
      setStatus(data.message || 'API key saved.');
    } catch (err: any) {
      setError(err.message || 'Could not save the key.');
    } finally {
      setBusy('');
    }
  };

  const handleGenerate = async () => {
    setBusy('generate');
    setError('');
    setStatus('Starting generation on your Gemini key...');
    try {
      const data = await generateWithClientKey(
        { prompt, apiKey: apiKey || undefined, aspectRatio, durationSeconds },
        (message) => setStatus(message)
      );
      const url = resolveStudioUrl(data.videoUrl);
      if (!url) throw new Error(data.error || 'Gemini did not return a video. This key may have no Veo quota. Enable billing in AI Studio.');
      setVideoUrl(url);
      saveStoredLibraryItems([
        mediaToLibraryItem(
          { id: `gen-${Date.now()}`, url, type: 'video', name: 'generated-veo.mp4', stored: true },
          {
            title: prompt.slice(0, 60),
            caption: prompt,
            creationSource: 'ai_generated',
            description: `Generated with the workspace Gemini API key (${data.model || 'Veo'}).`,
          }
        ),
        ...getStoredLibraryItems(),
      ]);
      setStatus(data.message || 'Video ready. It is stored for preview and publish.');
      if (data.masked) setMasked(data.masked);
    } catch (err: any) {
      setError(err.message || 'Generation failed.');
    } finally {
      setBusy('');
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div className="xl:col-span-6 space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-amber-500" />
          Your Gemini API key
        </h3>
        <p className="text-[11px] text-slate-500">
          Paste a billed AI Studio key. SocialFlow uses it only to call Veo / Omni for this prompt. We store the key encrypted and never show it again.
        </p>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={masked ? `Saved key ${masked}` : 'AIza... from Google AI Studio'}
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSaveKey}
            disabled={!apiKey || busy === 'key'}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white disabled:opacity-50"
          >
            Save key
          </button>
          {masked && (
            <button
              type="button"
              onClick={async () => {
                await deleteClientApiKey();
                setMasked('');
                setStatus('Removed the saved key.');
              }}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600"
            >
              <Trash2 className="w-3.5 h-3.5 inline mr-1" />
              Remove
            </button>
          )}
        </div>

        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Prompt</label>
        <textarea
          rows={5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs"
        />
        <div className="grid grid-cols-2 gap-3">
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value as '9:16' | '16:9')}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs"
          >
            <option value="9:16">9:16 vertical</option>
            <option value="16:9">16:9 landscape</option>
          </select>
          <select
            value={durationSeconds}
            onChange={(e) => setDurationSeconds(Number(e.target.value))}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs"
          >
            <option value={4}>4 seconds</option>
            <option value={6}>6 seconds</option>
            <option value={8}>8 seconds</option>
          </select>
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={busy === 'generate' || (!apiKey && !masked) || prompt.trim().length < 8}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-600 text-white disabled:opacity-50"
        >
          {busy === 'generate' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Generate with my API key
        </button>
      </div>

      <div className="xl:col-span-6 space-y-4">
        {(status || error) && (
          <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
            error ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
          }`}>
            <CheckCircle2 className="w-4 h-4" />
            <span>{error || status}</span>
          </div>
        )}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5">
          {videoUrl ? (
            <>
              <VideoPreviewPlayer title="Generated with your key" videoUrl={videoUrl} aspectRatio={aspectRatio} />
              <button
                type="button"
                onClick={() => {
                  sessionStorage.setItem('socialflow_studio_draft', JSON.stringify({
                    title: prompt.slice(0, 60),
                    mediaUrl: videoUrl,
                    caption: prompt,
                    hashtags: ['#Veo', '#SocialFlow'],
                  }));
                  router.push('/compose?fromGenerate=true');
                }}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white"
              >
                <Send className="w-4 h-4" />
                Send to Publisher
              </button>
            </>
          ) : (
            <p className="text-xs text-slate-500">The generated MP4 will appear here. It is stored in SocialFlow so you can publish it without keeping the raw prompt job.</p>
          )}
        </div>
      </div>
    </div>
  );
}
