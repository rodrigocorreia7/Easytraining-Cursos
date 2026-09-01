'use client';

import React, { useEffect, useState } from 'react';
import { CourseService } from '../../services/courseService';
import { BlogService } from '../../services/blogService';
import { SiteConfigService, SiteConfig } from '../../services/siteConfigService';
import { Course, BlogPost } from '../../types';
import { 
  BookOpen, FileText, Settings, Plus, ExternalLink, 
  CheckCircle2, TrendingUp, Sparkles, MessageCircle, 
  Phone, MapPin, RefreshCw, ArrowUpRight
} from 'lucide-react';

export default function AdminOverviewDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [notification, setNotification] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [coursesData, postsData, configData] = await Promise.all([
        CourseService.getAllCourses(),
        BlogService.getAllPosts(),
        SiteConfigService.getConfig()
      ]);
      setCourses(coursesData);
      setPosts(postsData);
      setConfig(configData);
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResetAll = async () => {
    if (!window.confirm('Tem certeza que deseja restaurar TODOS os Cursos, Artigos e Configurações para o padrão de fábrica?')) {
      return;
    }
    setResetting(true);
    const res = await fetch('/api/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: 'all' })
    });
    if (res.ok) {
      setNotification('Todos os dados foram restaurados para o padrão original com sucesso!');
      await loadData();
      setTimeout(() => setNotification(''), 4000);
    }
    setResetting(false);
  };

  const totalCategories = new Set([
    ...courses.map(c => c.category),
    ...posts.map(p => p.category)
  ]).size;

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-linear-to-r from-[#052e7f] via-[#042566] to-[#031b49] text-white p-6 sm:p-8 rounded-3xl shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EasyTraining CMS • Pronto para Firebase</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Painel de Controle Central
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Gerencie todos os cursos profissionalizantes, artigos do blog, links de contato e redes sociais com persistência instantânea no site.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/admin/courses/novo"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#00B060] hover:bg-[#009b54] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Curso</span>
            </a>

            <a
              href="/admin/posts/novo"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Novo Artigo</span>
            </a>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#00B060] shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Cursos */}
        <a 
          href="/admin/courses"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-sky-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
          </div>
          <span className="text-xs text-slate-500 font-medium">Cursos Ativos</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{loading ? '...' : courses.length}</div>
        </a>

        {/* Posts */}
        <a 
          href="/admin/posts"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
          </div>
          <span className="text-xs text-slate-500 font-medium">Artigos do Blog</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{loading ? '...' : posts.length}</div>
        </a>

        {/* WhatsApp & Contatos */}
        <a 
          href="/admin/config"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#00B060] flex items-center justify-center group-hover:scale-105 transition-transform">
              <MessageCircle className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#00B060] transition-colors" />
          </div>
          <span className="text-xs text-slate-500 font-medium">WhatsApp Principal</span>
          <div className="text-xs font-bold text-slate-800 mt-1 truncate">
            {loading ? '...' : (config?.whatsapp || '(11) 97063-8888')}
          </div>
        </a>

        {/* Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-xs text-slate-500 font-medium">Categorias Únicas</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{loading ? '...' : totalCategories}</div>
        </div>

      </div>

      {/* Two columns: Recent Courses & Recent Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Courses */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-600" />
              <h2 className="font-black text-base text-slate-900">Últimos Cursos</h2>
            </div>
            <a 
              href="/admin/courses" 
              className="text-xs font-bold text-[#00B060] hover:underline"
            >
              Ver todos ({courses.length})
            </a>
          </div>

          <div className="divide-y divide-slate-100">
            {courses.slice(0, 5).map(course => (
              <div key={course.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={course.image || '/images/default-course.webp'}
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-xs sm:text-sm text-slate-800 truncate">{course.title}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{course.category} • {course.duration}</div>
                  </div>
                </div>

                <a
                  href={`/admin/courses/${course.id}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs shrink-0 transition-colors"
                >
                  Editar
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" />
              <h2 className="font-black text-base text-slate-900">Últimos Artigos</h2>
            </div>
            <a 
              href="/admin/posts" 
              className="text-xs font-bold text-[#00B060] hover:underline"
            >
              Ver todos ({posts.length})
            </a>
          </div>

          <div className="divide-y divide-slate-100">
            {posts.slice(0, 5).map(post => (
              <div key={post.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={post.image || '/images/default-blog.webp'}
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-xs sm:text-sm text-slate-800 truncate">{post.title}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{post.category} • {post.date}</div>
                  </div>
                </div>

                <a
                  href={`/admin/posts/${post.id}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs shrink-0 transition-colors"
                >
                  Editar
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Quick Config Preview & Factory Reset */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#052e7f]" />
              <span>Contatos & Links Rápidos</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Valores ativos utilizados no Cabeçalho, Rodapé e Botões de Ação do site.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/admin/config"
              className="px-4 py-2 rounded-xl bg-[#052e7f] hover:bg-[#042566] text-white text-xs font-bold transition-all"
            >
              Editar Tudo
            </a>

            <button
              onClick={handleResetAll}
              disabled={resetting}
              className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
              <span>Restaurar Padrão de Fábrica</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <Phone className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-700">Telefone Fixo</div>
              <div className="text-slate-500">{config?.phone || '(11) 2484-4848'}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <MessageCircle className="w-4 h-4 text-[#00B060] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-700">WhatsApp Oficial</div>
              <div className="text-slate-500">{config?.whatsapp || '(11) 97063-8888'}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="font-bold text-slate-700">Endereço</div>
              <div className="text-slate-500 truncate">{config?.address?.street || 'Estrada do Sacramento, 1250'}</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
