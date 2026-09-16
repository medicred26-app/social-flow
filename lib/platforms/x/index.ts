import { PlatformAdapter, SocialPostPayload, PlatformActionResult } from '../types';

export class XAdapter implements PlatformAdapter {
  platformId = 'x' as const;
  displayName = 'X (Twitter)';

  async connect(params?: any) {
    if (typeof window !== 'undefined') {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      window.location.href = `${backendUrl}/api/platforms/x/oauth`;
    }
    return { success: true };
  }

  async publish(payload: SocialPostPayload): Promise<PlatformActionResult> {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/platforms/x/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        return { success: true, platformPostId: data.platformPostId };
      }
      return { success: false, error: data.error || 'Failed to post Tweet' };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Failed to connect to SocialFlow backend for X (Twitter) publishing.'
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

export const xAdapter = new XAdapter();
