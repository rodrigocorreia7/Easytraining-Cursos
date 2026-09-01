import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getStoredPosts } from '../../lib/db';
import { PostDetailView } from '../../components/blog/PostDetailView';

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
    title: `${post.title} | EasyTraining Guarulhos`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://easytraining.com.br/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author || 'EasyTraining'],
      images: [
        {
          url: post.image,
          alt: post.title,
        },
      ],
    },
    alternates: {
      canonical: `https://easytraining.com.br/${post.slug}`,
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

  const related = posts
    .filter(p => p.slug.toLowerCase() !== cleanSlug && (!post.category || p.category === post.category))
    .slice(0, 3);

  return <PostDetailView post={post} relatedPosts={related} />;
}
