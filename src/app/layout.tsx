import type { Metadata } from 'next';
import './globals.css';
import { siteConfig } from '../data/siteConfig';

export const metadata: Metadata = {
  metadataBase: new URL('https://easytraining.com.br'),
  title: {
    default: 'Easytraining - Cursos de Informática e Profissionalizantes em Guarulhos-SP',
    template: '%s | EasyTraining Guarulhos'
  },
  description: 'Escola de cursos profissionalizantes e informática em Guarulhos - Pimentas. Mais de 5.000 alunos formados, 19+ cursos práticos com certificado reconhecido.',
  keywords: [
    'cursos profissionalizantes guarulhos',
    'curso de informatica guarulhos',
    'auxiliar veterinario guarulhos',
    'excel avancado guarulhos',
    'auxiliar de farmacia guarulhos',
    'jovem aprendiz guarulhos',
    'easytraining pimentas'
  ],
  authors: [{ name: 'EasyTraining Formação Profissional' }],
  creator: 'EasyTraining',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://easytraining.com.br',
    siteName: 'EasyTraining - Cursos Profissionalizantes',
    title: 'Easytraining - Cursos de Informática e Profissionalizantes em Guarulhos-SP',
    description: 'Transforme seu futuro profissional com cursos 100% práticos e certificados reconhecidos em Guarulhos.',
    images: [
      {
        url: '/images/logos/logo-easytraining.png',
        width: 1200,
        height: 630,
        alt: 'EasyTraining - Cursos Profissionalizantes'
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'EasyTraining - Cursos Profissionalizantes',
    url: 'https://easytraining.com.br',
    logo: 'https://easytraining.com.br/images/logos/logo-easytraining.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Estrada do Sacramento, 1250',
      addressLocality: 'Guarulhos',
      addressRegion: 'SP',
      addressCountry: 'BR',
      postalCode: '07263-000'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -23.4428,
      longitude: -46.4028
    },
    telephone: '+55 11 2303-7983',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '323'
    },
    sameAs: [
      'https://www.facebook.com/easytrainingcursosprofissionalizantes',
      'https://www.instagram.com/easytraining1/',
      'https://www.youtube.com/@easytrainingprofissionalizante'
    ]
  };

  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#052e7f" />
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://api.whatsapp.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-[#F8FAFC] text-slate-800 selection:bg-[#00B060] selection:text-white">
        {children}
      </body>
    </html>
  );
}
