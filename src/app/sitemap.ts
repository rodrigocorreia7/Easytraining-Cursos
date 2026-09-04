import { MetadataRoute } from 'next';
import { getStoredCourses, getStoredPosts } from '../lib/db';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.easytraining.com.br';
  const now = new Date();

  // 1. Rotas Estáticas Principais
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/politica-de-privacidade`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/termos-de-uso`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // 2. Rotas Dinâmicas de Cursos (Catálogo Completo)
  const courses = getStoredCourses();
  const courseRoutes: MetadataRoute.Sitemap = courses
    .filter((c) => c && c.slug)
    .map((course) => ({
      url: `${baseUrl}/curso/${course.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

  // 3. Rotas Dinâmicas de Artigos do Blog
  const posts = getStoredPosts();
  const postRoutes: MetadataRoute.Sitemap = posts
    .filter((p) => p && p.slug)
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.date && !isNaN(Date.parse(post.date)) ? new Date(post.date) : now,
      changeFrequency: 'weekly',
      priority: 0.75,
    }));

  return [...staticRoutes, ...courseRoutes, ...postRoutes];
}
