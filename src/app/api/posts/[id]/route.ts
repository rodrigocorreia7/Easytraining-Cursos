import { NextRequest, NextResponse } from 'next/server';
import { getPostByIdFromFirestore, deletePostFromFirestore, invalidatePublicContentCache, savePostToFirestore } from '@/lib/firestoreDb';
import { getStoredPosts, saveStoredPosts } from '@/lib/db';
import { BlogPost } from '@/types';
import { sanitizeString, sanitizeObject, sanitizeHtmlContent, sanitizeImageUrl, sanitizeFaqs } from '@/lib/security';
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

    const post = await getPostByIdFromFirestore(id);

    if (!post) {
      return NextResponse.json({ error: 'Post não encontrado.' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Erro seguro ao buscar post:', error);
    return NextResponse.json({ error: 'Erro ao buscar post.' }, { status: 500 });
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
    const currentPost = await getPostByIdFromFirestore(id);
    if (!currentPost) {
      return NextResponse.json({ error: 'Post não encontrado.' }, { status: 404 });
    }

    // Sanitiza HTML de conteúdo rico suportando artigos longos (até 500.000 caracteres)
    const rawContent = rawBody.contentHtml !== undefined 
      ? rawBody.contentHtml 
      : (rawBody.content !== undefined ? rawBody.content : currentPost.contentHtml);
    const cleanContentHtml = sanitizeHtmlContent(rawContent, 500000);

    // Atualiza ou preserva headings
    let postHeadings = Array.isArray(body.headings) && body.headings.length > 0 
      ? body.headings 
      : (currentPost.headings || []);

    if (postHeadings.length === 0 && cleanContentHtml) {
      const headingRegex = /<(h[2-3])[^>]*>(.*?)<\/\1>/gi;
      let match;
      let hIndex = 0;
      const extracted: any[] = [];
      while ((match = headingRegex.exec(cleanContentHtml)) !== null) {
        const level = parseInt(match[1].substring(1), 10);
        const text = match[2].replace(/<[^>]*>/g, '').trim();
        if (text) {
          const hid = `heading-${hIndex}-${text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 30)}`;
          extracted.push({ level, text, id: hid });
          hIndex++;
        }
      }
      if (extracted.length > 0) postHeadings = extracted;
    }

    // Tempo de leitura
    const wordsCount = cleanContentHtml.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length;
    const computedReadTime = `${Math.max(1, Math.round(wordsCount / 180))} min`;

    const updatedPost: BlogPost = {
      ...currentPost,
      ...body,
      id: currentPost.id,
      title: sanitizeString(body.title || currentPost.title, 255),
      excerpt: sanitizeString(body.excerpt || currentPost.excerpt, 600),
      contentHtml: cleanContentHtml,
      category: sanitizeString(body.category || currentPost.category, 60),
      image: sanitizeImageUrl(body.image || currentPost.image) || '/images/courses/informatica-basica.webp',
      readTime: body.readTime || currentPost.readTime || computedReadTime,
      headings: postHeadings,
      faqs: body.faqs !== undefined ? sanitizeFaqs(body.faqs) : (currentPost.faqs || []),
      relatedCourse: body.relatedCourse || currentPost.relatedCourse
    };

    await savePostToFirestore(updatedPost);
    invalidatePublicContentCache('posts');

    const posts = getStoredPosts();
    const index = posts.findIndex(p => String(p.id) === String(currentPost.id));
    if (index >= 0) posts[index] = updatedPost;
    else posts.unshift(updatedPost);
    saveStoredPosts(posts);

    return NextResponse.json(updatedPost);
  } catch (error: any) {
    console.error('Erro seguro ao atualizar post:', error);
    return NextResponse.json({
      error: error?.message || 'Erro ao salvar alterações no artigo. Verifique se o Firebase Admin SDK está configurado no ambiente do servidor.'
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

    const target = await getPostByIdFromFirestore(id);

    if (target) {
      if (target.slug) await deletePostFromFirestore(target.slug);
      if (target.id) await deletePostFromFirestore(target.id);
    } else {
      await deletePostFromFirestore(id);
    }
    invalidatePublicContentCache('posts');

    const posts = getStoredPosts();
    const filtered = posts.filter(p => String(p.id) !== String(id) && (!target || p.slug !== target.slug));
    saveStoredPosts(filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro seguro ao excluir post:', error);
    return NextResponse.json({ error: 'Erro ao excluir artigo.' }, { status: 500 });
  }
}
