'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Menu, X, PhoneCall } from 'lucide-react';
import { siteConfig } from '../../data/siteConfig';
import { TextRollButton } from '../ui/TextRollButton';

interface HeaderProps {
  onSelectCategory?: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [spTime, setSpTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const formatted = new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(new Date());
      setSpTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'blog-page') {
      window.location.href = '/blog';
      return;
    }
    if (typeof window !== 'undefined') {
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -80;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else {
        window.location.href = `/#${id}`;
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full max-w-[1440px] mx-auto p-2 sm:p-3 pointer-events-none">
      <nav className="bg-white/95 backdrop-blur-md rounded-full p-[6px] sm:p-[8px] flex items-center justify-between shadow-[0_4px_25px_rgba(11,79,156,0.08)] border border-white/80 pointer-events-auto transition-all">
        {/* LOGO OFICIAL EASY TRAINING */}
        <a
          href="#"
          className="flex items-center gap-2 pl-2 pr-1 hover:opacity-90 transition-opacity"
          aria-label="EasyTraining - Formação Profissional"
        >
          <img
            src="/images/logos/logo-easytraining.webp"
            alt="EasyTraining Formação Profissional"
            className="h-8 sm:h-10 w-auto object-contain"
          />
        </a>

        {/* Nav links */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-7 ml-3">
          <button
            onClick={() => scrollTo('home')}
            className="text-[14px] text-slate-800 hover:text-[#00B060] transition-colors duration-200 font-semibold cursor-pointer"
          >
            Início
          </button>
          <button
            onClick={() => scrollTo('cursos')}
            className="text-[14px] text-slate-800 hover:text-[#00B060] transition-colors duration-200 font-semibold cursor-pointer"
          >
            Cursos
          </button>
          <button
            onClick={() => scrollTo('quem-somos')}
            className="text-[14px] text-slate-800 hover:text-[#00B060] transition-colors duration-200 font-semibold cursor-pointer"
          >
            Quem Somos
          </button>
          <a
            href="/blog"
            className="text-[14px] text-slate-800 hover:text-[#00B060] transition-colors duration-200 font-semibold cursor-pointer"
          >
            Blog
          </a>
          <button
            onClick={() => scrollTo('contato')}
            className="text-[14px] text-slate-800 hover:text-[#00B060] transition-colors duration-200 font-semibold cursor-pointer"
          >
            Contato
          </button>

          {/* Social Icons right after Contato */}
          <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-slate-50 hover:bg-blue-50 flex items-center justify-center transition-all group shadow-2xs border border-slate-100"
              aria-label="Facebook EasyTraining"
              title="Facebook EasyTraining"
            >
              <svg className="w-4 h-4 fill-[#1877F2] group-hover:scale-115 transition-transform" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-slate-50 hover:bg-blue-50 flex items-center justify-center transition-all group shadow-2xs border border-slate-100"
              aria-label="LinkedIn EasyTraining"
              title="LinkedIn EasyTraining"
            >
              <svg className="w-4 h-4 fill-[#0A66C2] group-hover:scale-115 transition-transform" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
            </a>

            <a
              href={siteConfig.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-slate-50 hover:bg-red-50 flex items-center justify-center transition-all group shadow-2xs border border-slate-100"
              aria-label="YouTube EasyTraining"
              title="YouTube EasyTraining"
            >
              <svg className="w-4 h-4 fill-[#0080FF] group-hover:fill-[#FF0000] group-hover:scale-115 transition-all" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>

            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-slate-50 hover:bg-pink-50 flex items-center justify-center transition-all group shadow-2xs border border-slate-100"
              aria-label="Instagram EasyTraining"
              title="Instagram EasyTraining"
            >
              <svg className="w-4 h-4 fill-[#0080FF] group-hover:fill-[#E4405F] group-hover:scale-115 transition-all" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Clock Guarulhos */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-[12px] text-slate-700 font-medium">
            <Clock className="w-3.5 h-3.5 text-[#00B060]" />
            <span>Guarulhos {spTime}</span>
          </div>

          {/* CTA WhatsApp Button */}
          <TextRollButton
            text="Matrículas Abertas"
            variant="green"
            href={`https://wa.me/${siteConfig.whatsappClean}?text=${encodeURIComponent('Olá! Acessei o site da EasyTraining e gostaria de informações sobre os cursos.')}`}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            ariaLabel="Falar com a EasyTraining no WhatsApp"
          />

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 lg:hidden cursor-pointer hover:bg-slate-200 transition-colors"
            aria-label="Abrir menu de navegação"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 p-5 bg-white/98 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 space-y-4 pointer-events-auto">
          <div className="flex flex-col space-y-2.5">
            <button
              onClick={() => scrollTo('home')}
              className="text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-[#00B060] rounded-xl transition-all"
            >
              Início
            </button>
            <button
              onClick={() => scrollTo('cursos')}
              className="text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-[#00B060] rounded-xl transition-all"
            >
              Cursos
            </button>
            <button
              onClick={() => scrollTo('quem-somos')}
              className="text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-[#00B060] rounded-xl transition-all"
            >
              Quem Somos
            </button>
            <a
              href="/blog"
              className="text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-[#00B060] rounded-xl transition-all"
            >
              Blog
            </a>
            <button
              onClick={() => scrollTo('contato')}
              className="text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-[#00B060] rounded-xl transition-all"
            >
              Contato
            </button>
          </div>

          {/* Mobile Social Links */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-center gap-4">
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
            </a>
            <a
              href={siteConfig.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center"
              aria-label="YouTube"
            >
              <svg className="w-4 h-4 fill-[#0080FF]" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 fill-[#0080FF]" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-slate-600">
            <span>Atendimento: {spTime}</span>
            <span className="font-bold text-slate-800">{siteConfig.phone}</span>
          </div>
        </div>
      )}
    </header>
  );
};
