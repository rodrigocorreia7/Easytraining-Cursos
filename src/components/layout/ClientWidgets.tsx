'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const CookieConsent = dynamic(() => import('./CookieConsent').then(m => m.CookieConsent), { ssr: false });
const ScrollToTop = dynamic(() => import('../ui/ScrollToTop').then(m => m.ScrollToTop), { ssr: false });
const AiChatbot = dynamic(() => import('../ui/AiChatbot').then(m => m.AiChatbot), { ssr: false });

export const ClientWidgets: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <ScrollToTop />
      <AiChatbot />
      <CookieConsent />
    </>
  );
};
