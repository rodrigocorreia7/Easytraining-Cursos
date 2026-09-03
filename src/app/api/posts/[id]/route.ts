import { NextRequest, NextResponse } from 'next/server';
import { getPostsFromFirestore, savePostToFirestore, deletePostFromFirestore } from '@/lib/firestoreDb';
import { saveStoredPosts } from '@/lib/db';
import { BlogPost } from '@/types';
import { sanitizeString, sanitizeObject } from '@/lib/security';

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

    let cleanContentHtml = body.contentHtml !== undefined ? body.contentHtml : posts[index].contentHtml;
    if (typeof cleanContentHtml === 'string') {
      cleanContentHtml = cleanContentHtml
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/javascript:[^"]*/gi, '');
    }

    const updatedPost: BlogPost = {
      ...posts[index],
      ...body,
      id: posts[index].id,
      title: sanitizeString(body.title || posts[index].title, 150),
      excerpt: sanitizeString(body.excerpt || posts[index].excerpt, 300),
      contentHtml: cleanContentHtml,
      category: sanitizeString(body.category || posts[index].category, 60),
      image: sanitizeString(body.image || posts[index].image, 255)
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
