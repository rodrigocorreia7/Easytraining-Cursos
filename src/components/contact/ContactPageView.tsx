'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Clock, 
  ShieldCheck, 
  Award, 
  ChevronRight, 
  Send, 
  Bus, 
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';
import { WhatsAppFloatingButton } from '../layout/WhatsAppButton';
import { siteConfig } from '../../data/siteConfig';

const contactFaqs = [
  {
    q: 'Como chegar à EasyTraining no Parque Jurema?',
    a: 'A escola está situada na Av. Jurema, 814, no Parque Jurema (Guarulhos-SP), a poucos minutos do Terminal Pimentas e do Shopping Bonsucesso. Diversas linhas municipais e intermunicipais de ônibus param bem em frente ou na esquina da unidade.'
  },
  {
    q: 'Posso fazer uma visita para conhecer as salas e laboratórios?',
    a: 'Com certeza! Nosso espaço está aberto de segunda a sexta-feira das 08h às 20h30 e aos sábados das 08h às 17h. Você pode vir sem agendamento prévio ou nos avisar pelo WhatsApp para que um orientador pedagógico reserve um momento exclusivo para te apresentar a estrutura.'
  },
  {
    q: 'Quais documentos são necessários para fazer a matrícula?',
    a: 'Para efetivar sua matrícula, basta trazer RG, CPF e Comprovante de Residência. Para menores de 18 anos, é necessária a presença de um responsável legal com documento com foto.'
  },
  {
    q: 'Quem tem restrição no SPC ou Serasa pode parcelar o curso no boleto?',
    a: 'Sim! Na EasyTraining o parcelamento em boleto bancário é direto com a escola, sem nenhuma consulta aos órgãos de proteção ao crédito (SPC/Serasa). Acreditamos que a qualificação profissional é o caminho para transformar a sua vida financeira.'
  },
  {
    q: 'A escola possui turmas aos finais de semana?',
    a: 'Sim! Temos turmas especiais aos sábados durante todo o dia e também aos domingos pela manhã (como a concorrida turma de Auxiliar Veterinário das 10h às 12h), ideal para quem tem rotina corrida na semana.'
  }
];

