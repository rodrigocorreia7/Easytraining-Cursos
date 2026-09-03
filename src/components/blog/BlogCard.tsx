'use client';

import React from 'react';
import { Clock, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { BlogPost } from '../../types';
import { formatShortDate } from '../../lib/dateUtils';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false }) => {
  const formattedDate = formatShortDate(post.date);

  return (
    <article
      className={`group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-emerald-300 shadow-sm hover:shadow-xl transition-all duration-300 ${
        featured ? 'md:grid md:grid-cols-12 md:gap-6' : ''
      }`}
    >
      {/* Image container */}
      <div
        className={`relative overflow-hidden bg-slate-100 ${
          featured ? 'md:col-span-6 h-64 md:h-full min-h-[260px]' : 'h-52 w-full'
        }`}
      >
        <img
          src={post.image?.includes('wp-content/uploads/') 
            ? `/images/courses/${post.image.split('/').pop()}` 
            : (post.image || '/images/courses/Curso-de-informatica-basica-em-guarulhos.png')}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            target.onerror = null;
            target.src = '/images/courses/Curso-de-informatica-basica-em-guarulhos.png';
          }}
        />
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-[#052e7f] backdrop-blur-md shadow-xs border border-white/80">
            <BookOpen className="w-3.5 h-3.5 text-[#00B060]" />
            {post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        className={`p-6 sm:p-7 flex flex-col justify-between flex-1 ${
          featured ? 'md:col-span-6 md:p-8' : ''
        }`}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
            <span suppressHydrationWarning className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#FFB800]" />
              {formattedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#00B060]" />
              {post.readTime}
            </span>
          </div>

          <h3
            className={`font-bold text-slate-900 group-hover:text-[#052e7f] transition-colors leading-tight ${
              featured ? 'text-2xl sm:text-3xl' : 'text-xl'
            }`}
          >
            <a href={`/${post.slug}`} className="hover:underline focus:outline-hidden">
              {post.title}
            </a>
          </h3>

          <p className="text-slate-600 text-sm sm:text-base line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">
            {post.author || 'EasyTraining'}
          </span>

          <a
            href={`/${post.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#00B060] group-hover:text-[#052e7f] transition-colors"
          >
            <span>Ler Artigo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </article>
  );
};
