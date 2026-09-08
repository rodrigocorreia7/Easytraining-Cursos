import { notFound, permanentRedirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getPostsFromFirestore } from '../../lib/firestoreDb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const posts = await getPostsFromFirestore();
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
  const posts = await getPostsFromFirestore();
  const cleanSlug = slug.replace(/^\/|\/$/g, '').toLowerCase();
  const post = posts.find(p => p.slug.toLowerCase() === cleanSlug);

  if (!post) {
    notFound();
  }

  // Redirecionamento permanente do artigo legado na raiz para /blog/[slug].
  permanentRedirect(`/blog/${post.slug}`);
}
