export function getBackendUrl() {
  const raw = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '');
  if (raw) return raw;
  if (process.env.NODE_ENV === 'production') return 'https://socialflow-api.onrender.com';
  return 'http://localhost:5000';
}

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
