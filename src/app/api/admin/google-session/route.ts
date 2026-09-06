import { NextRequest, NextResponse } from 'next/server';
import { signAdminToken, ALLOWED_ADMIN_EMAILS } from '@/lib/authServer';
import { checkRateLimit, getClientIp, sanitizeString } from '@/lib/security';
import { isFirebaseAdminConfigured } from '@/lib/firebaseConfigHelper';

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

    let verifiedEmail = '';
    let verifiedUid = '';
    let verifiedName = '';

    // 1. Validação Criptográfica do ID Token
    let tokenValidated = false;

    if (isFirebaseAdminConfigured()) {
      try {
        const { adminAuth } = await import('@/lib/firebaseAdmin');
        const decoded = await adminAuth.verifyIdToken(idToken);
        verifiedEmail = (decoded.email || '').toLowerCase().trim();
        verifiedUid = decoded.uid || '';
        verifiedName = decoded.name || '';
        tokenValidated = true;
      } catch (adminErr: any) {
        console.warn('Falha na validação via Firebase Admin SDK, utilizando fallback Identity Toolkit:', adminErr?.message);
      }
    }

    if (!tokenValidated) {
      // Fallback para Google Identity Toolkit oficial
      const apiKey = 
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
        process.env.FIREBASE_API_KEY || 
        'AIzaSyDjC8RWk973GR-rHO9JwX61izKYMBrcPEo';

      const verifyRes = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
          signal: AbortSignal.timeout(8000)
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

      verifiedEmail = sanitizeString(verifiedUser.email, 120).toLowerCase().trim();
      verifiedUid = sanitizeString(verifiedUser.localId || '', 120).trim();
      verifiedName = sanitizeString(verifiedUser.displayName || '', 120).trim();
    }

    // 2. Verificação estrita contra a Allowlist de Administradores Autorizados
    if (!verifiedEmail || !ALLOWED_ADMIN_EMAILS.includes(verifiedEmail)) {
      return NextResponse.json(
        { error: `O e-mail Google (${verifiedEmail || 'não identificado'}) não possui permissão de administrador.` },
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
      }
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
  } catch (error: any) {
    console.error('Erro ao emitir sessão Google Admin:', error);
    return NextResponse.json({ error: error?.message || 'Erro interno ao processar sessão.' }, { status: 500 });
  }
}
