import { getApps, initializeApp, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';

import fs from 'fs';
import path from 'path';

function getServiceAccountFallback(): any {
  if (process.env.NODE_ENV !== 'development') return null;
  try {
    const possiblePaths = [
      path.join(process.cwd(), '..', 'SDKs', 'easytraining-cursos-firebase-adminsdk-fbsvc-f5bfc9402c.json'),
      path.join(process.cwd(), 'SDKs', 'easytraining-cursos-firebase-adminsdk-fbsvc-f5bfc9402c.json'),
    ];
    for (const p of possiblePaths) {
      if (fs.existsSync(/*turbopackIgnore: true*/ p)) {
        return JSON.parse(fs.readFileSync(/*turbopackIgnore: true*/ p, 'utf8'));
      }
    }
  } catch {
    // Ignore fallback errors in serverless/readonly environments
  }
  return null;
}

function normalizePrivateKey(raw: string | undefined): string {
  if (!raw) return '';
  let key = raw.trim();

  // Caso 1: JSON completo colado no valor da variável
  if (key.startsWith('{')) {
    try {
      const parsed = JSON.parse(key);
      if (parsed.private_key) {
        key = parsed.private_key.trim();
      }
    } catch {
      // Ignora erro de parse
    }
  }

  // Caso 2: Remove aspas externas simples ou duplas
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1).trim();
  }

  // Caso 3: Remove carriage returns do Windows (\r)
  key = key.replace(/\r/g, '');

  // Caso 4: Desfaz escapes múltiplos ou simples de \n
  key = key.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n');

  // Caso 5: Garante headers PEM com quebras de linha limpas
  if (key.includes('BEGIN PRIVATE KEY') && !key.includes('-----BEGIN PRIVATE KEY-----\n')) {
    key = key.replace(/-----BEGIN PRIVATE KEY-----[\s\r\n]*/, '-----BEGIN PRIVATE KEY-----\n');
  }
  if (key.includes('END PRIVATE KEY') && !key.includes('\n-----END PRIVATE KEY-----')) {
    key = key.replace(/[\s\r\n]*-----END PRIVATE KEY-----/, '\n-----END PRIVATE KEY-----');
  }

  if (!key.endsWith('\n')) {
    key = key + '\n';
  }

  return key;
}

function resolveCredentials() {
  const fallback = !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL
    ? getServiceAccountFallback()
    : null;

  const projectId = 
    process.env.FIREBASE_PROJECT_ID || 
    fallback?.project_id || 
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 
    'easytraining-cursos';

  const clientEmail = 
    process.env.FIREBASE_CLIENT_EMAIL || 
    fallback?.client_email || 
    '';

  const privateKeyRaw = 
    process.env.FIREBASE_PRIVATE_KEY || 
    fallback?.private_key || 
    '';

  const storageBucket = 
    process.env.FIREBASE_STORAGE_BUCKET || 
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 
    '';

  const privateKey = normalizePrivateKey(privateKeyRaw);

  return { projectId, clientEmail, privateKey, storageBucket };
}

let lastAdminInitError: string | null = null;
export function getAdminInitError(): string | null {
  return lastAdminInitError;
}

export function isFirebaseAdminConfigured(): boolean {
  const { projectId, clientEmail, privateKey } = resolveCredentials();
  const ok = Boolean(projectId && clientEmail && privateKey && privateKey.length > 20);
  if (!ok) {
    lastAdminInitError = `Config incompleta: projectId=${Boolean(projectId)}, email=${Boolean(clientEmail)}, key=${Boolean(privateKey)} (tam=${privateKey?.length || 0})`;
  }
  return ok;
}

let cachedApp: App | null = null;

export function getAdminApp(): App | null {
  if (!isFirebaseAdminConfigured()) {
    return null;
  }

  if (cachedApp) {
    return cachedApp;
  }

  const existingApps = getApps();
  if (existingApps.length > 0) {
    cachedApp = existingApps[0];
    return cachedApp;
  }

  const { projectId, clientEmail, privateKey, storageBucket } = resolveCredentials();

  try {
    cachedApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      ...(storageBucket ? { storageBucket } : {}),
    });
    lastAdminInitError = null;
    return cachedApp;
  } catch (err: any) {
    lastAdminInitError = `Erro no initializeApp: ${err?.message || String(err)}`;
    console.error('Erro ao inicializar Firebase Admin SDK com credenciais:', err.message);
    return null;
  }
}

let cachedDb: Firestore | null = null;
export function getAdminDb(): Firestore | null {
  if (cachedDb) return cachedDb;
  const app = getAdminApp();
  if (!app) return null;
  cachedDb = getFirestore(app);
  try {
    cachedDb.settings({ ignoreUndefinedProperties: true });
  } catch {
    // Ignore if settings already locked
  }
  return cachedDb;
}

let cachedAuth: any = null;
export async function getAdminAuth(): Promise<any> {
  if (cachedAuth) return cachedAuth;
  const app = getAdminApp();
  if (!app) return null;
  try {
    const { getAuth } = await import('firebase-admin/auth');
    cachedAuth = getAuth(app);
    return cachedAuth;
  } catch (err: any) {
    console.warn('firebase-admin/auth indisponível no ambiente runtime:', err?.message);
    return null;
  }
}

let cachedStorage: Storage | null = null;
export function getAdminStorage(): Storage | null {
  if (cachedStorage) return cachedStorage;
  const app = getAdminApp();
  if (!app) return null;
  cachedStorage = getStorage(app);
  return cachedStorage;
}

// Proxies inteligentes para compatibilidade com importações diretas:
// Se o Firebase Admin não estiver configurado, lançam erro síncrono capturável (evitando crash gRPC não-capturado)
export const adminDb: Firestore = new Proxy({} as Firestore, {
  get(_, prop) {
    const db = getAdminDb();
    if (!db) {
      throw new Error('Firebase Admin Firestore não configurado (adicione FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY).');
    }
    const val = (db as any)[prop];
    return typeof val === 'function' ? val.bind(db) : val;
  }
});

export const adminAuth: any = new Proxy({} as any, {
  get(_, prop) {
    return async (...args: any[]) => {
      const auth = await getAdminAuth();
      if (!auth) {
        throw new Error('Firebase Admin Auth não configurado ou indisponível.');
      }
      const val = (auth as any)[prop];
      return typeof val === 'function' ? val.apply(auth, args) : val;
    };
  }
});

export const adminStorage: Storage = new Proxy({} as Storage, {
  get(_, prop) {
    const storage = getAdminStorage();
    if (!storage) {
      throw new Error('Firebase Admin Storage não configurado (adicione FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY).');
    }
    const val = (storage as any)[prop];
    return typeof val === 'function' ? val.bind(storage) : val;
  }
});

export default getAdminApp;
