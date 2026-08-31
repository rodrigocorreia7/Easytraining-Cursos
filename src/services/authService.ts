import { AdminUser } from '../types';

const ADMIN_STORAGE_KEY = 'easytraining_admin_session';

const MOCK_ADMIN: AdminUser = {
  id: 'admin-01',
  email: 'admin@easytraining.com.br',
  name: 'Administrador EasyTraining',
  role: 'admin'
};

export const AuthService = {
  /**
   * Realiza login do administrador (Mock -> Firebase signInWithEmailAndPassword ready)
   */
  async login(email: string, pass: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    // Simula delay de rede
    await new Promise(r => setTimeout(r, 400));

    // Credenciais mockadas de desenvolvimento
    if (email === 'admin@easytraining.com.br' && (pass === 'admin123' || pass === 'easytraining2026')) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(MOCK_ADMIN));
        // Definir cookie para middleware Next.js se necessário
        document.cookie = `admin_token=mock_valid_token; path=/; max-age=86400; SameSite=Lax`;
      }
      return { success: true, user: MOCK_ADMIN };
    }

    return { 
      success: false, 
      error: 'Credenciais inválidas. Use admin@easytraining.com.br e senha admin123 para o modo de desenvolvimento.' 
    };
  },

  /**
   * Retorna o usuário logado atualmente
   */
  getCurrentUser(): AdminUser | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  /**
   * Verifica se há sessão ativa
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!this.getCurrentUser();
  },

  /**
   * Encerra a sessão
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      window.location.href = '/admin/login';
    }
  }
};
