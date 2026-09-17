import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/authServer';
import { sendLeadWebhook } from '@/lib/leadsDb';

export async function POST(request: NextRequest) {
  const auth = verifyAdminSession(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });
  }

  const result = await sendLeadWebhook({
    event: 'teste_conexao',
    timestamp: new Date().toISOString(),
    origem: 'Painel EasyTraining CRM',
    mensagem: 'Disparo de teste bem-sucedido! Integração ativa.',
    leadExemplo: {
      nome: 'Aluno Teste',
      whatsapp: '(11) 2303-7983',
      curso: 'Auxiliar Veterinário',
      turno: 'Segunda a Sexta - Noite',
    },
  });

  if (result.status === 'not_configured') {
    return NextResponse.json(
      { error: 'Nenhum webhook de produção está salvo no Firestore ou na Vercel.' },
      { status: 400 }
    );
  }

  if (result.status === 'failed') {
    return NextResponse.json(
      {
        error: result.httpStatus
          ? `O n8n recusou o teste com status ${result.httpStatus}.`
          : 'Não foi possível conectar ao webhook do n8n.',
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true, message: 'O n8n recebeu o disparo de teste.' });
}
