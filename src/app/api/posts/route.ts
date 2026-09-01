import { NextRequest, NextResponse } from 'next/server';
import { getStoredPosts, saveStoredPosts } from '@/lib/db';
import { BlogPost } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');
    const query = searchParams.get('q')?.toLowerCase();

    let posts = getStoredPosts();

    if (slug) {
      const cleanSlug = slug.replace(/^\/|\/$/g, '').toLowerCase();
      const post = posts.find(p => p.slug.toLowerCase() === cleanSlug);
      if (!post) {
        return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
      }
      return NextResponse.json(post);
    }

    if (category && category !== 'Todos') {
      posts = posts.filter(p => p.category === category);
    }

    if (query) {
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.excerpt.toLowerCase().includes(query) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(query)))
      );
    }

    // Ordena por data decrescente
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Erro ao listar posts:', error);
    return NextResponse.json({ error: 'Erro interno ao buscar posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const posts = getStoredPosts();

    const maxId = posts.reduce((max, p) => (typeof p.id === 'number' && p.id > max ? p.id : max), 0);
    const newId = maxId + 1;

    const newPost: BlogPost = {
      ...body,
      id: newId,
      slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      date: body.date || new Date().toISOString().split('T')[0],
      readTime: body.readTime || '4 min',
      author: body.author || 'EasyTraining Admin',
      authorRole: body.authorRole || 'Redação EasyTraining',
      views: 0
    };

    posts.unshift(newPost);
    saveStoredPosts(posts);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar post:', error);
    return NextResponse.json({ error: 'Erro interno ao criar post' }, { status: 500 });
  }
}
