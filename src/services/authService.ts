import { AdminUser } from '../types';

const ADMIN_STORAGE_KEY = 'easytraining_admin_session';
const LOGIN_ATTEMPTS_KEY = 'easytraining_login_attempts';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutos de bloqueio
const SESSION_MAX_INACTIVITY_MS = 2 * 60 * 60 * 1000; // 2 horas de expiração por inatividade

interface LoginAttemptRecord {
  attempts: number;
  lockedUntil: number | null;
}

interface StoredSession {
  user: AdminUser;
  lastActive: number;
}

const MOCK_ADMIN: AdminUser = {
  id: 'admin-01',
  email: 'admin@easytraining.com.br',
  name: 'Administrador EasyTraining',
  role: 'admin'
};

export const AuthService = {
  /**
   * Obtém o estado atual de tentativas de login e bloqueios por rate limiting
   */
  getLoginAttempts(): LoginAttemptRecord {
    if (typeof window === 'undefined') return { attempts: 0, lockedUntil: null };
    try {
      const stored = localStorage.getItem(LOGIN_ATTEMPTS_KEY);
      if (!stored) return { attempts: 0, lockedUntil: null };
      const record: LoginAttemptRecord = JSON.parse(stored);

      // Se o tempo de bloqueio já expirou, reseta o contador
      if (record.lockedUntil && Date.now() > record.lockedUntil) {
        this.resetLoginAttempts();
        return { attempts: 0, lockedUntil: null };
      }

      return record;
    } catch {
      return { attempts: 0, lockedUntil: null };
    }
  },

  /**
   * Registra uma tentativa de login falha
   */
  registerFailedAttempt(): { locked: boolean; remaining: number; lockedUntil?: number } {
    if (typeof window === 'undefined') return { locked: false, remaining: MAX_FAILED_ATTEMPTS };
    
    const record = this.getLoginAttempts();
    const newAttempts = record.attempts + 1;
    let lockedUntil = record.lockedUntil;

    if (newAttempts >= MAX_FAILED_ATTEMPTS) {
      lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
      localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify({
        attempts: newAttempts,
        lockedUntil
      }));
      return { locked: true, remaining: 0, lockedUntil };
    }

    localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify({
      attempts: newAttempts,
      lockedUntil: null
    }));

    return { locked: false, remaining: MAX_FAILED_ATTEMPTS - newAttempts };
  },

  /**
   * Reseta o histórico de tentativas de login após autenticação bem-sucedida
   */
  resetLoginAttempts(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOGIN_ATTEMPTS_KEY);
    }
  },

  /**
   * Realiza login do administrador com Rate Limiting e Gestão de Sessão Segura
   */
  async login(email: string, pass: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    // 1. Verifica Rate Limiting
    const attemptRecord = this.getLoginAttempts();
    if (attemptRecord.lockedUntil && Date.now() < attemptRecord.lockedUntil) {
      const remainingMinutes = Math.ceil((attemptRecord.lockedUntil - Date.now()) / (60 * 1000));
      return {
        success: false,
        error: `Acesso temporariamente bloqueado por excesso de tentativas. Tente novamente em ${remainingMinutes} minuto(s).`
      };
    }

    // Simula delay de rede contra ataques de temporização (timing attacks)
    await new Promise(r => setTimeout(r, 600));

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Credenciais de Administrador (Mock -> Firebase Auth ready)
    if (normalizedEmail === 'admin@easytraining.com.br' && (pass === 'admin123' || pass === 'easytraining2026')) {
      this.resetLoginAttempts();

      if (typeof window !== 'undefined') {
        const sessionData: StoredSession = {
          user: MOCK_ADMIN,
          lastActive: Date.now()
        };
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(sessionData));
        
        // Cookie seguro para proteção de transporte
        const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = `admin_token=valid_session_token; path=/; max-age=7200; SameSite=Strict${secureFlag}`;
      }
      return { success: true, user: MOCK_ADMIN };
    }

    // 3. Falha na autenticação -> registra tentativa
    const failureStatus = this.registerFailedAttempt();
    if (failureStatus.locked) {
      return {
        success: false,
        error: 'Limite de 5 tentativas atingido. Acesso bloqueado por 15 minutos por segurança.'
      };
    }

    return { 
      success: false, 
      error: `Credenciais inválidas. Restam ${failureStatus.remaining} tentativa(s) antes do bloqueio temporário.` 
    };
  },

  /**
   * Retorna o usuário logado atualmente validando a expiração por inatividade (2 horas)
   */
  getCurrentUser(): AdminUser | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (!stored) return null;

      const sessionData: StoredSession = JSON.parse(stored);
      const now = Date.now();

      // Expiração por inatividade (> 2 horas)
      if (now - sessionData.lastActive > SESSION_MAX_INACTIVITY_MS) {
        this.logout();
        return null;
      }

      // Atualiza timestamp de última atividade (keep-alive ativo)
      sessionData.lastActive = now;
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(sessionData));

      return sessionData.user;
    } catch {
      return null;
    }
  },

  /**
   * Verifica se há sessão ativa e válida
   */
  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  },

  /**
   * Encerra a sessão e limpa todos os dados sensíveis
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      sessionStorage.clear();
      document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
  }
};
