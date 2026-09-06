import { getApps, initializeApp, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getStorage, type Storage } from 'firebase-admin/storage';

const projectId = 
  process.env.FIREBASE_PROJECT_ID || 
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 
  'easytraining-cursos';

const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || '';
const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY || '';
const storageBucket = 
  process.env.FIREBASE_STORAGE_BUCKET || 
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 
  'easytraining-cursos.firebasestorage.app';

// Formatação segura de quebras de linha em chaves privadas PEM
const privateKey = privateKeyRaw ? privateKeyRaw.replace(/\\n/g, '\n') : '';

export function isFirebaseAdminConfigured(): boolean {
  return Boolean(projectId && clientEmail && privateKey);
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

  try {
    cachedApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket,
    });
    return cachedApp;
  } catch (err: any) {
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
  return cachedDb;
}

let cachedAuth: Auth | null = null;
export function getAdminAuth(): Auth | null {
  if (cachedAuth) return cachedAuth;
  const app = getAdminApp();
  if (!app) return null;
  cachedAuth = getAuth(app);
  return cachedAuth;
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

export const adminAuth: Auth = new Proxy({} as Auth, {
  get(_, prop) {
    const auth = getAdminAuth();
    if (!auth) {
      throw new Error('Firebase Admin Auth não configurado (adicione FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY).');
    }
    const val = (auth as any)[prop];
    return typeof val === 'function' ? val.bind(auth) : val;
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
