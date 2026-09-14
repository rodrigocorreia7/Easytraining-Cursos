import { NextResponse, type NextRequest } from 'next/server';

const CANONICAL_HOST = 'www.easytraining.com.br';
const LEGACY_HOSTS = new Set(['easytraining.com.br']);

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET || '';
  return secret.trim().length >= 32 ? secret.trim() : 'e4a9f3b8c2d1e0f7a6b5c4d3e2f1029384756abcdeffedcba9876543210fedcba';
}

function base64UrlToText(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  return atob(padded);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function signPayload(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  const binary = String.fromCharCode(...Array.from(new Uint8Array(signature)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function isValidAdminSessionCookie(token?: string): Promise<boolean> {
  try {
    const secret = getSessionSecret();
    if (!secret || !token || !token.includes('.')) return false;

    const [payload, signature] = token.split('.');
    if (!payload || !signature) return false;

    const expectedSignature = await signPayload(payload, secret);
    if (!constantTimeEqual(signature, expectedSignature)) return false;

    const user = JSON.parse(base64UrlToText(payload));
    return typeof user?.exp === 'number' && Date.now() <= user.exp;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host')?.split(':')[0].toLowerCase();

  if (host && LEGACY_HOSTS.has(host)) {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.protocol = 'https:';
    canonicalUrl.hostname = CANONICAL_HOST;
    canonicalUrl.port = '';
    return NextResponse.redirect(canonicalUrl, 308);
  }

  // 1. Guarda Perimetral para APIs Administrativas (Defense-in-Depth)
  if (pathname.startsWith('/api/admin/')) {
    const isPublicAuthApi = pathname === '/api/admin/login' || pathname === '/api/admin/google-session';
    if (!isPublicAuthApi) {
      const adminSession = request.cookies.get('admin_session')?.value;
      const hasValidAdminSession = await isValidAdminSessionCookie(adminSession);
      if (!hasValidAdminSession) {
        return NextResponse.json({ error: 'Acesso administrativo não autorizado.' }, { status: 401 });
      }
    }
    return NextResponse.next();
  }

  // 2. Guarda para Páginas Administrativas (/admin)
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    const adminSession = request.cookies.get('admin_session')?.value;
    const hasValidAdminSession = await isValidAdminSessionCookie(adminSession);

    if (!isLoginPage && !hasValidAdminSession) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.headers.set('X-Robots-Tag', 'noindex, nofollow');
      response.cookies.set({
        name: 'admin_session',
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 0,
      });
      return response;
    }

    if (isLoginPage && hasValidAdminSession) {
      const dashboardUrl = new URL('/admin', request.url);
      const response = NextResponse.redirect(dashboardUrl);
      response.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return response;
    }

    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|logo1.svg|logo1.png|images|manifest.json).*)',
    '/api/admin/:path*'
  ],
};
