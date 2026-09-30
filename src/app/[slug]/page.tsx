import { notFound, permanentRedirect } from 'next/navigation';
import type { Metadata } from 'next';
import { cache } from 'react';
import { getCachedPostBySlugFromFirestore, getCachedPostsFromFirestore } from '../../lib/firestoreDb';

export const revalidate = 43200;
export const dynamicParams = false;

// Pré-renderiza estaticamente todos os artigos legados conhecidos na raiz.
// dynamicParams = false garante que qualquer URL inexistente receba 404 estático na CDN
// sem acordar funções serverless nem consultar o banco de dados.
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const posts = await getCachedPostsFromFirestore();

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
