import { BlogPost } from '../types';
import { realBlogPosts } from '../data/blogPostsReal';

// Armazenamento em memória / local para simular banco de dados antes da conexão com Firestore
let inMemoryPosts: BlogPost[] = [...realBlogPosts];

export const BlogService = {
  /**
   * Retorna todos os posts do blog ordenados por data decrescente
   */
  async getAllPosts(): Promise<BlogPost[]> {
    return [...inMemoryPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  /**
   * Busca um post específico pelo seu slug exato
   */
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const cleanSlug = slug.replace(/^\/|\/$/g, '').toLowerCase();
    const found = inMemoryPosts.find(p => p.slug.toLowerCase() === cleanSlug);
    return found || null;
  },

  /**
   * Busca um post pelo seu ID numérico ou string
   */
  async getPostById(id: number | string): Promise<BlogPost | null> {
    const found = inMemoryPosts.find(p => String(p.id) === String(id));
    return found || null;
  },

  /**
   * Retorna posts relacionados com base na categoria
   */
  async getRelatedPosts(currentSlug: string, limit = 3): Promise<BlogPost[]> {
    const current = await this.getPostBySlug(currentSlug);
    return inMemoryPosts
      .filter(p => p.slug !== currentSlug && (!current || p.category === current.category))
      .slice(0, limit);
  },

  /**
   * Busca posts por termo de texto e categoria
   */
  async searchPosts(query: string, category?: string): Promise<BlogPost[]> {
    const q = query.toLowerCase().trim();
    return inMemoryPosts.filter(post => {
      const matchQuery = !q || 
        post.title.toLowerCase().includes(q) || 
        post.excerpt.toLowerCase().includes(q) ||
        (post.tags && post.tags.some(t => t.toLowerCase().includes(q)));
      
      const matchCat = !category || category === 'Todos' || post.category === category;
      return matchQuery && matchCat;
    });
  },

  /**
   * Cria um novo post (Mock -> Firestore addDoc ready)
   */
  async createPost(postData: Omit<BlogPost, 'id'>): Promise<BlogPost> {
    const newId = Date.now();
    const newPost: BlogPost = {
      ...postData,
      id: newId,
      slug: postData.slug || postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      date: postData.date || new Date().toISOString().split('T')[0],
      readTime: postData.readTime || '4 min',
      author: postData.author || 'EasyTraining Admin',
      authorRole: postData.authorRole || 'Redação EasyTraining',
      views: 0
    };

    inMemoryPosts.unshift(newPost);
    return newPost;
  },

  /**
   * Atualiza um post existente (Mock -> Firestore updateDoc ready)
   */
  async updatePost(id: number | string, postData: Partial<BlogPost>): Promise<BlogPost | null> {
    const index = inMemoryPosts.findIndex(p => String(p.id) === String(id));
    if (index === -1) return null;

    inMemoryPosts[index] = {
      ...inMemoryPosts[index],
      ...postData
    };

    return inMemoryPosts[index];
  },

  /**
   * Exclui um post (Mock -> Firestore deleteDoc ready)
   */
  async deletePost(id: number | string): Promise<boolean> {
    const initialLen = inMemoryPosts.length;
    inMemoryPosts = inMemoryPosts.filter(p => String(p.id) !== String(id));
    return inMemoryPosts.length < initialLen;
  }
};
