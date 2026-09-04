import { NextRequest, NextResponse } from 'next/server';
import { signAdminToken, ALLOWED_ADMIN_EMAILS } from '@/lib/authServer';
import { checkRateLimit, getClientIp, sanitizeString } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`admin_google_session:${clientIp}`, 15, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Muitas tentativas de login com Google. Tente novamente em 15 minutos.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const idToken = typeof body.idToken === 'string' ? body.idToken.trim() : '';

    if (!idToken) {
      return NextResponse.json(
        { error: 'Token de autenticação Google não fornecido ou inválido.' },
        { status: 400 }
      );
    }

    // 1. Validação Criptográfica do ID Token diretamente na API oficial do Firebase/Google
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Configuração de autenticação não encontrada no servidor.' },
        { status: 500 }
      );
    }

    const verifyRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
        signal: AbortSignal.timeout(6000)
      }
    );

    if (!verifyRes.ok) {
      return NextResponse.json(
        { error: 'Token de autenticação Google inválido, expirado ou forjado.' },
        { status: 401 }
      );
    }

    const verifyData = await verifyRes.json();
    const verifiedUser = verifyData?.users?.[0];

    if (!verifiedUser || !verifiedUser.email) {
      return NextResponse.json(
        { error: 'Não foi possível validar as credenciais do usuário Google.' },
        { status: 401 }
      );
    }

    const verifiedEmail = sanitizeString(verifiedUser.email, 120).toLowerCase().trim();
    const verifiedUid = sanitizeString(verifiedUser.localId || body.uid || '', 120).trim();
    const verifiedName = sanitizeString(verifiedUser.displayName || body.name || '', 120).trim();

    // 2. Verificação contra a Allowlist de Administradores Oficiais
    if (!ALLOWED_ADMIN_EMAILS.includes(verifiedEmail)) {
      return NextResponse.json(
        { error: `O e-mail Google (${verifiedEmail}) não possui permissão de administrador.` },
        { status: 403 }
      );
    }

    const adminUser = {
      uid: verifiedUid,
      email: verifiedEmail,
      name: verifiedName || (verifiedEmail.includes('rac') ? 'Rodrigo Correia' : 'Administrador EasyTraining')
    };

    const token = signAdminToken(adminUser);

    const isProd = process.env.NODE_ENV === 'production';
    const response = NextResponse.json({
      success: true,
      user: {
        ...adminUser,
        role: 'admin'
      },
      token
    });

    response.cookies.set({
      name: 'admin_session',
      value: token,
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      path: '/',
      maxAge: 8 * 60 * 60 // 8 horas
    });

    return response;
  } catch (error) {
    console.error('Erro ao emitir sessão Google Admin:', error);
    return NextResponse.json({ error: 'Erro interno ao processar sessão.' }, { status: 500 });
  }
}
