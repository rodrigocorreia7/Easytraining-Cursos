import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { cache } from 'react';
import { getCachedPostBySlugFromFirestore, getCachedPostsFromFirestore, getPostsFromFirestore } from '../../../lib/firestoreDb';
import { PostDetailView } from '../../../components/blog/PostDetailView';

export const revalidate = 43200;

// Pre-render the known canonical article URLs. Unlisted slugs remain dynamic
// so newly published content and legacy links continue to resolve safely.
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const posts = await getPostsFromFirestore();

  return posts
    .filter((post) => post?.slug)
    .map((post) => ({ slug: post.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

const getPostBySlug = cache((slug: string) => getCachedPostBySlugFromFirestore(slug));

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Artigo não encontrado | EasyTraining',
    };
  }

  return {
    title: `${post.title} | Blog EasyTraining`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://www.easytraining.com.br/blog/${post.slug}`,
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
      canonical: `https://www.easytraining.com.br/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPageRoute({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const posts = await getCachedPostsFromFirestore();
  const cleanSlug = post.slug.toLowerCase();

  const related = posts
    .filter(p => p.slug.toLowerCase() !== cleanSlug && (!post.category || p.category === post.category))
    .slice(0, 3);

  return <PostDetailView post={post} relatedPosts={related} />;
}
