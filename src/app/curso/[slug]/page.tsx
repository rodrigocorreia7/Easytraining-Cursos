import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { courses } from '../../../data/coursesData';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { WhatsAppFloatingButton } from '../../../components/layout/WhatsAppButton';
import { siteConfig } from '../../../data/siteConfig';
import { 
  CheckCircle2, 
  Clock, 
  Award, 
  Sparkles, 
  ChevronRight, 
  ArrowLeft, 
  MessageCircle, 
  Briefcase, 
  BookOpen, 
  Users, 
  Share2,
  Star
} from 'lucide-react';

// Map of legacy WordPress slugs and aliases to canonical courses
const slugAliases: Record<string, string> = {
  'curso-de-informatica-basica': 'curso-de-informatica-basica',
  'informatica-basica': 'curso-de-informatica-basica',
  'curso-de-informatica': 'informatica',
  'informatica': 'informatica',
  'informatica-avancada': 'informatica-avancada',
  'curso-de-informatica-avancada': 'informatica-avancada',
  'informatica-empresarial': 'informatica-empresarial',
  'informatica-aplicada-aos-estudos': 'informatica-aplicada-aos-estudos',
  'excel-avancado': 'excel-avancado',
  'curso-de-excel-avancado': 'excel-avancado',
  'auxiliar-veterinario': 'auxiliar-veterinario',
  'curso-auxiliar-veterinario': 'auxiliar-veterinario',
  'curso-de-auxiliar-veterinario': 'auxiliar-veterinario',
  'curso-de-auxiliar-veterinario-em-guarulhos': 'auxiliar-veterinario',
  'auxiliar-de-farmacia': 'auxiliar-de-farmacia',
  'curso-auxiliar-de-farmacia': 'auxiliar-de-farmacia',
  'banho-e-tosa-higienica': 'banho-e-tosa-higienica',
  'banho-e-tosa': 'banho-e-tosa-higienica',
  'curso-de-tosa-pet-geral-em-guarulhos-sp': 'curso-de-tosa-pet-geral-em-guarulhos-sp',
  'tosa-pet-geral': 'curso-de-tosa-pet-geral-em-guarulhos-sp',
  'tosa-pet': 'curso-de-tosa-pet-geral-em-guarulhos-sp',
  'assistente-administrativo': 'assistente-administrativo',
  'curso-assistente-administrativo': 'assistente-administrativo',
  'assistente-de-recursos-humanos': 'assistente-de-recursos-humanos',
  'recursos-humanos': 'assistente-de-recursos-humanos',
  'assistente-de-logistica': 'assistente-de-logistica',
  'logistica': 'assistente-de-logistica',
  'auxiliar-de-contabilidade': 'auxiliar-de-contabilidade',
  'contabilidade': 'auxiliar-de-contabilidade',
  'gestao-comercial': 'gestao-comercial',
  'designer-grafico': 'designer-grafico',
  'marketing-digital': 'marketing-digital',
  'projetista-digital': 'projetista-digital',
  'arte-finalista': 'arte-finalista'
};

function findCourseBySlug(slug: string) {
  const normalized = slug.toLowerCase().replace(/\/$/, '');
  const targetSlug = slugAliases[normalized] || normalized;
  return courses.find(c => c.slug === targetSlug || c.slug === normalized);
}

