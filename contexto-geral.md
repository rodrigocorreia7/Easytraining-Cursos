# Contexto Geral do Projeto: EasyTraining - Cursos Profissionalizantes

Este documento consolida todo o histórico, arquitetura, padrões visuais, estrutura de código, painel de controle (CMS), inteligência artificial, CRM, integrações e decisões técnicas implementadas no projeto do novo site da **EasyTraining** em Guarulhos-SP. Ao iniciar uma nova sessão, este arquivo serve como guia mestre de continuidade.

---

## 1. Visão Geral do Projeto
- **Cliente**: EasyTraining - Formação Profissional (Guarulhos / Pimentas - SP).
- **Objetivo**: Substituição e modernização completa do site WordPress antigo por uma aplicação **Next.js (App Router)** ultra-rápida, com SSR/SSG nativo para indexação máxima no Google, preservação de 100% dos backlinks de artigos, alto padrão de animações (*Awwwards / Motion Canônico*), **Painel Administrativo Dinâmico (CMS)**, **Atendente Virtual com IA Generativa (Izzy)** e **Mini-CRM Kanban para Gestão de Leads e Matrículas**.
- **Stack Tecnológica**:
  - **Framework Principal**: Next.js 16 (App Router, Turbopack, SSR/SSG nativo)
  - **Linguagem & Tipagem**: React 19 + TypeScript
  - **Estilização**: Tailwind CSS v4
  - **Animações**: Framer Motion / Motion React & GSAP 3
  - **Shaders & 3D**: OGL (WebGL Shaders para efeitos fluidos e Aurora)
  - **Ícones**: Lucide React
  - **Canvas 2D**: Sequência de 71 frames acelerada por GPU para o Robô da Hero
  - **Banco de Dados em Nuvem**: Google Cloud Firestore (Firebase v12) com cache local resiliente e fallback automático
  - **Inteligência Artificial**: Google Gemini API (`gemini-3.6-flash` / `gemini-2.5-flash`) via SDK `@google/genai`
  - **CRM & Automação**: Pipeline Kanban nativo com integração de Webhooks para **N8N e Telegram**
  - **Segurança**: Arquitetura alinhada ao OWASP Top 10 (2025/2026) e OWASP Top 10 for LLM Applications

---

## 2. Identidade Visual e Paleta de Cores
- **Azul dos Títulos / Headlines**: `#052e7f` (aplicado universalmente nos títulos de todas as seções).
- **Verde Primário / Ações**: `#00B060` / `#00874A` (botões de CTA, pílulas de destaque, badges e WhatsApp).
- **Amarelo / Dourado de Destaque**: `#FFB800` (estrelas do Google, notas de avaliação).
- **Azul Escuro Noturno**: `#0A2540` / `#052e7f` (faixas institucionais e gradientes).
- **Fundo Predominante**: Branco Puro (`#FFFFFF`) e Cinza Suave (`#F8FAFC`), mesclado a superfícies *Liquid Glass* (`backdrop-blur-xl`).

---

## 3. Atendente Virtual de Inteligência Artificial: "Izzy"

A Izzy é a consultora virtual oficial da EasyTraining integrada no canto inferior direito do site:

### 3.1. Persona & Memória Institucional
- **Nome**: Izzy (consultora pedagógica acolhedora, objetiva e profissional).
- **Base de Conhecimento (`info gerais.md`)**:
  - Auxiliar Veterinário: 8 meses, 100h (64h na escola + 36h de estágio prático em clínica/hospital parceiro), turmas aos domingos das 10h às 12h ou segundas das 19h às 21h, professora Andressa Lessa.
  - Pagamento: Parcelamento em boleto bancário **SEM consulta ao SPC/Serasa**.
  - Idade mínima: 15 anos (sem escolaridade mínima exigida).
  - Tradição: Há 16 anos no mesmo endereço no bairro Pimentas em Guarulhos.
  - Reputação: Nota máxima no Google, sem reclamações no Reclame Aqui nem Procon, mais de 5.000 formados.

### 3.2. Formulário Inteligente de Captação de Leads no Chat
- **Abertura Contextual**: Abre automaticamente quando o visitante pergunta sobre preços, bolsas, turmas ou matrículas, ou via botão destacado no topo do chat (*"Garantir Bolsa"*).
- **Campos**:
  - Nome Completo
  - WhatsApp com máscara dinâmica: `(11) 98765-4321`
  - Curso de Interesse (dropdown com os cursos da escola)
  - Turno Preferido: *Segunda a Sexta - Manhã*, *Tarde*, *Noite* ou *Flexível*
