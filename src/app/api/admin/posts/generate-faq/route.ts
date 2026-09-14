import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/authServer';
import { ai, GEMINI_MODEL, GEMINI_FALLBACK_MODEL } from '@/lib/gemini';
import { FaqItem } from '@/types';

function cleanGeneratedFaqs(value: unknown): FaqItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(item => item && typeof item.question === 'string' && typeof item.answer === 'string')
    .map(item => ({
      question: item.question.trim().slice(0, 240),
      answer: item.answer.trim().slice(0, 1200),
    }))
    .filter(item => item.question && item.answer)
    .slice(0, 6);
}

export async function POST(request: NextRequest) {
  const auth = verifyAdminSession(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const title = typeof body.title === 'string' ? body.title.trim().slice(0, 255) : '';
    const category = typeof body.category === 'string' ? body.category.trim().slice(0, 80) : 'Mercado de Trabalho';
    const excerpt = typeof body.excerpt === 'string' ? body.excerpt.trim().slice(0, 1000) : '';
    const contentHtml = typeof body.contentHtml === 'string' ? body.contentHtml.slice(0, 12000) : '';

    if (!title) {
      return NextResponse.json({ error: 'Título do artigo é obrigatório.' }, { status: 400 });
    }

    const plainContent = contentHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const prompt = `
Você é especialista em conteúdo educacional e SEO para o blog da EasyTraining, escola de cursos profissionalizantes em Guarulhos - SP.

Crie exatamente 4 ou 5 perguntas frequentes úteis para o artigo abaixo.
- Título: ${title}
- Categoria: ${category}
- Resumo: ${excerpt}
- Conteúdo: ${plainContent}

Regras obrigatórias:
1. As perguntas devem refletir dúvidas reais de leitores sobre o tema, sem inventar preços, datas, certificados ou promessas que não estejam no texto.
2. As respostas devem ser claras, acolhedoras e objetivas, com 2 a 4 frases cada.
3. Evite repetir o título e não use perguntas genéricas que não tenham relação com o artigo.
4. Retorne APENAS um array JSON puro com as propriedades "question" e "answer".

Formato:
[
  { "question": "Pergunta?", "answer": "Resposta." }
]
`;

    let responseText = '';
    try {
      const response = await ai.models.generateContent({ model: GEMINI_MODEL, contents: prompt });
      responseText = response.text || '';
    } catch (primaryError: any) {
      console.warn(`Erro no modelo primário (${GEMINI_MODEL}), tentando fallback (${GEMINI_FALLBACK_MODEL}):`, primaryError?.message);
      const fallbackResponse = await ai.models.generateContent({ model: GEMINI_FALLBACK_MODEL, contents: prompt });
      responseText = fallbackResponse.text || '';
    }

    const cleanedJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    let faqs: FaqItem[];
    try {
      faqs = cleanGeneratedFaqs(JSON.parse(cleanedJson));
    } catch {
      console.error('Falha ao interpretar JSON da resposta do Gemini para FAQ de artigo:', responseText);
      return NextResponse.json({ error: 'Não foi possível formatar as perguntas geradas. Tente novamente.' }, { status: 502 });
    }

    if (faqs.length === 0) {
      return NextResponse.json({ error: 'A IA não retornou perguntas válidas para este artigo.' }, { status: 502 });
    }

    return NextResponse.json({ faqs });
  } catch (error: any) {
    console.error('Erro na rota de geração de FAQ para artigo:', error);
    return NextResponse.json({ error: error?.message || 'Erro interno ao gerar FAQs com IA.' }, { status: 500 });
  }
}
