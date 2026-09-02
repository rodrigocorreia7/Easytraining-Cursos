'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Key } from 'lucide-react';
import { AuthService } from '../../../services/authService';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@easytraining.com.br');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const res = await AuthService.loginWithGoogle();
      if (res.success) {
        router.push('/admin');
      } else {
        setError(res.error || 'Erro ao autenticar com o Google');
      }
    } catch {
      setError('Ocorreu um erro ao autenticar com o Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

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
            disabled={loading || googleLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-[#00B060] hover:bg-[#009b54] active:bg-[#008749] text-white font-bold text-sm shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Autenticando...</span>
            ) : (
              <>
                <span>Acessar com E-mail</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-semibold">ou</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
          className="w-full py-3 px-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 hover:border-slate-300"
        >
          {googleLoading ? (
            <span>Conectando ao Google...</span>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continuar com Google</span>
            </>
          )}
        </button>

        <div className="mt-8 p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-800 flex items-start gap-2">
          <Key className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
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
