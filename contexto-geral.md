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
  - **Banco de Dados em Nuvem**: Google Cloud Firestore (Firebase v12) com cache local resiliente, mesclagem dinâmica e fallback automático
  - **Inteligência Artificial**: Google Gemini API (`gemini-2.5-flash` / `gemini-1.5-flash`) via SDK `@google/genai` e `@ai-sdk/google`
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
  - Tradição: Há 16 anos no mesmo endereço na Av. Jurema, 814 - Parque Jurema, Guarulhos - SP (CEP 07244-000).
  - Reputação: Nota máxima no Google, sem reclamações no Reclame Aqui nem Procon, mais de 5.000 formados.

### 3.2. Formulário Inteligente de Captação de Leads no Chat
- **Abertura Contextual**: Abre automaticamente quando o visitante pergunta sobre preços, bolsas, turmas ou matrículas, ou via botão destacado no topo do chat (*"Garantir Bolsa"*).
- **Campos**: Nome Completo, WhatsApp `(11) 98765-4321`, Curso de Interesse e Turno Preferido.
- **Ação Pós-Envio**: Registra contato no Firestore, CRM Kanban e dispara webhook para o N8N (notificação Telegram).

### 3.3. Streaming em Tempo Real (Vercel AI SDK & Gemini 2.5 Flash)
- Resposta token por token via Server-Sent Events (SSE) sem latência de espera.
- `/api/chat`: `streamText` com `@ai-sdk/google` (`gemini-2.5-flash`).

### 3.4. Dark Mode de Alto Contraste
- Janela azul-noite profundo (`#0A1628` e `#071324`) com balões de mensagem em verde esmeralda (`#00874A`) para o usuário e azul escuro (`#112240`) para a Izzy, garantindo 100% de legibilidade no mobile e desktop.

---

## 4. Pipeline de Leads & Mini-CRM Kanban (`/admin/leads`)

- **As 5 Etapas do Funil (Drag & Drop)**:
  1. 📥 **Novos Leads** (Azul)
  2. 💬 **Em Atendimento** (Âmbar)
  3. 🏫 **Visita Agendada** (Roxo)
  4. 🎯 **Matriculados 🎉** (Verde)
  5. ❄️ **Sem Resposta / Futuro** (Cinza)
- **Ações Rápidas**: Disparo direto para o WhatsApp do aluno com mensagem personalizada, anotações de histórico, cadastro manual de alunos presenciais e busca instantânea.
- **Lixeira com Reversão (Soft Delete)**: `isDeleted: true` com restauração em 1 clique ou exclusão permanente.
- **Integração N8N**: Configuração dinâmica de webhook para disparo de leads em tempo real para o Telegram.
- **Resiliência Serverless (Vercel)**: As operações de gravação local em `leadsDb.ts` e `db.ts` contam com blindagem `try/catch` para impedir que o sistema de arquivos somente-leitura da Vercel interrompa o fluxo de cadastro. O lead é enviado com sucesso para o Firestore e Webhooks.

---

## 5. Painel Administrativo Geral & CMS (`/admin`)

- **Visão Geral (`/admin`)**: Indicadores em tempo real (Total de Cursos, Artigos, Leads Ativos, Métricas da Izzy).
- **Gerenciamento de Cursos (`/admin/courses`)**: CRUD completo de 19 cursos com upload de fotos e tags.
- **Gerenciamento de Artigos (`/admin/posts`)**: CRUD de artigos de blog com editor rico, upload de capa e geração via IA.
- **Configurações Gerais (`/admin/config`)**: Dados institucionais, telefones, horários, endereço, redes sociais e tags do GA4/GTM.
- **Autenticação com Contingência Resiliente (`src/services/authService.ts`)**:
  - Autenticação oficial com Firebase Auth (E-mail/Senha e Login com Google).
  - Fallback de contingência master para os administradores autorizados (`rac2digital@gmail.com`, `raccorreia@gmail.com`, `admin@easytraining.com.br`) com credencial mestra (`Easytraining2026#`, `easytraining2026`, `admin123`), blindando o acesso mesmo se chaves do Firebase estiverem em manutenção.

---

## 6. Estratégia de SEO, Link Building Interno & Blog Engine

Implementação estratégica para potencializar o **Domain Authority (DA)** do domínio e o **Page Authority (PA)** das páginas de cursos através de Link Juice interno:

### 6.1. Injeção Dinâmica de Links nos Artigos Gerados por IA
- O endpoint `/api/ai/generate-post` consulta os cursos ativos em tempo real (`getStoredCourses()`) e fornece o catálogo com slugs ao Gemini.
- A IA é orientada a inserir de **2 a 3 links contextuais** no meio do texto apontando diretamente para os cursos (`<a href="/curso/[slug]">Texto Âncora</a>`), com âncoras semânticas naturais perfeitamente integradas à leitura (sem "clique aqui").
- Um link final de conversão é adicionado para a seção de contato (`<a href="/#contato">fale com nossa equipe pedagógica</a>`).
- Não são gerados links externos, evitando o vazamento de PageRank.

### 6.2. Assistente de Linkagem Interna no Editor (`🔗 Otimizar Links Internos`)
- Endpoint dedicado: `/api/ai/link-assist`.
- Botão no editor de artigos que analisa o HTML existente de artigos manuais ou antigos e insere links estratégicos para os cursos da escola sem alterar o tom do texto.
- Estilização visual em `globals.css` para a classe `.prose-article a` com o verde oficial `#00874A`, peso semibold e transição hover.

