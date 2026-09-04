import { NextRequest, NextResponse } from 'next/server';
import { seedCoursesToFirestore, seedPostsToFirestore, saveSiteConfigToFirestore } from '@/lib/firestoreDb';
import { getStoredCourses, getStoredPosts, getStoredSiteConfig } from '@/lib/db';
import { verifyAdminSession } from '@/lib/authServer';

export async function POST(request: NextRequest) {
  try {
    const auth = verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: 'Acesso não autorizado. Faça login como administrador.' }, { status: 401 });
    }

    const courses = getStoredCourses();
    const posts = getStoredPosts();
    const config = getStoredSiteConfig();

    await seedCoursesToFirestore(courses);
    await seedPostsToFirestore(posts);
    await saveSiteConfigToFirestore(config);

    return NextResponse.json({
      success: true,
      message: `Sincronização com Cloud Firestore concluída com sucesso! (${courses.length} cursos, ${posts.length} posts e configurações do site sincronizados).`
    });
  } catch (error: any) {
    console.error('Erro ao sincronizar com Firebase:', error);
    return NextResponse.json({
      success: false,
      error: error?.message || 'Falha ao sincronizar dados com o Firebase Firestore'
    }, { status: 500 });
  }
}
