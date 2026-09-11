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

export async function generateAiVideo(
  body: Record<string, unknown>,
  onStatus?: (status: string) => void
) {
  const started = await aiPost('/video/generate', body);
  if (started.videoUrl || started.storyboard) return started;
  if (!started.jobId) {
    throw new Error(started.error || 'Video job did not start.');
  }

  const deadline = Date.now() + 240000;
  while (Date.now() < deadline) {
    onStatus?.(started.status || 'queued');
    await new Promise((resolve) => setTimeout(resolve, 2500));
    const job = await parseAi(
      await fetch(`${getBackendUrl()}/api/ai/video/jobs/${started.jobId}`, { cache: 'no-store' })
    );
    onStatus?.(job.status || 'running');
    if (job.status === 'done') return job;
    if (job.status === 'error' || job.success === false) {
      throw new Error(job.error || 'Video generation failed.');
    }
  }
  throw new Error('Video generation timed out. Try again in a minute.');
}
