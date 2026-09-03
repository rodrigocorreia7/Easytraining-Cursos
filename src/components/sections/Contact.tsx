'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, MessageCircle, MessageSquare, Clock, Send } from 'lucide-react';
import { siteConfig as defaultSiteConfig } from '../../data/siteConfig';
import { SiteConfigService } from '../../services/siteConfigService';
import { TextRollButton } from '../ui/TextRollButton';
import SplitText from '../ui/SplitText';

export const ContactSection: React.FC = () => {
  const [config, setConfig] = useState(defaultSiteConfig);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState('Informática Básica');
  const [message, setMessage] = useState('');

  useEffect(() => {
    SiteConfigService.getConfig().then((data) => {
      if (data) setConfig(data);
    }).catch(console.error);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Olá! Meu nome é ${name}, telefone ${phone}. Tenho interesse no curso de ${course}. ${message}`;
    window.open(`https://wa.me/${config.whatsappClean}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="contato" className="py-20 sm:py-28 bg-slate-100/70 relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-2xl mx-auto text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-xs font-bold text-[#052e7f] shadow-sm">
            <MessageSquare className="w-3.5 h-3.5 text-[#00874A]" />
            <span>Fale com a EasyTraining</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#052e7f] tracking-tight leading-normal pb-1">
            <SplitText
              text="Venha nos visitar ou tire dúvidas agora mesmo"
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#052e7f] tracking-tight"
              delay={28}
              duration={0.9}
              ease="power3.out"
              splitType="words, chars"
              from={{ opacity: 0, y: 35 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.15}
              tag="span"
              textAlign="center"
            />
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Nossa equipe está pronta para te atender e te ajudar a escolher a melhor formação.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
            <h3 className="text-xl font-bold text-[#052e7f]">Informações da Escola</h3>
            
            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#052e7f] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-[#052e7f]">Endereço:</p>
                  <p className="font-semibold text-slate-800">{config.address.street}</p>
                  <p>{config.address.neighborhood} - {config.address.city}/{config.address.state}</p>
                  <p className="text-xs text-slate-500 mt-0.5">CEP: {config.address.zipCode || '07244-000'}</p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Av.+Jurema,+814+-+Parque+Jurema,+Guarulhos+-+SP,+07244-000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#00B060] hover:underline mt-1"
                  >
                    Ver no Google Maps →
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#00B060] flex items-center justify-center shrink-0 mt-0.5">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-[#052e7f]">WhatsApp de Atendimento:</p>
                  <p className="font-bold text-[#00B060]">{config.whatsapp}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#FFB800] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-[#052e7f]">Horário de Funcionamento:</p>
                  <p>{config.openingHours.weekdays}</p>
                  <p>{config.openingHours.saturday}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <TextRollButton
                text="Conversar no WhatsApp"
                variant="whatsapp"
                href={`https://wa.me/${config.whatsappClean}?text=${encodeURIComponent('Olá! Gostaria de falar com o atendimento da EasyTraining Guarulhos.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full justify-center"
              />
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
            <h3 className="text-xl font-bold text-[#052e7f] mb-2">Envie uma Mensagem</h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">Preencha os campos para receber a grade curricular e informações sobre bolsas e descontos.</p>
            
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              {...({
                toolname: "enviarMensagemContato",
                tooldescription: "Envia mensagem para a secretaria da EasyTraining solicitando grade de cursos e informações de bolsas."
              } as any)}
            >
              <div>
                <label htmlFor="nome-completo" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Seu Nome Completo</label>
                <input
                  id="nome-completo"
                  name="nome-completo"
                  type="text"
                  required
                  aria-label="Seu Nome Completo"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Maria Silva"
                  {...({ toolparamdescription: "Nome completo do interessado" } as any)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-[#00874A] focus:bg-white transition-all text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="telefone-whatsapp" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Telefone / WhatsApp</label>
                  <input
                    id="telefone-whatsapp"
                    name="telefone-whatsapp"
                    type="tel"
                    required
                    aria-label="Telefone ou WhatsApp com DDD"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    {...({ toolparamdescription: "Telefone ou WhatsApp com DDD" } as any)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-[#00874A] focus:bg-white transition-all text-slate-800"
                  />
                </div>
                <div>
                  <label htmlFor="curso-interesse" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Curso de Interesse</label>
                  <select
                    id="curso-interesse"
                    name="curso-interesse"
                    aria-label="Curso de Interesse"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    {...({ toolparamdescription: "Curso profissionalizante ou de informática de interesse" } as any)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-[#00874A] focus:bg-white transition-all text-slate-800"
                  >
                    <option value="Informática Básica">Informática Básica</option>
                    <option value="Excel Avançado">Excel Avançado</option>
                    <option value="Assistente Administrativo">Assistente Administrativo</option>
                    <option value="Auxiliar Veterinário">Auxiliar Veterinário</option>
                    <option value="Banho e Tosa Higiênica">Banho e Tosa Higiênica</option>
                    <option value="Tosa PET Geral">Tosa PET Geral</option>
                    <option value="Auxiliar de Farmácia">Auxiliar de Farmácia</option>
                    <option value="Designer Gráfico">Designer Gráfico</option>
                    <option value="Gestão Comercial">Gestão Comercial</option>
                    <option value="Outro Curso">Outro Curso</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="mensagem-duvida" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Mensagem ou Dúvida (Opcional)</label>
                <textarea
                  id="mensagem-duvida"
                  name="mensagem-duvida"
                  rows={3}
                  aria-label="Mensagem ou Dúvida (Opcional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Gostaria de saber o valor das mensalidades e dias de aula..."
                  {...({ toolparamdescription: "Mensagem ou dúvida sobre o curso e valores" } as any)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-[#00874A] focus:bg-white transition-all text-slate-800"
                />
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="lgpd-consent"
                  name="lgpd-consent"
                  defaultChecked
                  required
                  className="mt-0.5 rounded-sm border-slate-300 text-[#00874A] focus:ring-[#00874A] cursor-pointer"
                />
                <label htmlFor="lgpd-consent" className="text-[11px] text-slate-600 leading-snug cursor-pointer">
                  Concordo com a <a href="/politica-de-privacidade" target="_blank" className="text-[#00874A] font-semibold underline">Política de Privacidade</a> e autorizo o contato da EasyTraining para informações pedagógicas e valores.
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#00874A] hover:bg-[#00703C] text-white font-bold text-sm rounded-full transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Solicitar Informações e Valores
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
