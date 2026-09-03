'use client';

import React, { useEffect, useState } from 'react';
import { Lead, LeadStatus } from '@/types';
import { 
  Users, MessageSquare, Plus, Phone, Calendar, Clock, 
  Search, ExternalLink, Trash2, Edit3, CheckCircle2, ArrowRight,
  Send, Sparkles, Filter, RefreshCw, Radio, Settings2, Info,
  RotateCcw, AlertTriangle, Archive
} from 'lucide-react';

const COLUMNS: { id: LeadStatus; title: string; color: string; badgeBg: string; borderTop: string }[] = [
  { 
    id: 'novo', 
    title: 'Novos Leads', 
    color: 'text-blue-700 bg-blue-50 border-blue-200', 
    badgeBg: 'bg-blue-600 text-white',
    borderTop: 'border-t-4 border-t-blue-500'
  },
  { 
    id: 'contato', 
    title: 'Em Atendimento', 
    color: 'text-amber-700 bg-amber-50 border-amber-200', 
    badgeBg: 'bg-amber-600 text-white',
    borderTop: 'border-t-4 border-t-amber-500'
  },
  { 
    id: 'visita', 
    title: 'Visita Agendada', 
    color: 'text-purple-700 bg-purple-50 border-purple-200', 
    badgeBg: 'bg-purple-600 text-white',
    borderTop: 'border-t-4 border-t-purple-500'
  },
  { 
    id: 'matriculado', 
    title: 'Matriculados 🎉', 
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200', 
    badgeBg: 'bg-[#00874A] text-white',
    borderTop: 'border-t-4 border-t-[#00874A]'
  },
  { 
    id: 'perdido', 
    title: 'Sem Resposta / Futuro', 
    color: 'text-slate-700 bg-slate-100 border-slate-200', 
    badgeBg: 'bg-slate-500 text-white',
    borderTop: 'border-t-4 border-t-slate-400'
  }
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [trashLeads, setTrashLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  // Modals & Panels
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [showTrashModal, setShowTrashModal] = useState(false);
  const [showN8nConfig, setShowN8nConfig] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [webhookFeedback, setWebhookFeedback] = useState('');

  // New Lead Form State
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadCourse, setNewLeadCourse] = useState('Auxiliar Veterinário');
  const [newLeadShift, setNewLeadShift] = useState('Segunda a Sexta - Noite');
  const [newLeadNotes, setNewLeadNotes] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const loadLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
      loadTrashLeads();
    } catch (err) {
      console.error('Erro ao carregar leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTrashLeads = async () => {
    try {
      const res = await fetch('/api/leads?trash=true');
      if (res.ok) {
        const data = await res.json();
        setTrashLeads(data);
      }
    } catch {}
  };

  useEffect(() => {
    loadLeads();
    fetch('/api/site-config')
      .then(r => r.json())
      .then(cfg => {
        if (cfg.n8nWebhookUrl) setWebhookUrl(cfg.n8nWebhookUrl);
        else setWebhookUrl('https://n8n.eterion.online/webhook/easytraining-leads');
      })
      .catch(() => {});
  }, []);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedLeadId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStatus: LeadStatus) => {
    e.preventDefault();
    const id = draggedLeadId || e.dataTransfer.getData('text/plain');
    if (!id) return;

    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    setDraggedLeadId(null);

    try {
      await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      loadLeads();
    }
  };

  const handleMoveStatus = async (id: string, newStatus: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    try {
      await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch {
      loadLeads();
    }
  };

  // Move lead to Trash (Soft Delete)
  const handleTrashLead = async (id: string) => {
    const targetLead = leads.find(l => l.id === id);
    setLeads(prev => prev.filter(l => l.id !== id));
    if (targetLead) {
      setTrashLeads(prev => [{ ...targetLead, isDeleted: true, deletedAt: new Date().toISOString() }, ...prev]);
    }
    showToast('Lead movido para a Lixeira! Você pode restaurá-lo a qualquer momento.');

    try {
      await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    } catch {
      loadLeads();
    }
  };

  // Restore lead from Trash
  const handleRestoreLead = async (id: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore' })
      });

      if (res.ok) {
        const restored = await res.json();
        setTrashLeads(prev => prev.filter(l => l.id !== id));
        setLeads(prev => [restored, ...prev]);
        showToast(`Lead "${restored.name}" restaurado com sucesso para o Kanban!`);
      }
    } catch {
      loadLeads();
    }
  };

  // Permanent Delete
  const handlePermanentDelete = async (id: string) => {
    if (!confirm('Esta ação é irreversível e excluirá o lead definitivamente do Firestore. Continuar?')) return;

    setTrashLeads(prev => prev.filter(l => l.id !== id));
    try {
      await fetch(`/api/leads/${id}?permanent=true`, { method: 'DELETE' });
      showToast('Lead excluído permanentemente.');
    } catch {
      loadTrashLeads();
    }
  };

  // Empty Trash
  const handleEmptyTrash = async () => {
    if (!confirm('Deseja realmente esvaziar toda a lixeira? Todos os leads na lixeira serão apagados em definitivo do Firebase.')) return;

    setTrashLeads([]);
    try {
      await fetch('/api/leads?emptyTrash=true', { method: 'DELETE' });
      showToast('Lixeira esvaziada com sucesso.');
    } catch {
      loadTrashLeads();
    }
  };

  const handleCreateManualLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadPhone) return;

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newLeadName,
          phone: newLeadPhone,
          courseInterest: newLeadCourse,
          preferredShift: newLeadShift,
          notes: newLeadNotes,
          source: 'Atendimento Presencial / Telefone'
        })
      });

      if (res.ok) {
        setShowNewLeadModal(false);
        setNewLeadName('');
        setNewLeadPhone('');
        setNewLeadNotes('');
        showToast('Lead cadastrado no Kanban e sincronizado com o Firebase!');
        loadLeads();
      }
    } catch (err) {
      console.error('Erro ao cadastrar lead:', err);
    }
  };

  const handleSaveN8nWebhook = async () => {
    try {
      const cfgRes = await fetch('/api/site-config');
      const cfg = await cfgRes.json();
      await fetch('/api/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cfg, n8nWebhookUrl: webhookUrl })
      });
      setWebhookFeedback('Webhook salvo com sucesso no Firebase!');
      setTimeout(() => setWebhookFeedback(''), 4000);
    } catch (e) {
      setWebhookFeedback('Erro ao salvar webhook.');
    }
  };

  const handleTestN8nWebhook = async () => {
    if (!webhookUrl || !webhookUrl.startsWith('http')) {
      alert('Informe uma URL de Webhook válida (iniciando com http ou https)');
      return;
    }
    setTestingWebhook(true);
    setWebhookFeedback('Enviando disparo teste para o N8N...');
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'teste_conexao',
          origem: 'Painel EasyTraining CRM',
          mensagem: 'Disparo de teste bem-sucedido! Integração ativa.',
          leadExemplo: {
            nome: 'Aluno Teste',
            whatsapp: '(11) 2303-7983',
            curso: 'Auxiliar Veterinário',
            turno: 'Segunda a Sexta - Noite'
          }
        })
      });
      if (res.ok) {
        setWebhookFeedback('✅ Sucesso! O N8N recebeu o disparo teste.');
      } else {
        setWebhookFeedback(`⚠️ O N8N respondeu com status ${res.status}.`);
      }
    } catch (e: any) {
      setWebhookFeedback(`❌ Falha: ${e.message}`);
    } finally {
      setTestingWebhook(false);
    }
  };

  const filteredLeads = leads.filter(l => {
    const q = search.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.phone.includes(q) ||
      l.courseInterest.toLowerCase().includes(q) ||
      (l.notes && l.notes.toLowerCase().includes(q))
    );
  });

  const countByStatus = (status: LeadStatus) => leads.filter(l => l.status === status).length;
  const conversionRate = leads.length > 0 
    ? Math.round((countByStatus('matriculado') / leads.length) * 100) 
    : 0;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-[#052e7f] text-white px-4 py-3 rounded-2xl shadow-xl border border-blue-400/30 flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-xs font-bold text-purple-700 mb-2">
            <Users className="w-3.5 h-3.5 text-purple-600" />
            <span>CRM & Funil de Matrículas • Cloud Firestore</span>
          </div>
          <h1 className="text-2xl font-black text-[#052e7f]">Pipeline de Leads & Atendimento</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gerencie contatos do Chatbot da Izzy, agende visitas na unidade Pimentas e acompanhe conversões.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => { setShowTrashModal(true); loadTrashLeads(); }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs"
            title="Ver itens na lixeira"
          >
            <Trash2 className="w-4 h-4 text-slate-500" />
            <span>Lixeira ({trashLeads.length})</span>
          </button>

          <button
            onClick={() => setShowN8nConfig(!showN8nConfig)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Settings2 className="w-4 h-4 text-slate-600" />
            <span>N8N & Telegram</span>
          </button>

          <button
            onClick={() => setShowNewLeadModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00874A] hover:bg-[#00703c] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Lead</span>
          </button>
        </div>
      </div>

      {/* N8N & Telegram Integration Drawer */}
      {showN8nConfig && (
        <div className="bg-gradient-to-r from-purple-900 to-indigo-950 text-white p-6 rounded-3xl shadow-lg animate-in slide-in-from-top-4 border border-purple-700/50">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-purple-300">
                <Send className="w-4 h-4 text-emerald-400" />
                <span>Integração com Automação N8N & Bot do Telegram</span>
              </div>
              <h2 className="text-lg font-black">Notificação no Telegram a cada novo Lead no Site</h2>
              <p className="text-xs text-purple-200 leading-relaxed">
                Toda vez que um aluno preenche o contato no chat com a Izzy ou no site, nosso sistema salva no <strong>Cloud Firestore</strong> e faz um disparo HTTP POST para o seu Webhook do N8N. No N8N, você conecta ao nó do <strong>Telegram</strong> para receber o alerta instantâneo no seu celular!
              </p>
            </div>
            <button
              onClick={() => setShowN8nConfig(false)}
              className="text-purple-300 hover:text-white p-1 text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://n8n.eterion.online/webhook/easytraining-leads"
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
            />
            <button
              onClick={handleSaveN8nWebhook}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-xs"
            >
              Salvar Webhook
            </button>
            <button
              onClick={handleTestN8nWebhook}
              disabled={testingWebhook}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer border border-white/20 flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingWebhook ? 'animate-spin' : ''}`} />
              <span>Testar Disparo</span>
            </button>
          </div>

          {webhookFeedback && (
            <p className="text-xs mt-3 font-semibold text-emerald-300 bg-white/10 px-3 py-1.5 rounded-lg inline-block">
              {webhookFeedback}
            </p>
          )}
        </div>
      )}

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Ativos</span>
          <div className="text-2xl font-black text-[#052e7f] mt-1">{leads.length}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-xs">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Novos</span>
          <div className="text-2xl font-black text-blue-700 mt-1">{countByStatus('novo')}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Em Atendimento</span>
          <div className="text-2xl font-black text-amber-700 mt-1">{countByStatus('contato')}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-purple-200 shadow-xs">
          <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Visitas</span>
          <div className="text-2xl font-black text-purple-700 mt-1">{countByStatus('visita')}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[11px] font-bold text-[#00874A] uppercase tracking-wider">Matriculados</span>
          <div className="text-2xl font-black text-[#00874A] mt-1 flex items-baseline gap-2">
            <span>{countByStatus('matriculado')}</span>
            <span className="text-xs text-slate-400 font-semibold">({conversionRate}%)</span>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar lead por nome, telefone ou curso..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 text-slate-800 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#00B060]"
          />
        </div>
        <button
          onClick={loadLeads}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold cursor-pointer transition-colors"
          title="Atualizar lista"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* KANBAN BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
        {COLUMNS.map(col => {
          const columnLeads = filteredLeads.filter(l => l.status === col.id);

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`bg-slate-50/80 rounded-2xl p-3 border border-slate-200 shadow-xs min-h-[500px] flex flex-col ${col.borderTop}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-200/60">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{col.title}</span>
                </span>
                <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${col.badgeBg}`}>
                  {columnLeads.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[620px] pr-0.5">
                {columnLeads.map(lead => {
                  const cleanPhone = lead.phone.replace(/\D/g, '');
                  const waNumber = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
                  const waText = encodeURIComponent(
                    `Olá ${lead.name}, tudo bem? Aqui é da secretaria da EasyTraining! Vi que você tirou dúvidas no site sobre o curso de ${leadCourseToMessage(lead.courseInterest)}. Como podemos te ajudar a garantir sua vaga com bolsa?`
                  );
                  const whatsappLink = `https://wa.me/${waNumber}?text=${waText}`;

                  return (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group select-none relative"
                    >
                      {/* Card Header: Name + Trash Button */}
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">
                          {lead.name}
                        </h4>
                        <button
                          onClick={() => handleTrashLead(lead.id)}
                          className="text-slate-300 hover:text-red-500 p-0.5 transition-colors cursor-pointer"
                          title="Mover para a Lixeira"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 mb-2">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{lead.phone}</span>
                      </div>

                      {/* Course Badge */}
                      <div className="inline-block px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[10px] font-bold mb-2">
                        {lead.courseInterest}
                      </div>

                      {/* Shift & Source Info */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{lead.preferredShift || 'Horário Livre'}</span>
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 bg-slate-100 rounded text-slate-600">
                          {lead.source}
                        </span>
                      </div>

                      {/* Internal Notes */}
                      {lead.notes && (
                        <p className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 p-1.5 rounded-lg mb-2.5 leading-snug">
                          <strong>Obs:</strong> {lead.notes}
                        </p>
                      )}

                      {/* WhatsApp Call Button */}
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#00874A] hover:bg-[#00703c] text-white text-[11px] font-bold transition-colors shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chamar no WhatsApp</span>
                      </a>

                      {/* Quick Move Status Arrows */}
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Mover para:</span>
                        <div className="flex items-center gap-1">
                          {col.id !== 'contato' && (
                            <button
                              onClick={() => handleMoveStatus(lead.id, 'contato')}
                              className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-amber-100 hover:text-amber-800 text-[9px] font-bold cursor-pointer"
                              title="Mover para Em Atendimento"
                            >
                              Atender
                            </button>
                          )}
                          {col.id !== 'visita' && (
                            <button
                              onClick={() => handleMoveStatus(lead.id, 'visita')}
                              className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-purple-100 hover:text-purple-800 text-[9px] font-bold cursor-pointer"
                              title="Mover para Visita Agendada"
                            >
                              Visita
                            </button>
                          )}
                          {col.id !== 'matriculado' && (
                            <button
                              onClick={() => handleMoveStatus(lead.id, 'matriculado')}
                              className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-emerald-100 hover:text-[#00874A] text-[9px] font-bold cursor-pointer"
                              title="Mover para Matriculado"
                            >
                              Matricular
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}

                {columnLeads.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-center p-3 text-slate-400 text-xs">
                    Arraste um card aqui
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* LIXEIRA MODAL */}
      {showTrashModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Lixeira de Leads</h3>
                  <p className="text-xs text-slate-500">
                    Itens apagados do Kanban. Você pode restaurar qualquer contato para o funil ou excluir definitivamente do Firebase.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTrashModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Trash List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-2.5">
              {trashLeads.map(lead => (
                <div 
                  key={lead.id}
                  className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{lead.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                        {lead.courseInterest}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                      <span>📱 {lead.phone}</span>
                      <span>🕒 Turno: {lead.preferredShift || 'Flexível'}</span>
                      {lead.deletedAt && (
                        <span className="text-red-500">
                          Apagado em: {new Date(lead.deletedAt).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleRestoreLead(lead.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#00874A] text-xs font-bold transition-colors cursor-pointer border border-emerald-200"
                      title="Restaurar lead de volta para o Kanban"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restaurar</span>
                    </button>

                    <button
                      onClick={() => handlePermanentDelete(lead.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors cursor-pointer border border-red-200"
                      title="Excluir do Firebase permanentemente"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Excluir Definitivo</span>
                    </button>
                  </div>
                </div>
              ))}

              {trashLeads.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                  <Archive className="w-8 h-8 text-slate-300" />
                  <span>A lixeira está vazia. Nenhum lead foi apagado.</span>
                </div>
              )}
            </div>

            {/* Trash Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                {trashLeads.length} {trashLeads.length === 1 ? 'item na lixeira' : 'itens na lixeira'}
              </span>

              <div className="flex items-center gap-2">
                {trashLeads.length > 0 && (
                  <button
                    onClick={handleEmptyTrash}
                    className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    Esvaziar Lixeira
                  </button>
                )}
                <button
                  onClick={() => setShowTrashModal(false)}
                  className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Manual New Lead Modal */}
      {showNewLeadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-[#052e7f] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#00874A]" />
                <span>Novo Lead Manual</span>
              </h3>
              <button
                onClick={() => setShowNewLeadModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualLead} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome do Aluno / Responsável</label>
                <input
                  type="text"
                  required
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  placeholder="Ex: João da Silva"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#00B060]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">WhatsApp com DDD</label>
                <input
                  type="tel"
                  required
                  value={newLeadPhone}
                  onChange={(e) => setNewLeadPhone(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#00B060]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Curso de Interesse</label>
                  <select
                    value={newLeadCourse}
                    onChange={(e) => setNewLeadCourse(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden"
                  >
                    <option value="Auxiliar Veterinário">Auxiliar Veterinário</option>
                    <option value="Informática Completa">Informática Completa</option>
                    <option value="Excel Avançado">Excel Avançado</option>
                    <option value="Banho e Tosa Higiênica">Banho e Tosa Higiênica</option>
                    <option value="Auxiliar de Farmácia">Auxiliar de Farmácia</option>
                    <option value="Assistente Administrativo">Assistente Administrativo</option>
                    <option value="Designer Gráfico">Designer Gráfico</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Turno Preferido</label>
                  <select
                    value={newLeadShift}
                    onChange={(e) => setNewLeadShift(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden"
                  >
                    <option value="Segunda a Sexta - Manhã">Segunda a Sexta - Manhã</option>
                    <option value="Segunda a Sexta - Tarde">Segunda a Sexta - Tarde</option>
                    <option value="Segunda a Sexta - Noite">Segunda a Sexta - Noite</option>
                    <option value="Segunda a Sexta - Horário Flexível">Segunda a Sexta - Horário Flexível</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Observações / Histórico</label>
                <textarea
                  value={newLeadNotes}
                  onChange={(e) => setNewLeadNotes(e.target.value)}
                  placeholder="Ex: Aluno quer turma da noite, mora no Parque Pimentas..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#00B060]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewLeadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#00874A] hover:bg-[#00703c] text-white font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Salvar Lead no Kanban
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function leadCourseToMessage(course: string): string {
  return course.replace(/^Curso\s*(de\s*)?/i, '');
}
