'use client';

import React, { useEffect, useState } from 'react';
import { CourseService } from '../../../services/courseService';
import { Course } from '../../../types';
import { 
  BookOpen, Plus, Search, ExternalLink, Edit3, Trash2, 
  CheckCircle2, Layers, AlertCircle, RefreshCw, Star, Clock 
} from 'lucide-react';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | string | null>(null);
  const [notification, setNotification] = useState('');

  const loadCourses = async () => {
    setLoading(true);
    const data = await CourseService.getAllCourses();
    setCourses(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleDelete = async (id: number | string) => {
    const success = await CourseService.deleteCourse(id);
    if (success) {
      setNotification('Curso excluído com sucesso!');
      setDeleteConfirmId(null);
      loadCourses();
      setTimeout(() => setNotification(''), 3500);
    }
  };

  const categories = ['Todos', ...Array.from(new Set(courses.map(c => c.category)))];

  const filteredCourses = courses.filter(c => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'Todos' || c.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-[#052e7f]">Gestão de Cursos Profissionalizantes</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Cadastre novos cursos, atualize módulos, tópicos da grade curricular e controle os destaques na Home.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/admin/courses/novo"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#00B060] hover:bg-[#009b54] text-white font-bold text-sm shadow-md transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Novo Curso</span>
          </a>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#00B060]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Filter / Search Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nome do curso, categoria ou slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-[#00B060]"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-hidden focus:border-[#00B060]"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Exibindo <span className="font-bold text-slate-800">{filteredCourses.length}</span> de {courses.length} cursos
          </div>
        </div>

        {/* Course Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs font-bold flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-sky-600" />
              <span>Carregando cursos...</span>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              Nenhum curso encontrado com os filtros selecionados.
            </div>
          ) : (
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Curso</th>
                  <th className="py-3.5 px-4">Categoria</th>
                  <th className="py-3.5 px-4">Duração</th>
                  <th className="py-3.5 px-4">Módulos</th>
                  <th className="py-3.5 px-4">Destaque</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Title & Thumbnail */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={course.image || '/images/default-course.webp'}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-100 border border-slate-200"
                        />
                        <div className="min-w-0 max-w-sm">
                          <div className="font-bold text-slate-900 truncate">{course.title}</div>
                          <div className="text-[11px] text-slate-400 font-mono truncate">/curso/{course.slug}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-100">
                        {course.category}
                      </span>
                    </td>

                    {/* Duration */}
                    <td className="py-3.5 px-4 text-slate-500 font-medium text-xs whitespace-nowrap">
                      {course.duration}
                    </td>

                    {/* Modules count */}
                    <td className="py-3.5 px-4 text-slate-500 text-xs whitespace-nowrap">
                      <span className="font-bold text-slate-700">{course.modules?.length || 0}</span> módulos
                    </td>

                    {/* Featured */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {course.featured ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>Sim</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Não</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/curso/${course.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="Ver página pública do curso"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        <a
                          href={`/admin/courses/${course.id}`}
                          className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#052e7f] transition-colors"
                          title="Editar curso"
                        >
                          <Edit3 className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => setDeleteConfirmId(course.id)}
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                          title="Excluir curso"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">Excluir Curso?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Esta ação removerá o curso da base de dados e de todas as listagens do site. Deseja continuar?
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
