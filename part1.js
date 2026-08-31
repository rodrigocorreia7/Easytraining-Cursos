const fs = require('fs');
const path = require('path');
const targetDir = 'I:/Works/Rod/Escola Profissionalizante/Easytrainning/Escola de Cursos/Site';

// 1. index.css
const indexCss = `@import "tailwindcss";

@layer utilities {
  .liquid-glass {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: inset 0 0 12px rgba(255, 255, 255, 0.5), 0 8px 32px rgba(11, 79, 156, 0.05);
    position: relative;
  }
  .liquid-glass-dark {
    background: rgba(10, 37, 64, 0.9);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 12px 40px rgba(0, 0, 0, 0.3);
    position: relative;
  }
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  color: #0F172A;
  background-color: #F8FAFC;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  overflow-x: hidden;
}

::selection {
  background-color: #00B060;
  color: #FFFFFF;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
`;
fs.writeFileSync(path.join(targetDir, 'src/index.css'), indexCss, 'utf8');

// 2. TextRollButton.tsx
const textRollButtonTsx = `import React from 'react';
import { ArrowRight } from 'lucide-react';

interface TextRollButtonProps {
  text: string;
  onClick?: () => void;
  variant?: 'green' | 'yellow' | 'blue' | 'whatsapp' | 'white' | 'dark';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  target?: string;
  rel?: string;
  type?: 'button' | 'submit';
  ariaLabel?: string;
}

export const TextRollButton: React.FC<TextRollButtonProps> = ({
  text,
  onClick,
  variant = 'green',
  className = '',
  size = 'md',
  href,
  target,
  rel,
  type = 'button',
  ariaLabel
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'whatsapp':
        return 'bg-[#075E54] hover:bg-[#054c44] text-white font-bold';
      case 'yellow':
        return 'bg-[#FFB800] hover:bg-[#e6a600] text-gray-950 font-bold';
      case 'blue':
        return 'bg-[#0B4F9C] hover:bg-[#083b75] text-white font-bold';
      case 'dark':
        return 'bg-gray-900 hover:bg-black text-white font-bold';
      case 'white':
        return 'bg-white hover:bg-gray-100 text-gray-900 shadow-md font-bold';
      case 'green':
      default:
        return 'bg-[#00B060] hover:bg-[#009652] text-white font-bold';
    }
  };

  const getArrowStyles = () => {
    switch (variant) {
      case 'whatsapp':
        return 'bg-white text-[#075E54]';
      case 'yellow':
        return 'bg-gray-950 text-[#FFB800]';
      case 'blue':
        return 'bg-white text-[#0B4F9C]';
      case 'dark':
        return 'bg-white text-gray-900';
      case 'white':
        return 'bg-[#00B060] text-white';
      case 'green':
      default:
        return 'bg-white text-[#00B060]';
    }
  };

  const getSizePadding = () => {
    switch (size) {
      case 'sm':
        return 'pl-4 pr-1.5 py-1.5 text-[12px] gap-2';
      case 'lg':
        return 'pl-6 sm:pl-7 pr-2.5 py-2.5 sm:py-3 text-[15px] sm:text-[16px] gap-4';
      case 'md':
      default:
        return 'pl-5 sm:pl-6 pr-2 py-2 text-[13px] sm:text-[14px] gap-3 sm:gap-3.5';
    }
  };

  const buttonClasses = \`group relative inline-flex items-center cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] rounded-full shadow-sm active:scale-95 \${getVariantStyles()} \${getSizePadding()} \${className}\`;

  const content = (
    <>
      <div className="h-[20px] overflow-hidden flex flex-col justify-start">
        <div className="flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2">
          <span className="h-[20px] flex items-center leading-none whitespace-nowrap">{text}</span>
          <span className="h-[20px] flex items-center leading-none whitespace-nowrap">{text}</span>
        </div>
      </div>
      <span
        className={\`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45 \${getArrowStyles()}\`}
      >
        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={buttonClasses}
        aria-label={ariaLabel || text}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClasses}
      aria-label={ariaLabel || text}
    >
      {content}
    </button>
  );
};
`;
fs.writeFileSync(path.join(targetDir, 'src/components/ui/TextRollButton.tsx'), textRollButtonTsx, 'utf8');

