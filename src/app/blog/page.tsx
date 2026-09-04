import React from 'react';
import type { Metadata } from 'next';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { WhatsAppFloatingButton } from '../../components/layout/WhatsAppButton';
import { getStoredPosts } from '../../lib/db';
import { Newspaper } from 'lucide-react';
import { BlogArchiveClient } from '../../components/blog/BlogArchiveClient';

export const metadata: Metadata = {
  title: 'Blog & Notícias de Carreira | Dicas e Mercado em Guarulhos',
  description:
    'Descubra dicas de entrevista, oportunidades de qualificação profissional e novidades do mercado de trabalho em Guarulhos. Cursos e carreira na EasyTraining.',
  alternates: {
    canonical: 'https://www.easytraining.com.br/blog',
  },
  openGraph: {
    title: 'Blog & Notícias de Carreira | EasyTraining Guarulhos',
    description:
      'Descubra oportunidades, dicas de entrevista e novidades do mercado de trabalho em Guarulhos.',
    url: 'https://www.easytraining.com.br/blog',
    type: 'website',
    images: [
      {
        url: 'https://www.easytraining.com.br/images/logos/logo-easytraining.webp',
        width: 1200,
        height: 630,
        alt: 'Blog EasyTraining - Cursos Profissionalizantes',
      },
    ],
  },
};

export default function BlogArchivePage() {
  const posts = getStoredPosts();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 selection:bg-[#00B060] selection:text-white">
      <Header />

      <main className="pt-28 sm:pt-36 pb-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-[#00874A] font-bold text-xs uppercase tracking-wider border border-emerald-100">
              <Newspaper className="w-4 h-4 text-[#00874A]" />
              <span>Conhecimento que Transforma Carreiras</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-[#052e7f] tracking-tight leading-tight">
              Blog & Notícias de Carreira
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Descubra oportunidades, dicas de entrevista, novidades do mercado de trabalho em Guarulhos e orientações práticas para sua qualificação profissional.
            </p>
          </div>

          {/* Interactive Client Component for Search and Category Filter */}
          <BlogArchiveClient initialPosts={posts} />
        </div>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
