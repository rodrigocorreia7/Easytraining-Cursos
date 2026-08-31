'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { siteConfig } from '../../data/siteConfig';

export const WhatsAppFloatingButton: React.FC = () => {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappClean}?text=${encodeURIComponent('Olá! Acessei o site da EasyTraining e gostaria de tirar dúvidas sobre os cursos.')}`;

  return (
    <aside aria-label="Atendimento via WhatsApp" className="fixed bottom-6 right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Atendimento via WhatsApp EasyTraining"
        className="group relative flex items-center gap-2.5 px-4 py-3 bg-[#075E54] hover:bg-[#054c44] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/40 focus:outline-hidden focus:ring-4 focus:ring-emerald-500/40"
      >
        <span className="w-6 h-6 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 fill-white text-[#075E54] animate-bounce" />
        </span>
        <span className="hidden sm:inline-block text-xs font-bold tracking-tight pr-1">
          Dúvidas? Fale Conosco
        </span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#F26522] rounded-full border-2 border-white animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#F26522] rounded-full border-2 border-white" />
      </a>
    </aside>
  );
};
