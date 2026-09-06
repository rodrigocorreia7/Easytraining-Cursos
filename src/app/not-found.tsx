import type { Metadata } from 'next';
import { ArrowRight, BookOpen, Home, MessageCircle, Search } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { WhatsAppFloatingButton } from '../components/layout/WhatsAppButton';
import { getStoredCourses, getStoredSiteConfig } from '../lib/db';

export const metadata: Metadata = {
  title: 'Página não encontrada',
  description:
    'A página solicitada não foi encontrada. Acesse os cursos, o blog ou fale com a secretaria da EasyTraining em Guarulhos.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  const courses = getStoredCourses().filter((course) => course.featured).slice(0, 4);
  const siteConfig = getStoredSiteConfig();
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappClean}?text=${encodeURIComponent(
    'Olá! Entrei em uma página antiga da EasyTraining e gostaria de ajuda para encontrar um curso.'
  )}`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 selection:bg-[#00B060] selection:text-white">
      <Header />

      <main className="pt-28 pb-20">
        <section className="mx-auto max-w-[1120px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#052e7f]">
            <Search className="h-8 w-8" />
          </div>

          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight text-[#052e7f] sm:text-5xl">
            Essa página mudou de endereço
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Algumas páginas antigas do site podem ter sido reorganizadas. Use os atalhos abaixo para seguir para os cursos, blog ou atendimento da EasyTraining.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/cursos"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#00B060] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-[#009652] sm:w-auto"
            >
              <BookOpen className="h-5 w-5" />
              Ver cursos
            </a>
            <a
              href="/blog"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#052e7f] shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 sm:w-auto"
            >
              <ArrowRight className="h-5 w-5" />
              Ir para o blog
            </a>
            <a
              href="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 sm:w-auto"
            >
              <Home className="h-5 w-5" />
              Página inicial
            </a>
          </div>

          <div className="mt-12 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => (
              <a
                key={course.id}
                href={`/curso/${course.slug}`}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="text-xs font-bold uppercase tracking-wide text-[#00B060]">
                  {course.category}
                </span>
                <h2 className="mt-2 text-base font-black leading-snug text-[#052e7f]">
                  {course.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-600">
                  {course.shortDescription}
                </p>
              </a>
            ))}
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-[#052e7f] px-7 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#083b9c]"
          >
            <MessageCircle className="h-5 w-5" />
            Pedir ajuda no WhatsApp
          </a>
        </section>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
