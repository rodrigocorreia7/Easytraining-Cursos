import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercepta todas as rotas do Painel Administrativo
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    const adminSession = request.cookies.get('admin_session')?.value;

    // Se tentar acessar o painel protegido sem o cookie seguro de sessão
    if (!isLoginPage && !adminSession) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return response;
    }

    // Se já possuir sessão e tentar abrir /admin/login
    if (isLoginPage && adminSession) {
      const dashboardUrl = new URL('/admin', request.url);
      const response = NextResponse.redirect(dashboardUrl);
      response.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return response;
    }

    const response = NextResponse.next();
    // Bloqueia indexação por qualquer bot de busca no painel administrativo
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
