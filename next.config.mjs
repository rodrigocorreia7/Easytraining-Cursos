/** @type {import('next').NextConfig} */
const legacyRedirects = [
  {
    source: '/mercado-de-trabalho',
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
  async redirects() {
    return legacyRedirects.map((redirect) => ({
      ...redirect,
      permanent: true,
    }));
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
