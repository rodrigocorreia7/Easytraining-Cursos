import type { Metadata } from 'next';
import { Award, BookOpen, Clock, GraduationCap, MessageCircle } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { WhatsAppFloatingButton } from '../../components/layout/WhatsAppButton';
import { getStoredCourses, getStoredSiteConfig } from '../../lib/db';

export const metadata: Metadata = {
  title: 'Cursos Profissionalizantes em Guarulhos',
  description:
    'Conheça os cursos presenciais da EasyTraining em Guarulhos: informática, Excel, auxiliar veterinário, banho e tosa, farmácia, administração, logística, design e marketing.',
  alternates: {
    canonical: 'https://www.easytraining.com.br/cursos',
  },
  openGraph: {
    title: 'Cursos Profissionalizantes em Guarulhos | EasyTraining',
    description:
      'Cursos práticos com certificado, turmas em Guarulhos e atendimento pelo WhatsApp.',
    url: 'https://www.easytraining.com.br/cursos',
    images: [
      {
        url: 'https://www.easytraining.com.br/images/logos/logo-easytraining.webp',
        alt: 'EasyTraining Cursos Profissionalizantes',
      },
    ],
  },
};

export default function CursosPage() {
  const courses = getStoredCourses();
  const siteConfig = getStoredSiteConfig();
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappClean}?text=${encodeURIComponent(
    'Olá! Acessei a página de cursos da EasyTraining e gostaria de informações sobre turmas e valores.'
  )}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': 'https://www.easytraining.com.br/cursos',
    name: 'Cursos Profissionalizantes em Guarulhos',
    description: metadata.description,
    url: 'https://www.easytraining.com.br/cursos',
    mainEntity: courses.map((course) => ({
      '@type': 'Course',
      name: course.title,
      description: course.shortDescription,
      url: `https://www.easytraining.com.br/curso/${course.slug}`,
      provider: {
        '@type': 'EducationalOrganization',
        name: 'EasyTraining - Cursos Profissionalizantes',
        url: 'https://www.easytraining.com.br',
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 selection:bg-[#00B060] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="pt-28 pb-20">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#00874A]">
                <GraduationCap className="h-4 w-4" />
                Cursos presenciais em Guarulhos
              </span>
              <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-[#052e7f] sm:text-5xl">
                Cursos profissionalizantes para entrar mais preparado no mercado
              </h1>
              <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
                Escolha uma formação prática da EasyTraining no Parque Jurema, região dos Pimentas, com aulas presenciais, certificado e atendimento pedagógico para orientar sua matrícula.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#00B060] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-[#009652]"
              >
                <MessageCircle className="h-5 w-5" />
                Consultar turmas no WhatsApp
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <a href={`/curso/${course.slug}`} className="block">
                  <div className="aspect-[16/10] bg-slate-100">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-4 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#052e7f]">
                        {course.category}
                      </span>
                      {course.featured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                          <Award className="h-3.5 w-3.5" />
                          Destaque
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-black leading-snug text-[#052e7f]">
                      {course.title}
                    </h2>

                    <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                      {course.shortDescription}
                    </p>

                    <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-600">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-[#00B060]" />
                        {course.duration}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4 text-[#052e7f]" />
                        {course.modality}
                      </span>
                    </div>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
