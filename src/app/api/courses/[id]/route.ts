import { NextRequest, NextResponse } from 'next/server';
import { getCoursesFromFirestore, saveCourseToFirestore, deleteCourseFromFirestore } from '@/lib/firestoreDb';
import { getStoredCourses, saveStoredCourses } from '@/lib/db';
import { Course } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courses = await getCoursesFromFirestore();
    const course = courses.find(c => String(c.id) === String(id));

    if (!course) {
      return NextResponse.json({ error: 'Curso não encontrado' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Erro ao buscar curso:', error);
    return NextResponse.json({ error: 'Erro ao buscar curso' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const courses = await getCoursesFromFirestore();

    const index = courses.findIndex(c => String(c.id) === String(id));
    if (index === -1) {
      return NextResponse.json({ error: 'Curso não encontrado' }, { status: 404 });
    }

    const updatedCourse: Course = {
      ...courses[index],
      ...body,
      id: courses[index].id, // preserva ID original
      categorySlug: body.categorySlug || (body.category ? body.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') : courses[index].categorySlug)
    };

    // Salva no Firestore
    await saveCourseToFirestore(updatedCourse);

    // Sincroniza cache local
    courses[index] = updatedCourse;
    saveStoredCourses(courses);

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('Erro ao atualizar curso:', error);
    return NextResponse.json({ error: 'Erro ao atualizar curso' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courses = await getCoursesFromFirestore();

    const filtered = courses.filter(c => String(c.id) !== String(id));
    if (filtered.length === courses.length) {
      return NextResponse.json({ error: 'Curso não encontrado' }, { status: 404 });
    }

    // Deleta do Firestore
    await deleteCourseFromFirestore(id);

    // Sincroniza cache local
    saveStoredCourses(filtered);
    return NextResponse.json({ success: true, message: 'Curso excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir curso:', error);
    return NextResponse.json({ error: 'Erro ao excluir curso' }, { status: 500 });
  }
}
