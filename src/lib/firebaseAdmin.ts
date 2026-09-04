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

let adminApp: App;

export function isFirebaseAdminConfigured(): boolean {
  return Boolean(projectId && clientEmail && privateKey);
}

if (getApps().length === 0) {
  if (clientEmail && privateKey) {
    try {
      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket,
      });
    } catch (err: any) {
      console.error('Erro ao inicializar Firebase Admin SDK com credenciais:', err.message);
      adminApp = initializeApp({ projectId, storageBucket });
    }
  } else {
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build') {
      console.warn('⚠️ AVISO: Credenciais do Firebase Admin SDK ausentes (FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY).');
    }
    adminApp = initializeApp({ projectId, storageBucket });
  }
} else {
  adminApp = getApps()[0];
}

export const adminDb: Firestore = getFirestore(adminApp);
export const adminAuth: Auth = getAuth(adminApp);
export const adminStorage: Storage = getStorage(adminApp);

export default adminApp;
