'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BlogPost } from '../../types';
import { BlogService } from '../../services/blogService';
import { 
  Save, Eye, ArrowLeft, Image as ImageIcon, BookOpen, 
  Link as LinkIcon, GraduationCap, CheckCircle2, AlertCircle, Upload 
} from 'lucide-react';
import { PostDetailView } from '../blog/PostDetailView';
import { sanitizeSlug, sanitizeInput } from '../../utils/security';

interface PostEditorFormProps {
  initialPost?: BlogPost;
  isEditing?: boolean;
}

const CATEGORIES = [
  'Tecnologia & Informática',
  'Saúde & Pet',
  'Saúde & Farmácia',
  'Gestão & Negócios',
  'Primeiro Emprego & Carreira',
  'Mercado de Trabalho'
];

const AVAILABLE_COURSES = [
  { slug: 'excel-avancado', name: 'Excel Avançado com Dashboards', tagline: 'Domine planilhas, automações e relatórios visuais.', duration: '40 Horas', category: 'Tecnologia & Informática' },
  { slug: 'auxiliar-veterinario', name: 'Auxiliar Veterinário', tagline: 'Aprenda procedimentos clínicos e cuidados com animais.', duration: '80 Horas', category: 'Saúde & Pet' },
  { slug: 'curso-de-informatica-basica', name: 'Informática Fundamental & Pacote Office', tagline: 'O curso essencial para entrar no mercado de trabalho.', duration: '60 Horas', category: 'Tecnologia & Informática' },
  { slug: 'auxiliar-de-farmacia', name: 'Auxiliar de Farmácia & Drogaria', tagline: 'Capacitação completa para atendimento e balcão.', duration: '60 Horas', category: 'Saúde & Farmácia' },
  { slug: 'assistente-administrativo', name: 'Assistente Administrativo Completo', tagline: 'Rotinas de escritório, finanças e atendimento corporativo.', duration: '70 Horas', category: 'Gestão & Negócios' }
];

