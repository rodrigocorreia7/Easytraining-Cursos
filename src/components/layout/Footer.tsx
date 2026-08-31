import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, Award, ShieldCheck } from 'lucide-react';
import { siteConfig } from '../../data/siteConfig';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0A2540] text-white pt-16 sm:pt-20 pb-12 overflow-hidden border-t border-slate-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-slate-800/80">
          
          <div className="lg:col-span-5 space-y-4">
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
                <span>Nota 5.0 no Google (320+ avaliações)</span>
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

          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Endereço & Contato</h4>
            <div className="space-y-2.5 text-sm text-slate-300">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FFB800] mt-0.5 shrink-0" />
                <span>{siteConfig.address.street}, {siteConfig.address.neighborhood} - {siteConfig.address.city}/{siteConfig.address.state}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#00B060] shrink-0" />
                <span>{siteConfig.phone}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp: {siteConfig.whatsapp}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#FFB800] shrink-0" />
                <span>{siteConfig.openingHours.weekdays}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {currentYear} {siteConfig.name}. Todos os direitos reservados.</p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <a href="/politica-de-privacidade" className="hover:text-emerald-400 transition-colors">Política de Privacidade (LGPD)</a>
            <span>•</span>
            <a href="/termos-de-uso" className="hover:text-white transition-colors">Termos de Uso</a>
            <span>•</span>
            <a href="/llms.txt" className="hover:text-white transition-colors" title="Indexação para IAs">llms.txt</a>
            <span>•</span>
            <a href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
