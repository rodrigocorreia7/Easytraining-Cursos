import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/authServer';

export async function GET(request: NextRequest) {
  const auth = verifyAdminSession(request);
  if (!auth.authorized || !auth.user) {
    return NextResponse.json({ error: 'Sessão inválida ou expirada.' }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: auth.user
  });
}
