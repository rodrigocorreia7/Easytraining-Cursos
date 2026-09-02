import { NextResponse } from 'next/server';
import { getAiMetrics } from '@/lib/aiMetrics';

export async function GET() {
  try {
    const metrics = await getAiMetrics();
    return NextResponse.json(metrics);
  } catch (error: any) {
    console.error('Erro ao buscar métricas de IA:', error);
    return NextResponse.json({ error: 'Erro ao carregar métricas' }, { status: 500 });
  }
}
