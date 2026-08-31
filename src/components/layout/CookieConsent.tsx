'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'easytraining_lgpd_consent';

export const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        // Exibe o banner com um pequeno delay suave
        const timer = setTimeout(() => setShowBanner(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignora erro caso localStorage esteja desativado no navegador
    }
  }, []);

  const handleAccept = (type: 'all' | 'necessary') => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
        accepted: true,
        type,
        timestamp: new Date().toISOString()
      }));
    } catch {}
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <aside
      aria-label="Aviso de Privacidade e Cookies LGPD"
      className="fixed bottom-3 sm:bottom-5 left-3 sm:left-5 right-3 sm:right-auto sm:max-w-md z-50 bg-white/98 backdrop-blur-xl rounded-3xl p-5 shadow-2xl border border-slate-200/90 text-slate-800 text-xs animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#00874A] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <p className="font-bold text-slate-900 text-sm">Privacidade e Cookies (LGPD)</p>
          <p className="text-slate-600 leading-relaxed text-xs">
            Utilizamos cookies essenciais para garantir o funcionamento seguro do site e melhorar a sua experiência, em conformidade com a <strong>LGPD (Lei nº 13.709/2018)</strong>.
          </p>
        </div>
      </div>

      <div className="text-[11px] text-slate-500 mb-4 pl-11 flex flex-wrap gap-2">
        <a
          href="/politica-de-privacidade"
          className="text-[#00874A] font-bold hover:underline"
        >
          Política de Privacidade
        </a>
        <span>•</span>
        <a
          href="/termos-de-uso"
          className="text-slate-600 hover:text-slate-900 hover:underline"
        >
          Termos de Uso
        </a>
      </div>

      <div className="flex items-center gap-2 pl-11">
        <button
          onClick={() => handleAccept('all')}
          className="flex-1 px-4 py-2.5 rounded-full bg-[#00874A] hover:bg-[#00703C] text-white font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer text-center"
        >
          Aceitar Todos
        </button>
        <button
          onClick={() => handleAccept('necessary')}
          className="px-3.5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
        >
          Necessários
        </button>
      </div>
    </aside>
  );
};
