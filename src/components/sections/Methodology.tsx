'use client';

import React from 'react';
import {
  Monitor,
  Briefcase,
  Award,
  Clock,
  CheckCircle2,
  Laptop,
  FileSpreadsheet,
  Building2,
  HeartPulse,
  Scissors,
  Pill,
  Palette,
  Megaphone,
  Truck,
  TrendingUp,
  Users2,
  Calculator,
  Compass,
  Layers,
} from 'lucide-react';
import { LogoLoop, LogoItem } from '../ui/LogoLoop';
import SplitText from '../ui/SplitText';

export const Methodology: React.FC = () => {
  const steps = [
    {
      icon: Monitor,
      title: '1. Aulas 100% Práticas',
      desc: 'Nada de apenas assistir aulas teóricas. Você aprende fazendo no computador ou no centro prático de estética animal.'
    },
    {
      icon: Briefcase,
      title: '2. Foco no Mercado de Trabalho',
      desc: 'Projetos reais, simulações de rotinas empresariais e conteúdo atualizado com as reais demandas das empresas de Guarulhos.'
    },
    {
      icon: Award,
      title: '3. Certificado Reconhecido',
      desc: 'Certificação nacional válida para enriquecer seu currículo, disputar vagas ou comprovar horas em faculdades e concursos.'
    },
    {
      icon: Clock,
      title: '4. Formação Rápida e Eficiente',
      desc: 'Cursos intensivos de 3 a 6 meses para você se qualificar e começar a trabalhar o mais rápido possível.'
    }
  ];

  // Course marquee items with distinct icons and categories
  const courseLogos: LogoItem[] = [
    {
      node: (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs sm:text-sm font-bold text-white transition-all backdrop-blur-md shadow-sm">
          <Laptop className="w-4 h-4 text-[#00B060]" />
          <span>Informática Básica</span>
        </span>
      ),
      title: 'Informática Básica'
    },
    {
      node: (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs sm:text-sm font-bold text-white transition-all backdrop-blur-md shadow-sm">
          <FileSpreadsheet className="w-4 h-4 text-[#00B060]" />
          <span>Excel Avançado</span>
        </span>
      ),
      title: 'Excel Avançado'
    },
    {
      node: (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs sm:text-sm font-bold text-white transition-all backdrop-blur-md shadow-sm">
          <HeartPulse className="w-4 h-4 text-[#FFB800]" />
          <span>Auxiliar Veterinário</span>
        </span>
      ),
      title: 'Auxiliar Veterinário'
    },
    {
      node: (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs sm:text-sm font-bold text-white transition-all backdrop-blur-md shadow-sm">
          <Scissors className="w-4 h-4 text-[#FFB800]" />
          <span>Banho e Tosa Higiênica</span>
        </span>
      ),
      title: 'Banho e Tosa Higiênica'
    },
    {
      node: (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs sm:text-sm font-bold text-white transition-all backdrop-blur-md shadow-sm">
          <Scissors className="w-4 h-4 text-[#FFB800]" />
          <span>Tosa PET Geral</span>
        </span>
      ),
      title: 'Tosa PET Geral'
    },
    {
      node: (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs sm:text-sm font-bold text-white transition-all backdrop-blur-md shadow-sm">
          <Pill className="w-4 h-4 text-[#00B060]" />
          <span>Auxiliar de Farmácia</span>
        </span>
      ),
      title: 'Auxiliar de Farmácia'
    },
    {
      node: (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs sm:text-sm font-bold text-white transition-all backdrop-blur-md shadow-sm">
          <Building2 className="w-4 h-4 text-blue-400" />
          <span>Assistente Administrativo</span>
        </span>
      ),
      title: 'Assistente Administrativo'
    },
    {
      node: (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs sm:text-sm font-bold text-white transition-all backdrop-blur-md shadow-sm">
          <Palette className="w-4 h-4 text-[#FFB800]" />
          <span>Designer Gráfico</span>
        </span>
      ),
      title: 'Designer Gráfico'
    },
    {
      node: (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs sm:text-sm font-bold text-white transition-all backdrop-blur-md shadow-sm">
          <Megaphone className="w-4 h-4 text-[#FFB800]" />
          <span>Marketing Digital</span>
        </span>
      ),
      title: 'Marketing Digital'
    },
    {
      node: (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs sm:text-sm font-bold text-white transition-all backdrop-blur-md shadow-sm">
          <Truck className="w-4 h-4 text-blue-400" />
          <span>Assistente de Logística</span>
        </span>
      ),
      title: 'Assistente de Logística'
    },
    {
      node: (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs sm:text-sm font-bold text-white transition-all backdrop-blur-md shadow-sm">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <span>Gestão Comercial</span>
        </span>
      ),
      title: 'Gestão Comercial'
    },
    {
      node: (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs sm:text-sm font-bold text-white transition-all backdrop-blur-md shadow-sm">
          <Users2 className="w-4 h-4 text-blue-400" />
          <span>Recursos Humanos (RH)</span>
        </span>
      ),
      title: 'Recursos Humanos (RH)'
    },
    {
      node: (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs sm:text-sm font-bold text-white transition-all backdrop-blur-md shadow-sm">
          <Calculator className="w-4 h-4 text-blue-400" />
          <span>Auxiliar de Contabilidade</span>
        </span>
      ),
      title: 'Auxiliar de Contabilidade'
    },
    {
      node: (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs sm:text-sm font-bold text-white transition-all backdrop-blur-md shadow-sm">
          <Compass className="w-4 h-4 text-[#FFB800]" />
          <span>Projetista Digital</span>
        </span>
      ),
      title: 'Projetista Digital'
    },
    {
      node: (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs sm:text-sm font-bold text-white transition-all backdrop-blur-md shadow-sm">
          <Layers className="w-4 h-4 text-[#FFB800]" />
          <span>Arte-finalista</span>
        </span>
      ),
      title: 'Arte-finalista'
    },
    {
      node: (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs sm:text-sm font-bold text-white transition-all backdrop-blur-md shadow-sm">
          <Laptop className="w-4 h-4 text-[#00B060]" />
          <span>Informática Empresarial</span>
        </span>
      ),
      title: 'Informática Empresarial'
    }
  ];

  return (
    <section id="diferenciais" className="pt-10 pb-20 sm:pt-12 sm:pb-28 bg-[#0A2540] text-white relative overflow-hidden">
      
      {/* 1. CONTINUOUS COURSES LOOP MARQUEE (ABOVE METHODOLOGY) */}
      <div className="w-full pb-14 sm:pb-16 border-b border-white/10 mb-14 sm:mb-16">
        <div className="max-w-[1440px] mx-auto px-4 mb-4 text-center">
          <p className="text-xs uppercase tracking-widest font-extrabold text-emerald-400">
            Formações Práticas com Matrículas Abertas em Guarulhos
          </p>
        </div>
        <LogoLoop
          logos={courseLogos}
          speed={38}
          gap={20}
          logoHeight={36}
          pauseOnHover={true}
          scaleOnHover={true}
          fadeOut={true}
          fadeOutColor="#0A2540"
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2. METHODOLOGY HEADLINE & BADGE */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00874A]" />
            <span>Por que escolher a EasyTraining?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            <SplitText
              text="Metodologia pensada para a sua contratação"
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight"
              delay={28}
              duration={0.9}
              ease="power3.out"
              splitType="words, chars"
              from={{ opacity: 0, y: 35 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.15}
              tag="span"
              textAlign="center"
            />
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Descubra por que centenas de alunos escolhem a EasyTraining todos os anos em Guarulhos.
          </p>
        </div>

        {/* 3. FOUR STEPS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:border-emerald-400/50 transition-all space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#00B060]/20 text-[#00B060] flex items-center justify-center font-bold">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{s.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
