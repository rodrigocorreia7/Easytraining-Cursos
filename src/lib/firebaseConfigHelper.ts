/**
 * Helper leve sem dependencias externas para verificar se as variaveis do
 * Firebase Admin SDK estao presentes no ambiente sem forcar a importacao de bibliotecas.
 */
export function isFirebaseAdminConfigured(): boolean {
  const hasProject = Boolean(
    process.env.FIREBASE_PROJECT_ID || 
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 
    'easytraining-cursos'
  );
  const hasEmail = Boolean(process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_CLIENT_EMAIL.trim().length > 0);
  const hasKey = Boolean(process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PRIVATE_KEY.trim().length > 20);

  return hasProject && hasEmail && hasKey;
}
