import { NextRequest, NextResponse } from 'next/server';
import { getLeadsFromDb, createLead, emptyTrash } from '@/lib/leadsDb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isTrash = searchParams.get('trash') === 'true';

    const leads = await getLeadsFromDb(isTrash);
    return NextResponse.json(leads);
  } catch (error: any) {
    console.error('Erro ao buscar leads:', error);
    return NextResponse.json({ error: 'Erro ao listar leads' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.phone) {
      return NextResponse.json({ error: 'Nome e WhatsApp são obrigatórios' }, { status: 400 });
    }

    const lead = await createLead({
      name: body.name,
      phone: body.phone,
      email: body.email || '',
      courseInterest: body.courseInterest || 'Interesse Geral',
      preferredShift: body.preferredShift || 'Qualquer',
      status: 'novo',
      source: body.source || 'Chatbot Izzy',
      notes: body.notes || ''
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar lead:', error);
    return NextResponse.json({ error: 'Erro ao registrar contato' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    if (searchParams.get('emptyTrash') === 'true') {
      await emptyTrash();
      return NextResponse.json({ success: true, message: 'Lixeira esvaziada com sucesso' });
    }
    return NextResponse.json({ error: 'Operação não permitida' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao esvaziar lixeira' }, { status: 500 });
  }
}
