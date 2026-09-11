import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/lib/backend';

const PLATFORMS = new Set(['facebook', 'instagram', 'youtube', 'x', 'linkedin']);

export async function GET(request: NextRequest) {
  const platform = (request.nextUrl.searchParams.get('platform') || '').toLowerCase();
  const origin = request.nextUrl.origin;

  if (!PLATFORMS.has(platform)) {
    return NextResponse.redirect(new URL('/accounts?error=Unknown%20social%20platform', origin));
  }

  const target = new URL(`/api/platforms/${platform}/oauth`, `${getBackendUrl()}/`);
  target.searchParams.set('frontend', origin);
  return NextResponse.redirect(target);
}
