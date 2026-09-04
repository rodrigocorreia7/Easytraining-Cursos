import { NextRequest, NextResponse } from 'next/server';
import { getCoursesFromFirestore, saveCourseToFirestore } from '@/lib/firestoreDb';
import { saveStoredCourses } from '@/lib/db';
import { Course } from '@/types';
import { sanitizeString, sanitizeObject, sanitizeHtmlContent } from '@/lib/security';
import { verifyAdminSession } from '@/lib/authServer';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');

    let courses = await getCoursesFromFirestore();

    if (slug) {
      const cleanSlug = sanitizeString(slug, 120).toLowerCase();
      const course = courses.find(c => c.slug.toLowerCase() === cleanSlug);
      if (!course) {
        return NextResponse.json({ error: 'Curso não encontrado.' }, { status: 404 });
      }
      return NextResponse.json(course);
    }

    if (category && category !== 'Todos') {
      const cleanCat = sanitizeString(category, 60);
      courses = courses.filter(c => c.category === cleanCat || c.categorySlug === cleanCat);
    }

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Erro seguro ao listar cursos:', error);
    return NextResponse.json({ error: 'Erro ao buscar catálogo de cursos.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: 'Acesso não autorizado. Faça login como administrador.' }, { status: 401 });
    }

    const rawBody = await request.json();
    const body = sanitizeObject<Record<string, any>>(rawBody);

    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json({ error: 'O título do curso é obrigatório.' }, { status: 400 });
    }

    const courses = await getCoursesFromFirestore();
    const maxId = courses.reduce((max, c) => (typeof c.id === 'number' && c.id > max ? c.id : max), 0);
    const newId = maxId + 1;

    const safeSlug = (body.slug || body.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newCourse: Course = {
      id: newId,
      title: sanitizeString(body.title, 120),
      slug: safeSlug,
      category: sanitizeString(body.category, 60) || 'Geral',
      categorySlug: sanitizeString(body.categorySlug, 60) || 'geral',
      shortDescription: sanitizeString(body.shortDescription, 280),
      fullDescription: sanitizeHtmlContent(rawBody.fullDescription || body.fullDescription, 50000),
      duration: sanitizeString(body.duration, 50) || '3 a 6 meses',
      modality: sanitizeString(body.modality, 60) || 'Presencial / Prático',
      certificate: Boolean(body.certificate),
      image: sanitizeString(body.image, 255) || '/images/courses/default.webp',
      featured: Boolean(body.featured),
      modules: Array.isArray(body.modules) ? body.modules : [],
      targetAudience: sanitizeString(body.targetAudience, 255),
      careerOpportunities: Array.isArray(body.careerOpportunities) ? body.careerOpportunities : [],
      whatsappMessage: sanitizeString(body.whatsappMessage, 200) || `Olá! Gostaria de saber mais sobre o ${body.title}.`
    };

    // Salva no Firestore
    await saveCourseToFirestore(newCourse);

    // Sincroniza cache local
    courses.push(newCourse);
    saveStoredCourses(courses);

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error('Erro seguro ao cadastrar curso:', error);
    return NextResponse.json({ error: 'Falha ao salvar curso.' }, { status: 500 });
  }
}
