import { NextResponse, type NextRequest } from 'next/server';

const CANONICAL_HOST = 'www.easytraining.com.br';
const LEGACY_HOSTS = new Set(['easytraining.com.br']);
const BLOCKED_LEGACY_PATHS = [
  '/xmlrpc.php',
  '/wp-login.php',
  '/wp-admin',
  '/wp-content',
  '/wp-includes',
  '/wp-json',
  '/admin/uploader',
];

function isBlockedLegacyPath(pathname: string): boolean {
  const normalizedPath = pathname.toLowerCase().replace(/\/+$/, '') || '/';

  return BLOCKED_LEGACY_PATHS.some((blockedPath) => (
    normalizedPath === blockedPath || normalizedPath.startsWith(`${blockedPath}/`)
  ));
}

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

// -----------------------------------------------------------------------------
// MAPA CANÔNICO DE REDIRECIONAMENTOS DE SALTO ÚNICO (SINGLE-HOP 301)
// Consolida todas as URLs antigas do WordPress, permalinks da raiz e aliases
// diretamente no destino canônico final em 1 único salto (< 20ms no Edge).
// -----------------------------------------------------------------------------
const CANONICAL_REDIRECTS: Record<string, string> = {
  // 1. Artigos de Blog Legados do WordPress (migrados da raiz para /blog/[slug])
  '/carreira-em-medicina-veterinaria-vale-a-pena': '/blog/carreira-em-medicina-veterinaria-vale-a-pena',
  '/descubra-a-importancia-de-um-curso-de-informatica-basica': '/blog/descubra-a-importancia-de-um-curso-de-informatica-basica',
  '/o-que-se-faz-em-um-curso-de-informatica': '/blog/o-que-se-faz-em-um-curso-de-informatica',
  '/importancia-do-excel-no-mercado-de-trabalho': '/blog/importancia-do-excel-no-mercado-de-trabalho',
  '/guia-definitivo-curso-auxiliar-veterinario-guarulhos': '/blog/guia-definitivo-curso-auxiliar-veterinario-guarulhos',
  '/jovem-aprendiz-2026-guarulhos-idade-salario': '/blog/jovem-aprendiz-2026-guarulhos-idade-salario',
  '/como-ser-estagiario-pelo-ciee-guia-completo-e-dicas-essenciais': '/blog/como-ser-estagiario-pelo-ciee-guia-completo-e-dicas-essenciais',
  '/curso-de-informatica-basicadesvende-o-mundo-digital': '/blog/curso-de-informatica-basicadesvende-o-mundo-digital',
  '/a-importancia-da-educacao-profissionalizante-para-o-mercado-de-trabalho': '/blog/a-importancia-da-educacao-profissionalizante-para-o-mercado-de-trabalho',
  '/curso-de-auxiliar-de-veterinario-tudo-que-voce-precisa-saber': '/blog/curso-de-auxiliar-de-veterinario-tudo-que-voce-precisa-saber',
  '/cursos-presenciais-ou-online-em-guarulhos': '/blog/cursos-presenciais-ou-online-em-guarulhos',
  '/qualificacao-profissional-em-guarulhos': '/blog/qualificacao-profissional-em-guarulhos',
  '/cursos-livres-em-guarulhos': '/blog/cursos-livres-em-guarulhos',
  '/cursos-profissionalizantes-em-guarulhos': '/blog/cursos-profissionalizantes-em-guarulhos',
  // No WordPress, este slug na raiz era um artigo. O curso equivalente
  // continua em /curso/auxiliar-de-farmacia.
  '/auxiliar-de-farmacia': '/blog/auxiliar-de-farmacia',
  '/mercado-de-trabalho': '/blog/a-importancia-da-educacao-profissionalizante-para-o-mercado-de-trabalho',

  // 2. Cursos e Aliases Legados (da raiz ou aliases /curso/ para o slug oficial /curso/[slug])
  '/curso/informatica-basica': '/curso/curso-de-informatica-basica',
  '/curso/curso-de-informatica': '/curso/informatica',
  '/curso/curso-de-informatica-em-guarulhos': '/curso/informatica',
  '/curso/curso-de-informatica-basica-em-guarulhos': '/curso/curso-de-informatica-basica',
  '/curso/curso-de-excel-avancado': '/curso/excel-avancado',
  '/curso/curso-auxiliar-veterinario': '/curso/auxiliar-veterinario',
  '/curso/curso-de-auxiliar-veterinario': '/curso/auxiliar-veterinario',
  '/curso/curso-de-auxiliar-veterinario-em-guarulhos': '/curso/auxiliar-veterinario',
  '/curso/banho-e-tosa': '/curso/banho-e-tosa-higienica',
  '/curso/tosa-pet': '/curso/curso-de-tosa-pet-geral-em-guarulhos-sp',
  '/curso/tosa-pet-geral': '/curso/curso-de-tosa-pet-geral-em-guarulhos-sp',
  '/curso/recursos-humanos': '/curso/assistente-de-recursos-humanos',
  '/curso/logistica': '/curso/assistente-de-logistica',
  '/curso/contabilidade': '/curso/auxiliar-de-contabilidade',
  '/curso-de-informatica': '/curso/informatica',
  '/informatica-basica': '/curso/curso-de-informatica-basica',
  '/auxiliar-veterinario': '/curso/auxiliar-veterinario',
  '/curso-auxiliar-veterinario': '/curso/auxiliar-veterinario',
  '/curso-de-auxiliar-veterinario': '/curso/auxiliar-veterinario',
  '/banho-e-tosa': '/curso/banho-e-tosa-higienica',
  '/recursos-humanos': '/curso/assistente-de-recursos-humanos',
  '/logistica': '/curso/assistente-de-logistica',
  '/contabilidade': '/curso/auxiliar-de-contabilidade',
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host')?.split(':')[0].toLowerCase();

  // Bloqueia sondagens de endpoints WordPress antes que qualquer rota seja executada.
  if (isBlockedLegacyPath(pathname)) {
    const response = new NextResponse(null, { status: 404 });
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=300');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  // 2. Resolução Canônica de Salto Único (Single-Hop 301) para SEO e Backlinks
  const isLocal = host ? (host.includes('localhost') || host.includes('127.0.0.1')) : false;
  const isLegacyHost = host ? LEGACY_HOSTS.has(host) : false;
  const targetHost = (isLegacyHost || !host) ? CANONICAL_HOST : host;
  const targetProtocol = (!isLocal && (isLegacyHost || targetHost === CANONICAL_HOST))
    ? 'https:'
    : request.nextUrl.protocol;

  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const mappedPath = CANONICAL_REDIRECTS[normalizedPath];
  const targetPath = mappedPath || normalizedPath;

  const needsRedirect = (
    isLegacyHost ||
    pathname !== targetPath
  );

  if (needsRedirect) {
    const finalUrl = new URL(targetPath, `${targetProtocol}//${targetHost}`);
    request.nextUrl.searchParams.forEach((val, key) => finalUrl.searchParams.set(key, val));
    const response = NextResponse.redirect(finalUrl, 301);
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return response;
  }

  // 3. Guarda Perimetral para APIs Administrativas (Defense-in-Depth)
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
