/** @type {import('next').NextConfig} */
const legacyRedirects = [
  {
    source: '/curso-de-auxiliar-de-veterinario-tudo-que-voce-precisa-saber',
    destination: '/blog/curso-de-auxiliar-de-veterinario-tudo-que-voce-precisa-saber',
  },
  {
    source: '/cursos-presenciais-ou-online-em-guarulhos',
    destination: '/blog/cursos-presenciais-ou-online-em-guarulhos',
  },
  {
    source: '/qualificacao-profissional-em-guarulhos',
    destination: '/blog/qualificacao-profissional-em-guarulhos',
  },
  {
    source: '/cursos-livres-em-guarulhos',
    destination: '/blog/cursos-livres-em-guarulhos',
  },
  {
    source: '/cursos-profissionalizantes-em-guarulhos',
    destination: '/blog/cursos-profissionalizantes-em-guarulhos',
  },
  {
    source: '/mercado-de-trabalho',
    destination: '/blog/a-importancia-da-educacao-profissionalizante-para-o-mercado-de-trabalho',
  },
  {
    source: '/carreira-em-medicina-veterinaria-vale-a-pena',
    destination: '/blog/carreira-em-medicina-veterinaria-vale-a-pena',
  },
  {
    source: '/descubra-a-importancia-de-um-curso-de-informatica-basica',
    destination: '/blog/descubra-a-importancia-de-um-curso-de-informatica-basica',
  },
  {
    source: '/o-que-se-faz-em-um-curso-de-informatica',
    destination: '/blog/o-que-se-faz-em-um-curso-de-informatica',
  },
  {
    source: '/importancia-do-excel-no-mercado-de-trabalho',
    destination: '/blog/importancia-do-excel-no-mercado-de-trabalho',
  },
  {
    source: '/guia-definitivo-curso-auxiliar-veterinario-guarulhos',
    destination: '/blog/guia-definitivo-curso-auxiliar-veterinario-guarulhos',
  },
  {
    source: '/jovem-aprendiz-2026-guarulhos-idade-salario',
    destination: '/blog/jovem-aprendiz-2026-guarulhos-idade-salario',
  },
  {
    source: '/como-ser-estagiario-pelo-ciee-guia-completo-e-dicas-essenciais',
    destination: '/blog/como-ser-estagiario-pelo-ciee-guia-completo-e-dicas-essenciais',
  },
  {
    source: '/curso-de-informatica-basicadesvende-o-mundo-digital',
    destination: '/blog/curso-de-informatica-basicadesvende-o-mundo-digital',
  },
  {
    source: '/a-importancia-da-educacao-profissionalizante-para-o-mercado-de-trabalho',
    destination: '/blog/a-importancia-da-educacao-profissionalizante-para-o-mercado-de-trabalho',
  },
  {
    source: '/curso/informatica-basica',
    destination: '/curso/curso-de-informatica-basica',
  },
  {
    source: '/curso/curso-de-informatica',
    destination: '/curso/informatica',
  },
  {
    source: '/curso/curso-de-informatica-em-guarulhos',
    destination: '/curso/informatica',
  },
  {
    source: '/curso/curso-de-informatica-basica-em-guarulhos',
    destination: '/curso/curso-de-informatica-basica',
  },
  {
    source: '/curso/curso-de-excel-avancado',
    destination: '/curso/excel-avancado',
  },
  {
    source: '/curso/curso-auxiliar-veterinario',
    destination: '/curso/auxiliar-veterinario',
  },
  {
    source: '/curso/curso-de-auxiliar-veterinario',
    destination: '/curso/auxiliar-veterinario',
  },
  {
    source: '/curso/curso-de-auxiliar-veterinario-em-guarulhos',
    destination: '/curso/auxiliar-veterinario',
  },
  {
    source: '/curso/banho-e-tosa',
    destination: '/curso/banho-e-tosa-higienica',
  },
  {
    source: '/curso/tosa-pet',
    destination: '/curso/curso-de-tosa-pet-geral-em-guarulhos-sp',
  },
  {
    source: '/curso/tosa-pet-geral',
    destination: '/curso/curso-de-tosa-pet-geral-em-guarulhos-sp',
  },
  {
    source: '/curso/recursos-humanos',
    destination: '/curso/assistente-de-recursos-humanos',
  },
  {
    source: '/curso/logistica',
    destination: '/curso/assistente-de-logistica',
  },
  {
    source: '/curso/contabilidade',
    destination: '/curso/auxiliar-de-contabilidade',
  },
  {
    source: '/curso-de-informatica',
    destination: '/curso/informatica',
  },
  {
    source: '/informatica-basica',
    destination: '/curso/curso-de-informatica-basica',
  },
  {
    source: '/auxiliar-veterinario',
    destination: '/curso/auxiliar-veterinario',
  },
  {
    source: '/curso-auxiliar-veterinario',
    destination: '/curso/auxiliar-veterinario',
  },
  {
    source: '/curso-de-auxiliar-veterinario',
    destination: '/curso/auxiliar-veterinario',
  },
  {
    source: '/auxiliar-de-farmacia',
    destination: '/curso/auxiliar-de-farmacia',
  },
  {
    source: '/banho-e-tosa',
    destination: '/curso/banho-e-tosa-higienica',
  },
  {
    source: '/recursos-humanos',
    destination: '/curso/assistente-de-recursos-humanos',
  },
  {
    source: '/logistica',
    destination: '/curso/assistente-de-logistica',
  },
  {
    source: '/contabilidade',
    destination: '/curso/auxiliar-de-contabilidade',
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  skipTrailingSlashRedirect: true,
  serverExternalPackages: ['firebase-admin'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'gsap'],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Os redirecionamentos canônicos 301 de salto único são centralizados no Edge Middleware (src/middleware.ts)
  // para garantir resolução com domínio canônico absoluto (https://www.easytraining.com.br),
  // suporte a remoção de trailing slash sem hops intermediários e header Cache-Control imutável de 1 ano.
  async redirects() {
    return [];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://www.easytraining.com.br',
          },
          {
            key: 'Vary',
            value: 'Origin',
          },
        ],
      },
      // 1. Static Assets Immutable Caching
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|woff2|mp4|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // 2. Global OWASP Top 10 Security Headers (Enterprise Standard)
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.googletagmanager.com https://identitytoolkit.googleapis.com https://*.google.com https://*.google.com.br https://*.googleadservices.com https://*.googlesyndication.com https://*.doubleclick.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.google-analytics.com https://*.analytics.google.com https://*.doubleclick.net https://*.google.com https://*.google.com.br https://*.googleadservices.com https://*.googlesyndication.com https://*.googletagmanager.com https://wa.me; frame-src 'self' https://*.firebaseapp.com https://accounts.google.com https://www.google.com https://maps.google.com; object-src 'none'; base-uri 'self'; form-action 'self';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
