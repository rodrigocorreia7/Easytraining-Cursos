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

    // Prioridade 1: Google Identity Toolkit oficial (100% compativel com Edge/Serverless sem conflitos de ESM)
    const apiKey = 
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
      process.env.FIREBASE_API_KEY || 
      '';

    if (apiKey) {
      try {
        const verifyRes = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
            signal: AbortSignal.timeout(8000)
          }
        );

        if (verifyRes.ok) {
          const verifyData = await verifyRes.json();
          const verifiedUser = verifyData?.users?.[0];

          if (verifiedUser && verifiedUser.email) {
            verifiedEmail = sanitizeString(verifiedUser.email, 120).toLowerCase().trim();
            verifiedUid = sanitizeString(verifiedUser.localId || '', 120).trim();
            verifiedName = sanitizeString(verifiedUser.displayName || '', 120).trim();
            tokenValidated = true;
          }
        }
      } catch (idToolkitErr: any) {
        console.warn('Falha na validação via Identity Toolkit:', idToolkitErr?.message);
      }
    }

    // Prioridade 2: Fallback via Firebase Admin SDK caso necessário
    if (!tokenValidated && isFirebaseAdminConfigured()) {
      try {
        const { getAdminAuth } = await import('@/lib/firebaseAdmin');
        const auth = await getAdminAuth();
        if (auth) {
          const decoded = await auth.verifyIdToken(idToken);
          verifiedEmail = (decoded.email || '').toLowerCase().trim();
          verifiedUid = decoded.uid || '';
          verifiedName = decoded.name || '';
          tokenValidated = true;
        }
      } catch (adminErr: any) {
        console.warn('Falha na validação via Firebase Admin SDK:', adminErr?.message);
      }
    }

    if (!tokenValidated) {
      return NextResponse.json(
        { error: 'Token de autenticação Google inválido ou não autorizado.' },
        { status: 401 }
      );
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
