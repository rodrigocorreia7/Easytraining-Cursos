import { NextRequest, NextResponse } from 'next/server';
import { getCachedSiteConfigFromFirestore, getSiteConfigFromFirestore, saveSiteConfigToFirestore } from '@/lib/firestoreDb';
import { saveStoredSiteConfig } from '@/lib/db';
import { verifyAdminSession } from '@/lib/authServer';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  try {
    const auth = verifyAdminSession(request);

    // Se o usuário não for administrador autenticado, serve versão pública com cache de borda de 24h
    if (!auth.authorized) {
      const config = await getCachedSiteConfigFromFirestore();
      const { n8nWebhookUrl, ...publicConfig } = (config || {}) as Record<string, any>;
      return NextResponse.json(publicConfig, {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        },
      });
    }

    // Administrador autenticado recebe a versão fresca com webhook completo
    const config = await getSiteConfigFromFirestore();
    return NextResponse.json(config, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Erro ao buscar siteConfig:', error);
    return NextResponse.json({ error: 'Erro ao buscar configurações' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });
    }

    const body = await request.json();
    const currentConfig = await getSiteConfigFromFirestore();

    const updatedConfig = {
      ...currentConfig,
      ...body,
      address: {
        ...currentConfig.address,
        ...(body.address || {})
      },
      openingHours: {
        ...currentConfig.openingHours,
        ...(body.openingHours || {})
      },
      rating: {
        ...currentConfig.rating,
        ...(body.rating || {})
      },
      social: {
        ...currentConfig.social,
        ...(body.social || {})
      }
    };

    // Salva no Firestore
    await saveSiteConfigToFirestore(updatedConfig);

    // Sincroniza cache local
    saveStoredSiteConfig(updatedConfig);

    try {
      revalidatePath('/api/site-config');
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json(updatedConfig);
  } catch (error) {
    console.error('Erro ao atualizar siteConfig:', error);
    return NextResponse.json({ error: 'Erro ao salvar configurações' }, { status: 500 });
  }
}
