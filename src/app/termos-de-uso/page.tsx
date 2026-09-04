import React from 'react';
import type { Metadata } from 'next';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { WhatsAppFloatingButton } from '../../components/layout/WhatsAppButton';
import { siteConfig } from '../../data/siteConfig';
import { FileText, ShieldCheck, ChevronRight, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Termos de Uso e Condições Gerais | EasyTraining',
  description: 'Confira os Termos de Uso e Condições Gerais de navegação e serviços educacionais da EasyTraining Cursos Profissionalizantes em Guarulhos.',
  alternates: {
    canonical: 'https://www.easytraining.com.br/termos-de-uso'
  }
};

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 selection:bg-[#00874A] selection:text-white font-sans antialiased">
      <Header />

      <main className="pt-28 sm:pt-36 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <a href="/" className="hover:text-[#00874A] transition-colors">Início</a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">Termos de Uso</span>
          </nav>

          {/* Hero Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 mb-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-[#052e7f] text-xs font-bold border border-blue-100">
              <FileText className="w-4 h-4 text-[#052e7f]" />
              <span>Condições Gerais de Navegação e Serviços</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#052e7f] tracking-tight leading-tight">
              Termos de Uso do Site
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Bem-vindo ao site oficial da <strong>EasyTraining Cursos Profissionalizantes</strong>. Ao navegar e utilizar nossos canais digitais, você concorda com os termos e condições descritos abaixo.
            </p>
          </div>

          {/* Content Document */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
            
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#052e7f]">1. Objeto e Serviços Oferecidos</h2>
              <p>
                Este site tem por finalidade apresentar as informações institucionais, cursos profissionalizantes presenciais, modalidades práticas, artigos educativos e canais de atendimento da EasyTraining, localizada em Guarulhos - SP.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#052e7f]">2. Propriedade Intelectual</h2>
              <p>
                Todos os textos, fotos de estrutura, marcas, logotipos, ilustrações, códigos e conteúdos publicados neste site são de propriedade exclusiva da EasyTraining ou devidamente licenciados, protegidos pela Lei de Direitos Autorais (Lei nº 9.610/98) e legislação de propriedade industrial. É proibida a reprodução sem prévia autorização por escrito.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#052e7f]">3. Matrículas e Vagas</h2>
              <p>
                As informações sobre valores promocionais, turmas e horários divulgadas no site ou em canais de atendimento estão sujeitas à disponibilidade de vagas no momento da efetivação da matrícula na unidade presencial.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#052e7f]">4. Certificação e Validade Nacional</h2>
              <p>
                Os cursos livres e profissionalizantes ministrados pela EasyTraining são emitidos com amparo na Lei nº 9.394/96 (LDB - Lei de Diretrizes e Bases da Educação Nacional) e Decreto Presidencial nº 5.154/04, válidos em todo o território nacional.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#052e7f]">5. Foro e Legislação Aplicável</h2>
              <p>
                Estes termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o Foro da Comarca de Guarulhos - SP para dirimir quaisquer dúvidas decorrentes deste documento.
              </p>
            </section>

          </div>

        </div>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
