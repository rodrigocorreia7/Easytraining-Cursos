'use client';

import React, { useState, useMemo } from 'react';
import { courses } from '../../data/coursesData';
import { Course } from '../../types';
import {
  Clock,
  ArrowRight,
  BookOpen,
  LayoutGrid,
  Monitor,
  Briefcase,
  Palette,
  HeartPulse,
} from 'lucide-react';
import { CourseModal } from '../ui/Modal';
import { FloatingDock, FloatingDockItem } from '../ui/floating-dock';
import BorderGlow from '../ui/BorderGlow';
import SplitText from '../ui/SplitText';

interface CoursesSectionProps {
  initialCategory?: string;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({ initialCategory = 'todos' }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchFilter, setSearchFilter] = useState('');
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  const categoryCounts = useMemo(() => {
    return {
      todos: courses.length,
      tecnologia: courses.filter((c) => c.categorySlug === 'tecnologia').length,
      gestao: courses.filter((c) => c.categorySlug === 'gestao').length,
      design: courses.filter((c) => c.categorySlug === 'design').length,
      'saude-pet': courses.filter((c) => c.categorySlug === 'saude-pet').length,
    };
  }, []);

  const dockItems: FloatingDockItem[] = [
    {
      id: 'todos',
      title: 'Todos os Cursos',
      count: categoryCounts.todos,
      icon: <LayoutGrid className="w-5 h-5" />,
      active: selectedCategory === 'todos',
      onClick: () => setSelectedCategory('todos'),
    },
    {
      id: 'tecnologia',
      title: 'Tecnologia & Informática',
      count: categoryCounts.tecnologia,
      icon: <Monitor className="w-5 h-5" />,
      active: selectedCategory === 'tecnologia',
      onClick: () => setSelectedCategory('tecnologia'),
    },
    {
      id: 'gestao',
      title: 'Gestão & Negócios',
      count: categoryCounts.gestao,
      icon: <Briefcase className="w-5 h-5" />,
      active: selectedCategory === 'gestao',
      onClick: () => setSelectedCategory('gestao'),
    },
    {
      id: 'design',
      title: 'Design & Criatividade',
      count: categoryCounts.design,
      icon: <Palette className="w-5 h-5" />,
      active: selectedCategory === 'design',
      onClick: () => setSelectedCategory('design'),
    },
    {
      id: 'saude-pet',
      title: 'Saúde & Pet',
      count: categoryCounts['saude-pet'],
      icon: <HeartPulse className="w-5 h-5" />,
      active: selectedCategory === 'saude-pet',
      onClick: () => setSelectedCategory('saude-pet'),
    },
  ];

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchCat = selectedCategory === 'todos' || c.categorySlug === selectedCategory;
      const matchSearch =
        c.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        c.shortDescription.toLowerCase().includes(searchFilter.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchFilter]);

  return (
    <section id="cursos" className="py-20 sm:py-28 bg-white relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mx-auto text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-xs font-bold text-[#00B060]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Grade Completa de Cursos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#052e7f] tracking-tight">
            <SplitText
              text="Escolha o curso que vai transformar o seu futuro"
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#052e7f] tracking-tight"
              delay={28}
              duration={0.9}
              ease="power3.out"
              splitType="words, chars"
              from={{ opacity: 0, y: 35 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.15}
              tag="span"
              textAlign="center"
            />
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Formações completas e práticas com matrículas abertas. Selecione uma área na dock abaixo para filtrar:
          </p>
        </div>

        {/* FLOATING DOCK ACETERNITY UI */}
        <div className="mb-12 flex justify-center">
          <FloatingDock items={dockItems} />
        </div>

        {/* COURSES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <BorderGlow
              key={course.id}
              edgeSensitivity={18}
              glowColor="45 98 52"
              backgroundColor="#ffffff"
              borderRadius={24}
              glowRadius={40}
              glowIntensity={1.3}
              coneSpread={35}
              colors={['#FFB800', '#F59E0B', '#4ADE80']}
              fillOpacity={0.3}
              className="group cursor-pointer hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-xl"
            >
              <div
                onClick={() => setActiveCourse(course)}
                className="p-5 flex flex-col justify-between h-full"
              >
                <div>
                  <div className="relative h-44 sm:h-48 rounded-2xl overflow-hidden mb-4 bg-slate-200">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-white/95 backdrop-blur-md text-[11px] font-bold text-[#052e7f] rounded-full uppercase tracking-wider shadow-sm">
                        {course.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#052e7f] mb-2 group-hover:text-[#00874A] transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
                    {course.shortDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#00874A]" />
                    <span>{course.duration}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#052e7f] group-hover:text-[#00874A] transition-colors">
                    Ver Grade <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </BorderGlow>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            Nenhum curso encontrado com esse filtro.
          </div>
        )}

      </div>

      <CourseModal
        course={activeCourse}
        isOpen={Boolean(activeCourse)}
        onClose={() => setActiveCourse(null)}
      />
    </section>
  );
};
