import { MetadataRoute } from 'next';
import {
  getCachedCoursesFromFirestore,
  getCachedPostsFromFirestore,
} from '../lib/firestoreDb';

// Keep the canonical sitemap available from cache and refresh it through the
// same on-demand invalidation used after CMS updates.
export const revalidate = 43200;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.easytraining.com.br';
  // 1. Rotas Estáticas Principais
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/contato`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cursos`,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/quem-somos`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/politica-de-privacidade`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/termos-de-uso`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // 2. Rotas Dinâmicas de Cursos (Catálogo Completo)
  const courses = await getCachedCoursesFromFirestore();
  const courseRoutes: MetadataRoute.Sitemap = courses
    .filter((c) => c && c.slug)
    .map((course) => ({
      url: `${baseUrl}/curso/${course.slug}`,
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

  // 3. Rotas Dinâmicas de Artigos do Blog
  const posts = await getCachedPostsFromFirestore();
  const postRoutes: MetadataRoute.Sitemap = posts
    .filter((p) => p && p.slug)
    .map((post) => {
      const parsedDate = post.date && !isNaN(Date.parse(post.date))
        ? new Date(post.date)
        : undefined;

      return {
        url: `${baseUrl}/blog/${post.slug}`,
        ...(parsedDate ? { lastModified: parsedDate } : {}),
        changeFrequency: 'weekly' as const,
        priority: 0.75,
      };
    });

  return [...staticRoutes, ...courseRoutes, ...postRoutes];
}