- **Ação Pós-Envio**:
  - Registra o contato instantaneamente no **Cloud Firestore** e no **Kanban CRM**.
  - Dispara o evento para o **N8N** para alerta no Telegram.
  - A Izzy responde confirmando o recebimento com carinho e gera um link para o WhatsApp da secretaria já preenchido.

### 3.3. Streaming em Tempo Real (Vercel AI SDK & Gemini 2.5 Flash)
- **Latência Mínima (TTFT)**: Resposta contínua token por token via Server-Sent Events (SSE), eliminando a espera pelo payload completo.
- **Backend (`/api/chat`)**: Utiliza `streamText` da biblioteca `ai` com o provider `@ai-sdk/google` (`gemini-2.5-flash`), retornando `toDataStreamResponse()`.
- **Frontend (`AiChatbot.tsx`)**: Utiliza o hook `useChat` de `ai/react`, garantindo renderização reativa com efeito de digitação suave, feedback animado enquanto digita e preservação do histórico da conversa.

### 3.4. Design em Modo Escuro de Alto Contraste (Dark Mode)
- **Janela e Fundo**: Azul-noite profundo (`#0A1628` e `#071324`) com bordas `border-slate-700/80` e sombra de profundidade (`shadow-[0_20px_60px_rgba(0,0,0,0.6)]`), eliminando reflexos e proporcionando 100% de contraste e legibilidade no celular e no desktop.
- **Balões de Mensagem**:
  - Usuário: Verde esmeralda oficial da escola (`#00874A`) com texto em branco puro.
  - Izzy (IA): Azul escuro de destaque (`#112240`) com borda suave e texto `text-slate-100`.
- **Inputs e Formulário**: Campos escuros com texto branco, foco em verde e botões com máxima visibilidade.

---

## 4. Pipeline de Leads & Mini-CRM Kanban (`/admin/leads`)

Um sistema de CRM completo integrado ao painel administrativo para controle do funil de matrículas:

### 4.1. As 5 Etapas do Funil (Drag & Drop)
1. 📥 **Novos Leads** (Azul): Contatos frescos recebidos pelo site ou chatbot.
2. 💬 **Em Atendimento** (Âmbar): Alunos já contactados pela equipe comercial.
3. 🏫 **Visita Agendada** (Roxo): Alunos com visita agendada na unidade Pimentas.
4. 🎯 **Matriculados 🎉** (Verde): Matrículas efetivadas com cálculo automático de taxa de conversão (%).
5. ❄️ **Sem Resposta / Futuro** (Cinza): Contatos para reativação em turmas futuras.

### 4.2. Funcionalidades dos Cards
- **Arrastar e Soltar (HTML5 Drag & Drop)**: Movimentação rápida que atualiza em tempo real o Firestore e a API.
- 🟢 **Chamar no WhatsApp**: Abre o WhatsApp Web/App com mensagem personalizada gerada com o nome e o curso do aluno.
- **Anotações Internas**: Campo para registrar o histórico de contato de cada candidato.
- **Cadastro Manual**: Modal para cadastrar alunos que ligaram ou compareceram pessoalmente na unidade.
- **Busca em Tempo Real**: Filtro instantâneo por nome, telefone, curso ou anotações.

### 4.3. Sistema de Lixeira com Reversão (Soft Delete)
- Ao apagar um lead do Kanban, ele recebe `isDeleted: true` no Firestore e vai para a **Lixeira**.
- **Modal da Lixeira (`Lixeira (X)`)**:
  - Exibe todos os itens apagados com data/hora.
  - 🔄 **Restaurar**: Retorna o contato com 1 clique para a coluna original do Kanban no Firestore.
  - ❌ **Excluir Definitivo**: Remove permanentemente o documento do banco.
  - 🧹 **Esvaziar Lixeira**: Limpeza total em lote.

### 4.4. Integração com N8N & Bot do Telegram
- Painel gaveta em `/admin/leads` para configurar a URL do Webhook do N8N.
- Botão **"Testar Disparo"** para verificar se o N8N está recebendo eventos.
- Payload enviado em cada lead:
  ```json
  {
    "event": "novo_lead",
    "timestamp": "2026-09-03T...",
    "lead": {
      "name": "Nome do Aluno",
      "phone": "(11) 98765-4321",
      "courseInterest": "Auxiliar Veterinário",
      "preferredShift": "Segunda a Sexta - Noite"
    }
  }
  ```

---

## 5. Painel Administrativo Geral & CMS (`/admin`)

