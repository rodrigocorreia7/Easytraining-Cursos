import { NextRequest, NextResponse } from 'next/server';
import { getStoredSiteConfig, saveStoredSiteConfig, resetStoredSiteConfig } from '@/lib/db';

export async function GET() {
  try {
    const config = getStoredSiteConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Erro ao buscar siteConfig:', error);
    return NextResponse.json({ error: 'Erro ao buscar configurações' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const currentConfig = getStoredSiteConfig();

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

    saveStoredSiteConfig(updatedConfig);
    return NextResponse.json(updatedConfig);
  } catch (error) {
    console.error('Erro ao atualizar siteConfig:', error);
    return NextResponse.json({ error: 'Erro ao salvar configurações' }, { status: 500 });
  }
}
