import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/authServer';
import { ai, GEMINI_MODEL, GEMINI_FALLBACK_MODEL } from '@/lib/gemini';
import { FaqItem } from '@/types';

export async function POST(request: NextRequest) {
  const auth = verifyAdminSession(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, category, shortDescription, fullDescription, modules, targetAudience } = body;

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Título do curso é obrigatório.' }, { status: 400 });
    }

    const modulesSummary = Array.isArray(modules)
      ? modules.map((m: any, i: number) => `Módulo ${i + 1}: ${m.title || ''} (${(m.topics || []).join(', ')})`).join('\n')
      : '';

    const prompt = `
Você é o Diretor Pedagógico e Especialista em SEO Educacional da "EasyTraining Formação Profissional", escola de cursos profissionalizantes e informática localizada na Av. Jurema, 814 - Parque Jurema, Guarulhos - SP (região dos Pimentas).

Gere exatamente entre 4 e 5 Perguntas Frequentes (FAQs) estratégicas para a página do seguinte curso:
- Nome do Curso: ${title}
- Categoria: ${category || 'Profissionalizante'}
- Público-Alvo: ${targetAudience || 'Iniciantes, jovens em busca do primeiro emprego, adultos em transição de carreira'}
- Descrição Curta: ${shortDescription || ''}
- Descrição Detalhada: ${fullDescription || ''}
- Grade Curricular / Módulos:
${modulesSummary || 'Conteúdo prático e atualizado'}

Critérios e Diretrizes Obrigatórias:
1. Responda a objeções reais de alunos e interessados em Guarulhos e região:
   - Pré-requisitos ou idade mínima (se precisa de ensino médio ou conhecimento anterior).
   - Metodologia: enfatizar que as aulas são presenciais, 100% práticas, em laboratórios equipados.
   - Mercado de trabalho e empregabilidade: onde o profissional pode atuar na região (Guarulhos, São Paulo, Grande SP).
   - Certificado: reforçar que o certificado é válido em todo o território nacional.
   - Flexibilidade de horários: turmas de manhã, tarde, noite e opções aos sábados.
2. Tom de voz: Profissional, acolhedor, transparente, persuasivo e focado em conversão.
3. As respostas devem ter entre 2 e 4 frases claras e completas (de 40 a 90 palavras cada).
4. Retorne APENAS um array JSON puro de objetos com as propriedades "question" e "answer", sem formatação markdown ou explicações fora do JSON.

Formato esperado:
[
  {
    "question": "Pergunta estratégica 1?",
    "answer": "Resposta completa e orientada a conversão 1."
  }
]
`;

    let responseText = '';
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });
      responseText = response.text || '';
    } catch (primaryErr: any) {
      console.warn(`Erro no modelo primário (${GEMINI_MODEL}), tentando fallback (${GEMINI_FALLBACK_MODEL}):`, primaryErr?.message);
      const fallbackResponse = await ai.models.generateContent({
        model: GEMINI_FALLBACK_MODEL,
        contents: prompt,
      });
      responseText = fallbackResponse.text || '';
    }

    // Extrair JSON puro mesmo se vier encapsulado em ```json ... ```
    const cleanedJson = responseText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    let faqs: FaqItem[] = [];
    try {
      const parsed = JSON.parse(cleanedJson);
      if (Array.isArray(parsed)) {
        faqs = parsed
          .filter(item => item && typeof item.question === 'string' && typeof item.answer === 'string')
          .map(item => ({
            question: item.question.trim(),
            answer: item.answer.trim(),
          }));
      }
    } catch (parseErr) {
      console.error('Falha ao interpretar JSON da resposta do Gemini:', responseText);
      return NextResponse.json(
        { error: 'Não foi possível formatar as perguntas geradas. Tente novamente.' },
        { status: 502 }
      );
    }

    if (faqs.length === 0) {
      return NextResponse.json(
        { error: 'A IA não retornou perguntas válidas para este curso.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ faqs });
  } catch (error: any) {
    console.error('Erro na rota generate-faq:', error);
    return NextResponse.json(
      { error: error?.message || 'Erro interno ao gerar FAQs com IA.' },
      { status: 500 }
    );
  }
}
