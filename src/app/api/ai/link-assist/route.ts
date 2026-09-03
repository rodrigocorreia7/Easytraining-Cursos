import { NextRequest, NextResponse } from 'next/server';
import { ai, GEMINI_MODEL, GEMINI_FALLBACK_MODEL } from '@/lib/gemini';
import { sanitizeString } from '@/lib/security';
import { getStoredCourses } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { contentHtml, category } = await request.json();
    if (!contentHtml || typeof contentHtml !== 'string') {
      return NextResponse.json(
        { error: 'O conteúdo HTML do artigo é obrigatório para otimização de links.' }, 
        { status: 400 }
      );
    }

    if (contentHtml.trim().length < 50) {
      return NextResponse.json(
        { error: 'O texto é muito curto para aplicar linkagem interna de SEO.' },
        { status: 400 }
      );
    }

    // Catálogo de Cursos da Escola
    const courses = getStoredCourses();
    const courseListText = courses
      .map(c => `- Curso: "${c.title}" | Categoria: "${c.category}" | URL: "/curso/${c.slug}"`)
      .join('\n');

    const cleanCategory = sanitizeString(category || 'Geral', 60);

    const systemInstruction = `Você é o especialista sênior de SEO On-Page da EasyTraining (escola de cursos profissionalizantes em Guarulhos - Pimentas).
Sua missão é enriquecer um artigo de blog existente inserindo links internos semânticos estratégicos para transferir Page Authority (Link Juice) e aumentar a conversão de matrículas da escola.

DIRETRIZES ESTRITAS:
1. Mantenha 100% da estrutura, do tom e do texto original do artigo. NÃO resuma, não apague seções e não altere o significado do conteúdo.
2. Identifique termos ou frases-chave ideais no meio dos parágrafos (<p>) e transforme-os em textos-âncora semânticos apontando para os cursos mais pertinentes do catálogo abaixo usando:
   <a href="/curso/[slug]" title="[Nome do Curso] em Guarulhos - EasyTraining">[Texto-âncora natural]</a>
3. Insira entre 2 a 4 links internos no total ao longo de todo o artigo. NUNCA coloque dois links para a mesma URL.
4. Se o artigo não contiver um link de fechamento convidando o leitor a entrar em contato ou agendar visita, insira no último parágrafo um convite natural apontando para <a href="/#contato" title="Fale com a secretaria da EasyTraining">agendar uma visita na EasyTraining</a>.
5. NUNCA use textos-âncora genéricos como "clique aqui", "saiba mais", "acesse o link".
6. JAMAIS insira links externos (fora de easytraining.com.br) e NUNCA gere tags <script> ou atributos maliciosos.

CATÁLOGO REAL DE CURSOS DISPONÍVEIS:
${courseListText}

Retorne EXCLUSIVAMENTE um objeto JSON válido (sem tags markdown):
{
  "optimizedHtml": "HTML completo com os links internos inseridos...",
  "linksAdded": 3,
  "summary": ["Adicionado link para /curso/auxiliar-veterinario no parágrafo 2", "Adicionado link para /#contato na conclusão"]
}`;

    const prompt = `Analise o conteúdo HTML do artigo abaixo (categoria: ${cleanCategory}) e insira de 2 a 4 links internos estratégicos para os cursos da escola e fechamento para contato:

${contentHtml}`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.3
        }
      });
    } catch (err) {
      console.warn('Fallback para modelo secundário em link-assist:', err);
      response = await ai.models.generateContent({
        model: GEMINI_FALLBACK_MODEL,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.3
        }
      });
    }

    const text = response.text || '{}';
    const result = JSON.parse(text);

    let cleanHtml = result.optimizedHtml || contentHtml;
    cleanHtml = cleanHtml
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:[^"]*/gi, '');

    return NextResponse.json({
      optimizedHtml: cleanHtml,
      linksAdded: Number(result.linksAdded) || 2,
      summary: Array.isArray(result.summary) ? result.summary : []
    });
  } catch (error) {
    console.error('Erro no assistente de linkagem interna:', error);
    return NextResponse.json(
      { error: 'Não foi possível otimizar os links no momento. Tente novamente mais tarde.' }, 
      { status: 500 }
    );
  }
}
