import { getBackendUrl } from '@/lib/backend';
import { ContentItem, MediaItem } from '@/types';

export type DrivePointer = {
  fileId: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  durationSeconds: number | null;
  thumbnailUrl: string;
  driveUrl: string;
  modifiedAt: string | null;
  stored: false;
  source: 'google_drive';
  streamUrl: string;
};

export type DriveStatus = {
  success: boolean;
  connected: boolean;
  storedVideos: boolean;
  mode?: string;
  account?: { id?: string; name?: string; email?: string; avatar?: string } | null;
  error?: string;
};

async function parseDrive(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data.error || data.message || `Drive request failed (${res.status})`);
  }
  return data;
}

export function driveApi(path: string) {
  return `${getBackendUrl()}/api/platforms/drive${path}`;
}

export function formatDriveSize(bytes?: number) {
  const value = Number(bytes || 0);
  if (!value) return '';
  if (value < 1024 * 1024) return `${Math.max(1, Math.round(value / 1024))} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export function pointerToMedia(pointer: DrivePointer): MediaItem {
  return {
    id: `drv-${pointer.fileId}`,
    url: pointer.streamUrl,
    type: 'video',
    name: pointer.name,
    size: formatDriveSize(pointer.sizeBytes),
    driveFileId: pointer.fileId,
    stored: false,
  };
}

export function pointerToLibraryItem(pointer: DrivePointer, extra: Partial<ContentItem> = {}): ContentItem {
  const now = new Date().toISOString();
  return {
    id: `lib-drive-${pointer.fileId}`,
    title: pointer.name.replace(/\.[a-z0-9]+$/i, ''),
    description: 'Google Drive pointer. The video stays in Drive; SocialFlow only stores this file address.',
    media: [pointerToMedia(pointer)],
    thumbnailUrl: pointer.thumbnailUrl || pointer.streamUrl,
    caption: extra.caption || `Imported from Google Drive: ${pointer.name}`,
    hashtags: extra.hashtags || ['#GoogleDrive', '#SocialFlow'],
    contentType: 'video',
    creationSource: 'google_drive',
    status: 'ready',
    createdAt: now,
    updatedAt: now,
    ...extra,
  };
}

export async function fetchDriveStatus(): Promise<DriveStatus> {
  return parseDrive(await fetch(driveApi('/status'), { cache: 'no-store' }));
}

export async function fetchDriveVideos(query = ''): Promise<{ items: DrivePointer[]; nextPageToken: string | null }> {
  const url = new URL(driveApi('/files'));
  if (query.trim()) url.searchParams.set('q', query.trim());
  const data = await parseDrive(await fetch(url.toString(), { cache: 'no-store' }));
  return {
    items: Array.isArray(data.items) ? data.items : [],
    nextPageToken: data.nextPageToken || null,
  };
}

export async function importDrivePointers(fileIds: string[]) {
  return parseDrive(
    await fetch(driveApi('/import'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileIds }),
    })
  );
}

export async function mergeDriveVideos(fileIds: string[], title: string) {
  return parseDrive(
    await fetch(driveApi('/merge'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileIds, title }),
    })
  );
}

export async function disconnectDrive() {
  return parseDrive(
    await fetch(driveApi('/disconnect'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
  );
}
