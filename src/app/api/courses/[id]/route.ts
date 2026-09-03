import { NextRequest, NextResponse } from 'next/server';
import { getCoursesFromFirestore, saveCourseToFirestore, deleteCourseFromFirestore } from '@/lib/firestoreDb';
import { saveStoredCourses } from '@/lib/db';
import { Course } from '@/types';
import { sanitizeString, sanitizeObject, sanitizeHtmlContent } from '@/lib/security';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courses = await getCoursesFromFirestore();
    const course = courses.find(c => String(c.id) === String(id));

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
    const { id } = await params;
    const rawBody = await request.json();
    const body = sanitizeObject<Record<string, any>>(rawBody);
    const courses = await getCoursesFromFirestore();

    const index = courses.findIndex(c => String(c.id) === String(id));
    if (index === -1) {
      return NextResponse.json({ error: 'Curso não encontrado.' }, { status: 404 });
    }

    const rawFullDesc = rawBody.fullDescription !== undefined 
      ? rawBody.fullDescription 
      : (body.fullDescription || courses[index].fullDescription);

    const updatedCourse: Course = {
      ...courses[index],
      ...body,
      id: courses[index].id,
      title: sanitizeString(body.title || courses[index].title, 120),
      shortDescription: sanitizeString(body.shortDescription || courses[index].shortDescription, 280),
      fullDescription: sanitizeHtmlContent(rawFullDesc, 50000),
      duration: sanitizeString(body.duration || courses[index].duration, 50),
      image: sanitizeString(body.image || courses[index].image, 255),
      whatsappMessage: sanitizeString(body.whatsappMessage || courses[index].whatsappMessage, 200)
    };

    await saveCourseToFirestore(updatedCourse);

    courses[index] = updatedCourse;
    saveStoredCourses(courses);

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('Erro seguro ao atualizar curso:', error);
    return NextResponse.json({ error: 'Erro ao salvar alterações no curso.' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteCourseFromFirestore(id);

    const courses = await getCoursesFromFirestore();
    const filtered = courses.filter(c => String(c.id) !== String(id));
    saveStoredCourses(filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro seguro ao excluir curso:', error);
    return NextResponse.json({ error: 'Erro ao excluir curso.' }, { status: 500 });
  }
}
