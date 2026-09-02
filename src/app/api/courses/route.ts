import { NextRequest, NextResponse } from 'next/server';
import { getCoursesFromFirestore, saveCourseToFirestore } from '@/lib/firestoreDb';
import { getStoredCourses, saveStoredCourses } from '@/lib/db';
import { Course } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');

    let courses = await getCoursesFromFirestore();

    if (slug) {
      const cleanSlug = slug.replace(/^\/|\/$/g, '').toLowerCase();
      const course = courses.find(c => c.slug.toLowerCase() === cleanSlug);
      if (!course) {
        return NextResponse.json({ error: 'Curso não encontrado' }, { status: 404 });
      }
      return NextResponse.json(course);
    }

    if (category && category !== 'Todos') {
      courses = courses.filter(c => c.category === category || c.categorySlug === category);
    }

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Erro ao listar cursos:', error);
    return NextResponse.json({ error: 'Erro interno ao buscar cursos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const courses = await getCoursesFromFirestore();

    const maxId = courses.reduce((max, c) => (typeof c.id === 'number' && c.id > max ? c.id : max), 0);
    const newId = maxId + 1;

    const newCourse: Course = {
      ...body,
      id: newId,
      slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      categorySlug: body.categorySlug || (body.category ? body.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'outros'),
      modules: body.modules || [],
      careerOpportunities: body.careerOpportunities || [],
      whatsappMessage: body.whatsappMessage || `Olá! Gostaria de saber mais sobre o ${body.title}.`
    };

    // Salva no Firestore
    await saveCourseToFirestore(newCourse);

    // Sincroniza cache local
    courses.push(newCourse);
    saveStoredCourses(courses);

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar curso:', error);
    return NextResponse.json({ error: 'Erro interno ao criar curso' }, { status: 500 });
  }
}