// 3. Header.tsx com LOGO OFICIAL
const headerTsx = `import React, { useState, useEffect } from 'react';
import { Clock, Menu, X } from 'lucide-react';
import { siteConfig } from '../../data/siteConfig';
import { TextRollButton } from '../ui/TextRollButton';

export const Header: React.FC = () => {
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
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full max-w-[1440px] mx-auto p-2 sm:p-3 pointer-events-none">
      <nav className="bg-white/95 backdrop-blur-md rounded-full p-[6px] sm:p-[8px] flex items-center justify-between shadow-[0_4px_25px_rgba(11,79,156,0.08)] border border-white/80 pointer-events-auto transition-all">
        
        <a
          href="#"
          className="flex items-center gap-2 pl-2 pr-1 hover:opacity-90 transition-opacity"
          aria-label="EasyTraining - Formação Profissional"
        >
          <img
            src="/images/logos/logo-easytraining.png"
            alt="EasyTraining Formação Profissional"
            className="h-9 sm:h-11 w-auto object-contain"
          />
        </a>

        <div className="hidden lg:flex items-center gap-6 xl:gap-8 ml-4">
          <button
            onClick={() => scrollTo('home')}
            className="text-[14px] text-gray-800 hover:text-[#00B060] transition-colors duration-200 font-semibold cursor-pointer"
          >
            Início
          </button>
          <button
            onClick={() => scrollTo('cursos')}
            className="text-[14px] text-gray-800 hover:text-[#00B060] transition-colors duration-200 font-semibold cursor-pointer"
          >
            Cursos
          </button>
          <button
            onClick={() => scrollTo('quem-somos')}
            className="text-[14px] text-gray-800 hover:text-[#00B060] transition-colors duration-200 font-semibold cursor-pointer"
          >
            Quem Somos
          </button>
          <button
            onClick={() => scrollTo('diferenciais')}
            className="text-[14px] text-gray-800 hover:text-[#00B060] transition-colors duration-200 font-semibold cursor-pointer"
          >
            Metodologia
          </button>
          <button
            onClick={() => scrollTo('blog')}
            className="text-[14px] text-gray-800 hover:text-[#00B060] transition-colors duration-200 font-semibold cursor-pointer"
          >
            Blog
          </button>
          <button
            onClick={() => scrollTo('contato')}
            className="text-[14px] text-gray-800 hover:text-[#00B060] transition-colors duration-200 font-semibold cursor-pointer"
          >
            Contato
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 text-[12px] text-gray-700 font-medium">
            <Clock className="w-3.5 h-3.5 text-[#00B060]" />
            <span>Guarulhos {spTime}</span>
          </div>

          <TextRollButton
            text="Matrículas Abertas"
            variant="green"
            href={`https://wa.me/${siteConfig.whatsappClean}?text=${encodeURIComponent('Olá! Acessei o site da EasyTraining e gostaria de informações sobre matrículas e valores.')}`}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            ariaLabel="Falar com a EasyTraining no WhatsApp"
          />

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 flex items-center justify-center text-gray-900 lg:hidden cursor-pointer hover:bg-slate-200 transition-colors"
            aria-label="Abrir menu de navegação"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 p-5 bg-white/98 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 space-y-4 pointer-events-auto">
          <div className="flex flex-col space-y-2.5">
            <button
              onClick={() => scrollTo('home')}
              className="text-left px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-emerald-50 hover:text-[#00B060] rounded-xl transition-all"
            >
              Início
            </button>
            <button
              onClick={() => scrollTo('cursos')}
              className="text-left px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-emerald-50 hover:text-[#00B060] rounded-xl transition-all"
            >
              Todos os Cursos
            </button>
            <button
              onClick={() => scrollTo('quem-somos')}
              className="text-left px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-emerald-50 hover:text-[#00B060] rounded-xl transition-all"
            >
              Quem Somos
            </button>
            <button
              onClick={() => scrollTo('diferenciais')}
              className="text-left px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-emerald-50 hover:text-[#00B060] rounded-xl transition-all"
            >
              Metodologia & Certificado
            </button>
            <button
              onClick={() => scrollTo('blog')}
              className="text-left px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-emerald-50 hover:text-[#00B060] rounded-xl transition-all"
            >
              Blog & Notícias
            </button>
            <button
              onClick={() => scrollTo('contato')}
              className="text-left px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-emerald-50 hover:text-[#00B060] rounded-xl transition-all"
            >
              Contato & Localização
            </button>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span>Atendimento: {spTime}</span>
            <span className="font-bold text-gray-900">{siteConfig.phone}</span>
          </div>
        </div>
      )}
    </header>
  );
};
`;
fs.writeFileSync(path.join(targetDir, 'src/components/layout/Header.tsx'), headerTsx, 'utf8');

// 4. Hero.tsx
const heroTsx = `import React, { useState } from 'react';
import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } from 'shaders/react';
import { Search } from 'lucide-react';

