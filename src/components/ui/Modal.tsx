'use client';

import React, { useEffect } from 'react';
import { X, Clock, CheckCircle2, Award, Users, BookOpen } from 'lucide-react';
import { Course } from '../../types';
import { siteConfig } from '../../data/siteConfig';
import { TextRollButton } from './TextRollButton';

interface CourseModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({ course, isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !course) return null;

  const whatsappUrl = `https://wa.me/${siteConfig.whatsappClean}?text=${encodeURIComponent(course.whatsappMessage)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/60 backdrop-blur-sm">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="relative h-48 sm:h-64 bg-slate-900 shrink-0 overflow-hidden">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] via-[#0A2540]/50 to-transparent" />
          
          <button
            onClick={onClose}
            aria-label="Fechar detalhes do curso"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 sm:left-6 right-6">
            <span className="inline-block px-3 py-1 bg-[#00B060] text-white text-xs font-bold rounded-full mb-2 uppercase tracking-wider">
              {course.category}
            </span>
            <h2 id="modal-title" className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">
              {course.title}
            </h2>
          </div>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700 text-[14px] sm:text-[15px] leading-relaxed">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-[#00B060]" />
              <div>
                <p className="text-[11px] text-slate-500 font-semibold uppercase">Carga Horária</p>
                <p className="text-xs sm:text-sm font-bold text-[#052e7f]">{course.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-[#052e7f]" />
              <div>
                <p className="text-[11px] text-slate-500 font-semibold uppercase">Metodologia</p>
                <p className="text-xs sm:text-sm font-bold text-[#052e7f]">100% Prática</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
              <Award className="w-5 h-5 text-[#FFB800]" />
              <div>
                <p className="text-[11px] text-slate-500 font-semibold uppercase">Certificado</p>
                <p className="text-xs sm:text-sm font-bold text-[#052e7f]">Reconhecido</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#052e7f] mb-2">Sobre o Curso</h3>
            <p className="text-slate-600">{course.fullDescription}</p>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#052e7f] mb-3">Conteúdo Programático</h3>
            <div className="space-y-3">
              {course.modules.map((mod, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="font-bold text-[#052e7f] text-sm mb-2">{mod.title}</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {mod.topics.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00B060] mt-0.5 shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <h4 className="font-bold text-[#052e7f] text-sm mb-1 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#00B060]" /> Para Quem é Indicado
              </h4>
              <p className="text-xs text-slate-600">{course.targetAudience}</p>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
              <h4 className="font-bold text-[#052e7f] text-sm mb-1 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#052e7f]" /> Oportunidades de Atuação
              </h4>
              <ul className="text-xs text-slate-600 space-y-0.5">
                {course.careerOpportunities.map((c, i) => (
                  <li key={i}>• {c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4 text-xs text-slate-500 text-center sm:text-left">
            <span><strong className="text-[#052e7f]">Turmas reduzidas em Guarulhos</strong> • Vagas limitadas</span>
            <a
              href={`/curso/${course.slug}`}
              className="text-[#00B060] font-bold hover:underline hidden md:inline-flex items-center gap-1"
            >
              Página do Curso ↗
            </a>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Voltar
            </button>
            <TextRollButton
              text="Garantir Minha Vaga"
              variant="green"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              ariaLabel="Garantir vaga no curso via WhatsApp"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
