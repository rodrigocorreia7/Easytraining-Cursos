'use client';

import React from 'react';
import { Award, Users, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { siteConfig } from '../../data/siteConfig';
import Aurora from '../ui/Aurora';

export const About: React.FC = () => {
  return (
    <section id="quem-somos" className="py-20 sm:py-28 relative overflow-hidden bg-slate-900 text-slate-900">
      
      {/* 1. AURORA WEBGL SHADER BACKGROUND */}
      <div className="absolute inset-0 z-0 opacity-70 pointer-events-none">
        <Aurora
          colorStops={["#dad517", "#186cc9", "#084e0c"]}
          blend={0.66}
          amplitude={1.0}
          speed={0.9}
        />
      </div>

      {/* Subtle Overlay to enhance contrast and readability */}
      <div className="absolute inset-0 z-0 bg-slate-950/40 pointer-events-none" />

      {/* 2. MAIN CONTENT */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="max-w-2xl mx-auto text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-[#052e7f] shadow-sm">
            <Award className="w-4 h-4 text-[#D97706]" />
            <span>Tradição em Qualificação Profissional</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md">
            Mais que uma escola, o caminho para o seu sucesso profissional
          </h2>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed drop-shadow">
            Localizada no coração dos Pimentas em Guarulhos, a EasyTraining nasceu com a missão de oferecer capacitação prática de alto nível com preços acessíveis e professores dedicados.
          </p>
        </div>

        {/* Bento Grid with Liquid Glass cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-5">
          
          {/* Card 1: Laboratórios */}
          <div className="lg:col-span-7 bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-white/40 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#00B060] flex items-center justify-center font-black text-sm shadow-sm">
                01
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#052e7f]">
                Aulas 100% Práticas em Laboratórios Equipados
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Aqui você não perde tempo apenas com teorias. Nos cursos de informática, cada aluno tem seu computador individual. Nos cursos de veterinária e estética pet, o aprendizado é feito diretamente com animais reais em ambiente seguro.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs font-bold text-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00B060] shrink-0" />
                <span>1 Aluno por Computador</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00B060] shrink-0" />
                <span>Professores Especialistas</span>
              </div>
            </div>
          </div>

          {/* Card 2: Localização */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#052e7f]/90 to-[#0A2540]/90 backdrop-blur-xl text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-2xl bg-white/15 text-white flex items-center justify-center font-black text-sm shadow-sm">
                02
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Fácil Acesso em Guarulhos (Pimentas)
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                Situada na Estrada do Sacramento, ao lado do Terminal Pimentas e Shopping Bonsucesso. Transporte público fácil para alunos de toda a região.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md text-xs text-slate-200 flex items-center gap-2 border border-white/10">
              <MapPin className="w-4 h-4 text-[#FFB800] shrink-0" />
              <span>{siteConfig.address.street} - Guarulhos/SP</span>
            </div>
          </div>

          {/* Card 3: Certificado */}
          <div className="lg:col-span-4 bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-white/40 space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#00B060] flex items-center justify-center font-bold text-sm shadow-sm">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#052e7f]">Certificado Válido Nacionalmente</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Ao concluir o curso, você recebe um certificado reconhecido em todo o território nacional para comprovação de horas, enriquecimento de currículo e promoções.
            </p>
          </div>

          {/* Card 4: Mercado */}
          <div className="lg:col-span-4 bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-white/40 space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#052e7f] flex items-center justify-center font-bold text-sm shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#052e7f]">Orientação para o Mercado</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Nossos professores auxiliam na elaboração do seu currículo, simulação de entrevistas e dicas para você se destacar nos processos seletivos.
            </p>
          </div>

          {/* Card 5: Horários */}
          <div className="lg:col-span-4 bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-white/40 space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#FFB800] flex items-center justify-center font-bold text-sm shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#052e7f]">Turmas nos 3 Períodos</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Opções de turmas pela manhã, tarde, noite e aos sábados para você estudar no horário que melhor se adapta à sua rotina.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
