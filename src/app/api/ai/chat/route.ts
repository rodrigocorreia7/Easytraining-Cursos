import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { ai, GEMINI_MODEL } from '@/lib/gemini';
import { getCoursesFromFirestore } from '@/lib/firestoreDb';
import { getStoredSiteConfig } from '@/lib/db';
import { recordChatMessage } from '@/lib/aiMetrics';

function getGeneralInfoDoc(): string {
  try {
    const filePath = path.join(process.cwd(), 'info gerais.md');
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8');
    }
  } catch (err) {
    console.warn('Não foi possível ler info gerais.md:', err);
  }
  return '';
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mensagem inválida' }, { status: 400 });
    }

    const courses = await getCoursesFromFirestore();
    const config = getStoredSiteConfig();
    const extraInfo = getGeneralInfoDoc();

    const coursesSummary = courses.map(c => 
      `- ${c.title} (${c.category}): Carga de ${c.duration}. ${c.shortDescription} Módulos principais: ${c.modules.slice(0, 3).map(m => m.title).join(', ')}.`
    ).join('\n');

    const systemInstruction = `Você é o "Alex", consultor pedagógico e atendente virtual oficial da EasyTraining Formação Profissional em Guarulhos - SP (bairro Pimentas).
Sua missão é responder dúvidas dos alunos com extrema simpatia, acolhimento, precisão e incentivo ao aprendizado.

INFORMAÇÕES INSTITUCIONAIS DA ESCOLA:
- Nome: EasyTraining Formação Profissional
- Localização: ${config.address.street}, ${config.address.neighborhood} - Guarulhos/SP (coração do bairro Pimentas, próximo ao Terminal Pimentas e Shopping Bonsucesso). Há 16 anos no mesmo endereço!
- Telefone / WhatsApp: ${config.phone}
- Horários de funcionamento: Segunda a Sexta das 08h às 21h; Sábados das 08h às 17h; Turmas especiais aos domingos.
- Reputação impecável: Nota máxima no Google, sem registros no Reclame Aqui e sem processos no Procon. Mais de 1.000 alunos formados.
- Certificados: Profissionalizantes reconhecidos e válidos em todo o território nacional.
- Condições de Pagamento: À vista (Dinheiro/Pix), Cartão ou Boleto Bancário. NÃO faz consulta ao SPC/Serasa (mesmo com nome negativado, o aluno pode parcelar no boleto)!
- Requisitos: Para a maioria dos cursos e Auxiliar Veterinário a idade mínima é 15 anos (abaixo disso passa por entrevista pessoal para avaliar maturidade). Não há limite máximo de idade e NÃO exige escolaridade mínima.

BASE DE CONHECIMENTO ESPECÍFICA (DOCUMENTO OFICIAL DA ESCOLA):
${extraInfo}

GRADE GERAL DE CURSOS DA ESCOLA:
${coursesSummary}

DIRETRIZES DE RESPOSTA:
1. Responda em português brasileiro em tom acolhedor, profissional e amigável (2 a 3 parágrafos objetivos).
2. Use os dados exatos do documento oficial quando perguntarem de Auxiliar Veterinário (ex: 8 meses, 100h sendo 64h na escola e 36h de estágio prático em clínica/hospital parceiro; turmas aos domingos das 10h às 12h ou segundas das 19h às 21h; professora Andressa Lessa).
3. Se perguntarem sobre valores específicos da mensalidade ou bolsas, explique que há condições especiais e parcelamento no boleto sem consulta ao SPC/Serasa, convidando com carinho a clicar no botão do WhatsApp para a secretaria passar a simulação de valores.
4. No final da resposta, inclua obrigatoriamente uma linha com a tag [TOPIC: CategoriaDoTema], escolhendo uma destas:
   - Auxiliar Veterinário & Pet
   - Informática & Pacote Office
   - Valores, Bolsas & Matrículas
   - Aulas aos Sábados & Horários
   - Farmácia & Drogaria
   - Geral & Outros`;

    const prompt = `Pergunta do visitante: "${message}"`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.5
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
    const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(`Olá! Estava tirando dúvidas com o assistente do site sobre ${message.slice(0, 50)} e gostaria de falar com a equipe.`)}`;

    return NextResponse.json({
      reply: replyText,
      category: detectedCategory,
      whatsappUrl
    });
  } catch (error: any) {
    console.error('Erro no chatbot com Gemini:', error);
    return NextResponse.json({
      reply: 'Olá! Tivemos uma pequena oscilação na conexão agora, mas você pode tirar todas as suas dúvidas diretamente com nossa equipe no WhatsApp da EasyTraining pelo número (11) 2303-7983. Estamos à disposição!',
      whatsappUrl: 'https://wa.me/551123037983'
    });
  }
}