export async function generateStaticParams() {
  const allSlugs = new Set<string>();
  courses.forEach(c => allSlugs.add(c.slug));
  Object.keys(slugAliases).forEach(alias => allSlugs.add(alias));
  return Array.from(allSlugs).map(slug => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = findCourseBySlug(slug);

  if (!course) {
    return {
      title: 'Curso Não Encontrado | EasyTraining',
      description: 'Conheça nossos cursos profissionalizantes em Guarulhos.',
    };
  }

  const url = `https://easytraining.com.br/curso/${course.slug}`;

  return {
    title: `${course.title} em Guarulhos | EasyTraining`,
    description: course.shortDescription,
    keywords: [
      course.title.toLowerCase(),
      `${course.title.toLowerCase()} guarulhos`,
      'curso profissionalizante guarulhos',
      'easytraining pimentas',
      course.category.toLowerCase()
    ],
    openGraph: {
      title: `${course.title} em Guarulhos | Certificado Reconhecido`,
      description: course.fullDescription,
      url,
      images: [
        {
          url: course.image,
          width: 1200,
          height: 630,
          alt: course.title
        }
      ]
    },
    alternates: {
      canonical: url
    }
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = findCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const relatedCourses = courses
    .filter(c => c.id !== course.id && (c.categorySlug === course.categorySlug || c.featured))
    .slice(0, 3);

  const whatsappMessage = encodeURIComponent(
    course.whatsappMessage || `Olá! Gostaria de informações sobre o curso de ${course.title} na EasyTraining.`
  );
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappClean}?text=${whatsappMessage}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.fullDescription,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'EasyTraining Cursos Profissionalizantes',
      sameAs: 'https://easytraining.com.br',
      address: {
        '@type': 'PostalAddress',
        streetAddress: siteConfig.address.street,
        addressLocality: siteConfig.address.city,
        addressRegion: siteConfig.address.state,
        postalCode: siteConfig.address.zipCode,
        addressCountry: 'BR'
      }
    },
    educationalCredentialAwarded: 'Certificado de Conclusão Reconhecido Nacionalmente',
    timeRequired: course.duration,
    courseMode: course.modality,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Blended',
      location: 'Guarulhos - SP (Pimentas)',
      instructor: {
        '@type': 'Person',
        name: 'Corpo Docente Especialista EasyTraining'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '323'
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 selection:bg-[#00B060] selection:text-white font-sans antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="pt-28 pb-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb & Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <a href="/" className="hover:text-[#00B060] transition-colors">Início</a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <a href="/#cursos" className="hover:text-[#00B060] transition-colors">Cursos</a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">{course.title}</span>
          </nav>

          {/* Hero Header of the Course */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm border border-slate-200/80 mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Details & CTAs */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-[#00B060] text-xs font-bold border border-emerald-100">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>{course.category} • Matrículas Abertas</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#052e7f] tracking-tight leading-tight">
                  {course.title}
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                  {course.fullDescription}
                </p>

                {/* Badges Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#00B060] shrink-0" />
                    <div>
                      <p className="text-[11px] text-slate-500 font-medium">Duração</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-900">{course.duration}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-[#052e7f] shrink-0" />
                    <div>
                      <p className="text-[11px] text-slate-500 font-medium">Modalidade</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-900">{course.modality}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 col-span-2 sm:col-span-1">
                    <Award className="w-5 h-5 text-[#FFB800] shrink-0" />
                    <div>
                      <p className="text-[11px] text-slate-500 font-medium">Certificado</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-900">Reconhecido</p>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-4">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#00B060] hover:bg-[#009652] text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Garantir Vaga no WhatsApp</span>
                  </a>

                  <a
                    href="/#cursos"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Ver Todos os Cursos</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Featured Image */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <div className="relative w-full max-w-md aspect-4/3 rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md text-xs font-bold text-[#052e7f] flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
                    <span>5.0 (323+ avaliações)</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Course Syllabus & Modules */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            
            {/* Left Main: Modules */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#00B060] flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#052e7f]">Grade Curricular & Módulos</h2>
                    <p className="text-xs text-slate-500">Conteúdo 100% atualizado para as exigências do mercado de trabalho</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {course.modules?.map((m, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                      <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#052e7f] text-white text-xs flex items-center justify-center font-black">
                          {idx + 1}
                        </span>
                        <span>{m.title}</span>
                      </h3>
                      <ul className="space-y-2 pl-8">
                        {m.topics.map((t, tIdx) => (
                          <li key={tIdx} className="text-sm text-slate-700 flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#00B060] shrink-0 mt-0.5" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Audience & Opportunities */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#052e7f] flex items-center justify-center font-bold">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#052e7f]">Mercado de Trabalho & Oportunidades</h2>
                    <p className="text-xs text-slate-500">Onde você poderá trabalhar após concluir sua formação</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                  {course.targetAudience && (
                    <p>
                      <strong>Público-alvo:</strong> {course.targetAudience}
                    </p>
                  )}

                  {course.careerOpportunities && course.careerOpportunities.length > 0 && (
                    <div className="pt-2">
                      <p className="font-bold text-slate-900 mb-3">Áreas de atuação e vagas:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {course.careerOpportunities.map((op, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-800">
                            <CheckCircle2 className="w-4 h-4 text-[#00B060] shrink-0" />
                            <span>{op}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar: Location & Quick WhatsApp Card */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* WhatsApp Registration Sticky Box */}
              <div className="bg-gradient-to-br from-[#052e7f] to-[#0a46b8] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
                <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-emerald-300">
                  Matrículas Abertas
                </span>

                <h3 className="text-xl font-bold leading-tight">
                  Pronto para começar suas aulas práticas?
                </h3>

                <p className="text-xs text-slate-200 leading-relaxed">
                  Fale com nossos consultores pedagógicos e consulte turmas disponíveis (manhã, tarde, noite ou sábados).
                </p>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#00B060] hover:bg-[#009652] text-white font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Consultar Valores & Horários</span>
                </a>

                <div className="pt-3 border-t border-white/10 text-[11px] text-slate-300 space-y-1.5">
                  <p>📍 Estrada do Sacramento, 1250 - Pimentas, Guarulhos</p>
                  <p>📞 (11) 2484-4848</p>
                </div>
              </div>

              {/* Related Courses Card */}
              {relatedCourses.length > 0 && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
                  <h4 className="font-bold text-[#052e7f] text-sm uppercase tracking-wider">
                    Outros Cursos Recomendados
                  </h4>
                  <div className="space-y-3">
                    {relatedCourses.map((rc) => (
                      <a
                        key={rc.id}
                        href={`/curso/${rc.slug}`}
                        className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors group"
                      >
                        <img
                          src={rc.image}
                          alt={rc.title}
                          className="w-14 h-14 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-[#00B060] transition-colors truncate">
                            {rc.title}
                          </p>
                          <p className="text-[11px] text-slate-500">{rc.duration}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
