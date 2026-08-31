'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { AuthService } from '../../../services/authService';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@easytraining.com.br');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await AuthService.login(email, password);
      if (res.success) {
        router.push('/admin');
      } else {
        setError(res.error || 'Erro ao realizar login');
      }
    } catch {
      setError('Ocorreu um erro ao processar o login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#052e7f] via-[#0A2540] to-[#041c33] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/20 relative overflow-hidden">
        
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00B060]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Brand */}
        <div className="text-center mb-8">
          <img
            src="/images/logos/logo-easytraining.webp"
            alt="EasyTraining Formação Profissional"
            className="h-10 sm:h-12 w-auto object-contain mx-auto mb-4"
          />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-[#052e7f]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00B060]" />
            <span>Painel Administrativo do Blog</span>
          </div>
          <h1 className="text-2xl font-black text-[#052e7f] mt-3">Acesso Restrito</h1>
          <p className="text-xs text-slate-500 mt-1">
            Entre com suas credenciais para publicar e gerenciar artigos
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              E-mail de Administrador
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@easytraining.com.br"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-hidden focus:border-[#00B060] focus:ring-2 focus:ring-emerald-100 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-hidden focus:border-[#00B060] focus:ring-2 focus:ring-emerald-100 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-[#00B060] hover:bg-[#009b54] active:bg-[#008749] text-white font-bold text-sm shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Autenticando...</span>
            ) : (
              <>
                <span>Acessar Painel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-800 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Modo Mock (Ambiente de Prévia):</strong>
            <br />
            Credenciais padrão: <code className="bg-amber-100 px-1 rounded">admin@easytraining.com.br</code> / senha: <code className="bg-amber-100 px-1 rounded">admin123</code>. (Pronto para Firestore/Firebase Auth).
          </div>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-xs font-semibold text-slate-500 hover:text-[#052e7f] transition-colors">
            ← Voltar para o site principal
          </a>
        </div>

      </div>
    </div>
  );
}
