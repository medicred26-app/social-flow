const PROD_API = 'https://socialflow-api-7ulz.onrender.com';
const DEAD_API_HOSTS = ['socialflow-api.onrender.com'];

function stripSlash(url: string) {
  return url.replace(/\/$/, '');
}

function isLocalUrl(url: string) {
  return !url || /localhost|127\.0\.0\.1/i.test(url);
}

function isDeadApi(url: string) {
  return DEAD_API_HOSTS.some((host) => url.includes(host));
}

function isBrowsingLocal() {
  return typeof window !== 'undefined' && isLocalUrl(window.location.hostname);
}

export function getBackendUrl() {
  const raw = stripSlash(process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || '');
  if (isBrowsingLocal()) {
    return raw && !isDeadApi(raw) ? raw : 'http://localhost:5000';
  }
  if (!raw || isLocalUrl(raw) || isDeadApi(raw)) {
    return PROD_API;
  }
  return raw;
}

export function startPlatformOAuth(platform: string) {
  const url = new URL(`/api/platforms/${platform}/oauth`, `${getBackendUrl()}/`);
  if (typeof window !== 'undefined') {
    url.searchParams.set('frontend', window.location.origin);
  }
  window.location.href = url.toString();
}
