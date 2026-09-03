import { NextRequest, NextResponse } from 'next/server';
import { updateLeadStatus, trashLead, restoreLead, permanentDeleteLead } from '@/lib/leadsDb';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Se a ação for restaurar da lixeira
    if (body.action === 'restore') {
      const restored = await restoreLead(id);
      if (!restored) {
        return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 });
      }
      return NextResponse.json(restored);
    }

    const { status, notes } = body;
    const updated = await updateLeadStatus(id, status, notes);
    if (!updated) {
      return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao atualizar lead' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const isPermanent = searchParams.get('permanent') === 'true';

    if (isPermanent) {
      // Exclusão definitiva do Firestore e local
      await permanentDeleteLead(id);
      return NextResponse.json({ success: true, permanent: true });
    }

    // Soft delete: move para a lixeira
    await trashLead(id);
    return NextResponse.json({ success: true, trashed: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao excluir lead' }, { status: 500 });
  }
}
