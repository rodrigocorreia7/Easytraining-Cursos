import React from 'react';
import type { Metadata } from 'next';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { WhatsAppFloatingButton } from '../../components/layout/WhatsAppButton';
import { siteConfig } from '../../data/siteConfig';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidade e Proteção de Dados (LGPD) | EasyTraining',
  description: 'Conheça as diretrizes de privacidade e tratamento de dados pessoais da EasyTraining em total conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).',
  alternates: {
    canonical: 'https://easytraining.com.br/politica-de-privacidade'
  }
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 selection:bg-[#00874A] selection:text-white font-sans antialiased">
      <Header />

      <main className="pt-28 sm:pt-36 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <a href="/" className="hover:text-[#00874A] transition-colors">Início</a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">Política de Privacidade</span>
          </nav>

          {/* Hero Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 mb-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-[#00874A] text-xs font-bold border border-emerald-100">
              <ShieldCheck className="w-4 h-4 text-[#00874A]" />
              <span>Conformidade com a LGPD • Lei nº 13.709/2018</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#052e7f] tracking-tight leading-tight">
              Política de Privacidade e Proteção de Dados
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Última atualização: <strong>31 de Agosto de 2026</strong>. A <strong>EasyTraining Cursos Profissionalizantes</strong> preza pela transparência, segurança e privacidade dos dados de seus alunos, responsáveis, visitantes e colaboradores.
            </p>
          </div>

          {/* Content Document */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
            
            {/* 1. Identificação do Controlador */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#052e7f] flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-blue-50 text-[#052e7f] text-xs font-black flex items-center justify-center">1</span>
                <span>Identificação do Controlador de Dados</span>
              </h2>
              <p>
                O responsável pelo tratamento dos seus dados pessoais é a instituição:
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs sm:text-sm text-slate-800">
                <p><strong>Razão Social / Nome:</strong> EasyTraining Cursos Profissionalizantes</p>
                <p><strong>Endereço:</strong> {siteConfig.address.street}, {siteConfig.address.neighborhood} - {siteConfig.address.city}/{siteConfig.address.state}, CEP {siteConfig.address.zipCode}</p>
                <p><strong>E-mail de Contato do DPO / Encarregado:</strong> privacidade@easytraining.com.br ou contato@easytraining.com.br</p>
                <p><strong>Telefone / WhatsApp:</strong> {siteConfig.phone} / {siteConfig.whatsapp}</p>
              </div>
            </section>

            {/* 2. Dados Coletados */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#052e7f] flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-blue-50 text-[#052e7f] text-xs font-black flex items-center justify-center">2</span>
                <span>Quais Dados Coletamos e Como Utilizamos</span>
              </h2>
              <p>
                Coletamos apenas as informações estritamente necessárias para prestar nossos serviços pedagógicos e responder a solicitações de atendimento:
              </p>
              <ul className="space-y-2 pl-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00874A] shrink-0 mt-1" />
                  <span><strong>Formulário de Contato e WhatsApp:</strong> Nome completo, número de telefone/WhatsApp e curso de interesse. Utilizados exclusivamente para esclarecer dúvidas sobre turmas, valores e envio da grade curricular.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00874A] shrink-0 mt-1" />
                  <span><strong>Matrícula e Cadastro Escolar:</strong> RG, CPF, comprovante de endereço e dados do responsável (em caso de alunos menores de 18 anos), necessários para confecção de contrato educacional e emissão de certificados oficiais válidos nacionalmente.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00874A] shrink-0 mt-1" />
                  <span><strong>Dados de Navegação (Cookies Técnicos):</strong> Endereço IP anonimizado, tipo de dispositivo e páginas visitadas para fins de métricas de desempenho e melhoria da experiência de navegação.</span>
                </li>
              </ul>
            </section>

            {/* 3. Bases Legais */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#052e7f] flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-blue-50 text-[#052e7f] text-xs font-black flex items-center justify-center">3</span>
                <span>Bases Legais para o Tratamento (Art. 7º da LGPD)</span>
              </h2>
              <p>
                Todo tratamento de dados realizado pela EasyTraining está respaldado nas hipóteses legais da LGPD:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="font-bold text-slate-900 text-xs sm:text-sm mb-1">Consentimento do Titular</p>
                  <p className="text-xs text-slate-600">Fornecido voluntariamente ao preencher formulários de contato ou iniciar conversa via WhatsApp.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="font-bold text-slate-900 text-xs sm:text-sm mb-1">Execução de Contrato</p>
                  <p className="text-xs text-slate-600">Necessário para a prestação dos serviços educacionais, aulas práticas e emissão de certificados.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="font-bold text-slate-900 text-xs sm:text-sm mb-1">Cumprimento de Obrigação Legal</p>
                  <p className="text-xs text-slate-600">Guarda de registros fiscais e documentação de certificação profissional conforme a Lei de Diretrizes e Bases da Educação.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="font-bold text-slate-900 text-xs sm:text-sm mb-1">Legítimo Interesse</p>
                  <p className="text-xs text-slate-600">Para segurança do site, prevenção a fraudes e melhoria contínua dos cursos oferecidos.</p>
                </div>
              </div>
            </section>

            {/* 4. Direitos dos Titulares */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#052e7f] flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-blue-50 text-[#052e7f] text-xs font-black flex items-center justify-center">4</span>
                <span>Seus Direitos como Titular dos Dados (Art. 18 da LGPD)</span>
              </h2>
              <p>
                Você tem o direito de solicitar a qualquer momento e de forma gratuita:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00874A] shrink-0" />
                  <span>Confirmação da existência de tratamento</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00874A] shrink-0" />
                  <span>Acesso aos seus dados pessoais</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00874A] shrink-0" />
                  <span>Correção de dados incompletos ou inexatos</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00874A] shrink-0" />
                  <span>Anonimização, bloqueio ou eliminação</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00874A] shrink-0" />
                  <span>Portabilidade dos dados</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00874A] shrink-0" />
                  <span>Revogação do consentimento</span>
                </div>
              </div>
            </section>

            {/* 5. Segurança da Informação */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#052e7f] flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-blue-50 text-[#052e7f] text-xs font-black flex items-center justify-center">5</span>
                <span>Segurança e Armazenamento dos Dados</span>
              </h2>
              <p>
                Adotamos medidas técnicas e organizacionais rigorosas para proteger seus dados contra acessos não autorizados, vazamentos ou alterações ilícitas:
              </p>
              <ul className="space-y-2 pl-2 text-xs sm:text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#00874A] shrink-0" />
                  <span>Criptografia de ponta a ponta via certificado SSL/TLS (HTTPS em 100% das páginas).</span>
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#00874A] shrink-0" />
                  <span>Controle de acesso restrito com autenticação multifator para a equipe administrativa.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#00874A] shrink-0" />
                  <span>Não vendemos, alugamos ou comercializamos dados pessoais de alunos com terceiros sob nenhuma hipótese.</span>
                </li>
              </ul>
            </section>

            {/* 6. Canal de Atendimento do DPO */}
            <section className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200/80 space-y-3">
              <h3 className="text-lg font-bold text-[#052e7f] flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#00874A]" />
                <span>Canal de Contato do Encarregado de Dados (DPO)</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700">
                Para exercer qualquer um dos seus direitos previstos na LGPD ou esclarecer dúvidas sobre esta Política de Privacidade, entre em contato direto com o nosso Encarregado de Proteção de Dados:
              </p>
              <div className="text-xs sm:text-sm font-bold text-[#052e7f] space-y-1">
                <p>E-mail: <a href="mailto:privacidade@easytraining.com.br" className="text-[#00874A] underline">privacidade@easytraining.com.br</a></p>
                <p>Atendimento Presencial: Estrada do Sacramento, 1250 - Sala 02, Conj. Hab. Marcos Freire / Pimentas, Guarulhos - SP</p>
              </div>
            </section>

          </div>

        </div>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
