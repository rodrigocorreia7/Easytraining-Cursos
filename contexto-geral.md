# Contexto Geral do Projeto: EasyTraining - Cursos Profissionalizantes

Este documento consolida todo o histórico, arquitetura, padrões visuais, estrutura de código, painel de controle (CMS) e decisões técnicas implementadas no projeto do novo site da **EasyTraining** em Guarulhos-SP. Ao iniciar uma nova sessão, este arquivo serve como guia mestre de continuidade.

---

## 1. Visão Geral do Projeto
- **Cliente**: EasyTraining - Formação Profissional (Guarulhos / Pimentas - SP).
- **Objetivo**: Substituição e modernização completa do site WordPress antigo por uma aplicação **Next.js (App Router)** ultra-rápida, com SSR/SSG nativo para indexação máxima no Google, preservação de 100% dos backlinks de artigos, alto padrão de animações (*Awwwards / Motion Canônico*) e **Painel Administrativo Dinâmico (CMS)** para gerenciar cursos, blog, contatos e links com persistência.
- **Stack Tecnológica**:
  - Next.js 16 (App Router, Turbopack, SSR/SSG)
  - React 19 + TypeScript
  - Tailwind CSS v4
  - Framer Motion / Motion React & GSAP 3
  - OGL (WebGL Shaders para efeitos fluidos)
  - Lucide React (Ícones)
  - Canvas 2D Acelerado por GPU para sequência de frames (Robô Hero)
  - Camada de Persistência Mock em JSON local (`src/lib/db.ts`)
  - Upload de Imagens local em `public/uploads/`
  - Service Layer 100% Desacoplada e Pronta para **Firebase / Cloud Firestore**

---

## 2. Identidade Visual e Paleta de Cores
- **Azul dos Títulos / Headlines**: `#052e7f` (aplicado universalmente nos títulos de todas as seções).
- **Verde Primário / Ações**: `#00B060` (botões de CTA, pílulas de destaque, badges e WhatsApp).
- **Amarelo / Dourado de Destaque**: `#FFB800` (estrelas do Google, ícones de brilho).
- **Azul Escuro Noturno (Faixa Institucional)**: `#0A2540` (seção de Metodologia e transição).
- **Fundo Predominante**: Branco Puro (`#FFFFFF`) na Hero e Cursos, mesclado a superfícies *Liquid Glass* (`backdrop-blur-xl`).

---

## 3. Painel Administrativo & CMS Dinâmico (`/admin`)

O site conta com um painel de administração unificado e completo, protegido por autenticação e com suporte a CRUD (Criação, Leitura, Edição e Exclusão) de todo o conteúdo:

### 3.1. Acesso & Autenticação (`/admin/login`)
- **Login Seguro**: Autenticação com rate limiting (bloqueio temporário após 5 tentativas inválidas) e expiração de sessão por inatividade.
- **Credenciais Padrão (Mock / Firebase Ready)**:
  - **E-mail**: `admin@easytraining.com.br`
  - **Senha**: `admin123` ou `easytraining2026`

### 3.2. Visão Geral / Dashboard (`/admin`)
- **Métricas em Tempo Real**: Total de cursos ativos, total de artigos publicados, WhatsApp ativo e contagem de categorias.
- **Listagens Recentes**: Atalhos para edição direta dos últimos cursos e artigos cadastrados.
- **Restaurar Padrão de Fábrica**: Botão de reset para restaurar todos os dados para o estado inicial padrão após testes.

### 3.3. Gestão de Cursos Profissionalizantes (`/admin/courses`)
- **Tabela Responsiva**: Busca em tempo real por título, categoria e slug, com filtro por categoria.
- **Criar Novo Curso (`/admin/courses/novo`) & Editar Curso (`/admin/courses/[id]`)**:
  - Título, Categoria e Slug URL amigável personalizável.
  - Descrição Curta (cards da vitrine) e Descrição Completa (página de detalhes).
  - Duração / Carga horária e Modalidade (ex: *Presencial / Prático*).
  - Flags de *Curso em Destaque* e *Certificado Incluso*.
  - **Grade Curricular Dinâmica**: Adição, edição e remoção de módulos e tópicos práticos ilimitados.
  - **Mercado de Trabalho**: Oportunidades de emprego/atuação e público-alvo.
  - **Mensagem Customizada do WhatsApp**: Texto específico gerado ao clicar em "Matricular-se".
  - **Upload de Imagem da Capa**: Envio de fotos direto do PC (salvas em `public/uploads/`) ou inserção de URL externa.

### 3.4. Gestão de Artigos do Blog (`/admin/posts`)
- **Listagem e Busca**: Filtros por categoria e busca por termos e tags.
- **Criar (`/admin/posts/novo`) & Editar (`/admin/posts/[id]`)**:
  - Título, Slug SEO, Categoria e Resumo para indexação.
  - Editor com formatação HTML completa.
  - **Aba de Pré-visualização em Tempo Real** antes de publicar.
  - Vinculação de curso com banner de conversão automático no corpo do artigo.
  - Upload de imagem de capa direto do computador.

