'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Course, CourseModule } from '../../types';
import { CourseService } from '../../services/courseService';
import { 
  Save, ArrowLeft, Upload, Plus, Trash2, CheckCircle2, 
  AlertCircle, Sparkles, Image as ImageIcon, Layers, BookOpen, 
  HelpCircle, MessageCircle, Star 
} from 'lucide-react';

interface CourseEditorFormProps {
  initialCourse?: Course;
  isEditing?: boolean;
}

const CATEGORIES = [
  'SAÚDE & PET',
  'GESTÃO & NEGÓCIOS',
  'DESIGN & CRIATIVIDADE',
  'TECNOLOGIA & INFORMÁTICA',
  'BELEZA & ESTÉTICA',
  'OUTROS'
];

export default function CourseEditorForm({ initialCourse, isEditing = false }: CourseEditorFormProps) {
  const router = useRouter();

  // Basic Info
  const [title, setTitle] = useState(initialCourse?.title || '');
  const [slug, setSlug] = useState(initialCourse?.slug || '');
  const [category, setCategory] = useState(initialCourse?.category || 'TECNOLOGIA & INFORMÁTICA');
  const [shortDescription, setShortDescription] = useState(initialCourse?.shortDescription || '');
  const [fullDescription, setFullDescription] = useState(initialCourse?.fullDescription || '');
  const [duration, setDuration] = useState(initialCourse?.duration || '3 a 6 meses');
  const [modality, setModality] = useState(initialCourse?.modality || 'Presencial / Prático');
  const [certificate, setCertificate] = useState(initialCourse?.certificate ?? true);
  const [featured, setFeatured] = useState(initialCourse?.featured ?? false);
  const [image, setImage] = useState(initialCourse?.image || '/images/default-course.webp');
  const [targetAudience, setTargetAudience] = useState(initialCourse?.targetAudience || '');
  const [whatsappMessage, setWhatsappMessage] = useState(
    initialCourse?.whatsappMessage || `Olá! Gostaria de saber mais sobre o Curso de ${title || 'informática'}.`
  );

  // Dynamic Career Opportunities
  const [careerOpportunities, setCareerOpportunities] = useState<string[]>(
    initialCourse?.careerOpportunities || ['Empresas de Tecnologia e Escritórios', 'Comércio e Indústrias']
  );
  const [newCareer, setNewCareer] = useState('');

  // Dynamic Modules
  const [modules, setModules] = useState<CourseModule[]>(
    initialCourse?.modules || [
      {
        title: 'Módulo 1: Introdução e Fundamentos',
        topics: ['Conceitos básicos', 'Ambiente prático', 'Primeiros passos']
      }
    ]
  );

  // State
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Helper auto slug generator
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
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
    setError('');

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
        setError(data.error || 'Erro no envio da imagem.');
      }
    } catch (err) {
      console.error(err);
      setError('Falha ao enviar arquivo.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Career Ops Handlers
  const handleAddCareer = () => {
    if (newCareer.trim()) {
      setCareerOpportunities([...careerOpportunities, newCareer.trim()]);
      setNewCareer('');
    }
  };

  const handleRemoveCareer = (idx: number) => {
    setCareerOpportunities(careerOpportunities.filter((_, i) => i !== idx));
  };

  // Modules Handlers
  const handleAddModule = () => {
    const nextIndex = modules.length + 1;
    setModules([
      ...modules,
      {
        title: `Módulo ${nextIndex}: Novo Módulo`,
        topics: ['Tópico prático 1']
      }
    ]);
  };

  const handleRemoveModule = (idx: number) => {
    setModules(modules.filter((_, i) => i !== idx));
  };

  const handleModuleTitleChange = (idx: number, newTitle: string) => {
    const updated = [...modules];
    updated[idx].title = newTitle;
    setModules(updated);
  };

  const handleAddTopic = (moduleIdx: number) => {
    const updated = [...modules];
    updated[moduleIdx].topics.push('Novo tópico');
    setModules(updated);
  };

  const handleTopicChange = (moduleIdx: number, topicIdx: number, val: string) => {
    const updated = [...modules];
    updated[moduleIdx].topics[topicIdx] = val;
    setModules(updated);
  };

  const handleRemoveTopic = (moduleIdx: number, topicIdx: number) => {
    const updated = [...modules];
    updated[moduleIdx].topics = updated[moduleIdx].topics.filter((_, i) => i !== topicIdx);
    setModules(updated);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      setError('Por favor, preencha o título e a URL (slug) do curso.');
      return;
    }

    setSaving(true);
    setError('');

    const categorySlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const coursePayload: Partial<Course> = {
      title,
      slug: slug.replace(/^\/|\/$/g, ''),
      category,
      categorySlug,
      shortDescription,
      fullDescription,
      duration,
      modality,
      certificate,
      featured,
      image,
      targetAudience,
      careerOpportunities,
      whatsappMessage,
      modules
    };

    try {
      if (isEditing && initialCourse?.id) {
        const res = await CourseService.updateCourse(initialCourse.id, coursePayload);
        if (res) {
          setSuccess(true);
          setTimeout(() => router.push('/admin/courses'), 1200);
        } else {
          setError('Erro ao salvar alterações no curso.');
        }
      } else {
        const res = await CourseService.createCourse(coursePayload);
        if (res) {
          setSuccess(true);
          setTimeout(() => router.push('/admin/courses'), 1200);
        } else {
          setError('Erro ao criar novo curso.');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao salvar o curso.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/courses')}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#052e7f]">
              {isEditing ? 'Editar Curso' : 'Criar Novo Curso'}
            </h1>
            <p className="text-xs text-slate-500">
              {isEditing ? `Editando: ${initialCourse?.title}` : 'Preencha os dados e módulos da grade curricular.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#00B060] hover:bg-[#009b54] text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Salvando...' : isEditing ? 'Atualizar Curso' : 'Publicar Curso'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-bold flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#00B060] shrink-0" />
          <span>Curso salvo com sucesso! Redirecionando...</span>
        </div>
      )}

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Core info & Modules (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Course Info */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-600" />
              <span>Informações Principais</span>
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Título do Curso *</label>
              <input
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="Ex: Curso de Auxiliar Veterinário"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-hidden focus:border-[#00B060]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL Amigável (Slug) *</label>
                <div className="flex items-center rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-mono text-slate-600">
                  <span className="text-slate-400">/curso/</span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-transparent focus:outline-hidden text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Categoria *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 focus:outline-hidden focus:border-[#00B060]"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Descrição Curta (Cards / Prévia)</label>
              <textarea
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Resumo em 1 ou 2 linhas sobre o curso..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#00B060]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Descrição Completa e Detalhada</label>
              <textarea
                rows={4}
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                placeholder="Explicação completa sobre a profissão, metodologia, laboratórios e oportunidades..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#00B060]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Duração do Curso</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Ex: 3 a 6 meses"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-hidden focus:border-[#00B060]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Modalidade</label>
                <input
                  type="text"
                  value={modality}
                  onChange={(e) => setModality(e.target.value)}
                  placeholder="Ex: Presencial / 100% Prático"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-hidden focus:border-[#00B060]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Público-Alvo</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Ex: Pessoas interessadas em ingressar rapidamente no mercado farmacêutico."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-hidden focus:border-[#00B060]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-[#00B060]" />
                <span>Mensagem Padrão do WhatsApp</span>
              </label>
              <input
                type="text"
                value={whatsappMessage}
                onChange={(e) => setWhatsappMessage(e.target.value)}
                placeholder="Ex: Olá! Gostaria de saber mais sobre as matrículas deste curso."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-hidden focus:border-[#00B060]"
              />
            </div>
          </div>

          {/* Dynamic Modules & Topics */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#00B060]" />
                  <span>Grade Curricular / Módulos ({modules.length})</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Adicione e organize os módulos e tópicos práticos ensinados neste curso.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddModule}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#00B060] font-bold text-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Módulo</span>
              </button>
            </div>

            <div className="space-y-4">
              {modules.map((mod, modIdx) => (
                <div key={modIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={mod.title}
                      onChange={(e) => handleModuleTitleChange(modIdx, e.target.value)}
                      placeholder={`Módulo ${modIdx + 1}: Nome do Módulo`}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-hidden focus:border-[#00B060]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveModule(modIdx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Excluir Módulo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Topics List */}
                  <div className="pl-3 border-l-2 border-emerald-300 space-y-2">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tópicos do Módulo:</div>
                    {mod.topics.map((topic, topicIdx) => (
                      <div key={topicIdx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <input
                          type="text"
                          value={topic}
                          onChange={(e) => handleTopicChange(modIdx, topicIdx, e.target.value)}
                          className="flex-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#00B060]"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveTopic(modIdx, topicIdx)}
                          className="text-slate-300 hover:text-red-500 p-1"
                          title="Remover tópico"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleAddTopic(modIdx)}
                      className="text-xs font-bold text-[#00B060] hover:underline inline-flex items-center gap-1 pt-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar Tópico</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Career Opportunities */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Oportunidades de Carreira / Onde Trabalhar</span>
            </h2>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newCareer}
                onChange={(e) => setNewCareer(e.target.value)}
                placeholder="Ex: Drogarias e Redes Farmacêuticas..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCareer();
                  }
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#00B060]"
              />
              <button
                type="button"
                onClick={handleAddCareer}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Adicionar
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {careerOpportunities.map((op, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold"
                >
                  <span>{op}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCareer(i)}
                    className="text-amber-600 hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Image Upload & Status toggles */}
        <div className="space-y-6">
          
          {/* Image Upload Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#052e7f]" />
              <span>Capa do Curso</span>
            </h2>

            {/* Preview Image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={image || '/images/default-course.webp'}
                alt="Prévia do Curso"
                className="w-full h-full object-cover"
              />
            </div>

            {/* File Upload Button */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Fazer Upload do Arquivo (PNG, JPG, WebP)
              </label>
              <label className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer border border-dashed border-slate-300 transition-colors">
                <Upload className="w-4 h-4 text-sky-600" />
                <span>{uploadingImage ? 'Enviando imagem...' : 'Escolher do Computador'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
            </div>

            {/* Manual URL Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ou digite o caminho / link da imagem</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/images/courses/meu-curso.webp"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 focus:outline-hidden focus:border-[#00B060]"
              />
            </div>
          </div>

          {/* Status & Options */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              <span>Visibilidade & Certificado</span>
            </h2>

            <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-[#00B060] rounded-sm focus:ring-[#00B060]"
              />
              <div>
                <div className="text-xs font-bold text-slate-800">Curso em Destaque</div>
                <div className="text-[11px] text-slate-500">Exibir em destaque nos carrosséis da página inicial.</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={certificate}
                onChange={(e) => setCertificate(e.target.checked)}
                className="w-4 h-4 text-[#00B060] rounded-sm focus:ring-[#00B060]"
              />
              <div>
                <div className="text-xs font-bold text-slate-800">Certificado Incluso</div>
                <div className="text-[11px] text-slate-500">Emitido ao concluir a carga horária do curso.</div>
              </div>
            </label>
          </div>

        </div>

      </div>

    </form>
  );
}