interface HeroProps {
  onSearch: (term: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      const el = document.getElementById('cursos');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-[92vh] lg:min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-28 sm:pt-32 pb-16">
      
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none opacity-30">
        <Shader className="w-full h-full" disableTelemetry>
          <Swirl colorA="#ffffff" colorB="#f0fdf4" detail={1.8}>
            <ChromaFlow
              baseColor="#ffffff"
              downColor="#00B060"
              leftColor="#0B4F9C"
              rightColor="#FFB800"
              upColor="#0A2540"
              momentum={12}
              radius={3.5}
            >
              <FlutedGlass
                aberration={0.35}
                angle={25}
                frequency={6}
                highlight={0.18}
                highlightSoftness={0}
                lightAngle={-90}
                refraction={3}
                shape="rounded"
                softness={1}
                speed={0.12}
              >
                <FilmGrain strength={0.03} />
              </FlutedGlass>
            </ChromaFlow>
          </Swirl>
        </Shader>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-emerald-100 text-xs font-bold text-emerald-800">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00B060] animate-pulse" />
            <span>Matrículas Abertas • Guarulhos (Pimentas)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-950 leading-[1.12]">
            Cursos Práticos para você <span className="text-[#00B060] relative inline-block">conquistar seu emprego</span> e transformar sua renda
          </h1>

          <p className="text-base sm:text-lg text-slate-700 font-normal leading-relaxed max-w-2xl mx-auto">
            Formação 100% presencial e prática em <strong>Informática</strong>, <strong>Administração</strong>, <strong>Auxiliar Veterinário</strong>, <strong>Banho e Tosa</strong>, <strong>Farmácia</strong> e <strong>Design</strong>. Certificado reconhecido em todo o Brasil!
          </p>

          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex items-center p-1.5 sm:p-2 bg-white rounded-full shadow-lg border border-slate-200/90 focus-within:border-[#00B060] transition-colors">
            <div className="flex items-center pl-3 sm:pl-4 flex-1 text-slate-400">
              <Search className="w-5 h-5 mr-2.5 text-[#00B060]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Qual curso você quer fazer? (ex: Excel, Tosa, Farmácia...)"
                className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-5 sm:px-7 py-2.5 sm:py-3 bg-[#00B060] hover:bg-[#009652] text-white text-xs sm:text-sm font-bold rounded-full transition-colors cursor-pointer shrink-0 shadow-md active:scale-95"
            >
              Buscar Curso
            </button>
          </form>

          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto pt-4 text-center">
            <div className="p-3.5 bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-sm">
              <p className="text-xl sm:text-2xl font-black text-[#0B4F9C]">19+</p>
              <p className="text-[11px] sm:text-xs text-slate-600 font-semibold">Cursos Práticos</p>
            </div>
            <div className="p-3.5 bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-sm">
              <p className="text-xl sm:text-2xl font-black text-[#FFB800]">? 4.9</p>
              <p className="text-[11px] sm:text-xs text-slate-600 font-semibold">Nota no Google</p>
            </div>
            <div className="p-3.5 bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-sm">
              <p className="text-xl sm:text-2xl font-black text-[#00B060]">100%</p>
              <p className="text-[11px] sm:text-xs text-slate-600 font-semibold">Com Certificado</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
`;
fs.writeFileSync(path.join(targetDir, 'src/components/sections/Hero.tsx'), heroTsx, 'utf8');

console.log('Parte 1 criada!');
