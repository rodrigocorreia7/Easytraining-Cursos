'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, MessageSquare, ExternalLink, Loader2, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  whatsappUrl?: string;
  time: string;
}

export const AiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Olá! Sou o assistente virtual da EasyTraining. Como posso te ajudar com cursos, horários ou certificados hoje?',
      time: 'Agora'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Posso te ajudar com mais alguma informação?',
        whatsappUrl: data.whatsappUrl,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'bot',
          text: 'Tive uma oscilação temporária de conexão, mas você pode chamar nossa equipe no WhatsApp agora mesmo!',
          whatsappUrl: 'https://wa.me/551123037983',
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    'Quais cursos vocês oferecem?',
    'Tem aulas aos sábados?',
    'Como funciona o certificado?',
    'Onde fica a escola em Guarulhos?'
  ];

  return (
    <div className="fixed bottom-22 right-6 z-40">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] sm:w-96 h-[500px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#052e7f] to-[#0a3fa8] text-white p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">Assistente EasyTraining</h3>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online • Inteligência Artificial</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Fechar chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-[#052e7f] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4 text-emerald-300" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3 rounded-2xl shadow-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#052e7f] text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  
                  {m.whatsappUrl && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <a
                        href={m.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Falar com atendente no WhatsApp</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  <span className={`block text-[9px] mt-1 ${m.sender === 'user' ? 'text-blue-200' : 'text-slate-400'} text-right`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-xl bg-[#052e7f] text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-emerald-300" />
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 text-slate-500">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00B060]" />
                  <span>Digitando resposta...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Chips */}
          {messages.length < 3 && (
            <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida sobre os cursos..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#00B060] transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-[#00B060] hover:bg-[#009b54] text-white disabled:opacity-40 transition-all cursor-pointer shadow-sm"
              title="Enviar pergunta"
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
          {isOpen ? 'Fechar Assistente' : 'Atendente IA 24h'}
        </span>
      </button>
    </div>
  );
};

export default AiChatbot;
