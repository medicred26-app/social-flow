import { getBackendUrl, startPlatformOAuth } from '@/lib/backend';
import { PlatformAdapter, SocialPostPayload, PlatformActionResult } from '../types';

export class InstagramAdapter implements PlatformAdapter {
  platformId = 'instagram' as const;
  displayName = 'Instagram Business';

  async connect() {
    if (typeof window !== 'undefined') {
      startPlatformOAuth('instagram');
    }
    return { success: true };
  }

  async publish(payload: SocialPostPayload): Promise<PlatformActionResult> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/platforms/instagram/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        return { success: true, platformPostId: data.platformPostId };
      }
      return { success: false, error: data.error || 'Failed to publish to Instagram' };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Failed to connect to SocialFlow backend for Instagram publishing.'
      };
    }
  }

  async disconnect(_accountId: string) {
    return { success: true };
  }

  async refreshToken(token: string) {
    return { success: true, newToken: token };
  }

  async validateToken() {
    return { valid: true };
  }
}

export const instagramAdapter = new InstagramAdapter();
