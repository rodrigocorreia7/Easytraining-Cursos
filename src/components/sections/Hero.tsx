'use client';

import React, { useEffect, useRef } from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { siteConfig } from '../../data/siteConfig';

const TOTAL_FRAMES = 71;

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetIndexRef = useRef<number>(35);
  const currentIndexRef = useRef<number>(35);
  const animIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Only initialize the 71-frame interactive canvas on Desktop screens (>= 1024px)
    if (typeof window === 'undefined' || window.innerWidth < 1024) {
      return;
    }

    const loadedImages: HTMLImageElement[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const numStr = String(i).padStart(3, '0');
      img.src = `/images/robot/frames/frame_${numStr}.webp`;
      loadedImages.push(img);
    }
    imagesRef.current = loadedImages;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    const renderInitial = () => {
      const initialImg = loadedImages[35] || loadedImages[0];
      if (initialImg && initialImg.complete && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(initialImg, 0, 0, canvas.width, canvas.height);
      }
    };
    if (loadedImages[35]) {
      loadedImages[35].onload = renderInitial;
    }

    // 60fps Canvas Render Loop
    const renderLoop = () => {
      const diff = targetIndexRef.current - currentIndexRef.current;
      if (Math.abs(diff) > 0.01) {
        currentIndexRef.current += diff * 0.18;
        const frameIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(currentIndexRef.current)));
        const activeImg = imagesRef.current[frameIdx];

        if (activeImg && activeImg.complete && ctx && canvas) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(activeImg, 0, 0, canvas.width, canvas.height);
        }
      }
      animIdRef.current = requestAnimationFrame(renderLoop);
    };

    animIdRef.current = requestAnimationFrame(renderLoop);

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      
      if (e.clientY >= rect.top - 50 && e.clientY <= rect.bottom + 150) {
        const normalizedX = Math.max(0, Math.min(1, e.clientX / window.innerWidth));
        targetIndexRef.current = normalizedX * (TOTAL_FRAMES - 1);
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, []);

  const scrollToCourses = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('cursos');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const whatsappUrl = `https://wa.me/${siteConfig.whatsappClean}?text=${encodeURIComponent(
    'Olá! Gostaria de informações sobre os cursos da EasyTraining em Guarulhos.'
  )}`;

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative bg-gradient-to-b from-[#06182c] via-[#0A2540] to-[#081f36] lg:bg-[#F6F9F8] pt-24 sm:pt-28 lg:pt-32 pb-12 lg:pb-20 overflow-hidden min-h-[600px] lg:min-h-[680px] xl:min-h-[740px] 2xl:min-h-[800px] flex items-center"
    >
      {/* Subtle Mobile Ambient Glow behind the robot */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-tr from-blue-600/25 to-emerald-500/20 blur-3xl rounded-full pointer-events-none lg:hidden" />

      {/* ========================================================= */}
      {/* 1. MOBILE LAYOUT (lg:hidden) - MODO ESCURO DE ALTO CONTRASTE */}
      {/* ========================================================= */}
      <div className="lg:hidden w-full max-w-[480px] mx-auto px-4 sm:px-6 flex flex-col items-center text-left space-y-4 relative z-20">
        
        {/* 1.1 Matrículas Pill */}
        <div className="self-start inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold text-emerald-300 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Matrículas Abertas • Guarulhos (Pimentas)</span>
        </div>

        {/* 1.2 Main Headline H1 */}
        <h1 className="text-[28px] sm:text-[32px] font-black tracking-tight leading-[1.12] text-left w-full text-white">
          <span className="text-white">Easytraining - </span>
          <span className="text-emerald-400">Cursos de Informática e Profissionalizantes</span>
          <span className="text-slate-200 block text-2xl sm:text-[28px] font-extrabold mt-0.5">em Guarulhos-SP</span>
        </h1>

        {/* 1.3 Centered Hero Robot com Glow de Fundo e Drop Shadow */}
        <div className="w-full flex justify-center items-center py-2 my-0 relative">
          <div className="absolute inset-0 bg-radial from-emerald-500/15 via-blue-500/10 to-transparent blur-2xl rounded-full pointer-events-none" />
          <img
            src="/images/robot/image-hero.webp"
            alt="Easytraining - Cursos de Informática e Profissionalizantes em Guarulhos"
            width={360}
            height={360}
            className="w-full max-w-[300px] sm:max-w-[340px] h-auto object-contain select-none relative z-10 drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>

        {/* 1.4 Three Metric Cards (Dark Glass) */}
        <div className="grid grid-cols-3 gap-2.5 w-full text-center">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 shadow-xs">
            <p className="text-lg sm:text-xl font-black text-white">19+</p>
            <p className="text-[10px] sm:text-[11px] text-slate-300 font-semibold mt-0.5">Cursos Práticos</p>
          </div>
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 shadow-xs">
            <p className="text-lg sm:text-xl font-black text-[#FFB800]">★ 5.0</p>
            <p className="text-[10px] sm:text-[11px] text-slate-300 font-semibold mt-0.5">Nota no Google</p>
          </div>
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 shadow-xs">
            <p className="text-lg sm:text-xl font-black text-emerald-400">100%</p>
            <p className="text-[10px] sm:text-[11px] text-slate-300 font-semibold mt-0.5">Com Certificado</p>
          </div>
        </div>

        {/* 1.5 Subtitle Description */}
        <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed text-left w-full pt-1">
          Mais de <strong className="text-white font-bold">5.000 alunos</strong> já transformaram suas carreiras. Venha para a <strong className="text-emerald-300 font-bold">Easytraining</strong> e faça parte deste time! Formação 100% presencial e prática com certificado reconhecido.
        </p>

        {/* 1.6 Action CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 w-full pt-1">
          <button
            onClick={scrollToCourses}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-[#00874A] hover:bg-[#00703C] text-white text-xs sm:text-sm font-bold rounded-full transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
          >
            <span>Explorar Cursos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs sm:text-sm font-bold rounded-full backdrop-blur-md transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Falar no WhatsApp</span>
          </a>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 2. DESKTOP & 4K UNIFIED RESPONSIVE WRAPPER */}
      {/* ========================================================= */}
      <div className="hidden lg:block w-full max-w-[1536px] 2xl:max-w-[1720px] mx-auto px-6 lg:px-10 xl:px-14 relative">
        
        {/* Left Foreground Content */}
        <div className="max-w-xl xl:max-w-2xl 2xl:max-w-3xl space-y-6 text-left relative z-30 py-4">
          
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50/90 backdrop-blur-md border border-slate-200/80 text-xs font-bold text-[#052e7f] shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00874A] animate-pulse" />
            <span>Matrículas Abertas 2026 • Guarulhos (Pimentas)</span>
          </div>

          {/* Main Headline H1 */}
          <h1 className="text-4xl lg:text-[46px] xl:text-[54px] 2xl:text-[60px] font-black tracking-tight text-slate-900 leading-[1.12]">
            <span className="text-[#052e7f]">Easytraining - </span>
            <span className="text-[#00874A]">Cursos de Informática e Profissionalizantes</span>
            <span className="text-slate-800 block text-3xl lg:text-4xl 2xl:text-5xl mt-1 font-extrabold">
              em Guarulhos-SP
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg 2xl:text-xl text-slate-600 leading-relaxed max-w-xl 2xl:max-w-2xl font-medium">
            Mais de <strong className="text-slate-900 font-bold">5.000 alunos</strong> já transformaram suas carreiras. Venha para a <strong className="text-[#052e7f] font-bold">Easytraining</strong> e faça parte deste time! Formação 100% presencial e prática com certificado reconhecido.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={scrollToCourses}
              className="flex items-center gap-2 px-7 py-3.5 bg-[#00874A] hover:bg-[#00703C] text-white text-sm 2xl:text-base font-bold rounded-full transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
            >
              <span>Conhecer os Cursos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3.5 bg-white/90 backdrop-blur-md hover:bg-white text-[#052e7f] border border-slate-200 text-sm 2xl:text-base font-bold rounded-full transition-all shadow-xs hover:border-[#00874A] active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-[#00874A]" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg 2xl:max-w-xl pt-3 text-center">
            <div className="p-3.5 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#052e7f]/30 transition-colors">
              <p className="text-xl sm:text-2xl 2xl:text-3xl font-black text-[#052e7f]">19+</p>
              <p className="text-[11px] sm:text-xs 2xl:text-sm text-slate-700 font-semibold mt-0.5">Cursos Práticos</p>
            </div>
            <div className="p-3.5 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#D97706]/40 transition-colors">
              <p className="text-xl sm:text-2xl 2xl:text-3xl font-black text-[#D97706]">★ 5.0</p>
              <p className="text-[11px] sm:text-xs 2xl:text-sm text-slate-700 font-semibold mt-0.5">Nota no Google</p>
            </div>
            <div className="p-3.5 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#00874A]/40 transition-colors">
              <p className="text-xl sm:text-2xl 2xl:text-3xl font-black text-[#00874A]">100%</p>
              <p className="text-[11px] sm:text-xs 2xl:text-sm text-slate-700 font-semibold mt-0.5">Com Certificado</p>
            </div>
          </div>

        </div>

        {/* Right Robot Canvas (Anchored directly inside the same max-w container!) */}
        <div className="absolute right-0 bottom-0 top-12 lg:top-14 xl:top-16 2xl:top-20 w-[58%] xl:w-[60%] 2xl:w-[58%] h-full flex items-end justify-end pointer-events-none z-10 select-none">
          <div className="relative w-full h-full flex items-end justify-end overflow-visible">
            <canvas
              ref={canvasRef}
              width={1280}
              height={720}
              className="h-full w-full max-h-[92%] 2xl:max-h-[95%] object-contain object-bottom-right scale-110 lg:scale-120 xl:scale-125 2xl:scale-130 origin-bottom-right select-none"
            />
          </div>
        </div>

      </div>

    </section>
  );
};
