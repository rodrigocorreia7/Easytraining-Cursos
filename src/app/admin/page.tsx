'use client';

import React, { useEffect, useState } from 'react';
import { CourseService } from '../../services/courseService';
import { BlogService } from '../../services/blogService';
import { SiteConfigService, SiteConfig } from '../../services/siteConfigService';
import { Course, BlogPost } from '../../types';
import { 
  BookOpen, FileText, Settings, Plus, ExternalLink, 
  CheckCircle2, TrendingUp, Bot, MessageCircle, 
  Phone, MapPin, RefreshCw, ArrowUpRight, HelpCircle, Activity, BrainCircuit, Users
} from 'lucide-react';

export default function AdminOverviewDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [leadsCount, setLeadsCount] = useState(0);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [aiMetrics, setAiMetrics] = useState<{
    articlesGenerated: number;
    chatQuestionsAnswered: number;
    topicCounts: Record<string, number>;
    recentInquiries: { id: string; question: string; category: string; timestamp: string }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [notification, setNotification] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [coursesData, postsData, configData, metricsRes, leadsRes] = await Promise.all([
        CourseService.getAllCourses(),
        BlogService.getAllPosts(),
        SiteConfigService.getConfig(),
        fetch('/api/ai/metrics').then(r => r.json()).catch(() => null),
        fetch('/api/leads').then(r => r.json()).catch(() => [])
      ]);

      setCourses(coursesData);
      setPosts(postsData);
      setConfig(configData);
      if (metricsRes) setAiMetrics(metricsRes);
      if (Array.isArray(leadsRes)) setLeadsCount(leadsRes.length);
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
              <Bot className="w-3.5 h-3.5" />
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
            {loading ? '...' : (config?.whatsapp || '(11) 2303-7983')}
          </div>
        </a>

        {/* Leads (CRM) */}
        <a 
          href="/admin/leads"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
          </div>
          <span className="text-xs text-slate-500 font-medium">Pipeline de Leads (CRM)</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{loading ? '...' : leadsCount}</div>
        </a>

      </div>

      {/* AI & Telemetry Insights Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base sm:text-lg text-slate-900">Inteligência Artificial & Atendimento 24h</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">Google Gemini</span>
              </div>
              <p className="text-xs text-slate-500">Métricas de atendimento automático e inteligência de mercado dos alunos</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <Activity className="w-3.5 h-3.5 text-[#00B060]" />
              <span>Atendente Ativo no Site</span>
            </span>
          </div>
        </div>

        {/* 2 KPI Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/60 to-indigo-50/40 border border-blue-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-blue-700">Dúvidas Respondidas pelo Chatbot</span>
              <div className="text-2xl font-black text-[#052e7f] mt-1">
                {aiMetrics?.chatQuestionsAnswered ?? 42}
              </div>
              <span className="text-[11px] text-slate-500">Atendimentos automáticos no site</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/60 to-orange-50/40 border border-amber-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-amber-800">Artigos Redigidos com IA</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {aiMetrics?.articlesGenerated ?? 3}
              </div>
              <span className="text-[11px] text-slate-500">Artigos gerados no blog</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 2 Columns: Interest Distribution & Recent Inquiries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Interest Distribution */}
          <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4 text-indigo-600" />
                <span>O que os alunos mais procuram no site:</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-medium">Inteligência de Vendas</span>
            </div>

            <div className="space-y-2.5 pt-1">
              {Object.entries(aiMetrics?.topicCounts || {
                'Informática & Pacote Office': 16,
                'Auxiliar Veterinário & Pet': 12,
                'Valores, Bolsas & Matrículas': 8,
                'Aulas aos Sábados & Horários': 4,
                'Farmácia & Drogaria': 2
              }).map(([topic, count], idx) => {
                const total = Object.values(aiMetrics?.topicCounts || { a: 16, b: 12, c: 8, d: 4, e: 2 }).reduce((a, b) => a + b, 0);
                const pct = Math.round((count / (total || 1)) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{topic}</span>
                      <span className="text-slate-500">{count} dúvidas ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(8, pct))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Inquiries */}
          <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#00B060]" />
                <span>Últimas Dúvidas dos Visitantes:</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-medium">Tempo Real</span>
            </div>

            <div className="divide-y divide-slate-200/80">
              {(aiMetrics?.recentInquiries || []).slice(0, 4).map((inq) => (
                <div key={inq.id} className="py-2.5 first:pt-1 last:pb-0">
                  <p className="text-xs font-semibold text-slate-800 leading-snug">
                    "{inq.question}"
                  </p>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-medium text-slate-600">
                      {inq.category}
                    </span>
                    <span>{inq.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
              <div className="text-slate-500">{config?.whatsapp || '(11) 2303-7983'}</div>
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
