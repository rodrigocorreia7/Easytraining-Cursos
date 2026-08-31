import React from 'react';
import { realBlogPosts } from '../../data/blogPostsReal';
import { Calendar, Clock, ArrowRight, Newspaper, BookOpen } from 'lucide-react';
import SplitText from '../ui/SplitText';

export const BlogSection: React.FC = () => {
  // Show top 3 recent real posts on landing page
  const featuredPosts = realBlogPosts.slice(0, 3);

  return (
    <section id="blog" className="py-20 sm:py-28 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-xs font-bold text-[#00874A]">
            <Newspaper className="w-3.5 h-3.5 text-[#00874A]" />
            <span>Blog Oficial EasyTraining</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#052e7f] tracking-tight">
            <SplitText
              text="Conteúdo para acelerar o seu crescimento"
              className="text-3xl sm:text-4xl font-black text-[#052e7f] tracking-tight"
              delay={28}
              duration={0.9}
              ease="power3.out"
              splitType="words, chars"
              from={{ opacity: 0, y: 35 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.15}
              tag="span"
              textAlign="center"
            />
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Artigos, guias práticos e dicas sobre o mercado de trabalho em Guarulhos e qualificação profissional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {featuredPosts.map((post) => {
            const formattedDate = new Date(post.date).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            });

            return (
              <article
                key={post.id}
                className="group bg-slate-50 rounded-3xl p-6 shadow-sm hover:shadow-xl border border-slate-200/80 hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 rounded-2xl overflow-hidden mb-5 bg-slate-200">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-[11px] font-bold text-[#052e7f] rounded-full shadow-xs border border-white/80">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-3 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#FFB800]" />
                      {formattedDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#00B060]" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#052e7f] mb-2.5 leading-snug group-hover:text-[#00B060] transition-colors">
                    <a href={`/${post.slug}`} className="hover:underline">
                      {post.title}
                    </a>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-200/80 flex items-center justify-between">
                  <a
                    href={`/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00B060] group-hover:text-[#052e7f] transition-colors"
                  >
                    <span>Ler Artigo Completo</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* Call to action for full blog */}
        <div className="text-center pt-4">
          <a
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#052e7f] hover:bg-[#04215c] text-white font-bold text-sm sm:text-base shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <BookOpen className="w-5 h-5 text-[#FFB800]" />
            <span>Ver Todos os Artigos do Blog ({realBlogPosts.length})</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
};
