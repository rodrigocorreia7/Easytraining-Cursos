import { NextRequest, NextResponse } from 'next/server';
import { getPostsFromFirestore, savePostToFirestore } from '@/lib/firestoreDb';
import { saveStoredPosts } from '@/lib/db';
import { BlogPost } from '@/types';
import { sanitizeString, sanitizeObject } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');
    const query = searchParams.get('q')?.toLowerCase();

    let posts = await getPostsFromFirestore();

    if (slug) {
      const cleanSlug = sanitizeString(slug, 120).toLowerCase();
      const post = posts.find(p => p.slug.toLowerCase() === cleanSlug);
      if (!post) {
        return NextResponse.json({ error: 'Post não encontrado.' }, { status: 404 });
      }
      return NextResponse.json(post);
    }

    if (category && category !== 'Todos') {
      const cleanCat = sanitizeString(category, 60);
      posts = posts.filter(p => p.category === cleanCat);
    }

    if (query) {
      const cleanQ = sanitizeString(query, 60).toLowerCase();
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(cleanQ) ||
        p.excerpt.toLowerCase().includes(cleanQ)
      );
    }

    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Erro seguro ao listar posts:', error);
    return NextResponse.json({ error: 'Erro ao buscar artigos do blog.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const body = sanitizeObject<Record<string, any>>(rawBody);

    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json({ error: 'O título do artigo é obrigatório.' }, { status: 400 });
    }

    const posts = await getPostsFromFirestore();
    const maxId = posts.reduce((max, p) => (typeof p.id === 'number' && p.id > max ? p.id : max), 0);
    const newId = maxId + 1;

    const safeSlug = (body.slug || body.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Sanitiza HTML de conteúdo para impedir XSS
    let cleanContentHtml = body.contentHtml || '';
    if (typeof cleanContentHtml === 'string') {
      cleanContentHtml = cleanContentHtml
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/javascript:[^"]*/gi, '');
    }

    const newPost: BlogPost = {
      id: newId,
      title: sanitizeString(body.title, 150),
      slug: safeSlug,
      excerpt: sanitizeString(body.excerpt, 300),
      contentHtml: cleanContentHtml,
      category: sanitizeString(body.category, 60) || 'Mercado de Trabalho',
      readTime: sanitizeString(body.readTime, 20) || '4 min',
      date: body.date || new Date().toISOString().split('T')[0],
      author: sanitizeString(body.author, 80) || 'Equipe Pedagógica EasyTraining',
      image: sanitizeString(body.image, 255) || '/images/blog/default.webp',
      tags: Array.isArray(body.tags) ? body.tags.map((t: any) => sanitizeString(t, 40)) : [],
      headings: Array.isArray(body.headings) ? body.headings : [],
      faqs: Array.isArray(body.faqs) ? body.faqs : []
    };

    await savePostToFirestore(newPost);

    posts.unshift(newPost);
    saveStoredPosts(posts);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Erro seguro ao cadastrar post:', error);
    return NextResponse.json({ error: 'Falha ao salvar artigo.' }, { status: 500 });
  }
}
