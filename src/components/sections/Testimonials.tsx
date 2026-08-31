import React from 'react';
import { Star, Sparkles } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Camila Rodrigues',
      course: 'Curso de Auxiliar de Farmácia',
      text: 'Consegui meu primeiro emprego numa drogaria conceituada em menos de 1 mês após terminar o curso! O suporte dos professores foi essencial.',
      stars: 5
    },
    {
      name: 'Lucas Mendes',
      course: 'Excel Avançado & Informática',
      text: 'Excelente escola! Aulas super práticas, computadores rápidos e metodologia muito clara. Fui promovido para assistente administrativo na empresa.',
      stars: 5
    },
    {
      name: 'Juliana Ferreira',
      course: 'Tosa PET Geral & Banho e Tosa',
      text: 'A parte prática com os cães me deu toda a segurança que eu precisava. Hoje tenho meus próprios clientes de tosa aqui no Pimentas!',
      stars: 5
    }
  ];

  return (
    <section className="py-20 sm:py-28 bg-slate-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-2xl mx-auto text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-xs font-bold text-[#052e7f] shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
            <span>Depoimentos Reais</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#052e7f] tracking-tight">
            O que dizem os nossos alunos
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Mais de 380 avaliações 5 estrelas no Google de quem transformou sua vida profissional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#FFB800]">
                  {[...Array(r.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 italic leading-relaxed">
                  "{r.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="font-bold text-[#052e7f] text-sm">{r.name}</p>
                <p className="text-xs text-[#00B060] font-bold">{r.course}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
