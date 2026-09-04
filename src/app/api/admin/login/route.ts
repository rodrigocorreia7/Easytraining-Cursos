import { NextRequest, NextResponse } from 'next/server';
import { signAdminToken, ALLOWED_ADMIN_EMAILS } from '@/lib/authServer';
import { checkRateLimit, getClientIp, sanitizeString } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`admin_login:${clientIp}`, 10, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Muitas tentativas incorretas de login. Tente novamente em 15 minutos.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const email = sanitizeString(body.email || '', 120).toLowerCase().trim();
    const password = String(body.password || '').trim();

    if (!email || !password) {
      return NextResponse.json({ error: 'E-mail e senha são obrigatórios.' }, { status: 400 });
    }

    if (!ALLOWED_ADMIN_EMAILS.includes(email)) {
      return NextResponse.json({ error: 'Credenciais inválidas.' }, { status: 401 });
    }

    // Validação estrita de senha no servidor (exclusivamente via variável de ambiente)
    const masterPassword = process.env.ADMIN_PASSWORD;
    if (!masterPassword || masterPassword.trim().length === 0) {
      console.error('ERRO CRÍTICO: ADMIN_PASSWORD não configurada no ambiente.');
      return NextResponse.json(
        { error: 'Autenticação administrativa indisponível. Contate o suporte técnico.' },
        { status: 503 }
      );
    }

    const isMasterValid = password === masterPassword;

    if (!isMasterValid) {
      return NextResponse.json({ error: 'Credenciais inválidas.' }, { status: 401 });
    }

    const adminUser = {
      uid: email === 'admin@easytraining.com.br' ? 'admin-01' : 'admin-rodrigo',
      email,
      name: email.includes('rac') ? 'Rodrigo Correia' : 'Administrador EasyTraining'
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

    // Cookie seguro HttpOnly
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
    console.error('Erro no login admin:', error);
    return NextResponse.json({ error: 'Erro interno ao processar login.' }, { status: 500 });
  }
}
