import { NextRequest, NextResponse } from 'next/server';
import { getCourseByIdFromFirestore, deleteCourseFromFirestore, invalidatePublicContentCache, saveCourseToFirestore } from '@/lib/firestoreDb';
import { getStoredCourses, saveStoredCourses } from '@/lib/db';
import { Course } from '@/types';
import { sanitizeString, sanitizeObject, sanitizeHtmlContent, sanitizeImageUrl } from '@/lib/security';
import { verifyAdminSession } from '@/lib/authServer';

function isValidEntityId(id: string): boolean {
  return typeof id === 'string' && /^[a-zA-Z0-9_-]{1,120}$/.test(id);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!isValidEntityId(id)) {
      return NextResponse.json({ error: 'Identificador com formato inválido.' }, { status: 400 });
    }

    const course = await getCourseByIdFromFirestore(id);

    if (!course) {
      return NextResponse.json({ error: 'Curso não encontrado.' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Erro seguro ao buscar curso:', error);
    return NextResponse.json({ error: 'Erro ao buscar curso.' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: 'Acesso não autorizado. Faça login como administrador.' }, { status: 401 });
    }

    const { id } = await params;
    if (!isValidEntityId(id)) {
      return NextResponse.json({ error: 'Identificador com formato inválido.' }, { status: 400 });
    }

    const rawBody = await request.json();
    const body = sanitizeObject<Record<string, any>>(rawBody);
    const currentCourse = await getCourseByIdFromFirestore(id);
    if (!currentCourse) {
      return NextResponse.json({ error: 'Curso não encontrado.' }, { status: 404 });
    }

    const rawFullDesc = rawBody.fullDescription !== undefined 
      ? rawBody.fullDescription 
      : (body.fullDescription || currentCourse.fullDescription);

    const updatedCourse: Course = {
      ...currentCourse,
      ...body,
      id: currentCourse.id,
      title: sanitizeString(body.title || currentCourse.title, 120),
      shortDescription: sanitizeString(body.shortDescription || currentCourse.shortDescription, 280),
      fullDescription: sanitizeHtmlContent(rawFullDesc, 50000),
      duration: sanitizeString(body.duration || currentCourse.duration, 50),
      image: sanitizeImageUrl(body.image || currentCourse.image) || '/images/courses/informatica-basica.webp',
      whatsappMessage: sanitizeString(body.whatsappMessage || currentCourse.whatsappMessage, 200)
    };

    await saveCourseToFirestore(updatedCourse);
    invalidatePublicContentCache('courses');

    const courses = getStoredCourses();
    const index = courses.findIndex(c => String(c.id) === String(currentCourse.id));
    if (index >= 0) courses[index] = updatedCourse;
    else courses.unshift(updatedCourse);
    saveStoredCourses(courses);

    return NextResponse.json(updatedCourse);
  } catch (error: any) {
    console.error('Erro seguro ao atualizar curso:', error);
    return NextResponse.json({
      error: error?.message || 'Erro ao salvar alterações no curso. Verifique se o Firebase Admin SDK está configurado no ambiente do servidor.'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: 'Acesso não autorizado. Faça login como administrador.' }, { status: 401 });
    }

    const { id } = await params;
    if (!isValidEntityId(id)) {
      return NextResponse.json({ error: 'Identificador com formato inválido.' }, { status: 400 });
    }

    await deleteCourseFromFirestore(id);
    invalidatePublicContentCache('courses');

    const courses = getStoredCourses();
    const filtered = courses.filter(c => String(c.id) !== String(id));
    saveStoredCourses(filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro seguro ao excluir curso:', error);
    return NextResponse.json({ error: 'Erro ao excluir curso.' }, { status: 500 });
  }
}
