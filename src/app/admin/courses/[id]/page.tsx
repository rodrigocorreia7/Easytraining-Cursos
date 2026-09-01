'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CourseService } from '../../../../services/courseService';
import { Course } from '../../../../types';
import CourseEditorForm from '../../../../components/admin/CourseEditorForm';
import { RefreshCw, AlertCircle } from 'lucide-react';

export default function AdminEditCoursePage() {
  const params = useParams();
  const id = params?.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCourse() {
      if (!id) return;
      setLoading(true);
      const data = await CourseService.getCourseById(id);
      if (data) {
        setCourse(data);
      } else {
        setError('Curso não encontrado.');
      }
      setLoading(false);
    }
    loadCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-[#00B060]" />
        <span className="text-sm font-bold">Carregando dados do curso...</span>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="p-8 max-w-md mx-auto text-center space-y-4 bg-white rounded-3xl border border-red-200">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">Ops! Não foi possível encontrar o curso.</h2>
        <a
          href="/admin/courses"
          className="inline-block px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
        >
          Voltar para Lista de Cursos
        </a>
      </div>
    );
  }

  return <CourseEditorForm initialCourse={course} isEditing={true} />;
}
