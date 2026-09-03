import { NextRequest, NextResponse } from 'next/server';
import { getPostsFromFirestore, savePostToFirestore, deletePostFromFirestore } from '@/lib/firestoreDb';
import { saveStoredPosts } from '@/lib/db';
import { BlogPost } from '@/types';
import { sanitizeString, sanitizeObject, sanitizeHtmlContent } from '@/lib/security';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const posts = await getPostsFromFirestore();
    const post = posts.find(p => String(p.id) === String(id));

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
    const { id } = await params;
    const rawBody = await request.json();
    const body = sanitizeObject<Record<string, any>>(rawBody);
    const posts = await getPostsFromFirestore();

    const index = posts.findIndex(p => String(p.id) === String(id));
    if (index === -1) {
      return NextResponse.json({ error: 'Post não encontrado.' }, { status: 404 });
    }

    // Sanitiza HTML de conteúdo rico suportando artigos longos (até 500.000 caracteres)
    const rawContent = rawBody.contentHtml !== undefined 
      ? rawBody.contentHtml 
      : (rawBody.content !== undefined ? rawBody.content : posts[index].contentHtml);
    const cleanContentHtml = sanitizeHtmlContent(rawContent, 500000);

    // Atualiza ou preserva headings
    let postHeadings = Array.isArray(body.headings) && body.headings.length > 0 
      ? body.headings 
      : (posts[index].headings || []);

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
      ...posts[index],
      ...body,
      id: posts[index].id,
      title: sanitizeString(body.title || posts[index].title, 255),
      excerpt: sanitizeString(body.excerpt || posts[index].excerpt, 600),
      contentHtml: cleanContentHtml,
      category: sanitizeString(body.category || posts[index].category, 60),
      image: sanitizeString(body.image || posts[index].image, 255),
      readTime: body.readTime || posts[index].readTime || computedReadTime,
      headings: postHeadings,
      faqs: Array.isArray(body.faqs) ? body.faqs : (posts[index].faqs || []),
      relatedCourse: body.relatedCourse || posts[index].relatedCourse
    };

    await savePostToFirestore(updatedPost);

    posts[index] = updatedPost;
    saveStoredPosts(posts);

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Erro seguro ao atualizar post:', error);
    return NextResponse.json({ error: 'Erro ao salvar alterações no artigo.' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deletePostFromFirestore(id);

    const posts = await getPostsFromFirestore();
    const filtered = posts.filter(p => String(p.id) !== String(id));
    saveStoredPosts(filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro seguro ao excluir post:', error);
    return NextResponse.json({ error: 'Erro ao excluir artigo.' }, { status: 500 });
  }
}
