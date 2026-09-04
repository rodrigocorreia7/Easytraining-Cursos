import { notFound, redirect, RedirectType } from 'next/navigation';
import type { Metadata } from 'next';
import { getStoredPosts } from '../../lib/db';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const posts = getStoredPosts();
  const cleanSlug = slug.replace(/^\/|\/$/g, '').toLowerCase();
  const post = posts.find(p => p.slug.toLowerCase() === cleanSlug);

  if (!post) {
    return {
      title: 'Página não encontrada | EasyTraining',
    };
  }

  return {
    title: `${post.title} | Blog EasyTraining`,
    alternates: {
      canonical: `https://www.easytraining.com.br/blog/${post.slug}`,
    },
  };
}

export default async function RootSlugPageRoute({ params }: PageProps) {
  const { slug } = await params;
  const posts = getStoredPosts();
  const cleanSlug = slug.replace(/^\/|\/$/g, '').toLowerCase();
  const post = posts.find(p => p.slug.toLowerCase() === cleanSlug);

  if (!post) {
    notFound();
  }

  // Redirecionamento permanente 301/308 do artigo legado na raiz para /blog/[slug]
  redirect(`/blog/${post.slug}`, RedirectType.replace);
}
