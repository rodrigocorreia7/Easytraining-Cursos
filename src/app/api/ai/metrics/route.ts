import { NextRequest, NextResponse } from 'next/server';
import { getAiMetrics } from '@/lib/aiMetrics';
import { verifyAdminSession } from '@/lib/authServer';

export async function GET(request: NextRequest) {
  try {
    const auth = verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: 'Acesso não autorizado. Faça login como administrador.' }, { status: 401 });
    }

    const metrics = await getAiMetrics();
    return NextResponse.json(metrics);
  } catch (error: any) {
    console.error('Erro ao buscar métricas de IA:', error);
    return NextResponse.json({ error: 'Erro ao carregar métricas' }, { status: 500 });
  }
}
