'use client';

import React, { useEffect, useState } from 'react';
import { SiteConfigService, SiteConfig } from '../../../services/siteConfigService';
import { 
  Settings, Save, RefreshCw, CheckCircle2, AlertCircle, 
  Phone, MessageCircle, Mail, MapPin, Clock, Star, Share2, Globe 
} from 'lucide-react';

export default function AdminConfigPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadConfig = async () => {
    setLoading(true);
    const data = await SiteConfigService.getConfig();
    setConfig(data);
    setLoading(false);
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    setSaving(true);
    setMessage(null);

    // Auto-clean phone numbers if clean fields aren't provided
    const payload = {
      ...config,
      phoneClean: config.phone.replace(/\D/g, ''),
      whatsappClean: config.whatsapp.replace(/\D/g, '')
    };

    const res = await SiteConfigService.updateConfig(payload);
    if (res) {
      setConfig(res);
      setMessage({ type: 'success', text: 'Configurações e links salvos com sucesso!' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: 'Erro ao salvar alterações.' });
    }
    setSaving(false);
  };

  const handleReset = async () => {
    if (!window.confirm('Deseja restaurar todas as configurações de contato, links e endereço para os valores padrão de fábrica?')) {
      return;
    }

    setResetting(true);
    const success = await SiteConfigService.resetConfig();
    if (success) {
      await loadConfig();
      setMessage({ type: 'success', text: 'Configurações restauradas para o padrão de fábrica!' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: 'Erro ao restaurar configurações.' });
    }
    setResetting(false);
  };

  if (loading || !config) {
    return (
      <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-[#00B060]" />
        <span className="text-sm font-bold">Carregando configurações...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#052e7f] flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#00B060]" />
            <span>Configurações Gerais & Links do Site</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Atualize os números de contato, botões do WhatsApp, endereço físico, redes sociais e avaliação do Google.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={resetting}
            className="px-4 py-2.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            <span>Restaurar Padrão</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-[#00B060] hover:bg-[#009b54] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 animate-fade-in ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-[#00B060] shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Contatos & WhatsApp */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Phone className="w-5 h-5 text-sky-600" />
            <span>Contatos Telefônicos & WhatsApp</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Principal (Exibição)</label>
            <input
              type="text"
              value={config.whatsapp}
              onChange={(e) => setConfig({ ...config, whatsapp: e.target.value })}
              placeholder="(11) 97063-8888"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#00B060]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Telefone Fixo Comercial</label>
            <input
              type="text"
              value={config.phone}
              onChange={(e) => setConfig({ ...config, phone: e.target.value })}
              placeholder="(11) 2484-4848"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#00B060]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">E-mail de Atendimento</label>
            <input
              type="email"
              value={config.email}
              onChange={(e) => setConfig({ ...config, email: e.target.value })}
              placeholder="contato@easytraining.com.br"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#00B060]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">URL Principal do Site</label>
            <input
              type="text"
              value={config.url}
              onChange={(e) => setConfig({ ...config, url: e.target.value })}
              placeholder="https://easytraining.com.br"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-mono text-slate-900 focus:outline-hidden focus:border-[#00B060]"
            />
          </div>
        </div>

        {/* Endereço & Localização */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            <span>Endereço da Unidade</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Logradouro / Rua e Número</label>
            <input
              type="text"
              value={config.address.street}
              onChange={(e) => setConfig({
                ...config,
                address: { ...config.address, street: e.target.value }
              })}
              placeholder="Estrada do Sacramento, 1250 - Sala 02"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#00B060]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bairro</label>
              <input
                type="text"
                value={config.address.neighborhood}
                onChange={(e) => setConfig({
                  ...config,
                  address: { ...config.address, neighborhood: e.target.value }
                })}
                placeholder="Marcos Freire / Pimentas"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#00B060]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">CEP</label>
              <input
                type="text"
                value={config.address.zipCode}
                onChange={(e) => setConfig({
                  ...config,
                  address: { ...config.address, zipCode: e.target.value }
                })}
                placeholder="07272-000"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#00B060]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Cidade</label>
              <input
                type="text"
                value={config.address.city}
                onChange={(e) => setConfig({
                  ...config,
                  address: { ...config.address, city: e.target.value }
                })}
                placeholder="Guarulhos"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#00B060]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Estado (UF)</label>
              <input
                type="text"
                value={config.address.state}
                onChange={(e) => setConfig({
                  ...config,
                  address: { ...config.address, state: e.target.value }
                })}
                placeholder="SP"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#00B060]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Ponto de Referência</label>
            <input
              type="text"
              value={config.address.reference}
              onChange={(e) => setConfig({
                ...config,
                address: { ...config.address, reference: e.target.value }
              })}
              placeholder="Próximo ao Terminal Pimentas e Shopping Bonsucesso"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#00B060]"
            />
          </div>
        </div>

        {/* Redes Sociais */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-500" />
            <span>Links das Redes Sociais</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Instagram URL</label>
            <input
              type="text"
              value={config.social.instagram}
              onChange={(e) => setConfig({
                ...config,
                social: { ...config.social, instagram: e.target.value }
              })}
              placeholder="https://www.instagram.com/easytraining1/"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#00B060]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Facebook URL</label>
            <input
              type="text"
              value={config.social.facebook}
              onChange={(e) => setConfig({
                ...config,
                social: { ...config.social, facebook: e.target.value }
              })}
              placeholder="https://www.facebook.com/easytrainingcursosprofissionalizantes"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#00B060]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">YouTube URL</label>
            <input
              type="text"
              value={config.social.youtube}
              onChange={(e) => setConfig({
                ...config,
                social: { ...config.social, youtube: e.target.value }
              })}
              placeholder="https://www.youtube.com/@easytrainingprofissionalizante"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#00B060]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn URL</label>
            <input
              type="text"
              value={config.social.linkedin}
              onChange={(e) => setConfig({
                ...config,
                social: { ...config.social, linkedin: e.target.value }
              })}
              placeholder="https://www.linkedin.com/company/..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#00B060]"
            />
          </div>
        </div>

        {/* Avaliações do Google & Horários */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            <span>Avaliações do Google & Horários</span>
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nota das Avaliações</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={config.rating.score}
                onChange={(e) => setConfig({
                  ...config,
                  rating: { ...config.rating, score: parseFloat(e.target.value) || 5.0 }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#00B060]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Total de Avaliações</label>
              <input
                type="number"
                value={config.rating.reviewsCount}
                onChange={(e) => setConfig({
                  ...config,
                  rating: { ...config.rating, reviewsCount: parseInt(e.target.value, 10) || 300 }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#00B060]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Link do Perfil do Google Meu Negócio</label>
            <input
              type="text"
              value={config.rating.googleProfileUrl}
              onChange={(e) => setConfig({
                ...config,
                rating: { ...config.rating, googleProfileUrl: e.target.value }
              })}
              placeholder="https://share.google/..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#00B060]"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-600" />
              <span>Horários de Funcionamento</span>
            </h3>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">Segunda a Sexta</label>
              <input
                type="text"
                value={config.openingHours.weekdays}
                onChange={(e) => setConfig({
                  ...config,
                  openingHours: { ...config.openingHours, weekdays: e.target.value }
                })}
                placeholder="Segunda a Sexta: 08:00 às 20:30"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-[#00B060]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">Sábados</label>
              <input
                type="text"
                value={config.openingHours.saturday}
                onChange={(e) => setConfig({
                  ...config,
                  openingHours: { ...config.openingHours, saturday: e.target.value }
                })}
                placeholder="Sábados: 08:00 às 17:00"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-[#00B060]"
              />
            </div>
          </div>
        </div>

      </div>

    </form>
  );
}
