import type { Metadata } from 'next';
import { Award, CheckCircle2, MapPin, MessageCircle, Monitor, Users } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { WhatsAppFloatingButton } from '../../components/layout/WhatsAppButton';
import { getStoredSiteConfig } from '../../lib/db';

export const metadata: Metadata = {
  title: 'Quem Somos',
  description:
    'Conheça a EasyTraining, escola de cursos profissionalizantes em Guarulhos, no Parque Jurema, com aulas práticas, certificado e foco em empregabilidade.',
  alternates: {
    canonical: 'https://www.easytraining.com.br/quem-somos',
  },
  openGraph: {
    title: 'Quem Somos | EasyTraining Guarulhos',
    description:
      'Escola profissionalizante em Guarulhos com cursos práticos, atendimento próximo e foco no mercado de trabalho.',
    url: 'https://www.easytraining.com.br/quem-somos',
    images: [
      {
        url: 'https://www.easytraining.com.br/images/robot/image-hero.webp',
        alt: 'EasyTraining Cursos Profissionalizantes em Guarulhos',
      },
    ],
  },
};

export default function QuemSomosPage() {
  const siteConfig = getStoredSiteConfig();
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappClean}?text=${encodeURIComponent(
    'Olá! Acessei a página Quem Somos da EasyTraining e gostaria de conhecer melhor a escola.'
  )}`;

  const highlights = [
    'Cursos presenciais e práticos em Guarulhos',
    'Atendimento para jovens, adultos e quem busca recolocação',
    'Formações em informática, gestão, pet, farmácia, design e marketing',
    'Certificado de conclusão para fortalecer currículo e oportunidades',
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': 'https://www.easytraining.com.br/quem-somos',
    name: 'Quem Somos | EasyTraining',
    description: metadata.description,
    url: 'https://www.easytraining.com.br/quem-somos',
    mainEntity: {
      '@type': 'EducationalOrganization',
      '@id': 'https://www.easytraining.com.br/#organizacao',
      name: 'EasyTraining - Cursos Profissionalizantes',
      url: 'https://www.easytraining.com.br',
      telephone: siteConfig.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: siteConfig.address.street,
        addressLocality: siteConfig.address.city,
        addressRegion: siteConfig.address.state,
        postalCode: siteConfig.address.zipCode,
        addressCountry: 'BR',
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 selection:bg-[#00B060] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="pt-28 pb-20">
        <section className="bg-[#052e7f] text-white">
          <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-emerald-300">
                <MapPin className="h-4 w-4" />
                Parque Jurema, Guarulhos
              </span>
              <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                Uma escola profissionalizante feita para a prática
              </h1>
              <p className="text-base leading-relaxed text-slate-200 sm:text-lg">
                A EasyTraining atende alunos de Guarulhos e região com cursos voltados para o dia a dia do trabalho. A proposta é simples: ensinar com prática, orientação próxima e formações que ajudem o aluno a ganhar confiança para buscar novas oportunidades.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#00B060] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-[#009652]"
              >
                <MessageCircle className="h-5 w-5" />
                Falar com a secretaria
              </a>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <img
                src="/images/robot/image-hero.webp"
                alt="EasyTraining Cursos Profissionalizantes em Guarulhos"
                className="h-full min-h-[360px] w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <Monitor className="mb-4 h-9 w-9 text-[#052e7f]" />
              <h2 className="text-xl font-black text-[#052e7f]">Aprendizado prático</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                As aulas são pensadas para aproximar o aluno da rotina real de trabalho, com exercícios, laboratórios e acompanhamento pedagógico.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <Users className="mb-4 h-9 w-9 text-[#00B060]" />
              <h2 className="text-xl font-black text-[#052e7f]">Atendimento próximo</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                A equipe ajuda o aluno a escolher curso, horário e caminho de formação conforme seu momento: primeiro emprego, mudança de área ou atualização.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <Award className="mb-4 h-9 w-9 text-amber-500" />
              <h2 className="text-xl font-black text-[#052e7f]">Foco em empregabilidade</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Os cursos ajudam a construir currículo, repertório técnico e segurança para entrevistas, estágios, jovem aprendiz e oportunidades profissionais.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-black text-[#052e7f]">Por que alunos procuram a EasyTraining</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#00B060]" />
                  <span className="text-sm font-semibold leading-relaxed text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
