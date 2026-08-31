'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthService } from '../../services/authService';
import { LayoutDashboard, PlusCircle, Globe, LogOut, ShieldCheck, User } from 'lucide-react';
import { AdminUser } from '../../types';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // If on login page, don't show the dashboard shell
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    const user = AuthService.getCurrentUser();
    if (!user) {
      router.push('/admin/login');
    } else {
      setCurrentUser(user);
      setLoading(false);
    }
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#00B060] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Carregando painel administrativo...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col">
      {/* Admin Header */}
      <header className="bg-[#052e7f] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-6">
            <a href="/admin" className="flex items-center gap-2 font-black text-lg">
              <span className="text-[#00B060]">EasyTraining</span>
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full font-normal">Admin</span>
            </a>

            <nav className="hidden md:flex items-center gap-2">
              <a
                href="/admin"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  pathname === '/admin'
                    ? 'bg-white/15 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-[#00B060]" />
                <span>Dashboard</span>
              </a>

              <a
                href="/admin/posts/novo"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  pathname === '/admin/posts/novo'
                    ? 'bg-white/15 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-[#FFB800]" />
                <span>Novo Artigo</span>
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#00B060]" />
              <span>Ver Blog Público</span>
            </a>

            <div className="h-4 w-px bg-white/20 hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-xs font-bold leading-tight">{currentUser?.name}</span>
                <span className="text-[10px] text-slate-300 leading-tight">Sessão Mock Ativa</span>
              </div>

              <button
                onClick={() => AuthService.logout()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-300 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                title="Sair do Painel"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="bg-slate-200 text-slate-500 text-xs py-4 px-4 text-center border-t border-slate-300">
        EasyTraining Admin Suite • Pronto para integração com Firebase Firestore & Storage
      </footer>
    </div>
  );
}
