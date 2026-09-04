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
    const email = sanitizeString(body.email || '', 120).toLowerCase().trim();
    const name = sanitizeString(body.name || '', 120).trim();
    const uid = sanitizeString(body.uid || '', 120).trim();

    if (!email || !uid) {
      return NextResponse.json({ error: 'Dados de autenticação Google inválidos.' }, { status: 400 });
    }

    if (!ALLOWED_ADMIN_EMAILS.includes(email)) {
      return NextResponse.json(
        { error: `O e-mail Google (${email}) não possui permissão de administrador.` },
        { status: 403 }
      );
    }

    const adminUser = {
      uid,
      email,
      name: name || (email.includes('rac') ? 'Rodrigo Correia' : 'Administrador EasyTraining')
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
