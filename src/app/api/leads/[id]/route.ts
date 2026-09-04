import { NextRequest, NextResponse } from 'next/server';
import { updateLeadStatus, trashLead, restoreLead, permanentDeleteLead } from '@/lib/leadsDb';
import { sanitizeString } from '@/lib/security';
import { verifyAdminSession } from '@/lib/authServer';

function isValidId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{3,64}$/.test(id);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });
    }

    const { id } = await params;
    if (!isValidId(id)) {
      return NextResponse.json({ error: 'Identificador inválido.' }, { status: 400 });
    }

    const body = await request.json();

    if (body.action === 'restore') {
      const restored = await restoreLead(id);
      if (!restored) {
        return NextResponse.json({ error: 'Lead não encontrado.' }, { status: 404 });
      }
      return NextResponse.json(restored);
    }

    const { status, notes } = body;
    const cleanNotes = notes !== undefined ? sanitizeString(notes, 500) : undefined;

    const validStatuses = new Set(['novo', 'contato', 'visita', 'matriculado', 'perdido']);
    if (status && !validStatuses.has(status)) {
      return NextResponse.json({ error: 'Status informado é inválido.' }, { status: 400 });
    }

    const updated = await updateLeadStatus(id, status, cleanNotes);
    if (!updated) {
      return NextResponse.json({ error: 'Lead não encontrado.' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Erro seguro em PUT leads/[id]:', error);
    return NextResponse.json({ error: 'Falha ao atualizar contato.' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });
    }

    const { id } = await params;
    if (!isValidId(id)) {
      return NextResponse.json({ error: 'Identificador inválido.' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const isPermanent = searchParams.get('permanent') === 'true';

    if (isPermanent) {
      await permanentDeleteLead(id);
      return NextResponse.json({ success: true, permanent: true });
    }

    await trashLead(id);
    return NextResponse.json({ success: true, trashed: true });
  } catch (error) {
    console.error('Erro seguro em DELETE leads/[id]:', error);
    return NextResponse.json({ error: 'Falha ao excluir contato.' }, { status: 500 });
  }
}
