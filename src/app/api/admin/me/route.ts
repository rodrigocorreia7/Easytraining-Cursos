import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/authServer';
import { checkFirestoreConnection } from '@/lib/firestoreDb';

export async function GET(request: NextRequest) {
  const auth = verifyAdminSession(request);
  if (!auth.authorized || !auth.user) {
    return NextResponse.json({ error: 'Sessão inválida ou expirada.' }, { status: 401 });
  }

  const firestore = await checkFirestoreConnection();

  return NextResponse.json({
    authenticated: true,
    user: auth.user,
    firestoreConnected: firestore.connected,
    ...(firestore.reason ? { firestoreReason: firestore.reason } : {}),
    ...(firestore.error ? { firestoreError: firestore.error } : {})
  });
}
