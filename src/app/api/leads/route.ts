import { NextRequest, NextResponse } from 'next/server';
import { getLeadsFromDb, createLead } from '@/lib/leadsDb';

export async function GET() {
  try {
    const leads = await getLeadsFromDb();
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
