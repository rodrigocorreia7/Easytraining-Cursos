'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { FaqItem } from '../../types';

interface ArticleFaqProps {
  faqs: FaqItem[];
}

export const ArticleFaq: React.FC<ArticleFaqProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="my-10 p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200">
      <div className="flex items-center gap-2.5 mb-6 text-[#052e7f]">
        <HelpCircle className="w-6 h-6 text-[#00B060]" />
        <h3 className="text-xl sm:text-2xl font-bold">Perguntas Frequentes sobre este tema</h3>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-4 sm:p-5 text-left font-bold text-slate-800 flex items-center justify-between gap-4 hover:text-[#00B060] transition-colors cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="text-base sm:text-lg leading-snug">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#00B060]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
