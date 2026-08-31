'use client';

import React from 'react';
import { ListFilter, ChevronRight } from 'lucide-react';
import { HeadingItem } from '../../types';

interface TableOfContentsProps {
  headings: HeadingItem[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ headings }) => {
  if (!headings || headings.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <aside className="bg-white/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm my-8">
      <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 text-[#052e7f] font-bold text-base">
        <ListFilter className="w-5 h-5 text-[#00B060]" />
        <span>Neste Artigo (Índice de Tópicos)</span>
      </div>

      <nav aria-label="Índice do Artigo">
        <ul className="space-y-2.5 text-sm">
          {headings.map((h, i) => (
            <li 
              key={i} 
              className={h.level === 3 ? 'pl-4' : 'pl-0'}
            >
              <button
                onClick={() => scrollToHeading(h.id)}
                className="group flex items-start gap-2 text-left text-slate-600 hover:text-[#00B060] transition-colors py-1 cursor-pointer w-full"
              >
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00B060] shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5" />
                <span className="leading-snug font-medium">{h.text}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
