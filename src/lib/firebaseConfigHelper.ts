import fs from 'fs';
import path from 'path';

/**
 * Helper leve sem dependencias externas para verificar se as variaveis do
 * Firebase Admin SDK estao presentes no ambiente sem forcar a importacao de bibliotecas.
 */
export function isFirebaseAdminConfigured(): boolean {
  const hasEmail = Boolean(process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_CLIENT_EMAIL.trim().length > 0);
  const hasKey = Boolean(process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PRIVATE_KEY.trim().length > 20);

  if (hasEmail && hasKey) {
    return true;
  }

  if (process.env.NODE_ENV === 'development') {
    try {
      const possiblePaths = [
        path.join(process.cwd(), '..', 'SDKs', 'easytraining-cursos-firebase-adminsdk-fbsvc-f5bfc9402c.json'),
        path.join(process.cwd(), 'SDKs', 'easytraining-cursos-firebase-adminsdk-fbsvc-f5bfc9402c.json'),
      ];
      for (const p of possiblePaths) {
        if (fs.existsSync(/*turbopackIgnore: true*/ p)) return true;
      }
    } catch {
      // Ignore fallback errors in serverless
    }
  }

  return false;
}