### 3.5. Configurações Gerais & Links (`/admin/config`)
- **WhatsApp & Telefones**: Atualização do número de WhatsApp (atualiza o botão flutuante e o cabeçalho no site todo), telefone fixo comercial e e-mail de atendimento.
- **Endereço Completo**: Logradouro, bairro, CEP, cidade, UF e ponto de referência.
- **Redes Sociais**: Instagram, Facebook, YouTube e LinkedIn.
- **Google Meu Negócio**: Nota de avaliações (ex: 5.0), total de avaliações (300+) e link direto para a página do Google.
- **Google Analytics 4 & Google Tag Manager**: Campos para configurar os IDs `G-XXXXXXXXXX` e `GTM-XXXXXXX` com injeção automática e assíncrona no `<head>` de todas as páginas públicas via Next.js `Script`.
- **Horários de Funcionamento**: Segunda a Sexta e Sábados.
- **Botão para Restaurar Padrões de Configuração**.

---

## 4. Arquitetura de Persistência & Backend

### 4.1. Camada de Banco de Dados Local (`src/lib/db.ts`)
- Salva os dados em arquivos JSON em `src/data/db/`:
  - `courses.json`: Cursos cadastrados e suas grades curriculares.
  - `posts.json`: Artigos do blog e suas tags.
  - `siteConfig.json`: Contatos, endereços, redes sociais e notas de avaliação.
- Possui fallback automático para os dados padrão em TypeScript caso os arquivos não existam.

### 4.2. Endpoints de API (Next.js App Router)
- `/api/courses` & `/api/courses/[id]`: Listagem, busca, criação, edição e exclusão de cursos.
- `/api/posts` & `/api/posts/[id]`: Listagem, busca, criação, edição e exclusão de artigos.
- `/api/site-config`: Obtenção e atualização das configurações de contato e links.
- `/api/upload`: Recebimento de arquivos via `multipart/form-data` e gravação em `public/uploads/`.
- `/api/reset`: Restauração dos dados para o padrão de fábrica.

### 4.3. Camada de Serviços Desacoplada (Pronta para Firebase Firestore)
Toda a comunicação do frontend passa por 3 serviços assíncronos:
1. `src/services/courseService.ts`
2. `src/services/blogService.ts`
3. `src/services/siteConfigService.ts`
4. `src/services/authService.ts`

```
┌────────────────────────────────────────────────────────┐
│                   Frontend / UI Next.js                │
│    (Home, /curso/[slug], /blog, Header, Footer, Admin) │
└───────────────────────────┬────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
  [Services Layer]                 [Services Layer]
  (Course, Blog, Config)           (Quando migrar para Firebase)
            │                               │
            ▼                               ▼
    Next.js API Routes              Firebase SDK
  (/api/courses, posts, config)   (Firestore / Firebase Storage)
            │
            ▼
    src/data/db/*.json
```

> **Migração para Firebase:** Para plugar o Firebase/Firestore no futuro, basta substituir as chamadas `fetch` dentro de `courseService.ts`, `blogService.ts` e `siteConfigService.ts` pelos métodos do SDK do Firebase (`getDocs`, `addDoc`, `updateDoc`, `deleteDoc`). Nenhuma tela, componente visual ou formulário precisará ser reescrito!

---

## 5. Estrutura de Rotas e Páginas Públicas

1. **Página Inicial (`/` - `src/app/page.tsx`)**:
   - Header dinâmico consumindo telefone e WhatsApp de `siteConfig`.
   - Hero Section com Robô Interativo em Canvas GPU.
   - Faixa de Metodologia com Esteira Contínua `LogoLoop`.
   - Vitrine de Cursos dinâmica consumindo os cursos cadastrados no CMS.
   - Seção Quem Somos com Aurora WebGL Shader.
   - Prova Social com Depoimentos Google.
   - Seção de Blog com destaques dinâmicos.
   - Acordeão de FAQ e Seção de Contato/Localização dinâmica.
   - Botão Flutuante de WhatsApp dinâmico.

2. **Detalhes do Curso (`/curso/[slug]` - `src/app/curso/[slug]/page.tsx`)**:
   - Página completa do curso com grade curricular em módulos/tópicos, oportunidades de carreira, público-alvo, certificados e botão direto para o WhatsApp com mensagem personalizada.
   - Suporte a aliases e slugs antigos para evitar quebras.

3. **Arquivo Geral do Blog (`/blog` - `src/app/blog/page.tsx`)**:
   - Busca instantânea e filtros por categoria.

4. **Detalhes do Artigo (`/[slug]` e `/blog/[slug]`)**:
   - Layout editorial de alta conversão, preservação de backlinks de artigos do WordPress antigo, índice interativo, banner de curso vinculado e dados estruturados Schema.org `BlogPosting`.

5. **Páginas Institucionais Legais**:
   - `/politica-de-privacidade` (Conformidade com a LGPD).
   - `/termos-de-uso` (Termos e condições gerais).

---

## 6. Comandos e Execução

- **Iniciar Servidor de Desenvolvimento**: `cmd /c npm run dev` (porta `3000`).
- **Compilar e Validar Produção**: `cmd /c npm run build` (Static Site Generation e rotas dinâmicas verificadas).
- **Publicação no GitHub**: `git push origin main` (dispara deploy automático na Vercel).