- **Visão Geral (`/admin`)**: Indicadores em tempo real (Total de Cursos, Artigos, Leads Ativos, Mensagens respondidas pela IA).
- **Gerenciamento de Cursos (`/admin/courses`)**: CRUD de 19 cursos com upload de fotos, controle de módulos, duração e tags.
- **Gerenciamento de Artigos (`/admin/posts`)**: CRUD de artigos de blog com editor rico e **Redator com Inteligência Artificial** (gera artigos prontos e otimizados para SEO via Gemini com 1 clique).
- **Configurações Gerais (`/admin/config`)**: WhatsApp, telefone comercial, horários, endereço, redes sociais, Google Meu Negócio, e IDs do Google Analytics 4 e Google Tag Manager.
- **Métricas de IA (`/admin/page.tsx`)**: Monitoramento de perguntas frequentes, tópicos mais consultados e artigos redigidos por IA.

---

## 6. Arquitetura de Nuvem, Firestore & Segurança Enterprise

### 6.1. Cloud Firestore (Firebase v12)
- Sincronização híbrida resiliente:
  - Coleções ativas: `courses`, `posts`, `config`, `metrics`, `leads`.
  - Mecanismo com `withTimeout(800ms)` em `src/lib/firestoreDb.ts` para garantir que instabilidades de rede nunca travem o carregamento do site.
- **Regras de Segurança Oficiais do Firestore**:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /courses/{courseId} {
        allow read: if true;
        allow write: if request.auth != null;
      }
      match /posts/{postId} {
        allow read: if true;
        allow write: if request.auth != null;
      }
      match /config/{configId} {
        allow read: if true;
        allow write: if request.auth != null;
      }
      match /metrics/{metricId} {
        allow read, write: if true;
      }
      match /leads/{leadId} {
        allow create: if true;
        allow read, update, delete: if request.auth != null;
      }
    }
  }
  ```

### 6.2. Proteções de Segurança Implementadas (`src/lib/security.ts`)
- **Anti-Prompt Injection & Jailbreak (OWASP LLM01/LLM02)**: Bloqueia tentativas de quebra de diretrizes, comandos maliciosos e protege chaves de API com delimitação `<visitor_query>`.
- **Rate Limiting por IP (Anti-DoS)**:
  - Chat da Izzy: Máximo 15 requisições por minuto.
  - Envio de Leads: Máximo 5 envios a cada 10 minutos.
- **Anti-XSS, Anti-SQLi e NoSQL Injection**: Sanitização de strings (`sanitizeString`), telefones (`sanitizePhone`) e proteção contra Prototype Pollution (`sanitizeObject`).
- **Upload Seguro de Imagens (`/api/upload`)**: Validação de extensão, tipo MIME, limite de 5MB, validação de **Magic Bytes binários** e renomeação criptográfica (prevenção total de Path Traversal e RCE).
- **Cabeçalhos HTTP (OWASP Top 10)**:
  - `Content-Security-Policy` (CSP restritivo para scripts, conexões e fontes)
  - `Strict-Transport-Security` (HSTS de 2 anos com preload)
  - `X-Frame-Options: DENY` (Anti-Clickjacking)
  - `X-Content-Type-Options: nosniff`
  - `Permissions-Policy` restritivo
  - `poweredByHeader: false`
- **Mascaramento de Erros**: Nenhum stack trace ou caminho interno de arquivo é exposto ao cliente.

---

## 7. Layout Mobile e Responsividade

- **Header Mobile Redesenhado**:
  - Logo circular + marca legível e compacta.
  - Botão de ação direta "Matrículas" compacto.
  - Botão Hambúrguer (`Menu` / `✕`) posicionado com margens de segurança, sem corte pela curva arredondada da pílula.
- **Drawer Mobile Full-Width**:
  - Menu flutuante em tela cheia com desfoque de fundo (*backdrop blur*).
  - Botões touch-friendly confortáveis para navegação rápida (Início, Cursos, Quem Somos, Blog, Contato).
  - Acesso direto ao WhatsApp, redes sociais e horários da escola.

---

## 8. Comandos e Operações do Projeto

- **Iniciar Servidor Local**: `npm run dev` (porta `3000`).
- **Testar Compilação de Produção**: `npm run build` (validação de tipos e páginas estáticas).
- **Deploy Automático**: `git push origin main` (dispara build imediato na Vercel).
- **Variáveis de Ambiente Necessárias (Vercel)**:
  - `GEMINI_API_KEY`: Chave da API do Google Gemini.
  - `N8N_WEBHOOK_URL`: URL padrão do webhook (opcional, configurável pelo Admin).
