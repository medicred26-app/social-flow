import { PlatformAdapter, SocialPostPayload, PlatformActionResult } from '../types';

export class YouTubeAdapter implements PlatformAdapter {
  platformId = 'youtube' as const;
  displayName = 'YouTube Channel';

  async connect(params?: any) {
    if (typeof window !== 'undefined') {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      window.location.href = `${backendUrl}/api/platforms/youtube/oauth`;
    }
    return { success: true };
  }

  async publish(payload: SocialPostPayload): Promise<PlatformActionResult> {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/platforms/youtube/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        return { success: true, platformPostId: data.platformPostId };
      }
      return { success: false, error: data.error || 'Failed to upload to YouTube' };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Failed to connect to SocialFlow backend for YouTube publishing.'
      };
    }
  }

  async disconnect(accountId: string) {
    return { success: true };
  }

  async refreshToken(token: string) {
    return { success: true, newToken: token };
  }

  async validateToken(token: string) {
    return { valid: true };
  }
}

export const youtubeAdapter = new YouTubeAdapter();
