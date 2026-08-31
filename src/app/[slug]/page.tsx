import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BlogService } from '../../services/blogService';
import { PostDetailView } from '../../components/blog/PostDetailView';
import { realBlogPosts } from '../../data/blogPostsReal';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return realBlogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await BlogService.getPostBySlug(slug);

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
  const post = await BlogService.getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const related = await BlogService.getRelatedPosts(post.slug, 3);

  return <PostDetailView post={post} relatedPosts={related} />;
}
