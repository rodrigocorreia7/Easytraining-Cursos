'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { siteConfig } from '../../data/siteConfig';
import { TextRollButton } from '../ui/TextRollButton';
import SplitText from '../ui/SplitText';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'O que é a Easytraining e quais cursos vocês oferecem em Guarulhos?',
      a: 'A Easytraining Formação Profissional oferece cursos presenciais e híbridos em Guarulhos voltados para inserção no mercado de trabalho: Curso de Informática, Curso Auxiliar de Veterinário, Curso de Banho e Tosa, Farmácia, Administração e Design. Formações práticas, com foco em empregabilidade.',
    },
    {
      q: 'Como funciona o Curso de Informática? É indicado para iniciantes?',
      a: 'Voltado para iniciantes e jovens em busca da primeira vaga; aborda pacote Office, Excel, navegação segura, e-mail, formatação de documentos e noções de produtividade para compor o currículo.',
    },
    {
      q: 'O que vou aprender no Curso Auxiliar de Veterinário? Preciso ter experiência?',
      a: 'Cobre cuidados básicos, primeiros socorros, manejo, higiene e suporte a rotinas veterinárias. Não exige experiência prévia — apenas interesse e amor pela área pet.',
    },
    {
      q: 'Como é o Curso de Banho e Tosa? Dá para abrir um negócio?',
      a: 'Curso 100% prático que ensina higiene, tosquia básica, escovação, secagem e atendimento ao cliente — ideal para trabalhar em clínicas, pet shops ou iniciar seu próprio serviço/negócio.',
    },
    {
      q: 'Qual a duração, valores e como faço matrícula?',
      a: 'A duração e os valores variam por curso e turma. Para inscrições, valores com bolsas e condições atualizadas, entre em contato diretamente pelo nosso WhatsApp (11) 2303-7983.',
    },
    {
      q: 'Os cursos são presenciais em Guarulhos? Há opção online/híbrida?',
      a: 'Nossas turmas são presenciais em Guarulhos (Estrada do Sacramento, Pimentas), garantindo prática real. Alguns módulos teóricos contam com material de apoio online.',
    },
    {
      q: 'Vocês emitem certificado? Ele tem validade no mercado de trabalho?',
      a: 'Sim! Após a conclusão e cumprimento da carga horária, emitimos certificado de conclusão reconhecido e válido em todo o território nacional, perfeito para enriquecer o currículo.',
    },
    {
      q: 'Há pré-requisitos ou encaminhamentos necessários?',
      a: 'Na maioria dos cursos não há necessidade de experiência prévia. Temos formações desde os 12 anos de idade até turmas para adultos e terceira idade.',
    },
    {
      q: 'Qual a carga horária e frequência recomendada?',
      a: 'Varia conforme o curso escolhido. Oferecemos turmas nos períodos da manhã, tarde, noite e turmas intensivas exclusivas aos sábados.',
    },
    {
      q: 'Onde fica a Easytraining e como faço contato / matrícula?',
      a: 'Estamos na Estrada do Sacramento, 1250 - Sala 02, Marcos Freire / Pimentas em Guarulhos (ao lado do Terminal Pimentas e Shopping Bonsucesso). Telefone / WhatsApp: (11) 2303-7983.',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-slate-50 relative">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-xs font-bold text-[#052e7f] shadow-sm border border-slate-100">
            <HelpCircle className="w-3.5 h-3.5 text-[#FFB800]" />
            <span>Tire Suas Dúvidas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#052e7f] tracking-tight">
            <SplitText
              text="Perguntas Frequentes"
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#052e7f] tracking-tight"
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
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Confira as principais dúvidas sobre os cursos, matrículas, certificados e estrutura da EasyTraining em Guarulhos.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:border-[#00B060]/40 transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-800 hover:text-[#052e7f] text-sm sm:text-base cursor-pointer transition-colors"
                >
                  <span className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-[#052e7f] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#00B060]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pl-14 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    <p>{faq.a}</p>
                    {idx === 9 && (
                      <div className="mt-3 pt-2">
                        <TextRollButton
                          text="Chamar no WhatsApp"
                          variant="whatsapp"
                          href={`https://wa.me/${siteConfig.whatsappClean}?text=${encodeURIComponent('Olá! Gostaria de informações sobre matrículas na EasyTraining.')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="sm"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