export const PostEditorForm: React.FC<PostEditorFormProps> = ({ initialPost, isEditing = false }) => {
  const router = useRouter();
  const [title, setTitle] = useState(initialPost?.title || '');
  const [slug, setSlug] = useState(initialPost?.slug || '');
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '');
  const [category, setCategory] = useState(initialPost?.category || CATEGORIES[0]);
  const [image, setImage] = useState(initialPost?.image || '/images/wordpress/diverse-work-team-working-in-the-office-ZD9JBTU.webp');
  const [contentHtml, setContentHtml] = useState(initialPost?.contentHtml || initialPost?.content || '');
  const [selectedCourseSlug, setSelectedCourseSlug] = useState(initialPost?.relatedCourse?.slug || 'assistente-administrativo');
  const [author, setAuthor] = useState(initialPost?.author || 'EasyTraining Equipe Pedagógica');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing || !slug) {
      const generated = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  };

  // Image Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setImage(data.url);
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro no envio da imagem.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Falha ao enviar arquivo de imagem.' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const safeSlug = sanitizeSlug(slug);
    const relatedCourse = AVAILABLE_COURSES.find(c => c.slug === selectedCourseSlug) || AVAILABLE_COURSES[0];

    const postPayload: Partial<BlogPost> = {
      title: title.trim(),
      slug: safeSlug,
      excerpt: excerpt.trim(),
      category: sanitizeInput(category),
      image,
      contentHtml,
      content: contentHtml,
      author: sanitizeInput(author),
      authorRole: 'Especialistas em Carreira e Qualificação',
      date: initialPost?.date || new Date().toISOString().split('T')[0],
      readTime: `${Math.max(1, Math.round(contentHtml.replace(/<[^>]+>/g, '').split(/\s+/).length / 180))} min`,
      relatedCourse,
      tags: [category, 'Guarulhos', 'Cursos Profissionalizantes', 'Mercado de Trabalho']
    };

    try {
      if (isEditing && initialPost?.id) {
        await BlogService.updatePost(initialPost.id, postPayload);
        setMessage({ type: 'success', text: 'Artigo atualizado com sucesso!' });
      } else {
        await BlogService.createPost(postPayload as any);
        setMessage({ type: 'success', text: 'Novo artigo publicado com sucesso!' });
      }

      setTimeout(() => {
        router.push('/admin/posts');
      }, 1200);
    } catch {
      setMessage({ type: 'error', text: 'Ocorreu um erro ao salvar o artigo.' });
    } finally {
      setSaving(false);
    }
  };

  // Construct temporary preview post
  const previewPost: BlogPost = {
    id: initialPost?.id || 9999,
    title: title || 'Título do Artigo em Destaque',
    slug: slug || 'artigo-exemplo',
    excerpt: excerpt || 'Resumo do artigo para pré-visualização e otimização de SEO...',
    category,
    image,
    contentHtml: contentHtml || '<p>Escreva o conteúdo do seu artigo no formulário para visualizar aqui.</p>',
    author,
    authorRole: 'Especialistas em Carreira e Qualificação',
    date: initialPost?.date || new Date().toISOString().split('T')[0],
    readTime: `${Math.max(1, Math.round(contentHtml.replace(/<[^>]+>/g, '').split(/\s+/).length / 180))} min`,
    relatedCourse: AVAILABLE_COURSES.find(c => c.slug === selectedCourseSlug) || AVAILABLE_COURSES[0],
    tags: [category, 'Guarulhos', 'Cursos Profissionalizantes']
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <a
            href="/admin/posts"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Voltar aos Artigos"
          >
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#052e7f]">
              {isEditing ? 'Editar Artigo' : 'Criar Novo Artigo'}
            </h1>
            <p className="text-xs text-slate-500">
              {isEditing ? `Editando: /${initialPost?.slug}` : 'Preencha os campos para publicar no blog e indexar no Google'}
            </p>
          </div>
        </div>

        {/* Tab Toggle & Save Button */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'edit'
                  ? 'bg-white text-[#052e7f] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Formulário
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-white text-[#00B060] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pré-visualização</span>
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving || !title || !contentHtml}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#00B060] hover:bg-[#009b54] active:bg-[#008749] text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Salvando...' : 'Salvar & Publicar'}</span>
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#00B060]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Tab Views */}
      {activeTab === 'preview' ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-8">
          <div className="mb-4 pb-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold text-[#00B060]">Modo de Pré-visualização em Tempo Real</span>
            <span>URL: https://easytraining.com.br/{slug}</span>
          </div>
          <PostDetailView post={previewPost} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Title & Slug */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Título do Artigo (H1) *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Ex: Importância do Excel no Mercado de Trabalho em 2026"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-base sm:text-lg focus:outline-hidden focus:border-[#00B060] focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>Slug da URL (Permalinks / Backlinks)</span>
                </label>
                <div className="flex items-center">
                  <span className="px-3.5 py-2.5 bg-slate-100 text-slate-500 rounded-l-2xl border border-r-0 border-slate-200 text-xs font-mono">
                    https://easytraining.com.br/
                  </span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="importancia-do-excel-no-mercado-de-trabalho"
                    className="w-full px-4 py-2.5 rounded-r-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-mono focus:outline-hidden focus:border-[#00B060]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Resumo / Meta Descrição de SEO *
                </label>
                <textarea
                  rows={3}
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Breve descrição atraente para o snippet do Google e compartilhamento em redes sociais..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-hidden focus:border-[#00B060] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            {/* Content Body */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Conteúdo do Artigo (HTML / Texto Formatado) *
                </label>
                <span className="text-[11px] text-slate-400">
                  Suporta tags HTML como &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;img&gt;
                </span>
              </div>

              <textarea
                rows={16}
                required
                value={contentHtml}
                onChange={(e) => setContentHtml(e.target.value)}
                placeholder="<p>Escreva os parágrafos do artigo aqui...</p><h2>Subtítulo Importante</h2><p>Mais detalhes...</p>"
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs sm:text-sm focus:outline-hidden focus:border-[#00B060] focus:ring-2 focus:ring-emerald-100 leading-relaxed"
              />
            </div>

          </div>

          {/* Sidebar Column (1/3) */}
          <div className="space-y-6">
            
            {/* Category & Course Banner */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#052e7f] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#00B060]" />
                <span>Classificação & Categoria</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Categoria Principal</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-[#00B060]"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                  <GraduationCap className="w-4 h-4 text-[#FFB800]" />
                  <span>Banner de Curso Relacionado (WhatsApp CTA)</span>
                </label>
                <select
                  value={selectedCourseSlug}
                  onChange={(e) => setSelectedCourseSlug(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-[#00B060]"
                >
                  {AVAILABLE_COURSES.map(course => (
                    <option key={course.slug} value={course.slug}>
                      {course.name} ({course.duration})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Autor / Assinatura</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-[#00B060]"
                />
              </div>
            </div>

            {/* Featured Image URL & Upload */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#052e7f] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#00B060]" />
                <span>Imagem de Capa (Destaque)</span>
              </h3>

              {image && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Upload Button */}
              <div>
                <label className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer border border-dashed border-slate-300 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-sky-600" />
                  <span>{uploadingImage ? 'Enviando...' : 'Fazer Upload do PC'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Ou digite o caminho/link:</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/images/... ou https://..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-hidden focus:border-[#00B060]"
                />
              </div>
            </div>

          </div>

        </form>
      )}

    </div>
  );
};
export default PostEditorForm;
