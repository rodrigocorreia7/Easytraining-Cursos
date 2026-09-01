'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { WhatsAppFloatingButton } from '../../components/layout/WhatsAppButton';
import { realBlogPosts as defaultPosts } from '../../data/blogPostsReal';
import { BlogPost } from '../../types';
import { BlogService } from '../../services/blogService';
import { BlogCard } from '../../components/blog/BlogCard';
import { Search, Newspaper, BookOpen, Filter, Award } from 'lucide-react';

export default function BlogArchivePage() {
  const [posts, setPosts] = useState<BlogPost[]>(defaultPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  useEffect(() => {
    async function loadDynamicPosts() {
      try {
        const data = await BlogService.getAllPosts();
        if (data && data.length > 0) {
          setPosts(data);
        }
      } catch (err) {
        console.error('Erro ao carregar posts dinâmicos:', err);
      }
    }
    loadDynamicPosts();
  }, []);

  const categories = useMemo(() => {
    const cats = ['Todos', ...Array.from(new Set(posts.map(p => p.category)))];
    return cats;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchQuery = !searchTerm || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.tags && post.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchCat = selectedCategory === 'Todos' || post.category === selectedCategory;

      return matchQuery && matchCat;
    });
  }, [posts, searchTerm, selectedCategory]);

  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 selection:bg-[#00B060] selection:text-white">
      <Header />

      <main className="pt-28 sm:pt-36 pb-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Banner */}
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-[#00874A] font-bold text-xs uppercase tracking-wider border border-emerald-100">
              <Newspaper className="w-4 h-4 text-[#00874A]" />
              <span>Conhecimento que Transforma Carreiras</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-[#052e7f] tracking-tight leading-tight">
              Blog & Notícias de Carreira
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Descubra oportunidades, dicas de entrevista, novidades do mercado de trabalho em Guarulhos e orientações práticas para sua qualificação profissional.
            </p>

            {/* Search Bar */}
            <div className="pt-4 max-w-xl mx-auto">
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
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
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
                onClick={() => { setSearchTerm(''); setSelectedCategory('Todos'); }}
                className="px-5 py-2.5 rounded-full bg-[#00B060] text-white text-xs font-bold hover:bg-[#009b54] transition-colors"
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
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
