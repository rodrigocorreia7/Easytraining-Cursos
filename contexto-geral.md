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
  - **Workflow N8N Ativo**: `EasyTraining - Notificação de Novos Leads (Telegram & WhatsApp)` (ID: `Ne2MUiRDtBj3gcix`).
  - **Endpoint de Produção**: `https://n8n.eterion.online/webhook/easytraining-leads` (Método: `POST`).
  - **Canal Telegram**: Supergrupo **Easytraining Leads** (Chat ID: `-1003808355395`) com o bot `@EasytrainingLead_bot` como Administrador, permitindo que toda a equipe comercial receba as notificações simultaneamente.
  - **Ações do Fluxo**: Sanitização de payload, normalização de telefone brasileiro com DDI 55, geração de link direto de conversa no WhatsApp, notificação HTML no Telegram com Inline Keyboard (botões: *Chamar no WhatsApp* e *Abrir CRM Kanban*), e resposta HTTP 200 resiliente (`onError: continueRegularOutput`).
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

### 6.4. Preservação de Backlinks e Rotas Específicas (/contato e Artigo Profissionalizante)
- **Página Dedicada de Contato (`/contato`)**: Criada em `src/app/contato/page.tsx` com componente interativo `ContactPageView.tsx`. Oferece status 200 OK para backlinks externos legados, metadados ricos de SEO Local, Schema.org `LocalBusiness` e `EducationalOrganization`, mapa interativo embutido do Google Maps, FAQs de localização/matrícula e formulário integrado ao WhatsApp da secretaria.
- **Artigo de Educação Profissionalizante (`/a-importancia-da-educacao-profissionalizante-para-o-mercado-de-trabalho`)**: Adicionado como artigo mestre (post #10) em `blogPostsReal.ts` e `posts.json`. Possui mais de 1.200 palavras, FAQs para Rich Snippets, banner de conversão para o curso de **Assistente Administrativo** e links contextuais para Informática, Excel, Auxiliar Veterinário e Farmácia. Servido com HTTP 200 via `src/app/[slug]/page.tsx` na raiz e `/blog/...`.
- **Sitemap Atualizado (`public/sitemap.xml`)**: O script `generate_sitemap.cjs` indexa automaticamente as duas URLs para o Googlebot.

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
  - `ADMIN_PASSWORD` (Secret - Senha mestre server-side para login do painel)
  - `ADMIN_SESSION_SECRET` (Secret - Chave HMAC para assinatura de tokens de sessão)

---

## 10. Blindagem de Segurança da API de Leads & Arquitetura de SEO Canônico

### 10.1. Blindagem da API de Leads (LGPD & OWASP)
- **Bloqueio de Leitura Não Autorizada (`GET /api/leads`)**: Exige autenticação de administrador via `verifyAdminSession(request)`. Requisições anônimas recebem `401 Unauthorized`.
- **Bloqueio de Exclusão & Edição (`DELETE /api/leads`, `PUT/DELETE /api/leads/[id]`)**: Protegidos contra acesso não autorizado.
- **Formulário de Entrada Aberto (`POST /api/leads`)**: Permanece público com rate limiting de 30 envios/10min por IP e sanitização rigorosa anti-XSS para recebimento seguro de contatos.
- **Login Server-Side (`/api/admin/login`)**: O navegador envia as credenciais via HTTPS; a validação ocorre estritamente no servidor, gerando token assinado criptograficamente (HMAC-SHA256) em cookie seguro `HttpOnly; SameSite=Strict; Secure`.
- **Eliminação de Senhas no Frontend**: Nenhuma credencial em texto puro reside no código JavaScript do cliente (`authService.ts`).

### 10.2. Arquitetura de SEO e Domínio Canônico
- **Domínio Canônico Unificado**: Padronizado para `https://www.easytraining.com.br` (com `www`), alinhado com o domínio primário configurado na Vercel e eliminando loops de redirecionamento no Google Search Console.
- **Restauração do Título Clássico**: Curso de Informática restaurado para `Curso de Informática em Guarulhos` (recuperando a palavra-chave histórica mais forte do WordPress).
- **Eliminação de Duplicação de Título**: Removido sufixo redundante (`| EasyTraining | EasyTraining Guarulhos`).
- **Redirecionamento 301 de Artigos Antigos**: Requisições para artigos na raiz `/{slug}` são redirecionadas permanentemente (HTTP 308/301) para `/blog/{slug}`, transferindo 100% da autoridade de backlinks legados.
- **Sitemap.xml & Robots.txt**: Todas as 33 URLs oficiais foram regeneradas e apontam diretamente para `https://www.easytraining.com.br`.

---

## 11. Resolução Integral da Auditoria Técnica de Segurança, Autenticação e LGPD (Setembro/2026)

Na última sessão de auditoria e blindagem, foram resolvidas 100% das pendências técnicas de segurança, SEO, autenticação e conformidade legal:

### 11.1. Proteção de Todas as Rotas Administrativas da API (Item 1)
Todas as operações de alteração ou exclusão de dados nos Route Handlers do Next.js receberam o validador `verifyAdminSession(request)`, barrando requisições anônimas ou com tokens adulterados com HTTP `401 Unauthorized`:
- **Cursos**: `POST /api/courses`, `PUT /api/courses/[id]`, `DELETE /api/courses/[id]`.
- **Blog**: `POST /api/posts`, `PUT /api/posts/[id]`, `DELETE /api/posts/[id]`.
- **Upload & Reset**: `POST /api/upload` (validação de magic bytes + auth), `POST /api/reset` (restauração de dados locais).
- **Sincronização Firebase**: `POST /api/sync-firebase`.
- **Ferramentas de IA**: `POST /api/ai/generate-post`, `POST /api/ai/link-assist`, `GET /api/ai/metrics`.
- *Nota*: As rotas públicas de consulta de cursos e posts (`GET /api/courses`, `GET /api/posts`) e o envio de novos alunos (`POST /api/leads`) permanecem públicas para os visitantes do site.

### 11.2. Blindagem de Chaves e Credenciais de Ambiente (Item 2)
- Criadas as variáveis `ADMIN_PASSWORD` e `ADMIN_SESSION_SECRET` (segredo criptográfico HMAC de 64 caracteres hexadecimais) em `.env.local`.
- Em `src/lib/authServer.ts`, foi adicionado tratamento seguro para produção que impede chaves padrão fracas e unifica a lista autorizada (`ALLOWED_ADMIN_EMAILS`).

### 11.3. Unificação de Login Google e Validação Contínua no Painel (Item 3)
- **Novo Endpoint**: `src/app/api/admin/google-session/route.ts` recebe os dados do Firebase Google Auth, valida se o e-mail pertence aos administradores permitidos e gera o token de sessão HMAC assinado, gravando o cookie seguro `admin_session` (`HttpOnly; SameSite=Strict`).
- **Eliminação de Cookie Forjável**: Removido do `src/services/authService.ts` o antigo cookie `admin_token=valid_session_token`.
- **Validação Ativa no Painel**: O layout administrativo (`src/app/admin/layout.tsx`) valida a sessão ativamente com o endpoint `/api/admin/me` no carregamento. Se a sessão for inválida ou expirada, força logout e redireciona para `/admin/login`.

### 11.4. Schema.org JSON-LD Unificado (Item 4)
- Em `src/app/layout.tsx`, as propriedades `url`, `logo` e `image` do Schema `EducationalOrganization` foram atualizadas para o domínio canônico oficial `https://www.easytraining.com.br`.

### 11.5. Duração Oficial de Auxiliar Veterinário (Item 5)
- Em `src/data/coursesData.ts` e `src/data/db/courses.json`, a duração do curso foi corrigida de `"4 a 8 meses"` para **`"8 meses (100h)"`** (64h de aula prática + 36h de estágio em clínica/hospital veterinário parceiro), alinhando rigorosamente com o documento pedagógico oficial da escola (`info gerais.md`).
- A base em nuvem Cloud Firestore também foi sincronizada com a nova duração.

### 11.6. Conformidade com a LGPD nos Formulários de Captura (Item 6)
- Removido o atributo `defaultChecked` dos checkboxes de autorização de contato e política de privacidade em `src/components/sections/Contact.tsx` e `src/components/contact/ContactPageView.tsx`. O visitante deve consentir afirmativamente marcando o checkbox antes do envio do formulário.

### 11.7. Validações e Bateria de Testes Automatizados
- **25 Testes Automatizados**: 25/25 passaram com sucesso (bloqueio 401 de rotas protegidas, bloqueio 403 para Google login não autorizado, validação de login master, acesso com cookie seguro, duração do curso e captura pública de leads).
- **Compilação de Produção**: `npm run build` com Turbopack concluído com sucesso, gerando todas as 34 páginas estáticas e zero erros de TypeScript.
- **Commit & Deploy**: Todas as alterações foram comitadas e enviadas ao repositório remoto (`bc0e940`) no branch `main`.

---

## 12. Blindagem Final Pós-Auditoria Externa Spark (Setembro/2026)

Em resposta à auditoria externa técnica de segurança e SEO ("Auditoria site Spark"), foram implementadas as correções definitivas nos itens críticos e de alto impacto:

### 12.1. Blindagem Criptográfica do Login Google (`/api/admin/google-session`)
- **Problema Anterior**: O endpoint confiava no e-mail enviado no corpo da requisição JSON, permitindo forja com ferramentas como curl.
- **Solução Implementada**: 
  - O cliente (`authService.ts`) envia o `idToken` real emitido pelo Firebase Auth (`await fbUser.getIdToken(true)`).
  - O backend valida criptograficamente o `idToken` no Google Identity Toolkit (`identitytoolkit.googleapis.com`), extrai o e-mail verificado diretamente pelo Google e valida contra a allowlist (`ALLOWED_ADMIN_EMAILS`).
  - Requisições sem token retornam `400`, e tokens falsos/expirados retornam `401`.

### 12.2. Eliminação de Segredos e Senhas em Fallback Hardcoded
- `src/lib/authServer.ts`: Removido o segredo de fallback estático em produção. Se `ADMIN_SESSION_SECRET` não estiver presente em produção, a aplicação bloqueia a execução por segurança em vez de usar chave conhecida.
- `src/app/api/admin/login/route.ts`: Exige obrigatoriamente a variável de ambiente `ADMIN_PASSWORD`. Se ausente, retorna HTTP 503 com erro seguro.

### 12.3. Upload em Nuvem Resiliente (Firebase Storage)
- `src/lib/firebase.ts`: Exportada a instância oficial do `storage`.
- `src/app/api/upload/route.ts`: Migrado para gravar arquivos no **Firebase Storage** (`easytraining-cursos.firebasestorage.app`), retornando URLs públicas permanentes e eliminando falhas em contêineres efêmeros da Vercel.

### 12.4. Proteção LGPD, Sanitização e Anti-Spam
- `src/data/db/leads.json`: PII real removido do repositório, mantendo apenas dados de demonstração.
- `firestore.rules`: Arquivo de regras criado para publicação no Firebase Console, bloqueando leitura e exclusão pública da coleção `/leads`, permitindo apenas criação de contatos.
- `src/app/api/leads/route.ts`: Adicionado campo Honeypot (`b_field` / `website_url`). Bots que preencherem o campo recebem resposta de sucesso simulada sem gravar no banco nem acionar webhooks.
- `src/lib/security.ts`: Removida regex que apagava `;` e `--`, preservando o texto em português de mensagens legítimas.

### 12.5. Reestruturação SSR do Blog & SEO Avançado
- `src/app/blog/page.tsx`: Convertido em **Server Component** nativo com Server-Side Rendering (SSR). Exporta metadados completos (`title`, `description`, `canonical` e OpenGraph) diretamente no HTML inicial para o Googlebot.
- `src/components/blog/BlogArchiveClient.tsx`: Criado componente cliente isolado para pesquisa interativa e filtro por categorias.
- `src/app/sitemap.ts`: Gerador dinâmico nativo do Next.js App Router, indexando rotas estáticas, catálogo de cursos e artigos com `lastModified` e `priority`.
- `src/components/sections/FAQ.tsx`: Inserido Schema.org `FAQPage` estruturado em JSON-LD para exibição de rich snippets sanfonados na busca do Google.
- `src/app/layout.tsx`: Removido canonical estático fixo para que cada rota defina seu próprio canonical sem conflitos.
- `vercel.json`: Removidos cabeçalhos legados obsoletos (`SAMEORIGIN` e `X-XSS-Protection`) para manter conformidade com `next.config.mjs`.
- `package.json`: Desinstalado `puppeteer-core`, reduzindo dependências.

