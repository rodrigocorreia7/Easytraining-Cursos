'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthService } from '../../services/authService';
import { 
  LayoutDashboard, BookOpen, FileText, Settings, 
  PlusCircle, Globe, LogOut, ShieldCheck, User, Users 
} from 'lucide-react';
import { AdminUser } from '../../types';

export function AdminShell({ children }: { children: React.ReactNode }) {
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
      return;
    }

    let isMounted = true;
    fetch('/api/admin/me')
      .then((res) => {
        if (!res.ok) {
          AuthService.logout();
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (isMounted && data?.user) {
          setCurrentUser(user);
        }
      })
      .catch(() => {
        if (isMounted) setCurrentUser(user);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
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

  const navItems = [
    {
      name: 'Visão Geral',
      href: '/admin',
      active: pathname === '/admin',
      icon: LayoutDashboard,
      color: 'text-[#00B060]'
    },
    {
      name: 'Cursos',
      href: '/admin/courses',
      active: pathname.startsWith('/admin/courses'),
      icon: BookOpen,
      color: 'text-sky-400'
    },
    {
      name: 'Artigos do Blog',
      href: '/admin/posts',
      active: pathname.startsWith('/admin/posts'),
      icon: FileText,
      color: 'text-amber-400'
    },
    {
      name: 'Leads (CRM)',
      href: '/admin/leads',
      active: pathname.startsWith('/admin/leads'),
      icon: Users,
      color: 'text-purple-400'
    },
    {
      name: 'Configurações & Links',
      href: '/admin/config',
      active: pathname.startsWith('/admin/config'),
      icon: Settings,
      color: 'text-emerald-400'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col">
      {/* Admin Header */}
      <header className="bg-[#052e7f] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-6">
            <a href="/admin" className="flex items-center gap-2 font-black text-lg">
              <span className="text-[#00B060]">EasyTraining</span>
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full font-normal">Admin CMS</span>
            </a>

            <nav className="hidden md:flex items-center gap-1.5">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      item.active
                        ? 'bg-white/15 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <span>{item.name}</span>
                  </a>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#00B060]" />
              <span>Ver Site Público</span>
            </a>

            <div className="h-4 w-px bg-white/20 hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-xs font-bold leading-tight">{currentUser?.name}</span>
                <span className="text-[10px] text-slate-300 leading-tight">Mock DB Ativo (JSON)</span>
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

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around border-t border-white/10 px-2 py-2 overflow-x-auto bg-[#032261]">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
                  item.active
                    ? 'bg-white/20 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                <span>{item.name}</span>
              </a>
            );
          })}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="bg-slate-200 text-slate-500 text-xs py-4 px-4 text-center border-t border-slate-300">
        EasyTraining Admin CMS • Persistência Local Ativa • Pronto para Firebase / Firestore
      </footer>
    </div>
  );
}
