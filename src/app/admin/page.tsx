'use client';

import React, { useEffect, useState } from 'react';
import { BlogService } from '../../services/blogService';
import { BlogPost } from '../../types';
import { 
  FileText, Plus, Search, ExternalLink, Edit3, Trash2, 
  Eye, CheckCircle2, TrendingUp, Layers, AlertCircle 
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | string | null>(null);
  const [notification, setNotification] = useState('');

  const loadPosts = async () => {
    setLoading(true);
    const data = await BlogService.getAllPosts();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id: number | string) => {
    const success = await BlogService.deletePost(id);
    if (success) {
      setNotification('Artigo excluído com sucesso!');
      setDeleteConfirmId(null);
      loadPosts();
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCategories = new Set(posts.map(p => p.category)).size;

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-[#052e7f]">Painel de Artigos do Blog</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gerencie todas as publicações, crie novos conteúdos e controle a indexação SEO.
          </p>
        </div>

        <a
          href="/admin/posts/novo"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#00B060] hover:bg-[#009b54] text-white font-bold text-sm shadow-md transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Artigo</span>
        </a>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#00B060]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#052e7f] flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Artigos Ativos</span>
            <div className="text-2xl font-black text-slate-900">{posts.length}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#00B060] flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Categorias Ativas</span>
            <div className="text-2xl font-black text-slate-900">{totalCategories}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#FFB800] flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Status do Sistema</span>
            <div className="text-sm font-bold text-emerald-600 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>100% Operacional</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por título, categoria ou slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-[#00B060]"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Exibindo <span className="font-bold text-slate-800">{filteredPosts.length}</span> de {posts.length} artigos
          </div>
        </div>

        {/* Post Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Artigo</th>
                <th className="py-3.5 px-4">Categoria</th>
                <th className="py-3.5 px-4">Data</th>
                <th className="py-3.5 px-4">Tempo</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Title & Thumbnail */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.image}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-100 border border-slate-200"
                      />
                      <div className="min-w-0 max-w-sm">
                        <div className="font-bold text-slate-900 truncate">{post.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono truncate">/{post.slug}</div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                      {post.category}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-slate-500 font-medium text-xs">
                    {post.date}
                  </td>

                  {/* Read Time */}
                  <td className="py-3.5 px-4 text-slate-500 text-xs">
                    {post.readTime}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Ver no site"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      <a
                        href={`/admin/posts/${post.id}`}
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#052e7f] transition-colors"
                        title="Editar artigo"
                      >
                        <Edit3 className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => setDeleteConfirmId(post.id)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                        title="Excluir artigo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">Excluir Artigo?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Esta ação removerá o artigo da listagem pública e do painel. Deseja continuar?
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
