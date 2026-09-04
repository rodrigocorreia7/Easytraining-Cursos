import React from 'react';
import type { Metadata } from 'next';
import { ContactPageView } from '../../components/contact/ContactPageView';
import { siteConfig } from '../../data/siteConfig';

export const metadata: Metadata = {
  title: 'Fale Conosco | EasyTraining Guarulhos - Cursos Profissionalizantes',
  description: 'Entre em contato com a EasyTraining no Parque Jurema, Guarulhos. Tire dúvidas sobre cursos, valores, matrículas e horários. Telefone e WhatsApp: (11) 2303-7983.',
  alternates: {
    canonical: 'https://www.easytraining.com.br/contato',
  },
  openGraph: {
    title: 'Fale Conosco | EasyTraining Guarulhos',
    description: 'Atendimento e Matrículas da EasyTraining Cursos Profissionalizantes no Parque Jurema, Guarulhos-SP.',
    url: 'https://www.easytraining.com.br/contato',
    type: 'website',
    images: [
      {
        url: 'https://www.easytraining.com.br/images/logos/logo-easytraining.webp',
        alt: 'EasyTraining Cursos Profissionalizantes em Guarulhos',
      },
    ],
  },
};

export default function ContatoPage() {
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    name: 'EasyTraining Cursos Profissionalizantes',
    description: siteConfig.description,
    url: 'https://www.easytraining.com.br/contato',
    telephone: '+55 11 2303-7983',
    email: siteConfig.email,
    logo: 'https://www.easytraining.com.br/images/logos/logo-easytraining.webp',
    image: 'https://www.easytraining.com.br/images/courses/Teoria-e-bom-mas-a-pratica-e-o-que-te-leva-ao-emprego-Na-Easytraining-voce-aprende-fazendo-em-nossos-laboratorios-moderno-no-Pimentas-1.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.zipCode,
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '-23.4566373',
      longitude: '-46.4087541',
    },
    hasMap: siteConfig.address.googleMapsUrl,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '20:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '08:00',
        closes: '17:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: 323,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <ContactPageView />
    </>
  );
}
