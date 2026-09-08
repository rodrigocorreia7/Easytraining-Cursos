import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/authServer';
import { isFirebaseAdminConfigured } from '@/lib/firebaseConfigHelper';
import { getStoredSiteConfig } from '@/lib/db';

type CheckStatus = 'ok' | 'missing' | 'error' | 'not_checked';

function checkEnv(name: string, minLength = 1): CheckStatus {
  return process.env[name]?.trim() && process.env[name]!.trim().length >= minLength
    ? 'ok'
    : 'missing';
}

async function withTimeout<T>(promise: Promise<T>, ms = 10000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Timeout após ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

export async function GET(request: NextRequest) {
  const auth = verifyAdminSession(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });
  }

  const firebaseAdmin = isFirebaseAdminConfigured();
  let firestore: CheckStatus = firebaseAdmin ? 'not_checked' : 'missing';
  let storage: CheckStatus = firebaseAdmin ? 'not_checked' : 'missing';
  let firestoreError: string | undefined;
  let storageError: string | undefined;

  if (firebaseAdmin) {
    try {
      const { getAdminDb, getAdminInitError } = await import('@/lib/firebaseAdmin');
      const adminDb = getAdminDb();
      if (!adminDb) {
        firestore = 'missing';
        firestoreError = getAdminInitError() || 'Firebase Admin não inicializou o banco Firestore.';
      } else {
        await withTimeout(adminDb.collection('config').limit(1).get(), 10000);
        firestore = 'ok';
      }
    } catch (err: any) {
      firestore = 'error';
      firestoreError = err?.message || 'Falha ao conectar com o Firestore';
    }

    try {
      const { getAdminStorage, getAdminInitError } = await import('@/lib/firebaseAdmin');
      const adminStorage = getAdminStorage();
      if (!adminStorage) {
        storage = 'missing';
        storageError = getAdminInitError() || 'Firebase Admin não inicializou o Storage.';
      } else {
        const bucket = adminStorage.bucket();
        await withTimeout(bucket.getMetadata(), 8000);
        storage = 'ok';
      }
    } catch (err: any) {
      if (err?.message?.includes('does not exist') || err?.code === 404) {
        storage = 'missing';
        storageError = 'Bucket Cloud Storage ainda não criado no Firebase Console (opcional para artigos/cursos).';
      } else {
        storage = 'error';
        storageError = err?.message || 'Falha ao acessar o Storage bucket';
      }
    }
  }

  const config = getStoredSiteConfig();
  const n8nWebhookUrl = (config as any)?.n8nWebhookUrl || process.env.N8N_WEBHOOK_URL || '';

  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    admin: {
      sessionSecret: checkEnv('ADMIN_SESSION_SECRET', 32),
      passwordLogin: checkEnv('ADMIN_PASSWORD', 8),
    },
    firebase: {
      adminSdk: firebaseAdmin ? 'ok' : 'missing',
      firestore,
      storage,
      ...(firestoreError ? { firestoreError } : {}),
      ...(storageError ? { storageError } : {}),
    },
    integrations: {
      n8nWebhook: n8nWebhookUrl.trim() ? 'ok' : 'missing',
    },
  });
}
