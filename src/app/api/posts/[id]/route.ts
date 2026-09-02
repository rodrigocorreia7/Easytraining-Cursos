import { NextRequest, NextResponse } from 'next/server';
import { getPostsFromFirestore, savePostToFirestore, deletePostFromFirestore } from '@/lib/firestoreDb';
import { getStoredPosts, saveStoredPosts } from '@/lib/db';
import { BlogPost } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const posts = await getPostsFromFirestore();
    const post = posts.find(p => String(p.id) === String(id));

    if (!post) {
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Erro ao buscar post:', error);
    return NextResponse.json({ error: 'Erro ao buscar post' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const posts = await getPostsFromFirestore();

    const index = posts.findIndex(p => String(p.id) === String(id));
    if (index === -1) {
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
    }

    const updatedPost: BlogPost = {
      ...posts[index],
      ...body,
      id: posts[index].id // preserva ID original
    };

    // Salva no Firestore
    await savePostToFirestore(updatedPost);

    // Sincroniza cache local
    posts[index] = updatedPost;
    saveStoredPosts(posts);

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    return NextResponse.json({ error: 'Erro ao atualizar post' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const posts = await getPostsFromFirestore();

    const filtered = posts.filter(p => String(p.id) !== String(id));
    if (filtered.length === posts.length) {
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
    }

    // Deleta do Firestore
    await deletePostFromFirestore(id);

    // Sincroniza cache local
    saveStoredPosts(filtered);
    return NextResponse.json({ success: true, message: 'Post excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir post:', error);
    return NextResponse.json({ error: 'Erro ao excluir post' }, { status: 500 });
  }
}
