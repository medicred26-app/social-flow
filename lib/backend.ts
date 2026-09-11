const PROD_API = 'https://socialflow-api.onrender.com';

function stripSlash(url: string) {
  return url.replace(/\/$/, '');
}

function isLocalUrl(url: string) {
  return !url || /localhost|127\.0\.0\.1/i.test(url);
}

function isBrowsingLocal() {
  return typeof window !== 'undefined' && isLocalUrl(window.location.hostname);
}

export function getBackendUrl() {
  const raw = stripSlash(process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || '');
  if (isBrowsingLocal()) {
    return raw || 'http://localhost:5000';
  }
  if (process.env.NODE_ENV === 'production' || (typeof window !== 'undefined' && !isBrowsingLocal())) {
    return isLocalUrl(raw) ? PROD_API : raw;
  }
  return raw || 'http://localhost:5000';
}

export function startPlatformOAuth(platform: string) {
  const url = new URL('/api/oauth/start', window.location.origin);
  url.searchParams.set('platform', platform);
  window.location.href = url.toString();
}
