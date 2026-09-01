import { BlogPost } from '../types';

export const BlogService = {
  /**
   * Retorna todos os posts do blog ordenados por data decrescente
   */
  async getAllPosts(): Promise<BlogPost[]> {
    try {
      const res = await fetch('/api/posts', { cache: 'no-store' });
      if (!res.ok) throw new Error('Falha ao buscar posts');
      return await res.json();
    } catch (error) {
      console.error('BlogService.getAllPosts error:', error);
      return [];
    }
  },

  /**
   * Busca um post específico pelo seu slug exato
   */
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const cleanSlug = slug.replace(/^\/|\/$/g, '').toLowerCase();
      const res = await fetch(`/api/posts?slug=${encodeURIComponent(cleanSlug)}`, { cache: 'no-store' });
      if (!res.ok) return null;
      return await res.json();
    } catch (error) {
      console.error('BlogService.getPostBySlug error:', error);
      return null;
    }
  },

  /**
   * Busca um post pelo seu ID numérico ou string
   */
  async getPostById(id: number | string): Promise<BlogPost | null> {
    try {
      const res = await fetch(`/api/posts/${id}`, { cache: 'no-store' });
      if (!res.ok) return null;
      return await res.json();
    } catch (error) {
      console.error('BlogService.getPostById error:', error);
      return null;
    }
  },

  /**
   * Retorna posts relacionados com base na categoria
   */
  async getRelatedPosts(currentSlug: string, limit = 3): Promise<BlogPost[]> {
    try {
      const all = await this.getAllPosts();
      const current = all.find(p => p.slug.toLowerCase() === currentSlug.replace(/^\/|\/$/g, '').toLowerCase());
      return all
        .filter(p => p.slug !== currentSlug && (!current || p.category === current.category))
        .slice(0, limit);
    } catch (error) {
      console.error('BlogService.getRelatedPosts error:', error);
      return [];
    }
  },

  /**
   * Busca posts por termo de texto e categoria
   */
  async searchPosts(query: string, category?: string): Promise<BlogPost[]> {
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (category && category !== 'Todos') params.set('category', category);
      
      const res = await fetch(`/api/posts?${params.toString()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Falha na busca de posts');
      return await res.json();
    } catch (error) {
      console.error('BlogService.searchPosts error:', error);
      return [];
    }
  },

  /**
   * Cria um novo post (Mock JSON -> Firestore addDoc ready)
   */
  async createPost(postData: Omit<BlogPost, 'id'>): Promise<BlogPost | null> {
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      if (!res.ok) throw new Error('Falha ao criar post');
      return await res.json();
    } catch (error) {
      console.error('BlogService.createPost error:', error);
      return null;
    }
  },

  /**
   * Atualiza um post existente (Mock JSON -> Firestore updateDoc ready)
   */
  async updatePost(id: number | string, postData: Partial<BlogPost>): Promise<BlogPost | null> {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      if (!res.ok) throw new Error('Falha ao atualizar post');
      return await res.json();
    } catch (error) {
      console.error('BlogService.updatePost error:', error);
      return null;
    }
  },

  /**
   * Exclui um post (Mock JSON -> Firestore deleteDoc ready)
   */
  async deletePost(id: number | string): Promise<boolean> {
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch (error) {
      console.error('BlogService.deletePost error:', error);
      return false;
    }
  },

  /**
   * Restaura a lista de posts original
   */
  async resetPosts(): Promise<boolean> {
    try {
      const res = await fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: 'posts' })
      });
      return res.ok;
    } catch (error) {
      console.error('BlogService.resetPosts error:', error);
      return false;
    }
  }
};
