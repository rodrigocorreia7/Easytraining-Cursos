'use client';

import React from 'react';
import { Star, ExternalLink, MessageCircle, CheckCircle2, Quote } from 'lucide-react';
import { siteConfig } from '../../data/siteConfig';
import SplitText from '../ui/SplitText';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Luana Paz',
      initials: 'LP',
      avatarColor: 'bg-emerald-700',
      course: 'Curso de Auxiliar Veterinário',
      time: '4 meses atrás',
      stars: 5,
      text: 'Excelente escola! Concluí recentemente o curso de Auxiliar Veterinária na Easy Training e recomendo muito. A Professora Andressa Lessa foi essencial nessa jornada. Suas aulas foram muito práticas e enriquecedoras.',
      response: 'Olá Luana, agradecemos imensamente pela sua avaliação e por recomendar nosso curso Auxiliar Veterinário em Guarulhos. Ficamos felizes em saber que a Professora Andressa contribuiu significativamente para a sua formação. Sucesso em sua carreira! 🐾'
    },
    {
      name: 'Sabrina Ferreira Rodrigues',
      initials: 'SF',
      avatarColor: 'bg-[#0477BF]',
      course: 'Curso de Auxiliar Veterinário',
      time: '4 meses atrás',
      stars: 5,
      text: 'O curso de Auxiliar de Veterinário tem sido uma experiência muito enriquecedora. Ele oferece uma base sólida sobre cuidados com os animais, técnicas de higiene, primeiros socorros e rotina de clínicas e hospitais veterinários. Além disso, a estrutura e o suporte dos professores são excelentes.',
      response: 'Olá Sabrina, agradecemos imensamente pelo seu feedback positivo sobre o curso de Auxiliar de Veterinário. Ficamos felizes em saber que a experiência está sendo enriquecedora e que você está adquirindo habilidades importantes. Estamos aqui para apoiá-la em sua jornada profissional. 💎'
    },
    {
      name: 'Maysa Silva Abreu',
      initials: 'MS',
      avatarColor: 'bg-purple-600',
      course: 'Curso de Informática & Formação Prática',
      time: '2 meses atrás',
      stars: 5,
      text: 'Minha experiência na escola de informática foi muito positiva. Os professores demonstram conhecimento e explicam os conteúdos de forma clara e prática, facilitando o aprendizado. A estrutura da escola é organizada, com computadores modernos e ótimo suporte pedagógico.',
      response: 'Obrigado, Maysa! Ficamos felizes em saber que teve uma experiência positiva em nossa escola. Estamos comprometidos em oferecer um ambiente de aprendizado de qualidade. Esperamos vê-la em breve para novos cursos.'
    },
    {
      name: 'Nathália Gomes Gomes',
      initials: 'NG',
      avatarColor: 'bg-indigo-600',
      course: 'Curso de Auxiliar Veterinário',
      time: '9 meses atrás',
      stars: 5,
      text: 'A escola é excelente, muito organizada e com um ambiente acolhedor. Os profissionais são atenciosos e realmente sabem ensinar. Faço o curso de Auxiliar Veterinário e estou gostando demais, as aulas são bem explicadas, práticas e me ajudam a entender cada detalhe da área. Super recomendo!',
      response: 'Obrigado, Nathália! Nosso compromisso é entregar a melhor preparação prática para o mercado de trabalho com carinho e dedicação.'
    }
  ];

  return (
    <section id="avaliacoes" className="py-20 sm:py-28 bg-slate-50 relative overflow-hidden">
      {/* Decorative gradient blur background */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#00B060]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 -ml-20" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#052e7f]/10 rounded-full blur-3xl pointer-events-none -mr-20" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Google Score Badge */}
        <div className="max-w-3xl mx-auto text-center mb-14 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-xs font-bold text-[#052e7f] shadow-xs border border-slate-200/80">
            <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
            <span>Avaliações Reais de Alunos no Google</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#052e7f] tracking-tight leading-normal pb-1">
            <SplitText
              text="Nota 5.0 no Google com mais de 320 alunos satisfeitos"
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#052e7f] tracking-tight leading-tight"
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

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Veja o que diz quem já se formou ou estuda na <strong>EasyTraining</strong> em Guarulhos. Aulas 100% práticas, professores especialistas e suporte para entrar no mercado.
          </p>

          {/* Google Score Floating Summary Pill */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href={siteConfig.rating.googleProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white shadow-sm hover:shadow-md border border-slate-200 text-slate-800 transition-all hover:scale-102"
              title="Abrir perfil oficial no Google"
            >
              {/* Google G Multi-color Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>

              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base text-slate-900">5,0</span>
                <div className="flex text-[#FFB800]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
                  ))}
                </div>
              </div>

              <span className="text-xs text-slate-500 font-semibold border-l border-slate-200 pl-3">
                {siteConfig.rating.reviewsCount} avaliações
              </span>

              <ExternalLink className="w-3.5 h-3.5 text-[#00B060]" />
            </a>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {reviews.map((r, idx) => (
            <article
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl border border-slate-200/80 hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between space-y-5 relative"
            >
              {/* Top Quote Icon */}
              <Quote className="w-8 h-8 text-slate-100 absolute top-6 right-6 pointer-events-none" />

              <div className="space-y-4">
                {/* Author row */}
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-full ${r.avatarColor} text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0`}>
                    {r.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-[#052e7f] text-base leading-tight truncate">
                        {r.name}
                      </h3>
                      <span title="Avaliação Verificada no Google">
                        <CheckCircle2 className="w-4 h-4 text-[#00B060] shrink-0" />
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      {r.time} • Avaliação Google
                    </p>
                  </div>
                </div>

                {/* Stars & Course Tag */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1 text-[#FFB800]">
                    {[...Array(r.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
                    ))}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#065F46] text-[11px] font-bold">
                    {r.course}
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                  "{r.text}"
                </p>
              </div>

              {/* Owner Response Box */}
              {r.response && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-[#052e7f]">
                    <div className="w-4 h-4 rounded-full bg-[#052e7f] text-white flex items-center justify-center text-[9px]">
                      E
                    </div>
                    <span>Resposta da EasyTraining (Proprietário):</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic pl-6">
                    {r.response}
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Bottom CTA to view all reviews on Google */}
        <div className="mt-12 text-center">
          <a
            href={siteConfig.rating.googleProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#052e7f] hover:bg-[#04215c] text-white font-bold text-sm sm:text-base shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            {/* Google Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Ver Todas as 323 Avaliações no Google</span>
            <ExternalLink className="w-4 h-4 text-[#00B060]" />
          </a>
        </div>

      </div>
    </section>
  );
};
