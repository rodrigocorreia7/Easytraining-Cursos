import { notFound, permanentRedirect } from 'next/navigation';
import type { Metadata } from 'next';
import { cache } from 'react';
import { getCachedPostBySlugFromFirestore } from '../../lib/firestoreDb';

export const revalidate = 43200;

interface PageProps {
  params: Promise<{ slug: string }>;
}

const getPostBySlug = cache((slug: string) => getCachedPostBySlugFromFirestore(slug));

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

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
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Redirecionamento permanente do artigo legado na raiz para /blog/[slug].
  permanentRedirect(`/blog/${post.slug}`);
}
