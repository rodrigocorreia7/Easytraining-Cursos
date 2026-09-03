import { NextRequest, NextResponse } from 'next/server';
import { ai, GEMINI_MODEL, GEMINI_FALLBACK_MODEL } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { topic, category } = await request.json();
    if (!topic || typeof topic !== 'string') {
      return NextResponse.json({ error: 'O tema do artigo é obrigatório.' }, { status: 400 });
    }

    const systemInstruction = `Você é o redator sênior especialista em SEO e educação profissional da EasyTraining, escola tradicional com 16 anos no mesmo endereço no bairro Pimentas em Guarulhos - SP, com mais de 1.000 alunos formados, reputação impecável (nota máxima no Google, sem registros no Reclame Aqui nem Procon) e metodologia 100% prática com facilidade de pagamento no boleto sem consulta ao SPC/Serasa.
Sua missão é criar um artigo de blog informativo, prático, estruturado e otimizado para o Google.
O tom é positivo, profissional e focado em empregabilidade real.

Retorne EXCLUSIVAMENTE um objeto JSON válido (sem tags markdown de bloco de código) com o seguinte formato:
{
  "title": "Título cativante e forte para SEO",
  "slug": "slug-otimizado-em-letras-minusculas-com-hifens",
  "excerpt": "Resumo envolvente de 2 a 3 linhas",
  "category": "Tecnologia & Informática | Saúde & Pet | Saúde & Farmácia | Gestão & Negócios | Primeiro Emprego & Carreira | Mercado de Trabalho",
  "readTime": "5 min",
  "tags": ["Tag 1", "Tag 2", "Tag 3"],
  "contentHtml": "<p>Introdução impactante...</p><h2>Subtítulo Relevante</h2><p>Conteúdo explicativo rico com exemplos práticos...</p><ul><li>Dica importante</li><li>Outro diferencial</li></ul><h2>Como se destacar no mercado</h2><p>Dicas práticas e menção aos cursos práticos da EasyTraining...</p>"
}`;

    const prompt = `Escreva um artigo de blog de alta qualidade sobre: "${topic}".
Categoria de preferência: ${category || 'Mercado de Trabalho'}.
O artigo deve ter pelo menos 4 seções com <h2>, formatação HTML limpa (<p>, <ul>, <li>, <strong>), dicas práticas de carreira e um incentivo final para quem busca qualificação em Guarulhos.`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7
        }
      });
    } catch (err) {
      console.warn('Fallback para modelo secundário em generate-post:', err);
      response = await ai.models.generateContent({
        model: GEMINI_FALLBACK_MODEL,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7
        }
      });
    }

    const text = response.text || '{}';
    const postData = JSON.parse(text);

    try {
      const { recordArticleGenerated } = await import('@/lib/aiMetrics');
      await recordArticleGenerated();
    } catch (_) {}

    return NextResponse.json(postData);
  } catch (error: any) {
    console.error('Erro na geração com Gemini:', error);
    return NextResponse.json({ error: error?.message || 'Falha ao gerar artigo com IA' }, { status: 500 });
  }
}
