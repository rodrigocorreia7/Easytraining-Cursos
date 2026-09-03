'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { 
  Bot, Send, X, MessageSquare, ExternalLink, Loader2, 
  Sparkles, CheckCircle2, User, Phone
} from 'lucide-react';

const POPULAR_COURSES = [
  'Auxiliar Veterinário',
  'Informática Completa & Pacote Office',
  'Banho e Tosa Higiênica',
  'Auxiliar de Farmácia & Drogaria',
  'Excel Avançado',
  'Assistente Administrativo & RH',
  'Designer Gráfico & Marketing Digital'
];

export const AiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Lead Form State
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadCourse, setLeadCourse] = useState(POPULAR_COURSES[0]);
  const [leadShift, setLeadShift] = useState('Segunda a Sexta - Noite');
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadError, setLeadError] = useState('');

  // Vercel AI SDK useChat hook for continuous streaming
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
    setMessages
  } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Olá! Sou a Izzy, consultora virtual da EasyTraining. Como posso te ajudar com cursos, horários, bolsas ou certificados hoje?'
      }
    ],
    onFinish: (message) => {
      const lower = message.content.toLowerCase();
      if (
        (lower.includes('preço') || lower.includes('valor') || lower.includes('bolsa') || lower.includes('matrícula') || lower.includes('inscrição') || lower.includes('quanto')) &&
        !leadSuccess && !showLeadForm
      ) {
        setTimeout(() => setShowLeadForm(true), 1200);
      }
    }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, showLeadForm, isLoading]);

  // Format phone number as user types (XX) XXXXX-XXXX
  const handlePhoneChange = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 11);
    let formatted = clean;
    if (clean.length > 2 && clean.length <= 7) {
      formatted = `(${clean.slice(0, 2)}) ${clean.slice(2)}`;
    } else if (clean.length > 7) {
      formatted = `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
    }
    setLeadPhone(formatted);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadError('');

    if (!leadName.trim()) {
      setLeadError('Por favor, informe seu nome completo.');
      return;
    }

    const digitsOnly = leadPhone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      setLeadError('Por favor, digite seu WhatsApp com DDD.');
      return;
    }

    setSubmittingLead(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName.trim(),
          phone: leadPhone.trim(),
          courseInterest: leadCourse,
          preferredShift: leadShift,
          source: 'Chatbot Izzy'
        })
      });

      if (res.ok) {
        setLeadSuccess(true);
        setShowLeadForm(false);

        const directWhatsapp = `https://wa.me/551123037983?text=${encodeURIComponent(
          `Olá! Meu nome é ${leadName.trim()}. Acabei de preencher o formulário no site com a Izzy para o curso de ${leadCourse} (${leadShift}) e gostaria de garantir minha condição especial.`
        )}`;

        setMessages((prev) => [
          ...prev,
          {
            id: `lead-ok-${Date.now()}`,
            role: 'assistant',
            content: `🎉 Perfeito, ${leadName.trim()}! Registrei seu interesse no curso de ${leadCourse} (${leadShift}).\n\nNossa secretaria aqui no bairro Pimentas já recebeu seus dados no sistema e vai te chamar no WhatsApp (${leadPhone}) para liberar sua condição de bolsa e tirar suas dúvidas.\n\nSe quiser falar agora mesmo sem esperar, basta tocar no botão abaixo do WhatsApp!`
          }
        ]);
      } else {
        const data = await res.json().catch(() => ({}));
        setLeadError(data.error || 'Não foi possível registrar seu contato. Tente novamente.');
      }
    } catch (err) {
      setLeadError('Erro de conexão ao enviar contato. Tente novamente.');
    } finally {
      setSubmittingLead(false);
    }
  };

  const quickQuestions = [
    'Quais cursos vocês oferecem?',
    'Tem aulas aos sábados ou domingos?',
    'Como funciona o certificado?',
    'Onde fica a escola nos Pimentas?'
  ];

  return (
    <div className="fixed bottom-20 sm:bottom-22 right-3 sm:right-6 z-40 flex flex-col items-end">
      {/* Chat Window - DARK MODE HIGH CONTRAST */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-1.5rem)] sm:w-96 h-[520px] sm:h-[540px] max-h-[78vh] sm:max-h-[82vh] bg-[#0A1628] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-slate-700/80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#031b4e] via-[#052e7f] to-[#0A2540] text-white p-4 flex items-center justify-between shadow-md border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 relative">
                <Bot className="w-5 h-5 text-emerald-400" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#052e7f]" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight flex items-center gap-1.5">
                  <span>Izzy</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-400/30">IA</span>
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-300">
                  <span>Consultora Virtual EasyTraining</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Fechar chat"
              aria-label="Fechar chat da Izzy"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Lead Action Strip (Dark) */}
          {!leadSuccess && !showLeadForm && (
            <div className="bg-[#0D223F] border-b border-emerald-500/20 px-3.5 py-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Quer garantir sua bolsa de estudos?</span>
              </div>
              <button
                onClick={() => setShowLeadForm(true)}
                className="text-[10.5px] font-bold text-white bg-[#00874A] hover:bg-[#00703c] px-2.5 py-1 rounded-full shadow-xs transition-transform active:scale-95 cursor-pointer"
                aria-label="Garantir Bolsa de estudos"
              >
                Garantir Bolsa
              </button>
            </div>
          )}

          {/* Inline Lead Form Drawer (Dark) */}
          {showLeadForm && !leadSuccess && (
            <div className="bg-[#0D1D35] border-b border-slate-700/80 p-3.5 animate-in slide-in-from-top-2 text-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reserve sua Bolsa ou Aula Prática</span>
                </div>
                <button
                  onClick={() => setShowLeadForm(false)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer p-1"
                  aria-label="Fechar formulário de bolsa"
                >
                  ✕
                </button>
              </div>
              <p className="text-[11px] text-slate-300 mb-2.5">
                Preencha abaixo e nossa secretaria entrará em contato com a condição especial:
              </p>

              <form
                onSubmit={handleLeadSubmit}
                className="space-y-2"
                {...({
                  toolname: "solicitarBolsaEstudos",
                  tooldescription: "Reserva condição especial de bolsa de estudos ou aula experimental na EasyTraining."
                } as any)}
              >
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    required
                    aria-label="Seu nome completo"
                    autoComplete="name"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="Seu nome completo"
                    {...({ toolparamdescription: "Nome completo para reserva de bolsa de estudos" } as any)}
                    className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-[#071324] border border-slate-700 text-white placeholder-slate-400 text-[11px] focus:outline-hidden focus:ring-1 focus:ring-[#00B060]"
                  />
                </div>

                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="tel"
                    required
                    aria-label="Seu WhatsApp com DDD"
                    autoComplete="tel"
                    value={leadPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="Seu WhatsApp: (11) 99999-9999"
                    {...({ toolparamdescription: "Número de WhatsApp com DDD para contato pedagógico" } as any)}
                    className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-[#071324] border border-slate-700 text-white placeholder-slate-400 text-[11px] focus:outline-hidden focus:ring-1 focus:ring-[#00B060]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <div className="relative">
                    <select
                      aria-label="Curso de interesse"
                      value={leadCourse}
                      onChange={(e) => setLeadCourse(e.target.value)}
                      {...({ toolparamdescription: "Curso profissionalizante escolhido para bolsa" } as any)}
                      className="w-full px-2 py-1.5 rounded-lg bg-[#071324] border border-slate-700 text-white text-[10px] focus:outline-hidden focus:ring-1 focus:ring-[#00B060]"
                    >
                      {POPULAR_COURSES.map((c, i) => (
                        <option key={i} value={c} className="bg-[#071324] text-white">{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <select
                      aria-label="Turno preferido"
                      value={leadShift}
                      onChange={(e) => setLeadShift(e.target.value)}
                      {...({ toolparamdescription: "Turno de aula presencial preferido" } as any)}
                      className="w-full px-2 py-1.5 rounded-lg bg-[#071324] border border-slate-700 text-white text-[10px] focus:outline-hidden focus:ring-1 focus:ring-[#00B060]"
                    >
                      <option value="Segunda a Sexta - Manhã" className="bg-[#071324] text-white">Segunda a Sexta - Manhã</option>
                      <option value="Segunda a Sexta - Tarde" className="bg-[#071324] text-white">Segunda a Sexta - Tarde</option>
                      <option value="Segunda a Sexta - Noite" className="bg-[#071324] text-white">Segunda a Sexta - Noite</option>
                      <option value="Segunda a Sexta - Horário Flexível" className="bg-[#071324] text-white">Segunda a Sexta - Flexível</option>
                    </select>
                  </div>
                </div>

                {leadError && (
                  <p className="text-[10px] text-red-400 bg-red-950/60 border border-red-800 px-2.5 py-1.5 rounded-lg font-semibold animate-in fade-in">
                    {leadError}
                  </p>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={submittingLead}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#00874A] hover:bg-[#00703c] disabled:opacity-60 text-white font-bold text-[11px] transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {submittingLead ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Enviando contato...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Enviar Contato & Garantir Condição</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLeadForm(false)}
                    className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium transition-colors cursor-pointer border border-slate-700"
                  >
                    Agora não
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Messages Area (Dark High-Contrast) */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#071324] text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-[#052e7f] text-emerald-300 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[84%] p-3 rounded-2xl shadow-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#00874A] text-white rounded-tr-xs shadow-md'
                      : 'bg-[#112240] text-slate-100 border border-slate-700/70 rounded-tl-xs shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.content}</p>
                  
                  {/* WhatsApp CTA button on assistant answers */}
                  {m.role === 'assistant' && m.id !== 'welcome' && (
                    <div className="mt-2.5 pt-2 border-t border-slate-700/60">
                      <a
                        href={`https://wa.me/551123037983?text=${encodeURIComponent('Olá! Estive conversando com a Izzy no site e gostaria de falar com a equipe da EasyTraining.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00874A] hover:bg-[#00703c] text-white font-bold text-[11px] transition-all shadow-md"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chamar secretaria no WhatsApp</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Live Typing Indicator (Dark) */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start animate-in fade-in">
                <div className="w-7 h-7 rounded-xl bg-[#052e7f] text-emerald-300 border border-white/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-[#112240] p-3 rounded-2xl border border-slate-700/70 shadow-xs flex items-center gap-2 text-slate-300">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00B060]" />
                  <span className="text-[11px] font-medium animate-pulse">Izzy digitando resposta...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Chips (Dark) */}
          {messages.length < 3 && !showLeadForm && (
            <div className="p-2.5 bg-[#0A1628] border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => append({ role: 'user', content: q })}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#112240] hover:bg-[#19325c] text-slate-200 border border-slate-700/60 font-medium transition-colors cursor-pointer shadow-xs"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Form with useChat handleSubmit (Dark) */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-[#0A1628] border-t border-slate-800 flex items-center gap-2"
            {...({
              toolname: "perguntarIzzyConsultora",
              tooldescription: "Envia perguntas sobre cursos, metodologia e valores para a consultora virtual Izzy."
            } as any)}
          >
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              aria-label="Mensagem ou pergunta para a consultora Izzy"
              placeholder="Pergunte sobre cursos, horários..."
              {...({ toolparamdescription: "Dúvida ou pergunta sobre os cursos da EasyTraining" } as any)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#071324] border border-slate-700/80 text-white placeholder-slate-400 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#00B060] transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-[#00874A] hover:bg-[#00703c] text-white disabled:opacity-40 transition-all cursor-pointer shadow-md"
              title="Enviar mensagem"
              aria-label="Enviar mensagem para a Izzy"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#052e7f] hover:bg-[#042464] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white cursor-pointer"
        aria-label="Abrir assistente virtual da EasyTraining"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#052e7f]" />
        </div>
        <span className="hidden sm:inline-block text-xs font-bold tracking-tight">
          {isOpen ? 'Fechar Izzy' : 'Fale com a Izzy (IA)'}
        </span>
      </button>
    </div>
  );
};

export default AiChatbot;
