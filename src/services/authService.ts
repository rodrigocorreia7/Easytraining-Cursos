import { AdminUser } from '../types';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut as fbSignOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

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

export const ALLOWED_ADMIN_EMAILS = [
  'raccorreia@gmail.com',
  'rac2digital@gmail.com',
  'admin@easytraining.com.br'
];

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

    const normalizedEmail = email.trim().toLowerCase();

    if (!ALLOWED_ADMIN_EMAILS.includes(normalizedEmail)) {
      return {
        success: false,
        error: 'Este e-mail não possui permissão de administrador no sistema.'
      };
    }

    // 2. Tenta autenticação real com Firebase Authentication
    try {
      const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
      const fbUser = userCredential.user;

      const adminUser: AdminUser = {
        id: fbUser.uid,
        email: fbUser.email || normalizedEmail,
        name: fbUser.displayName || (normalizedEmail.includes('rac') ? 'Rodrigo Correia' : 'Administrador EasyTraining'),
        role: 'admin'
      };

      this.resetLoginAttempts();

      if (typeof window !== 'undefined') {
        const sessionData: StoredSession = {
          user: adminUser,
          lastActive: Date.now()
        };
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(sessionData));

        const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = `admin_token=valid_session_token; path=/; max-age=7200; SameSite=Strict${secureFlag}`;
      }

      return { success: true, user: adminUser };
    } catch (fbErr: any) {
      // 3. Fallback de contingência para o superusuário local se ainda não cadastrado no Firebase
      if (normalizedEmail === 'admin@easytraining.com.br' && (pass === 'admin123' || pass === 'easytraining2026')) {
        this.resetLoginAttempts();

        if (typeof window !== 'undefined') {
          const sessionData: StoredSession = {
            user: MOCK_ADMIN,
            lastActive: Date.now()
          };
          localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(sessionData));

          const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
          document.cookie = `admin_token=valid_session_token; path=/; max-age=7200; SameSite=Strict${secureFlag}`;
        }
        return { success: true, user: MOCK_ADMIN };
      }

      // 4. Falha na autenticação -> registra tentativa de rate limiting
      const failureStatus = this.registerFailedAttempt();
      if (failureStatus.locked) {
        return {
          success: false,
          error: 'Limite de 5 tentativas atingido. Acesso bloqueado por 15 minutos por segurança.'
        };
      }

      let errorMsg = `Credenciais inválidas. Restam ${failureStatus.remaining} tentativa(s) antes do bloqueio temporário.`;
      if (fbErr?.code === 'auth/user-not-found' || fbErr?.code === 'auth/wrong-password' || fbErr?.code === 'auth/invalid-credential') {
        errorMsg = `E-mail ou senha incorretos no Firebase. Restam ${failureStatus.remaining} tentativa(s).`;
      } else if (fbErr?.code === 'auth/too-many-requests') {
        errorMsg = 'Acesso temporariamente bloqueado pelo Firebase por excesso de requisições.';
      }

      return {
        success: false,
        error: errorMsg
      };
    }
  },

  /**
   * Realiza login administrativo com a Conta Google (OAuth)
   */
  async loginWithGoogle(): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      const emailLower = (fbUser.email || '').toLowerCase();

      if (!ALLOWED_ADMIN_EMAILS.includes(emailLower)) {
        await fbSignOut(auth);
        return {
          success: false,
          error: `O e-mail Google (${emailLower}) não possui permissão de administrador no sistema.`
        };
      }

      const adminUser: AdminUser = {
        id: fbUser.uid,
        email: emailLower,
        name: fbUser.displayName || (emailLower.includes('rac') ? 'Rodrigo Correia' : 'Administrador EasyTraining'),
        role: 'admin'
      };

      this.resetLoginAttempts();

      if (typeof window !== 'undefined') {
        const sessionData: StoredSession = {
          user: adminUser,
          lastActive: Date.now()
        };
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(sessionData));

        const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = `admin_token=valid_session_token; path=/; max-age=7200; SameSite=Strict${secureFlag}`;
      }

      return { success: true, user: adminUser };
    } catch (error: any) {
      console.error('Erro no login com Google:', error);
      if (error?.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Janela do Google fechada antes de concluir o login.' };
      }
      return { success: false, error: error?.message || 'Falha ao autenticar com a conta Google.' };
    }
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
      try {
        fbSignOut(auth).catch(() => {});
      } catch (_) {}
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      sessionStorage.clear();
      document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
  }
};
