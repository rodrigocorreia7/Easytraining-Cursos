'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, MessageCircle, Clock, Award, ShieldCheck } from 'lucide-react';
import { siteConfig as defaultSiteConfig } from '../../data/siteConfig';
import { SiteConfigService } from '../../services/siteConfigService';

export const Footer: React.FC = () => {
  const [config, setConfig] = useState(defaultSiteConfig);
  const currentYear = new Date().getFullYear();
  const mapRef = useRef<HTMLDivElement>(null);
  const [loadMap, setLoadMap] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      SiteConfigService.getConfig().then((data) => {
        if (data) setConfig(data);
      }).catch(console.error);
    }, 5000);

    const el = mapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setLoadMap(true);
        observer.disconnect();
      }
    }, { rootMargin: '300px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="relative bg-[#0A2540] text-white pt-16 sm:pt-20 pb-12 overflow-hidden border-t border-slate-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-slate-800/80">
          
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logos/logo-easytraining.webp"
                alt="EasyTraining Formação Profissional"
                className="h-10 sm:h-12 w-auto object-contain bg-white rounded-xl p-1.5 shadow-sm"
              />
            </div>
            <p className="text-slate-300 text-sm leading-relaxed max-w-md">
              A escola de qualificação profissional que prepara você para o mercado de trabalho com aulas 100% práticas, professores especialistas e certificado reconhecido nacionalmente.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#FFB800]" />
                <span>Certificado Reconhecido</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00B060]" />
                <span>Nota {config.rating?.score?.toFixed(1) || '5.0'} no Google ({config.rating?.reviewsCount || '320'}+ avaliações)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Navegação Rápida</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="/#home" className="hover:text-[#00B060] transition-colors">Início</a></li>
              <li><a href="/#cursos" className="hover:text-[#00B060] transition-colors">Cursos Profissionalizantes</a></li>
              <li><a href="/#quem-somos" className="hover:text-[#00B060] transition-colors">Quem Somos</a></li>
              <li><a href="/#diferenciais" className="hover:text-[#00B060] transition-colors">Metodologia Prática</a></li>
              <li><a href="/blog" className="hover:text-[#00B060] transition-colors">Blog de Carreira</a></li>
              <li><a href="/#contato" className="hover:text-[#00B060] transition-colors">Localização & Contato</a></li>
              <li><a href="/admin" className="hover:text-[#FFB800] transition-colors text-xs opacity-75">Área do Administrador</a></li>
            </ul>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Endereço & Localização</h4>
            <div className="space-y-2 text-sm text-slate-300">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FFB800] mt-0.5 shrink-0" />
                <span className="font-medium text-white">
                  Av. Jurema, 814 - Parque Jurema, Guarulhos - SP, CEP 07244-000
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#00B060] shrink-0" />
                <span>{config.phone}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp: {config.whatsapp}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#FFB800] shrink-0" />
                <span>{config.openingHours.weekdays}</span>
              </p>
            </div>

            {/* Mapa Interativo do Google Maps (Carregamento sob demanda para não pesar a página) */}
            <div ref={mapRef} className="mt-3 rounded-2xl overflow-hidden border border-slate-700/80 shadow-lg bg-slate-900/60">
              <div className="relative w-full h-44 sm:h-48 bg-slate-900 flex items-center justify-center">
                {loadMap ? (
                  <iframe
                    title="Localização EasyTraining no Google Maps"
                    src="https://www.google.com/maps?q=Av.+Jurema,+814+-+Parque+Jurema,+Guarulhos+-+SP,+07244-000&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full grayscale-[10%] hover:grayscale-0 transition-all duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-2 p-4 text-center">
                    <MapPin className="w-6 h-6 text-[#00B060] animate-bounce" />
                    <span className="text-xs font-medium">Carregando mapa interativo...</span>
                  </div>
                )}
              </div>
              <div className="px-3 py-2 bg-slate-900/90 flex items-center justify-between gap-2 border-t border-slate-800 text-xs">
                <span className="text-slate-300 truncate flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#00B060] shrink-0" />
                  Av. Jurema, 814 - Parque Jurema
                </span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Av.+Jurema,+814+-+Parque+Jurema,+Guarulhos+-+SP,+07244-000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00B060] hover:text-emerald-300 font-bold shrink-0 underline transition-colors"
                >
                  Abrir no Maps →
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {currentYear} {config.name}. Todos os direitos reservados.</p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <a href="/politica-de-privacidade" className="hover:text-emerald-400 transition-colors">Política de Privacidade (LGPD)</a>
            <span>•</span>
            <a href="/termos-de-uso" className="hover:text-white transition-colors">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
