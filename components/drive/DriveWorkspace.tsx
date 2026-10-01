'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Cloud,
  FolderPlus,
  HardDrive,
  Layers,
  Play,
  RefreshCw,
  Search,
  Send,
  Unplug,
  Video,
} from 'lucide-react';
import { startPlatformOAuth } from '@/lib/backend';
import {
  DrivePointer,
  DriveStatus,
  disconnectDrive,
  fetchDriveStatus,
  fetchDriveVideos,
  importDrivePointers,
  mergeDriveVideos,
  pointerToLibraryItem,
} from '@/lib/drive';
import { getStoredLibraryItems, saveStoredLibraryItems } from '@/lib/store';
import { VideoPreviewPlayer } from '@/components/studio/VideoPreviewPlayer';

function formatDuration(seconds: number | null) {
  if (!seconds) return 'Clip';
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${mins}m ${rest}s`;
}

export function DriveWorkspace({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [status, setStatus] = useState<DriveStatus | null>(null);
  const [items, setItems] = useState<DrivePointer[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [mergeTitle, setMergeTitle] = useState('Merged 30s clips');
  const [previewId, setPreviewId] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [notif, setNotif] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedPointers = useMemo(
    () => selected.map((id) => items.find((item) => item.fileId === id)).filter(Boolean) as DrivePointer[],
    [items, selected]
  );
  const preview = items.find((item) => item.fileId === previewId) || selectedPointers[0] || items[0];

  const showMessage = (message: string, isError = false) => {
    if (isError) setError(message);
    else setNotif(message);
    setTimeout(() => {
      setNotif(null);
      setError(null);
    }, 6000);
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const nextStatus = await fetchDriveStatus();
      setStatus(nextStatus);
      if (nextStatus.connected) {
        const listed = await fetchDriveVideos(query);
        setItems(listed.items);
      } else {
        setItems([]);
      }
    } catch (err: any) {
      setError(err.message || 'Could not load Google Drive.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('drive_connected') === 'true') {
      showMessage(`Connected Google Drive${params.get('name') ? ` for ${params.get('name')}` : ''}. Videos stay in Drive.`);
      window.history.replaceState({}, '', window.location.pathname);
    } else if (params.get('error')) {
      showMessage(params.get('error') || 'Drive connection failed', true);
      window.history.replaceState({}, '', window.location.pathname);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSelect = (fileId: string) => {
    setSelected((current) =>
      current.includes(fileId) ? current.filter((id) => id !== fileId) : [...current, fileId]
    );
    setPreviewId(fileId);
  };

  const moveSelected = (fileId: string, direction: -1 | 1) => {
    setSelected((current) => {
      const index = current.indexOf(fileId);
      const next = index + direction;
      if (index < 0 || next < 0 || next >= current.length) return current;
      const copy = [...current];
      [copy[index], copy[next]] = [copy[next], copy[index]];
      return copy;
    });
  };

  const handleImport = async () => {
    if (!selected.length) return showMessage('Select one or more Drive videos first.', true);
    setBusy('import');
    try {
      const data = await importDrivePointers(selected);
      const pointers: DrivePointer[] = data.items || [];
      const current = getStoredLibraryItems();
      const imported = pointers.map((pointer) => pointerToLibraryItem(pointer));
      const withoutDupes = current.filter((item) => !imported.some((next) => next.id === item.id));
      saveStoredLibraryItems([...imported, ...withoutDupes]);
      showMessage(`Saved ${imported.length} Drive address${imported.length === 1 ? '' : 'es'} to the library. No video bytes were copied.`);
    } catch (err: any) {
      showMessage(err.message || 'Import failed', true);
    } finally {
      setBusy('');
    }
  };

  const handleMerge = async () => {
    if (selected.length < 2) return showMessage('Select at least two clips to build a longer video.', true);
    setBusy('merge');
    try {
      const data = await mergeDriveVideos(selected, mergeTitle);
      const pointer = data.item as DrivePointer;
      if (pointer) {
        const current = getStoredLibraryItems();
        saveStoredLibraryItems([pointerToLibraryItem(pointer, {
          title: mergeTitle || pointer.name,
          caption: `Merged ${selected.length} Drive clips. Result lives in your Drive/SocialFlow folder.`,
        }), ...current]);
        setItems((currentItems) => [pointer, ...currentItems.filter((item) => item.fileId !== pointer.fileId)]);
        setPreviewId(pointer.fileId);
        setSelected([pointer.fileId]);
      }
      showMessage(data.message || 'Merged clips and saved the longer video back to Drive.');
    } catch (err: any) {
      showMessage(err.message || 'Merge failed', true);
    } finally {
      setBusy('');
    }
  };

  const handlePublish = () => {
    if (!preview) return showMessage('Select a Drive video first.', true);
    sessionStorage.setItem('socialflow_studio_draft', JSON.stringify({
      title: preview.name,
      mediaUrl: preview.streamUrl,
      thumbnailUrl: preview.thumbnailUrl,
      caption: `Publishing ${preview.name} from Google Drive. SocialFlow streamed the file; it was not stored.`,
      hashtags: ['#GoogleDrive', '#SocialFlow'],
    }));
    router.push('/compose?fromDrive=true');
  };

  const handleDisconnect = async () => {
    setBusy('disconnect');
    try {
      await disconnectDrive();
      setStatus({ success: true, connected: false, storedVideos: false, account: null });
      setItems([]);
      setSelected([]);
      showMessage('Disconnected Google Drive.');
    } catch (err: any) {
      showMessage(err.message || 'Disconnect failed', true);
    } finally {
      setBusy('');
    }
  };

  return (
    <div className="space-y-6">
      {!compact && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-sky-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-sky-500/20">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Google Drive Videos
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                SocialFlow stores file addresses only. Videos stay in Drive. Merge 15–30s clips into one longer video, then the result goes back to Drive.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {status?.connected ? (
              <button
                onClick={handleDisconnect}
                disabled={busy === 'disconnect'}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-500/10 text-rose-600 border border-rose-200"
              >
                <Unplug className="w-4 h-4" />
                Disconnect Drive
              </button>
            ) : (
              <button
                onClick={() => startPlatformOAuth('drive')}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md"
              >
                <Cloud className="w-4 h-4" />
                Connect Google Drive
              </button>
            )}
          </div>
        </div>
      )}

      {(notif || error) && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
          error
            ? 'bg-rose-500/10 border border-rose-500/20 text-rose-600'
            : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600'
        }`}>
          <CheckCircle2 className="w-4 h-4" />
          <span>{error || notif}</span>
        </div>
      )}

      {!status?.connected ? (
        <div className="p-10 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <Cloud className="w-10 h-10 text-sky-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Connect Drive to use videos by address</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            After you connect, we list videos in your Drive and remember their file IDs. We do not keep a copy of the MP4.
          </p>
          <button
            onClick={() => startPlatformOAuth('drive')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
          >
            <Cloud className="w-4 h-4" />
            Connect Google Drive
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && load()}
                  placeholder="Search Drive video names..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs"
                />
              </div>
              <button
                onClick={load}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading && (
                <div className="md:col-span-2 p-8 text-center text-xs text-slate-500">Reading Drive file list…</div>
              )}
              {!loading && items.length === 0 && (
                <div className="md:col-span-2 p-8 text-center text-xs text-slate-500">
                  No videos found in this Drive. Upload or generate clips in Drive, then refresh.
                </div>
              )}
              {items.map((item) => {
                const active = selected.includes(item.fileId);
                const order = selected.indexOf(item.fileId) + 1;
                return (
                  <button
                    key={item.fileId}
                    type="button"
                    onClick={() => toggleSelect(item.fileId)}
                    className={`text-left rounded-2xl border overflow-hidden transition-all ${
                      active
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="aspect-video bg-slate-950 relative">
                      {item.thumbnailUrl ? (
                        <img src={item.thumbnailUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                          <Video className="w-8 h-8" />
                        </div>
                      )}
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-white">
                        {formatDuration(item.durationSeconds)}
                      </span>
                      {active && (
                        <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
                          {order}
                        </span>
                      )}
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Pointer · {item.fileId.slice(0, 8)}… · not stored
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="xl:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-indigo-500" />
                Streamed preview
              </h3>
              {preview ? (
                <VideoPreviewPlayer
                  title={preview.name}
                  videoUrl={preview.streamUrl}
                  aspectRatio="16:9"
                />
              ) : (
                <p className="text-xs text-slate-500">Select a clip to stream it from Drive. Nothing is saved on our servers.</p>
              )}
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-500" />
                Merge {selected.length || 0} clips
              </h3>
              <p className="text-[11px] text-slate-500">
                Pick 2–8 short clips (15–30s works best). We stream them from Drive, stitch one longer video, upload that new file back to your Drive/SocialFlow folder, then delete the temp files.
              </p>
              {selectedPointers.length > 0 && (
                <ol className="space-y-2">
                  {selectedPointers.map((item, index) => (
                    <li key={item.fileId} className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {index + 1}. {item.name}
                      </span>
                      <span className="flex gap-1 shrink-0">
                        <button type="button" onClick={() => moveSelected(item.fileId, -1)} className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">Up</button>
                        <button type="button" onClick={() => moveSelected(item.fileId, 1)} className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">Down</button>
                      </span>
                    </li>
                  ))}
                </ol>
              )}
              <input
                value={mergeTitle}
                onChange={(e) => setMergeTitle(e.target.value)}
                placeholder="Merged video title"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={handleImport}
                  disabled={busy === 'import'}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800"
                >
                  <FolderPlus className="w-4 h-4 text-indigo-500" />
                  Save pointers
                </button>
                <button
                  onClick={handleMerge}
                  disabled={busy === 'merge' || selected.length < 2}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-purple-600 text-white disabled:opacity-50"
                >
                  {busy === 'merge' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
                  Merge clips
                </button>
                <button
                  onClick={handlePublish}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white"
                >
                  <Send className="w-4 h-4" />
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
