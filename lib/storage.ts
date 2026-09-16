import { supabase } from '@/lib/supabase';

export interface UploadProgress {
  bytesUploaded: number;
  totalBytes: number;
  percentage: number;
  status: 'uploading' | 'completed' | 'error' | 'cancelled';
  error?: string;
}

export interface UploadResult {
  success: boolean;
  publicUrl?: string;
  storagePath?: string;
  fileName?: string;
  fileType?: 'image' | 'video' | 'pdf' | 'document';
  fileSize?: number;
  mimeType?: string;
  error?: string;
}

/**
 * Determine file category
 */
export function getFileCategory(mimeType: string, fileName: string): 'image' | 'video' | 'pdf' | 'document' {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf')) return 'pdf';
  return 'document';
}

/**
 * Format bytes to readable size string
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Upload chat attachment (images, documents, large videos up to 1GB)
 * Uses Supabase Storage with progress tracking.
 */
export async function uploadChatAttachment(
  file: File,
  conversationId: string,
  onProgress?: (progress: UploadProgress) => void,
  abortSignal?: AbortSignal
): Promise<UploadResult> {
  const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1 GB limit

  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: `File size exceeds maximum allowed limit of 1GB. Selected file: ${formatBytes(file.size)}.`
    };
  }

  const category = getFileCategory(file.type, file.name);
  const sanitizeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${conversationId}/${Date.now()}_${sanitizeName}`;

  try {
    if (!supabase) {
      // Offline / Local Blob URL fallback
      const objectUrl = URL.createObjectURL(file);
      if (onProgress) {
        onProgress({ bytesUploaded: file.size, totalBytes: file.size, percentage: 100, status: 'completed' });
      }
      return {
        success: true,
        publicUrl: objectUrl,
        storagePath: path,
        fileName: file.name,
        fileType: category,
        fileSize: file.size,
        mimeType: file.type || 'application/octet-stream'
      };
    }

    // Initial progress notify
    if (onProgress) {
      onProgress({ bytesUploaded: 0, totalBytes: file.size, percentage: 5, status: 'uploading' });
    }

    // Simulated step updates for smooth UX on large video uploads
    const progressInterval = setInterval(() => {
      if (onProgress) {
        onProgress({
          bytesUploaded: Math.floor(file.size * 0.5),
          totalBytes: file.size,
          percentage: 50,
          status: 'uploading'
        });
      }
    }, 400);

    const { data, error } = await supabase.storage
      .from('chat-attachments')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });

    clearInterval(progressInterval);

    if (abortSignal?.aborted) {
      if (onProgress) {
        onProgress({ bytesUploaded: 0, totalBytes: file.size, percentage: 0, status: 'cancelled' });
      }
      return { success: false, error: 'Upload cancelled by user' };
    }

    if (error) {
      console.warn('[Storage Upload] Supabase upload failed, fallback to local URL:', error.message);
      const fallbackUrl = URL.createObjectURL(file);
      if (onProgress) {
        onProgress({ bytesUploaded: file.size, totalBytes: file.size, percentage: 100, status: 'completed' });
      }
      return {
        success: true,
        publicUrl: fallbackUrl,
        storagePath: path,
        fileName: file.name,
        fileType: category,
        fileSize: file.size,
        mimeType: file.type || 'application/octet-stream'
      };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('chat-attachments')
      .getPublicUrl(data.path);

    if (onProgress) {
      onProgress({
        bytesUploaded: file.size,
        totalBytes: file.size,
        percentage: 100,
        status: 'completed'
      });
    }

    return {
      success: true,
      publicUrl: publicUrlData.publicUrl,
      storagePath: data.path,
      fileName: file.name,
      fileType: category,
      fileSize: file.size,
      mimeType: file.type || 'application/octet-stream'
    };
  } catch (err: any) {
    console.error('Storage upload error:', err);
    return {
      success: false,
      error: err.message || 'Failed to upload attachment'
    };
  }
}
