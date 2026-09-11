export { getBackendUrl, startPlatformOAuth } from './backend';
import { getBackendUrl } from './backend';

async function parseAi(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data.error || data.message || `AI request failed (${res.status})`);
  }
  return data;
}

export async function aiPost(path: string, body: Record<string, unknown>) {
  return parseAi(
    await fetch(`${getBackendUrl()}/api/ai${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  );
}
