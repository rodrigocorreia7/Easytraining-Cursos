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

async function withTimeout<T>(promise: Promise<T>, ms = 4000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('timeout')), ms);
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

  if (firebaseAdmin) {
    try {
      const { getAdminDb } = await import('@/lib/firebaseAdmin');
      const adminDb = getAdminDb();
      if (!adminDb) {
        firestore = 'missing';
      } else {
        await withTimeout(adminDb.collection('config').limit(1).get());
        firestore = 'ok';
      }
    } catch {
      firestore = 'error';
    }

    try {
      const { getAdminStorage } = await import('@/lib/firebaseAdmin');
      const adminStorage = getAdminStorage();
      if (!adminStorage) {
        storage = 'missing';
      } else {
        await withTimeout(adminStorage.bucket().getMetadata());
        storage = 'ok';
      }
    } catch {
      storage = 'error';
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
    },
    integrations: {
      n8nWebhook: n8nWebhookUrl.trim() ? 'ok' : 'missing',
    },
  });
}
