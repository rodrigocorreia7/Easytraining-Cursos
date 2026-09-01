import { NextRequest, NextResponse } from 'next/server';
import { resetStoredCourses, resetStoredPosts, resetStoredSiteConfig } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { target } = await request.json().catch(() => ({ target: 'all' }));

    if (target === 'courses' || target === 'all') {
      resetStoredCourses();
    }
    if (target === 'posts' || target === 'all') {
      resetStoredPosts();
    }
    if (target === 'config' || target === 'all') {
      resetStoredSiteConfig();
    }

    return NextResponse.json({
      success: true,
      message: `Restauração concluída com sucesso para: ${target || 'todos os módulos'}.`
    });
  } catch (error) {
    console.error('Erro ao resetar dados:', error);
    return NextResponse.json({ error: 'Erro ao restaurar dados padrão' }, { status: 500 });
  }
}
