import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { getStoredSiteConfig } from '../lib/db';
import { siteConfig as defaultSiteConfig } from '../data/siteConfig';

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
        url: '/images/logos/logo-easytraining.webp',
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
    icon: [
      { url: '/logo1.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/logo1.svg',
    apple: '/logo1.png'
  }
};

import { CookieConsent } from '../components/layout/CookieConsent';
import { ScrollToTop } from '../components/ui/ScrollToTop';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = getStoredSiteConfig();
  const gaId = config?.googleAnalyticsId || defaultSiteConfig.googleAnalyticsId;
  const gtmId = config?.googleTagManagerId || defaultSiteConfig.googleTagManagerId;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'EasyTraining - Cursos Profissionalizantes',
    description: 'Cursos Profissionalizantes e de Informática em Guarulhos - SP. Mais de 5.000 alunos formados.',
    url: 'https://easytraining.com.br',
    logo: 'https://easytraining.com.br/logo1.svg',
    image: 'https://easytraining.com.br/images/robot/image-hero.webp',
    address: {
      '@type': 'PostalAddress',
      streetAddress: config?.address?.street || 'Estrada do Sacramento, 1250 - Sala 02',
      addressLocality: config?.address?.city || 'Guarulhos',
      addressRegion: config?.address?.state || 'SP',
      postalCode: config?.address?.zipCode || '07272-000',
      addressCountry: 'BR'
    },
    telephone: config?.phone || '+55 11 2303-7983',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(config?.rating?.score || '5.0'),
      reviewCount: String(config?.rating?.reviewsCount || '323')
    },
    sameAs: [
      config?.social?.facebook || 'https://www.facebook.com/easytrainingcursosprofissionalizantes',
      config?.social?.instagram || 'https://www.instagram.com/easytraining1/',
      config?.social?.youtube || 'https://www.youtube.com/@easytrainingprofissionalizante'
    ]
  };

  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#052e7f" />
        <link rel="icon" href="/logo1.svg" type="image/svg+xml" sizes="any" />
        <link rel="shortcut icon" href="/logo1.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo1.png" />
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://api.whatsapp.com" />
        <link rel="preload" as="image" href="/images/robot/image-hero.webp" type="image/webp" />
        {/* Agentic Navigation & LLM discovery */}
        <link rel="llms" href="/llms.txt" />
        <link rel="llms-txt" href="/llms.txt" />
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="LLMs Context" />

        {/* Google Analytics 4 (GA4) - Inserção Dinâmica */}
        {gaId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script
              id="google-analytics-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}

        {/* Google Tag Manager (GTM) - Inserção Dinâmica */}
        {gtmId && (
          <Script
            id="google-tag-manager"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `,
            }}
          />
        )}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-[#F8FAFC] text-slate-800 selection:bg-[#00874A] selection:text-white">
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {children}
        <ScrollToTop />
        <CookieConsent />
      </body>
    </html>
  );
}
