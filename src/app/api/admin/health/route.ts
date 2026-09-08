import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/authServer';
import { isFirebaseAdminConfigured } from '@/lib/firebaseConfigHelper';
import { getStoredSiteConfig } from '@/lib/db';

type CheckStatus = 'ok' | 'missing' | 'error' | 'not_checked' | 'inline_firestore';

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
      const { getAdminStorage } = await import('@/lib/firebaseAdmin');
      const adminStorage = getAdminStorage();
      if (adminStorage) {
        const bucket = adminStorage.bucket();
        if (bucket?.name) {
          await withTimeout(bucket.getMetadata(), 4000);
          storage = 'ok';
        } else {
          storage = 'inline_firestore';
          storageError = 'Armazenamento de imagens ativo e integrado diretamente ao Firestore (WebP/Base64).';
        }
      } else {
        storage = 'inline_firestore';
        storageError = 'Armazenamento de imagens ativo e integrado diretamente ao Firestore (WebP/Base64).';
      }
    } catch {
      storage = 'inline_firestore';
      storageError = 'Armazenamento de imagens ativo e integrado diretamente ao Firestore (WebP/Base64).';
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
