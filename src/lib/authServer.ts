import { NextRequest } from 'next/server';
import crypto from 'crypto';

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET;
  if (secret && secret.trim().length >= 16) {
    return secret.trim();
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('CONFIGURAÇÃO CRÍTICA AUSENTE: ADMIN_SESSION_SECRET é obrigatória em ambiente de produção.');
  }
  return 'easytraining_dev_secret_local_only_never_use_in_prod';
}

export const ALLOWED_ADMIN_EMAILS = [
  'admin@easytraining.com.br',
  'rac2digital@gmail.com',
  'raccorreia@gmail.com',
  'easytraining.cursos@gmail.com'
];

export interface AdminSessionUser {
  uid: string;
  email: string;
  name: string;
  role: 'admin';
  exp: number;
}

/**
 * Cria um token assinado (HMAC-SHA256) contendo os dados do admin e tempo de expiração.
 */
export function signAdminToken(user: { uid: string; email: string; name: string }): string {
  const exp = Date.now() + 8 * 60 * 60 * 1000; // 8 horas de validade
  const payload = JSON.stringify({
    uid: user.uid,
    email: user.email,
    name: user.name,
    role: 'admin',
    exp
  });

  const b64Payload = Buffer.from(payload).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getSessionSecret())
    .update(b64Payload)
    .digest('base64url');

  return `${b64Payload}.${signature}`;
}

/**
 * Verifica a assinatura e validade do token de sessão.
 */
export function verifyAdminToken(token: string): { valid: boolean; user?: AdminSessionUser } {
  try {
    if (!token || !token.includes('.')) return { valid: false };

    const [b64Payload, signature] = token.split('.');
    if (!b64Payload || !signature) return { valid: false };

    const expectedSig = crypto
      .createHmac('sha256', getSessionSecret())
      .update(b64Payload)
      .digest('base64url');

    const a = Buffer.from(signature);
    const b = Buffer.from(expectedSig);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return { valid: false };
    }

    const user: AdminSessionUser = JSON.parse(Buffer.from(b64Payload, 'base64url').toString('utf8'));

    if (Date.now() > user.exp) {
      return { valid: false };
    }

    return { valid: true, user };
  } catch (err) {
    return { valid: false };
  }
}

/**
 * Validador universal para rotas protegidas da API.
 * Lê o cookie 'admin_session' ou o header 'Authorization: Bearer <token>'.
 */
export function verifyAdminSession(request: NextRequest): { authorized: boolean; user?: AdminSessionUser } {
  const cookieToken = request.cookies.get('admin_session')?.value;
  if (cookieToken) {
    const res = verifyAdminToken(cookieToken);
    if (res.valid && res.user) {
      return { authorized: true, user: res.user };
    }
  }

  const authHeader = request.headers.get('authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const res = verifyAdminToken(token);
    if (res.valid && res.user) {
      return { authorized: true, user: res.user };
    }
  }

  return { authorized: false };
}
