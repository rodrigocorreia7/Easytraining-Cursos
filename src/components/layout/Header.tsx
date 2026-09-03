'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Clock, Menu, X, Home, BookOpen, Users, 
  Newspaper, Phone, MessageCircle, ArrowRight, MapPin 
} from 'lucide-react';
import { siteConfig as defaultSiteConfig } from '../../data/siteConfig';
import { SiteConfigService } from '../../services/siteConfigService';
import { TextRollButton } from '../ui/TextRollButton';
import { PillNav, PillNavItem } from '../ui/PillNav';

interface HeaderProps {
  onSelectCategory?: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const [spTime, setSpTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState(defaultSiteConfig);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
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

    SiteConfigService.getConfig().then((data) => {
      if (data) setConfig(data);
    }).catch(console.error);

    return () => clearInterval(interval);
  }, []);

  // Fecha o menu mobile se a tela for redimensionada para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems: PillNavItem[] = [
    { label: 'Início', href: '/#home' },
    { label: 'Cursos', href: '/#cursos' },
    { label: 'Quem Somos', href: '/#quem-somos' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contato', href: '/#contato' }
  ];

  const whatsappUrl = `https://wa.me/${config.whatsappClean}?text=${encodeURIComponent('Olá! Acessei o site da EasyTraining e gostaria de informações sobre os cursos.')}`;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 w-full max-w-[1440px] mx-auto p-2 sm:p-3 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md rounded-full pl-2.5 pr-2.5 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between shadow-[0_4px_25px_rgba(11,79,156,0.08)] border border-white/80 pointer-events-auto transition-all">
          
          {/* ========================================================= */}
          {/* 1. DESKTOP NAVIGATION (PillNav + Socials) */}
          {/* ========================================================= */}
          <div className="hidden md:flex items-center gap-2">
            <PillNav
              logo="/logo1.svg"
              logoAlt="EasyTraining Cursos Profissionalizantes"
              items={navItems}
              activeHref="/"
              baseColor="#ffffff"
              hoverBgColor="#052e7f"
              pillColor="transparent"
              pillTextColor="#052e7f"
              hoveredPillTextColor="#ffffff"
              ease="power3.easeOut"
              initialLoadAnimation={true}
            />

            {/* Social Icons (Desktop >= 1280px) */}
            <div className="hidden xl:flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <a
                href={config.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-blue-50 flex items-center justify-center transition-all group shadow-2xs border border-slate-100"
                aria-label="Facebook EasyTraining"
              >
                <svg className="w-3.5 h-3.5 fill-[#1877F2] group-hover:scale-115 transition-transform" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              <a
                href={config.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-blue-50 flex items-center justify-center transition-all group shadow-2xs border border-slate-100"
                aria-label="LinkedIn EasyTraining"
              >
                <svg className="w-3.5 h-3.5 fill-[#0A66C2] group-hover:scale-115 transition-transform" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>

              <a
                href={config.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-red-50 flex items-center justify-center transition-all group shadow-2xs border border-slate-100"
                aria-label="YouTube EasyTraining"
              >
                <svg className="w-3.5 h-3.5 fill-[#FF0000] group-hover:scale-115 transition-transform" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              <a
                href={config.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-pink-50 flex items-center justify-center transition-all group shadow-2xs border border-slate-100"
                aria-label="Instagram EasyTraining"
              >
                <svg className="w-3.5 h-3.5 fill-[#E4405F] group-hover:scale-115 transition-transform" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 2. MOBILE LOGO & BRAND (md:hidden) */}
          {/* ========================================================= */}
          <div className="flex md:hidden items-center gap-2 pl-1">
            <Link 
              href="/"
              className="w-9 h-9 rounded-full bg-white p-1 border border-slate-200/80 shadow-xs flex items-center justify-center shrink-0"
              aria-label="Ir para a página inicial"
            >
              <img
                src="/logo1.svg"
                alt="EasyTraining"
                className="w-full h-full object-contain"
              />
            </Link>
            <Link href="/" className="leading-tight">
              <span className="text-xs font-black tracking-tight text-[#052e7f] block">
                Easy<span className="text-[#00874A]">Training</span>
              </span>
              <span className="text-[9px] font-semibold text-slate-500 block -mt-0.5">
                Guarulhos • Pimentas
              </span>
            </Link>
          </div>

          {/* ========================================================= */}
          {/* 3. RIGHT SIDE CONTROLS (Desktop & Mobile) */}
          {/* ========================================================= */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Live Clock (Desktop only) */}
            <div className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-[12px] text-slate-700 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#00874A]" />
              <span suppressHydrationWarning>{mounted && spTime ? `Guarulhos ${spTime}` : 'Guarulhos'}</span>
            </div>

            {/* Desktop CTA Button */}
            <div className="hidden md:block">
              <TextRollButton
                text="Matrículas Abertas"
                variant="green"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                ariaLabel="Falar com a EasyTraining no WhatsApp"
              />
            </div>

            {/* Mobile Compact CTA Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#00874A] hover:bg-[#00703c] text-white text-[10.5px] font-bold shadow-xs active:scale-95 transition-transform shrink-0"
            >
              <span>Matrículas</span>
              <ArrowRight className="w-3 h-3" />
            </a>

            {/* Mobile Hamburger / Close Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 flex items-center justify-center cursor-pointer transition-all border border-slate-200/60 shadow-2xs shrink-0 mr-0.5"
              aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-3.5 h-3.5 text-slate-900 stroke-[2.5]" />
              ) : (
                <Menu className="w-3.5 h-3.5 text-slate-900 stroke-[2.5]" />
              )}
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================= */}
      {/* 4. MOBILE FULL-WIDTH FLOATING DRAWER / MODAL */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop Blur */}
          <div 
            className="md:hidden fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Floating Menu Container */}
          <div 
            className="md:hidden fixed top-[68px] left-3 right-3 z-50 bg-white/98 backdrop-blur-2xl rounded-3xl p-5 shadow-2xl border border-slate-200/90 max-w-md mx-auto animate-in slide-in-from-top-3 fade-in duration-200"
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <img src="/logo1.svg" alt="EasyTraining" className="w-6 h-6 object-contain" />
                <span className="text-xs font-black text-[#052e7f]">
                  Menu Easy<span className="text-[#00874A]">Training</span>
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">
                16 anos no Pimentas
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1.5" aria-label="Navegação Mobile">
              <Link
                href="/#home"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-[#00874A] font-bold text-xs transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Home className="w-4 h-4 text-[#052e7f]" />
                  <span>Início</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/#cursos"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-[#00874A] font-bold text-xs transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-[#00874A]" />
                  <span>Cursos Profissionalizantes</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-[#00874A] font-extrabold">19+</span>
              </Link>

              <Link
                href="/#quem-somos"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-[#00874A] font-bold text-xs transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>Quem Somos & Estrutura</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-[#00874A] font-bold text-xs transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Newspaper className="w-4 h-4 text-amber-600" />
                  <span>Blog & Carreira</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/#contato"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-[#00874A] font-bold text-xs transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>Localização & Contato</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </nav>

            {/* Direct WhatsApp Action Button */}
            <div className="pt-3 mt-2 border-t border-slate-100">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#00874A] hover:bg-[#00703c] text-white text-xs font-extrabold shadow-md active:scale-98 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chamar no WhatsApp ({config.phone})</span>
              </a>
            </div>

            {/* Address & Social Footer */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span>{config.address.neighborhood} • Guarulhos</span>

              {/* Social icons */}
              <div className="flex items-center gap-2">
                <a href={config.social.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#E4405F]">
                  Instagram
                </a>
                <span>•</span>
                <a href={config.social.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#1877F2]">
                  Facebook
                </a>
              </div>
            </div>

          </div>
        </>
      )}
    </>
  );
};
