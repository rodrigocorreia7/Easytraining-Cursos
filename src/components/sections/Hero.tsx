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
    // 1. Preload 71 WebP frames into memory
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

    // 2. 60fps/120fps Canvas Render Loop
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

    // 3. Mouse Tracker across Viewport
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
      className="relative bg-white pt-24 sm:pt-28 pb-12 overflow-hidden"
    >
      {/* ========================================================= */}
      {/* 1. MOBILE LAYOUT (lg:hidden) - EXACT PIXEL PERFECT */}
      {/* ========================================================= */}
      <div className="lg:hidden w-full max-w-[480px] mx-auto px-4 sm:px-6 flex flex-col items-center text-left space-y-4">
        
        {/* 1.1 Matrículas Pill */}
        <div className="self-start inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-emerald-100 text-[11px] font-bold text-emerald-800">
          <span className="w-2 h-2 rounded-full bg-[#00B060] animate-pulse" />
          <span>Matrículas Abertas • Guarulhos (Pimentas)</span>
        </div>

        {/* 1.2 Main Headline H1 (SEO Semantic text) */}
        <h1 className="text-[28px] sm:text-[32px] font-black tracking-tight leading-[1.12] text-left w-full">
          <span className="text-[#052e7f]">Easytraining - </span>
          <span className="text-[#00B060]">Cursos de Informática e Profissionalizantes em Guarulhos-SP</span>
        </h1>

        {/* 1.3 Centered Hero Robot (image-hero.png) */}
        <div className="w-full flex justify-center items-center py-0 my-0">
          <img
            src="/images/robot/image-hero.png"
            alt="Easytraining - Cursos de Informática e Profissionalizantes em Guarulhos"
            className="w-full max-w-[320px] sm:max-w-[360px] h-auto object-contain select-none"
            loading="eager"
          />
        </div>

        {/* 1.4 Three Metric Cards */}
        <div className="grid grid-cols-3 gap-2.5 w-full text-center">
          <div className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-sm">
            <p className="text-lg sm:text-xl font-black text-[#052e7f]">19+</p>
            <p className="text-[10px] sm:text-[11px] text-slate-600 font-semibold mt-0.5">Cursos Práticos</p>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-sm">
            <p className="text-lg sm:text-xl font-black text-[#FFB800]">★ 4.9</p>
            <p className="text-[10px] sm:text-[11px] text-slate-600 font-semibold mt-0.5">Nota no Google</p>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-sm">
            <p className="text-lg sm:text-xl font-black text-[#00B060]">100%</p>
            <p className="text-[10px] sm:text-[11px] text-slate-600 font-semibold mt-0.5">Com Certificado</p>
          </div>
        </div>

        {/* 1.5 Subtitle Description with 5000+ students */}
        <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed text-left w-full pt-1">
          Mais de <strong>5.000 alunos</strong> já transformaram suas carreiras. Venha para a <strong>Easytraining</strong> e faça parte deste time! Formação 100% presencial e prática com certificado reconhecido.
        </p>

        {/* 1.6 Action CTA Buttons (Replacing Search Bar) */}
        <div className="flex flex-col sm:flex-row gap-2.5 w-full pt-1">
          <button
            onClick={scrollToCourses}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#00B060] hover:bg-[#009652] text-white text-xs sm:text-sm font-bold rounded-full transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span>Explorar Cursos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-emerald-50 hover:bg-emerald-100 text-[#00B060] border border-emerald-200 text-xs sm:text-sm font-bold rounded-full transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Falar no WhatsApp</span>
          </a>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 2. DESKTOP LAYOUT (hidden lg:flex) - SEO MAX + CANVAS */}
      {/* ========================================================= */}
      <div className="hidden lg:flex relative z-20 max-w-[1440px] mx-auto px-6 lg:px-8 w-full min-h-[calc(100vh-8rem)] flex-col justify-center">
        
        {/* Left Column Text & Controls */}
        <div className="w-full lg:w-[50%] xl:w-[46%] max-w-xl space-y-6 text-left z-20 py-4">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-emerald-100 text-xs font-bold text-emerald-800">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00B060] animate-pulse" />
            <span>Matrículas Abertas • Guarulhos (Pimentas)</span>
          </div>

          <h1 className="text-3xl lg:text-[44px] xl:text-[50px] font-black tracking-tight leading-[1.10]">
            <span className="text-[#052e7f] block">Easytraining - </span>
            <span className="text-[#00B060] block mt-1">Cursos de Informática e Profissionalizantes em Guarulhos-SP</span>
          </h1>

          <p className="text-base text-slate-600 font-normal leading-relaxed max-w-lg">
            Mais de <strong>5.000 alunos</strong> já transformaram suas carreiras. Venha para a <strong>Easytraining</strong> e faça parte deste time! Formação 100% presencial e prática com certificado reconhecido em todo o Brasil.
          </p>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={scrollToCourses}
              className="flex items-center gap-2 px-7 py-3.5 bg-[#00B060] hover:bg-[#009652] text-white text-sm font-bold rounded-full transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95 cursor-pointer"
            >
              <span>Explorar Grade de Cursos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-[#052e7f] border border-slate-200 text-sm font-bold rounded-full transition-all shadow-sm hover:border-[#00B060] active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-[#00B060]" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg pt-3 text-center">
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-[#052e7f]/30 transition-colors">
              <p className="text-xl sm:text-2xl font-black text-[#052e7f]">19+</p>
              <p className="text-[11px] sm:text-xs text-slate-600 font-semibold mt-0.5">Cursos Práticos</p>
            </div>
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-[#FFB800]/40 transition-colors">
              <p className="text-xl sm:text-2xl font-black text-[#FFB800]">★ 4.9</p>
              <p className="text-[11px] sm:text-xs text-slate-600 font-semibold mt-0.5">Nota no Google</p>
            </div>
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-[#00B060]/40 transition-colors">
              <p className="text-xl sm:text-2xl font-black text-[#00B060]">100%</p>
              <p className="text-[11px] sm:text-xs text-slate-600 font-semibold mt-0.5">Com Certificado</p>
            </div>
          </div>

        </div>

      </div>

      {/* DESKTOP ZERO-STUTTER CANVAS ROBOT */}
      <div className="hidden lg:flex absolute right-[-10%] sm:right-[-4%] lg:right-[0%] xl:right-[2%] bottom-0 top-12 sm:top-10 lg:top-4 w-[85%] sm:w-[75%] lg:w-[65%] xl:w-[62%] h-full items-end justify-end pointer-events-none z-10 select-none">
        <div className="relative w-full h-full flex items-end justify-end overflow-visible">
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            className="h-full w-full max-h-[96vh] lg:max-h-[105vh] xl:max-h-[110vh] object-contain object-bottom-right scale-110 sm:scale-120 lg:scale-135 xl:scale-140 origin-bottom-right select-none mix-blend-multiply"
          />
        </div>
      </div>

    </section>
  );
};
