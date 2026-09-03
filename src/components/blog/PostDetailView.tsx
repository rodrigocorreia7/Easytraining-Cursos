'use client';

import React from 'react';
import { Clock, Calendar, ArrowLeft, User, CheckCircle, Award } from 'lucide-react';
import { BlogPost } from '../../types';
import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';
import { WhatsAppFloatingButton } from '../layout/WhatsAppButton';
import { TableOfContents } from './TableOfContents';
import { CoursePromoBanner } from './CoursePromoBanner';
import { ShareButtons } from './ShareButtons';
import { ArticleFaq } from './ArticleFaq';
import { BlogCard } from './BlogCard';
import { formatLongDate } from '../../lib/dateUtils';

interface PostDetailViewProps {
  post: BlogPost;
  relatedPosts?: BlogPost[];
}

export const PostDetailView: React.FC<PostDetailViewProps> = ({ post, relatedPosts = [] }) => {
  const formattedDate = formatLongDate(post.date);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: post.author || 'EasyTraining'
    },
    publisher: {
      '@type': 'Organization',
      name: 'EasyTraining - Cursos Profissionalizantes',
      logo: {
        '@type': 'ImageObject',
        url: 'https://easytraining.com.br/images/logos/logo-easytraining.webp'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://easytraining.com.br/${post.slug}`
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 selection:bg-[#00B060] selection:text-white">
      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <Header />

      <main className="pt-28 sm:pt-36 pb-20">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb & Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <a
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#00B060] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Blog</span>
            </a>

            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#00B060] border border-emerald-100">
              {post.category}
            </span>
          </div>

          {/* Article Header */}
          <header className="space-y-4 mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#052e7f] tracking-tight leading-[1.2]">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author & Meta bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#052e7f] text-white flex items-center justify-center font-bold text-sm">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-800">{post.author || 'Equipe EasyTraining'}</div>
                  <div className="text-[11px] text-slate-500">{post.authorRole || 'Especialistas em Qualificação'}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 font-medium">
                <span suppressHydrationWarning className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#FFB800]" />
                  {formattedDate}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#00B060]" />
                  {post.readTime} de leitura
                </span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative w-full rounded-3xl overflow-hidden shadow-xl mb-10 bg-slate-100 aspect-16/9 max-h-[520px]">
            <img
              src={post.image?.includes('wp-content/uploads/')
                ? `/images/courses/${post.image.split('/').pop()}`
                : (post.image || '/images/courses/Curso-de-informatica-basica-em-guarulhos.png')}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = '/images/courses/Curso-de-informatica-basica-em-guarulhos.png';
              }}
            />
          </div>

          {/* Social Share Top */}
          <ShareButtons title={post.title} url={`/${post.slug}`} />

          {/* Table of Contents */}
          {post.headings && post.headings.length > 0 && (
            <TableOfContents headings={post.headings} />
          )}

          {/* Article Main Body Content */}
          <div
            className="prose-article my-10"
            dangerouslySetInnerHTML={{ __html: post.contentHtml || post.content || '' }}
          />

          {/* Smart Course Promo Banner */}
          {post.relatedCourse && (
            <CoursePromoBanner course={post.relatedCourse} />
          )}

          {/* Article FAQs */}
          {post.faqs && post.faqs.length > 0 && (
            <ArticleFaq faqs={post.faqs} />
          )}

          {/* Social Share Bottom */}
          <ShareButtons title={post.title} url={`/${post.slug}`} />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-6 border-t border-slate-200 my-8">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                Tags Relacionadas:
              </span>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-medium transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Articles Section */}
          {relatedPosts.length > 0 && (
            <div className="my-16 pt-12 border-t border-slate-200">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold text-[#00B060] uppercase tracking-wider">Continue Lendo</span>
                  <h3 className="text-2xl font-bold text-[#052e7f]">Artigos Relacionados</h3>
                </div>
                <a href="/blog" className="text-xs font-bold text-[#00B060] hover:underline">
                  Ver todos →
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map(rp => (
                  <BlogCard key={rp.id} post={rp} />
                ))}
              </div>
            </div>
          )}

        </article>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
};
