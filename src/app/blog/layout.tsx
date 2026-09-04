import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog da EasyTraining | Notícias, Cursos e Dicas de Carreira em Guarulhos',
  description: 'Artigos, novidades do mercado de trabalho, dicas de qualificação profissional e conteúdos sobre cursos em Guarulhos.',
  alternates: {
    canonical: 'https://www.easytraining.com.br/blog',
  },
  openGraph: {
    title: 'Blog da EasyTraining | Dicas de Carreira e Qualificação',
    description: 'Artigos, novidades do mercado de trabalho e dicas de qualificação profissional em Guarulhos.',
    url: 'https://www.easytraining.com.br/blog',
    type: 'website',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
