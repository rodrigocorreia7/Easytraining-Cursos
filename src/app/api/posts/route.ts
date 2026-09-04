import { NextRequest, NextResponse } from 'next/server';
import { getPostsFromFirestore, savePostToFirestore } from '@/lib/firestoreDb';
import { saveStoredPosts } from '@/lib/db';
import { BlogPost } from '@/types';
import { sanitizeString, sanitizeObject, sanitizeHtmlContent } from '@/lib/security';
import { verifyAdminSession } from '@/lib/authServer';

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
    const auth = verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: 'Acesso não autorizado. Faça login como administrador.' }, { status: 401 });
    }

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

    // Sanitiza HTML de conteúdo rico suportando artigos longos (até 500.000 caracteres)
    const rawContent = rawBody.contentHtml !== undefined ? rawBody.contentHtml : (rawBody.content !== undefined ? rawBody.content : (body.contentHtml || ''));
    const cleanContentHtml = sanitizeHtmlContent(rawContent, 500000);

    // Extrai headings automaticamente se não enviados
    let postHeadings = Array.isArray(body.headings) && body.headings.length > 0 ? body.headings : [];
    if (postHeadings.length === 0 && cleanContentHtml) {
      const headingRegex = /<(h[2-3])[^>]*>(.*?)<\/\1>/gi;
      let match;
      let hIndex = 0;
      while ((match = headingRegex.exec(cleanContentHtml)) !== null) {
        const level = parseInt(match[1].substring(1), 10);
        const text = match[2].replace(/<[^>]*>/g, '').trim();
        if (text) {
          const hid = `heading-${hIndex}-${text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 30)}`;
          postHeadings.push({ level, text, id: hid });
          hIndex++;
        }
      }
    }

    // Calcula tempo de leitura estimado com base nas palavras reais
    const wordsCount = cleanContentHtml.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length;
    const computedReadTime = `${Math.max(1, Math.round(wordsCount / 180))} min`;

    const newPost: BlogPost = {
      id: newId,
      title: sanitizeString(body.title, 255),
      slug: safeSlug,
      excerpt: sanitizeString(body.excerpt, 600),
      contentHtml: cleanContentHtml,
      category: sanitizeString(body.category, 60) || 'Mercado de Trabalho',
      readTime: body.readTime || computedReadTime,
      date: body.date || new Date().toISOString().split('T')[0],
      author: sanitizeString(body.author, 80) || 'Equipe Pedagógica EasyTraining',
      image: sanitizeString(body.image, 255) || '/images/blog/default.webp',
      tags: Array.isArray(body.tags) ? body.tags.map((t: any) => sanitizeString(t, 40)) : [],
      headings: postHeadings,
      faqs: Array.isArray(body.faqs) ? body.faqs : [],
      relatedCourse: body.relatedCourse || undefined
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
