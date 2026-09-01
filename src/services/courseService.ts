import { Course } from '../types';

export const CourseService = {
  /**
   * Retorna todos os cursos cadastrados
   */
  async getAllCourses(): Promise<Course[]> {
    try {
      const res = await fetch('/api/courses', { cache: 'no-store' });
      if (!res.ok) throw new Error('Falha ao buscar cursos');
      return await res.json();
    } catch (error) {
      console.error('CourseService.getAllCourses error:', error);
      return [];
    }
  },

  /**
   * Busca um curso específico pelo slug
   */
  async getCourseBySlug(slug: string): Promise<Course | null> {
    try {
      const cleanSlug = slug.replace(/^\/|\/$/g, '').toLowerCase();
      const res = await fetch(`/api/courses?slug=${encodeURIComponent(cleanSlug)}`, { cache: 'no-store' });
      if (!res.ok) return null;
      return await res.json();
    } catch (error) {
      console.error('CourseService.getCourseBySlug error:', error);
      return null;
    }
  },

  /**
   * Busca um curso pelo seu ID
   */
  async getCourseById(id: number | string): Promise<Course | null> {
    try {
      const res = await fetch(`/api/courses/${id}`, { cache: 'no-store' });
      if (!res.ok) return null;
      return await res.json();
    } catch (error) {
      console.error('CourseService.getCourseById error:', error);
      return null;
    }
  },

  /**
   * Cria um novo curso (Mock JSON -> Firestore addDoc ready)
   */
  async createCourse(courseData: Partial<Course>): Promise<Course | null> {
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
      });
      if (!res.ok) throw new Error('Falha ao criar curso');
      return await res.json();
    } catch (error) {
      console.error('CourseService.createCourse error:', error);
      return null;
    }
  },

  /**
   * Atualiza um curso existente (Mock JSON -> Firestore updateDoc ready)
   */
  async updateCourse(id: number | string, courseData: Partial<Course>): Promise<Course | null> {
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
      });
      if (!res.ok) throw new Error('Falha ao atualizar curso');
      return await res.json();
    } catch (error) {
      console.error('CourseService.updateCourse error:', error);
      return null;
    }
  },

  /**
   * Exclui um curso (Mock JSON -> Firestore deleteDoc ready)
   */
  async deleteCourse(id: number | string): Promise<boolean> {
    try {
      const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch (error) {
      console.error('CourseService.deleteCourse error:', error);
      return false;
    }
  },

  /**
   * Restaura a lista de cursos original
   */
  async resetCourses(): Promise<boolean> {
    try {
      const res = await fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: 'courses' })
      });
      return res.ok;
    } catch (error) {
      console.error('CourseService.resetCourses error:', error);
      return false;
    }
  }
};
