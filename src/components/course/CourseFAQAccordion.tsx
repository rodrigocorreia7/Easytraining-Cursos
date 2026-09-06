'use client';

import React, { useState } from 'react';
import { FaqItem } from '@/types';
import { HelpCircle, ChevronDown, MessageCircle, Sparkles } from 'lucide-react';

interface CourseFAQAccordionProps {
  faqs?: FaqItem[];
  courseTitle: string;
  whatsappUrl: string;
}

export const CourseFAQAccordion: React.FC<CourseFAQAccordionProps> = ({
  faqs,
  courseTitle,
  whatsappUrl,
}) => {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  // Deixa a primeira pergunta aberta para engajamento imediato
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <section aria-labelledby="course-faq-heading" className="mb-12">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#00B060] flex items-center justify-center shrink-0 shadow-xs border border-emerald-100/50">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold mb-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Tire Suas Dúvidas</span>
              </div>
              <h2 id="course-faq-heading" className="text-2xl sm:text-3xl font-black text-[#052e7f] tracking-tight">
                Perguntas Frequentes sobre {courseTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Tudo o que você precisa saber sobre aulas práticas, certificado, requisitos e matrícula em Guarulhos.
              </p>
            </div>
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5" role="region" aria-label="Lista de perguntas frequentes do curso">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const questionId = `faq-question-${idx}`;
            const answerId = `faq-answer-${idx}`;

            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-emerald-200 bg-emerald-50/20 shadow-xs'
                    : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  id={questionId}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => toggleItem(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00B060] rounded-2xl"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200 ${
                      isOpen ? 'bg-[#00B060] text-white' : 'bg-white text-slate-400 border border-slate-200'
                    }`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ease-out ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={answerId}
                    role="region"
                    aria-labelledby={questionId}
                    className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal animate-in fade-in duration-200"
                  >
                    <div className="border-t border-slate-200/60 pt-3">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Fast CTA Box */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-[#052e7f] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm sm:text-base font-bold">Ainda tem alguma dúvida sobre este curso?</h3>
            <p className="text-xs text-slate-300">
              Nossa equipe pedagógica em Guarulhos está online para tirar dúvidas sobre turmas, valores e bolsas.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#00B060] hover:bg-[#009652] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Falar com a Secretaria</span>
          </a>
        </div>

      </div>
    </section>
  );
};