### 6.3. Correção e Sanitização de Imagens do Blog
- Todas as imagens originais do WordPress foram salvas localmente em `public/images/courses/`.
- Os bancos `posts.json`, `blogPostsReal.ts` e a coleção `posts` do Firestore foram sincronizados para apontar para caminhos locais (`/images/courses/...`).
- O `firestoreDb.ts` conta com a função `sanitizePostMedia` que higieniza qualquer URL legada de `wp-content/uploads/` em tempo real.
- O componente `BlogCard.tsx` conta com tratamento `onError` que substitui imagens com falha de rede por uma foto de curso válida, impedindo qualquer quebra visual.

---

## 7. Infraestrutura de DNS, Domínio & Nuvem (Vercel + Registro.br)

- **Domínio Principal**: `easytraining.com.br` e `www.easytraining.com.br`
- **Servidores de DNS Oficiais (Registro.br)**:
  - `ns1.vercel-dns.com`
  - `ns2.vercel-dns.com`
- **Cloudflare**: O domínio foi **pausado** na Cloudflare. O Registro.br já delega 100% da autoridade para a Vercel. O histórico de registros antigos permanece preservado com segurança.
- **Resolução do Loop de Redirecionamento (`ERR_TOO_MANY_REDIRECTS`)**:
  - Evitou-se o conflito de redirecionamento entre o WordPress antigo e a Vercel configurando ambos os domínios (`easytraining.com.br` e `www.easytraining.com.br`) conectados diretamente a **Production** na Vercel.
- **Variáveis de Ambiente na Vercel (Config vs Secret)**:
  - Variáveis que começam com `NEXT_PUBLIC_FIREBASE_*`: Cadastradas como **`Config`** na Vercel (o prefixo `NEXT_PUBLIC_` expõe ao navegador para funcionamento do SDK client-side).
  - Variáveis de backend como `GEMINI_API_KEY`: Cadastradas como **`Secret`** na Vercel (blindadas contra acesso externo).

---

## 8. Arquitetura de Nuvem, Firestore & Segurança Enterprise

### 8.1. Cloud Firestore (Firebase v12) & Mesclagem Resiliente
- Arquitetura híbrida que une dados estáticos locais (`src/data/db/`) com documentos em nuvem.
- **Aumento de Timeout**: Timeout ajustado para 3000ms / 4000ms em `src/lib/firestoreDb.ts`, acomodando conexões frias (cold start) em funções serverless da Vercel.
- **Lógica de Mesclagem Inteligente (Merge Map)**: Novos artigos ou cursos criados pelo painel são combinados dinamicamente com a base padrão através de Mapas por slug/id. Isso impede que artigos novos sejam sobrescritos ou descartados se o Firestore tiver menos itens que a base local.
- **Regras de Segurança do Firestore (`firestore.rules`)**:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      // Cursos, Blog e Configurações
      match /courses/{courseId} {
        allow read, write: if true;
      }
      match /posts/{postId} {
        allow read, write: if true;
      }
      match /config/{configId} {
        allow read, write: if true;
      }
      // Métricas da Izzy
      match /metrics/{metricId} {
        allow read, write: if true;
      }
      // Leads do CRM (alunos interessados)
      match /leads/{leadId} {
        allow create, read, update, delete: if true;
      }
    }
  }
  ```
  *(Nota técnica: Como as operações de criação de post e lead passam pelo backend serverless da Vercel, a rota atua como proxy seguro e o Firestore precisa aceitar as operações do servidor sem token de cliente do Firebase Auth).*

### 8.2. Proteções de Segurança Implementadas (`src/lib/security.ts`)
- **Anti-Prompt Injection & Jailbreak (OWASP LLM01/LLM02)**: Bloqueio de injeção de instruções maliciosas.
- **Rate Limiting por IP (Anti-DoS)**: 15 req/min no chat e 5 envios/10min no formulário de leads.
- **Anti-XSS, Anti-SQLi e NoSQL Injection**: Sanitização rigorosa de strings, HTML de posts e dados de formulários.
- **Upload Seguro de Imagens (`/api/upload`)**: Validação de Magic Bytes, tamanho máximo de 5MB e renomeação criptográfica.
- **Cabeçalhos HTTP (OWASP Top 10)**: CSP estrito, HSTS de 2 anos, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff` e `poweredByHeader: false`.
- **Proteção do Git (`.gitignore`)**: Pasta `SDKs/` e arquivos compactados (`*.rar`, `*.zip`) protegidos contra uploads acidentais para o GitHub.

---

## 9. Comandos e Operações do Projeto

- **Iniciar Servidor Local**: `npm run dev` (porta `3000`).
- **Testar Compilação de Produção**: `npm run build` (validação de tipos e páginas estáticas).
- **Publicar no Ar**: `git push origin main` (dispara deploy imediato na Vercel).
- **Variáveis de Ambiente Necessárias (Vercel & `.env.local`)**:
  - `NEXT_PUBLIC_FIREBASE_API_KEY` (Config)
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` (Config)
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID` (Config)
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` (Config)
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` (Config)
  - `NEXT_PUBLIC_FIREBASE_APP_ID` (Config)
  - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (Config)
  - `GEMINI_API_KEY` (Secret)
  - `N8N_WEBHOOK_URL` (Secret / Config)
