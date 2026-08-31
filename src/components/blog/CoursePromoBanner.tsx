import React from 'react';
import { GraduationCap, ArrowRight, CheckCircle2, MessageCircle, Clock } from 'lucide-react';
import { RelatedCourseInfo } from '../../types';
import { siteConfig } from '../../data/siteConfig';

interface CoursePromoBannerProps {
  course: RelatedCourseInfo;
}

export const CoursePromoBanner: React.FC<CoursePromoBannerProps> = ({ course }) => {
  if (!course) return null;

  const whatsappUrl = `https://wa.me/${siteConfig.whatsappClean}?text=${encodeURIComponent(
    `Olá! Estava lendo o artigo no blog da EasyTraining e quero saber mais sobre o curso de ${course.name} e condições de matrícula.`
  )}`;

  return (
    <section className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#052e7f] via-[#0A2540] to-[#041c33] text-white shadow-xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#00B060]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFB800]/15 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md border border-white/10">
            <GraduationCap className="w-4 h-4" />
            <span>Formação Profissional Recomendada</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            {course.name}
          </h3>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {course.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 pt-1">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#FFB800]" />
              <span>Carga: {course.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00B060]" />
              <span>Certificado Reconhecido</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00B060]" />
              <span>Aulas 100% Práticas</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#00B060] hover:bg-[#009b54] text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-900/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center"
          >
            <MessageCircle className="w-5 h-5 fill-white/20" />
            <span>Consultar Turmas & Bolsas</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="/#cursos"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold text-center backdrop-blur-md transition-colors"
          >
            Ver Grade Completa do Curso
          </a>
        </div>
      </div>
    </section>
  );
};
