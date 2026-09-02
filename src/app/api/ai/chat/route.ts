import { NextRequest, NextResponse } from 'next/server';
import { ai, GEMINI_MODEL } from '@/lib/gemini';
import { getCoursesFromFirestore } from '@/lib/firestoreDb';
import { getStoredSiteConfig } from '@/lib/db';
import { recordChatMessage } from '@/lib/aiMetrics';

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mensagem inválida' }, { status: 400 });
    }

    const courses = await getCoursesFromFirestore();
    const config = getStoredSiteConfig();

    const coursesSummary = courses.map(c => 
      `- ${c.title} (${c.category}): Carga de ${c.duration}. ${c.shortDescription} Módulos principais: ${c.modules.slice(0, 3).map(m => m.title).join(', ')}.`
    ).join('\n');

    const systemInstruction = `Você é o "Alex", consultor pedagógico e atendente virtual oficial da EasyTraining Formação Profissional em Guarulhos - SP.
Sua missão é responder dúvidas dos alunos com simpatia, clareza, incentivo e precisão.

INFORMAÇÕES DA ESCOLA:
- Nome: EasyTraining Formação Profissional
- Localização: ${config.address.street}, ${config.address.neighborhood} - Guarulhos/SP (próximo ao Terminal Pimentas e Shopping Bonsucesso).
- Telefone / WhatsApp: ${config.phone}
- Horários de funcionamento: Segunda a Sexta das 08h às 21h; Sábados das 08h às 17h.
- Certificados: Emitidos e válidos em todo o Brasil.
- Aulas: 100% práticas em laboratórios com computadores individuais e estrutura completa.

GRADE DE CURSOS DA ESCOLA:
${coursesSummary}

DIRETRIZES DE RESPOSTA:
1. Responda em português brasileiro de forma acolhedora, objetiva e encorajadora (máximo 2 a 3 parágrafos curtos).
2. Não invente cursos que a escola não oferece. Se perguntarem algo fora da grade, oriente com o curso mais próximo.
3. Para valores exatos e planos de bolsas, oriente que variam por turma e convide amigavelmente a falar no WhatsApp com a secretaria.
4. No final da resposta, inclua uma linha com a tag [TOPIC: CategoriaDoTema], onde CategoriaDoTema deve ser estritamente uma destas opções:
   - Informática & Pacote Office
   - Auxiliar Veterinário & Pet
   - Valores, Bolsas & Matrículas
   - Aulas aos Sábados & Horários
   - Farmácia & Drogaria
   - Geral & Outros`;

    const prompt = `Pergunta do aluno: "${message}"`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.6
      }
    });

    let replyText = response.text || 'Olá! Como posso te ajudar hoje na EasyTraining?';

    // Extract detected topic category
    let detectedCategory = 'Geral & Outros';
    const topicMatch = replyText.match(/\[TOPIC:\s*([^\]]+)\]/);
    if (topicMatch) {
      detectedCategory = topicMatch[1].trim();
      replyText = replyText.replace(/\[TOPIC:\s*[^\]]+\]/, '').trim();
    }

    // Record interaction in metrics
    try {
      await recordChatMessage(message, detectedCategory);
    } catch (_) {}

    const cleanPhone = config.whatsapp.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(`Olá! Estava tirando dúvidas no site sobre ${message.slice(0, 50)} e gostaria de mais informações.`)}`;

    return NextResponse.json({
      reply: replyText,
      category: detectedCategory,
      whatsappUrl
    });
  } catch (error: any) {
    console.error('Erro no chatbot com Gemini:', error);
    return NextResponse.json({
      reply: 'Olá! No momento nosso atendimento via inteligência artificial está temporariamente ocupado. Pode nos chamar diretamente no WhatsApp (11) 2303-7983 que nossa equipe te atende na hora!',
      whatsappUrl: 'https://wa.me/551123037983'
    });
  }
}
