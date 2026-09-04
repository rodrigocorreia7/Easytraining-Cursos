'use client';

import React, { useState, useMemo } from 'react';
import { BlogPost } from '../../types';
import { BlogCard } from './BlogCard';
import { Search, BookOpen, Award } from 'lucide-react';

interface BlogArchiveClientProps {
  initialPosts: BlogPost[];
}

export function BlogArchiveClient({ initialPosts }: BlogArchiveClientProps) {
  const [posts] = useState<BlogPost[]>(initialPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = useMemo(() => {
    const cats = ['Todos', ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))];
    return cats;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchQuery =
        !searchTerm ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.tags && post.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchCat = selectedCategory === 'Todos' || post.category === selectedCategory;

      return matchQuery && matchCat;
    });
  }, [posts, searchTerm, selectedCategory]);

  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  return (
    <div className="space-y-12">
      {/* Search and Filters */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        {/* Search Bar */}
        <div className="pt-2 max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar por assunto (ex: Excel, Veterinário, Jovem Aprendiz...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#00B060] focus:ring-2 focus:ring-emerald-100 shadow-sm transition-all text-sm"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#052e7f] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Display */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">Nenhum artigo encontrado</h3>
          <p className="text-sm text-slate-500 mb-4">
            Não encontramos artigos para o termo "{searchTerm}". Tente buscar por outros termos ou limpe o filtro.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('Todos');
            }}
            className="px-5 py-2.5 rounded-full bg-[#00B060] text-white text-xs font-bold hover:bg-[#009b54] transition-colors cursor-pointer"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Featured Post on Top */}
          {featuredPost && (
            <div>
              <div className="flex items-center gap-2 mb-4 text-xs font-bold text-[#00874A] uppercase tracking-wider">
                <Award className="w-4 h-4 text-[#00874A]" />
                <span>Artigo em Destaque</span>
              </div>
              <BlogCard post={featuredPost} featured={true} />
            </div>
          )}

          {/* Grid of Remaining Posts */}
          {regularPosts.length > 0 && (
            <div className="pt-8">
              <h2 className="text-2xl font-bold text-[#052e7f] mb-6">Todos os Artigos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