export const ContactPageView: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState('Informática Básica');
  const [shift, setShift] = useState('Noite (19h às 21h)');
  const [message, setMessage] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Olá! Meu nome é ${name}, telefone ${phone}.\nTenho interesse no curso de *${course}* no turno *${shift}*.\n${message ? `Mensagem/Dúvida: ${message}` : 'Gostaria de receber informações sobre turmas, grade e valores.'}`;
    window.open(`https://wa.me/${siteConfig.whatsappClean}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 selection:bg-[#00874A] selection:text-white font-sans antialiased">
      <Header />

      <main className="pt-28 sm:pt-36 pb-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <a href="/" className="hover:text-[#00874A] transition-colors">Início</a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">Contato</span>
          </nav>

          {/* Hero Header */}
          <div className="bg-gradient-to-br from-[#052e7f] to-[#0A2540] rounded-3xl p-6 sm:p-12 text-white shadow-xl mb-12 relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#00874A]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute right-1/4 -top-20 w-60 h-60 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-bold border border-white/15">
                <MessageCircle className="w-4 h-4 text-[#00B060]" />
                <span>Atendimento ao Aluno & Matrículas</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Fale com a EasyTraining Guarulhos
              </h1>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
                Tire todas as suas dúvidas sobre cursos profissionalizantes, grade de aulas, bolsas de estudo e datas de início das próximas turmas. Estamos há mais de 16 anos formando profissionais no Parque Jurema.
              </p>
            </div>
          </div>

          {/* Cards Informativos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            
            {/* Endereço */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#052e7f] flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-[#052e7f]">Endereço Presencial</h2>
                <div className="text-xs sm:text-sm text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-900">{siteConfig.address.street}</p>
                  <p>{siteConfig.address.neighborhood} - {siteConfig.address.city}/{siteConfig.address.state}</p>
                  <p className="text-slate-500">CEP: {siteConfig.address.zipCode}</p>
                  <p className="text-slate-500 text-[11px] pt-1">{siteConfig.address.reference}</p>
                </div>
              </div>
              <a
                href={siteConfig.address.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#00874A] hover:underline mt-4 pt-3 border-t border-slate-100"
              >
                Abrir Rota no Google Maps →
              </a>
            </div>

            {/* WhatsApp & Telefone */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00874A] flex items-center justify-center font-bold">
                  <Phone className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-[#052e7f]">Telefone & WhatsApp</h2>
                <div className="text-xs sm:text-sm text-slate-600 space-y-1">
                  <p className="text-slate-500">Atendimento imediato:</p>
                  <p className="text-lg font-black text-[#00874A]">{siteConfig.whatsapp}</p>
                  <p className="text-xs text-slate-500">Chame no zap para receber a grade de matérias em PDF.</p>
                </div>
              </div>
              <a
                href={`https://wa.me/${siteConfig.whatsappClean}?text=${encodeURIComponent('Olá! Acessei a página de contato e gostaria de informações sobre os cursos.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#00874A] hover:underline mt-4 pt-3 border-t border-slate-100"
              >
                Iniciar Conversa Agora →
              </a>
            </div>

            {/* Horário de Atendimento */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#FFB800] flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-[#052e7f]">Horário de Secretaria</h2>
                <div className="text-xs sm:text-sm text-slate-600 space-y-1.5">
                  <div>
                    <p className="font-semibold text-slate-900">Segunda a Sexta:</p>
                    <p className="text-xs text-slate-500">08:00 às 20:30 (Sem fechar para almoço)</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Sábados:</p>
                    <p className="text-xs text-slate-500">08:00 às 17:00</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Domingos:</p>
                    <p className="text-xs text-slate-500">Aulas práticas de turmas especiais</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
                Aberto para visitas nos horários acima
              </div>
            </div>

            {/* Reputação & Tradição */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-[#052e7f]">Tradição e Nota Máxima</h2>
                <div className="text-xs sm:text-sm text-slate-600 space-y-1.5">
                  <div className="flex items-center gap-1 font-bold text-amber-600 text-sm">
                    <span>★ ★ ★ ★ ★</span>
                    <span className="text-slate-900 ml-1">5.0 no Google</span>
                  </div>
                  <p className="text-xs text-slate-500">Mais de 320 avaliações de alunos reais.</p>
                  <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1 pt-1">
                    <Award className="w-3.5 h-3.5" /> 16 anos no mesmo endereço
                  </p>
                  <p className="text-[11px] text-slate-500">Zero queixas no Reclame Aqui e Procon.</p>
                </div>
              </div>
              <a
                href={siteConfig.rating.googleProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#052e7f] hover:underline mt-4 pt-3 border-t border-slate-100"
              >
                Conferir Avaliações no Google →
              </a>
            </div>

          </div>

          {/* Seção Principal: Formulário + Mapa */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
            
            {/* Formulário de Atendimento */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80">
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#00874A] text-xs font-bold mb-2">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Mensagem Rápida</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#052e7f] tracking-tight">
                  Envie sua dúvida ou solicite valores
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Preencha abaixo para receber valores de parcelas, bolsas disponíveis e o cronograma do curso desejado direto no seu WhatsApp.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contato-nome" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Nome Completo
                  </label>
                  <input
                    id="contato-nome"
                    name="contato-nome"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Ana Clara Santos"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-[#00874A] focus:bg-white transition-all text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contato-whatsapp" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      WhatsApp com DDD
                    </label>
                    <input
                      id="contato-whatsapp"
                      name="contato-whatsapp"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-[#00874A] focus:bg-white transition-all text-slate-800"
                    />
                  </div>

                  <div>
                    <label htmlFor="contato-curso" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Curso de Interesse
                    </label>
                    <select
                      id="contato-curso"
                      name="contato-curso"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-[#00874A] focus:bg-white transition-all text-slate-800"
                    >
                      <option value="Informática Básica">Informática Básica</option>
                      <option value="Excel Avançado">Excel Avançado</option>
                      <option value="Assistente Administrativo">Assistente Administrativo</option>
                      <option value="Auxiliar Veterinário">Auxiliar Veterinário</option>
                      <option value="Banho e Tosa Higiênica">Banho e Tosa Higiênica</option>
                      <option value="Tosa PET Geral">Tosa PET Geral</option>
                      <option value="Auxiliar de Farmácia">Auxiliar de Farmácia</option>
                      <option value="Assistente de Logística">Assistente de Logística</option>
                      <option value="Designer Gráfico">Designer Gráfico</option>
                      <option value="Marketing Digital">Marketing Digital</option>
                      <option value="Gestão Comercial">Gestão Comercial</option>
                      <option value="Outro Curso">Outro Curso / Dúvida Geral</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contato-turno" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Turno Preferido para Estudar
                  </label>
                  <select
                    id="contato-turno"
                    name="contato-turno"
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-[#00874A] focus:bg-white transition-all text-slate-800"
                  >
                    <option value="Manhã (08h às 10h ou 10h às 12h)">Manhã (08h às 10h ou 10h às 12h)</option>
                    <option value="Tarde (14h às 16h ou 16h às 18h)">Tarde (14h às 16h ou 16h às 18h)</option>
                    <option value="Noite (19h às 21h)">Noite (19h às 21h)</option>
                    <option value="Sábado (Manhã ou Tarde)">Sábado (Manhã ou Tarde)</option>
                    <option value="Domingo (10h às 12h - Auxiliar Veterinário)">Domingo (10h às 12h - Auxiliar Veterinário)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contato-mensagem" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Dúvidas ou Observações (Opcional)
                  </label>
                  <textarea
                    id="contato-mensagem"
                    name="contato-mensagem"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Gostaria de saber se há turmas iniciando este mês e formas de pagamento..."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-[#00874A] focus:bg-white transition-all text-slate-800"
                  />
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="contato-lgpd"
                    name="contato-lgpd"
                    defaultChecked
                    required
                    className="mt-0.5 rounded-sm border-slate-300 text-[#00874A] focus:ring-[#00874A] cursor-pointer"
                  />
                  <label htmlFor="contato-lgpd" className="text-[11px] text-slate-600 leading-snug cursor-pointer">
                    Concordo com a <a href="/politica-de-privacidade" target="_blank" className="text-[#00874A] font-semibold underline">Política de Privacidade</a> e autorizo o envio de informações sobre o curso e valores.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#00874A] hover:bg-[#00703C] text-white font-bold text-sm sm:text-base rounded-2xl transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" /> Enviar Mensagem para a Secretaria no WhatsApp
                </button>
              </form>
            </div>

            {/* Mapa Interativo & Como Chegar */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#052e7f] flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#00874A]" />
                      <span>Localização no Google Maps</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Av. Jurema, 814 - Parque Jurema, Guarulhos - SP</p>
                  </div>
                  <a
                    href={siteConfig.address.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-full bg-blue-50 text-[#052e7f] text-xs font-bold hover:bg-blue-100 transition-colors"
                  >
                    Rotas GPS
                  </a>
                </div>

                {/* Iframe do Mapa */}
                <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 relative shadow-inner">
                  <iframe
                    title="Mapa de Localização da EasyTraining Cursos Profissionalizantes"
                    src={siteConfig.address.googleMapsEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                {/* Dica de transporte público */}
                <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white text-[#052e7f] flex items-center justify-center shrink-0 shadow-sm border border-slate-200">
                    <Bus className="w-4 h-4 text-[#052e7f]" />
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="font-bold text-slate-900">Como chegar de transporte coletivo:</p>
                    <p>
                      Linhas diretas que passam pela Av. Jurema conectando os bairros Pimentas, Bonsucesso, Alvorada e Cecap. Fácil desembarque a menos de 50 metros da portaria da escola.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Seção FAQ de Atendimento */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 mb-12">
            <div className="max-w-2xl mx-auto text-center mb-10 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#052e7f] text-xs font-bold">
                <HelpCircle className="w-3.5 h-3.5 text-[#00874A]" />
                <span>Dúvidas Frequentes</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#052e7f] tracking-tight">
                Perguntas Frequentes sobre Atendimento e Visitas
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Informações práticas para você planejar seu contato ou visita presencial à EasyTraining.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
              {contactFaqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#052e7f] hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${openFaqIndex === idx ? 'rotate-180 text-[#00874A]' : ''}`} />
                  </button>
                  {openFaqIndex === idx && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
};
