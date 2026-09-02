import { NextRequest, NextResponse } from 'next/server';
import { getSiteConfigFromFirestore, saveSiteConfigToFirestore } from '@/lib/firestoreDb';
import { getStoredSiteConfig, saveStoredSiteConfig } from '@/lib/db';

export async function GET() {
  try {
    const config = await getSiteConfigFromFirestore();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Erro ao buscar siteConfig:', error);
    return NextResponse.json({ error: 'Erro ao buscar configurações' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
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

    return NextResponse.json(updatedConfig);
  } catch (error) {
    console.error('Erro ao atualizar siteConfig:', error);
    return NextResponse.json({ error: 'Erro ao salvar configurações' }, { status: 500 });
  }
}
