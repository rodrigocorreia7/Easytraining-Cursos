import { NextRequest, NextResponse } from 'next/server';
import { getLeadsFromDb, createLead, emptyTrash } from '@/lib/leadsDb';
import { sanitizeString, sanitizePhone, checkRateLimit, getClientIp } from '@/lib/security';
import { verifyAdminSession } from '@/lib/authServer';

export async function GET(request: NextRequest) {
  try {
    const auth = verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: 'Acesso não autorizado aos dados de leads.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const isTrash = searchParams.get('trash') === 'true';

    const leads = await getLeadsFromDb(isTrash);
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Erro seguro ao buscar leads:', error);
    return NextResponse.json({ error: 'Falha ao consultar contatos.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting Anti-Spam (Generoso: 30 envios a cada 10 minutos por IP)
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`lead_submit:${clientIp}`, 30, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Muitas tentativas em sequência. Por favor, aguarde alguns minutos ou fale direto no WhatsApp da escola.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // 2. Proteção Anti-Bot Honeypot (descarte silencioso para spammers)
    if (body.b_field || body.website_url || body.company_name) {
      return NextResponse.json(
        { id: `mock-${Date.now()}`, message: 'Contato recebido com sucesso.' },
        { status: 200 }
      );
    }

    // 3. Sanitização Rigorosa de Entrada (Anti-XSS & Anti-Injection)
    const rawName = sanitizeString(body.name, 100);
    const rawPhone = sanitizePhone(body.phone);
    const rawCourse = sanitizeString(body.courseInterest, 100) || 'Interesse Geral';
    const rawShift = sanitizeString(body.preferredShift, 50) || 'Segunda a Sexta - Noite';
    const rawNotes = sanitizeString(body.notes, 500);
    const rawSource = sanitizeString(body.source, 50) || 'Chatbot Izzy';

    if (!rawName || rawName.length < 2) {
      return NextResponse.json({ error: 'Por favor, informe seu nome completo.' }, { status: 400 });
    }

    const digitsOnly = rawPhone.replace(/\D/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 13) {
      return NextResponse.json({ error: 'Por favor, informe um número de WhatsApp válido com DDD.' }, { status: 400 });
    }

    const lead = await createLead({
      name: rawName,
      phone: rawPhone,
      email: sanitizeString(body.email, 120),
      courseInterest: rawCourse,
      preferredShift: rawShift,
      status: 'novo',
      source: rawSource,
      notes: rawNotes
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error('Erro seguro ao criar lead:', error);
    return NextResponse.json({ error: 'Não foi possível registrar seu contato no momento.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: 'Acesso não autorizado para esvaziar a lixeira.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    if (searchParams.get('emptyTrash') === 'true') {
      await emptyTrash();
      return NextResponse.json({ success: true, message: 'Lixeira esvaziada com sucesso.' });
    }
    return NextResponse.json({ error: 'Operação não permitida.' }, { status: 400 });
  } catch (error) {
    console.error('Erro seguro ao esvaziar lixeira:', error);
    return NextResponse.json({ error: 'Erro ao esvaziar lixeira.' }, { status: 500 });
  }
}
