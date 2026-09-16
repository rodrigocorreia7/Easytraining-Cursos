import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/authServer';
import { invalidatePublicContentCache, syncRecoveredPostsToFirestore } from '@/lib/firestoreDb';
import { legacyWordpressPosts } from '@/data/legacyWordpressPosts';

export async function POST(request: NextRequest) {
  const auth = verifyAdminSession(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Acesso não autorizado. Faça login como administrador.' }, { status: 401 });
  }

  try {
    const result = await syncRecoveredPostsToFirestore(legacyWordpressPosts);
    if (result.created.length > 0) invalidatePublicContentCache('posts');

    return NextResponse.json({
      success: result.errors.length === 0,
      ...result,
      total: legacyWordpressPosts.length,
    }, { status: result.errors.length === 0 ? 200 : 207 });
  } catch (error: any) {
    console.error('Erro ao sincronizar artigos recuperados:', error?.message);
    return NextResponse.json({
      success: false,
      error: error?.message || 'Não foi possível sincronizar os artigos recuperados.',
    }, { status: 500 });
  }
}
