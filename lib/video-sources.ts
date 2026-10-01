import { getBackendUrl } from '@/lib/backend';
import { ContentItem, MediaItem } from '@/types';

export type VideoMethod = 'drive' | 'generate' | 'upload';

export function resolveStudioUrl(url?: string) {
  if (!url) return '';
  if (url.startsWith('/')) return `${getBackendUrl()}${url}`;
  return url;
}

function parseJson(res: Response, fallback = 'Request failed') {
  return res.json().then((data) => {
    if (!res.ok || data.success === false) {
      throw new Error(data.error || data.message || `${fallback} (${res.status})`);
    }
    return data;
  });
}

export function mediaToLibraryItem(media: MediaItem, extra: Partial<ContentItem> = {}): ContentItem {
  const now = new Date().toISOString();
  return {
    id: extra.id || `lib-${Date.now()}`,
    title: extra.title || media.name.replace(/\.[a-z0-9]+$/i, ''),
    description: extra.description || '',
    media: [media],
    thumbnailUrl: extra.thumbnailUrl || media.url,
    caption: extra.caption || media.name,
    hashtags: extra.hashtags || ['#SocialFlow'],
    contentType: 'video',
    creationSource: extra.creationSource || 'user_upload',
    status: 'ready',
    createdAt: now,
    updatedAt: now,
    ...extra,
  };
}

export async function fetchClientKeyStatus() {
  return parseJson(await fetch(`${getBackendUrl()}/api/ai/keys/status`, { cache: 'no-store' }), 'Could not read API key status');
}

export async function saveClientApiKey(apiKey: string) {
  return parseJson(
    await fetch(`${getBackendUrl()}/api/ai/keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey }),
    }),
    'Could not save API key'
  );
}

export async function deleteClientApiKey() {
  return parseJson(
    await fetch(`${getBackendUrl()}/api/ai/keys`, { method: 'DELETE' }),
    'Could not remove API key'
  );
}

export async function generateWithClientKey(
  body: { prompt: string; apiKey?: string; aspectRatio?: string; durationSeconds?: number },
  onStatus?: (status: string) => void
) {
  const started = await parseJson(
    await fetch(`${getBackendUrl()}/api/ai/video/generate-direct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
    'Could not start generation'
  );
  if (started.videoUrl) return started;
  if (!started.jobId) throw new Error(started.error || 'Video job did not start.');

  const deadline = Date.now() + 180000;
  while (Date.now() < deadline) {
    onStatus?.(started.message || started.status || 'queued');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const job = await parseJson(
      await fetch(`${getBackendUrl()}/api/ai/video/jobs/${started.jobId}`, { cache: 'no-store' }),
      'Could not read generation status'
    );
    onStatus?.(job.message || job.status || 'running');
    if (job.status === 'done') return job;
    if (job.status === 'error' || job.success === false) {
      throw new Error(job.error || 'Video generation failed.');
    }
  }
  throw new Error('Generation timed out. The key may still be rendering — try again in a minute.');
}

export async function uploadDirectVideo(file: File, onProgress?: (pct: number) => void) {
  const form = new FormData();
  form.append('video', file);
  if (onProgress) onProgress(15);
  const res = await fetch(`${getBackendUrl()}/api/media/upload`, {
    method: 'POST',
    body: form,
  });
  if (onProgress) onProgress(90);
  const data = await parseJson(res, 'Upload failed');
  if (onProgress) onProgress(100);
  return data;
}

export async function listUploadedVideos() {
  return parseJson(await fetch(`${getBackendUrl()}/api/media`, { cache: 'no-store' }), 'Could not list uploads');
}
