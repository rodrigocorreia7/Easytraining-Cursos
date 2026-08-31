# Contexto Geral do Projeto: EasyTraining - Cursos Profissionalizantes

Este documento consolida todo o histórico, arquitetura, padrões visuais, estrutura de código e decisões técnicas implementadas no projeto do novo site da **EasyTraining** em Guarulhos-SP. Ao iniciar uma nova sessão, este arquivo serve como guia mestre de continuidade.

---

## 1. Visão Geral do Projeto
- **Cliente**: EasyTraining - Formação Profissional (Guarulhos / Pimentas - SP).
- **Objetivo**: Substituição e modernização completa do site WordPress antigo por uma aplicação **Next.js 15/16 (App Router)** ultra-rápida, com SSR/SSG nativo para indexação máxima no Google, preservação de 100% dos backlinks de artigos, alto padrão de animações (*Awwwards / Motion Canônico*) e área administrativa para publicação de blog.
- **Stack Tecnológica**:
  - Next.js (App Router, Turbopack, SSR/SSG)
  - React 19 + TypeScript
  - Tailwind CSS v4
  - Framer Motion / Motion React
  - OGL (WebGL Shaders para efeitos fluidos)
  - Lucide React (Ícones)
  - Canvas 2D Acelerado por GPU para sequência de frames (Robô Hero)
  - Service Layer desacoplada para Blog & Auth (Mock inicial com interface 100% compatível para Firebase / Firestore)

---

## 2. Identidade Visual e Paleta de Cores
- **Azul dos Títulos / Headlines**: `#052e7f` (aplicado universalmente nos títulos de todas as seções).
- **Verde Primário / Ações**: `#00B060` (botões de CTA, pílulas de destaque, badges e WhatsApp).
- **Amarelo / Dourado de Destaque**: `#FFB800` (estrelas do Google, ícones de brilho).
- **Azul Escuro Noturno (Faixa Institucional)**: `#0A2540` (seção de Metodologia e transição).
- **Fundo Predominante**: Branco Puro (`#FFFFFF`) na Hero e Cursos, mesclado a superfícies *Liquid Glass* (`backdrop-blur-xl`).

---

## 3. Estrutura de Rotas e Páginas (Next.js App Router)

1. **Página Inicial (`/` - `src/app/page.tsx`)**:
   - Header Fixo com Menu: `Início` ➔ `Cursos` ➔ `Quem Somos` ➔ `Blog` ➔ `Contato`.
   - Hero Section com Robô Interativo em Canvas GPU (71 frames WebP) e layout mobile.
   - Faixa de Metodologia com Esteira Contínua `LogoLoop`.
   - Grade com 19 Cursos Profissionalizantes completos, Floating Dock e Modais detalhados.
   - Seção Quem Somos com Aurora WebGL Shader.
   - Prova Social com Depoimentos Google 4.9 estrelas.
   - Seção de Blog com destaques dinâmicos e link para o arquivo geral.
   - Acordeão de Perguntas Frequentes (FAQ) e Seção de Contato/Localização.

2. **Arquivo Geral do Blog (`/blog` - `src/app/blog/page.tsx`)**:
   - Barra de pesquisa instantânea por termos, tags e conteúdo.
   - Filtros dinâmicos por categoria (*Tecnologia & Informática*, *Saúde & Pet*, *Saúde & Farmácia*, *Primeiro Emprego*, etc.).
   - Card principal em destaque e grid responsivo de todos os artigos.

3. **Rotas Dinâmicas de Artigos & Preservação de Backlinks**:
   - **Rota Raiz Exata (`/[slug]` - `src/app/[slug]/page.tsx`)**: Preserva 100% dos backlinks do WordPress sem erro 404.
   - **Rota Alternativa (`/blog/[slug]` - `src/app/blog/[slug]/page.tsx`)**: Acessível também sob o prefixo de blog.
   - **Layout Editorial de Alta Conversão**:
     - Índice de Tópicos Interativo (Table of Contents).
     - Banner de Curso Relacionado com CTA direto para WhatsApp.
     - Botões de Compartilhamento (WhatsApp, LinkedIn, Facebook, Copiar Link).
     - Acordeão de FAQ do artigo e Artigos Relacionados recomendados.
     - Dados Estruturados Schema.org `BlogPosting` em JSON-LD.

4. **Painel Administrativo (`/admin` - `src/app/admin/`)**:
   - **Autenticação (`/admin/login`)**: Login seguro com guard de rota e feedback visual.
   - **Dashboard (`/admin`)**: Métricas de artigos, busca, tabela com thumbnails e ações de Visualizar, Editar e Excluir.
   - **Criação & Edição (`/admin/posts/novo` e `/admin/posts/[id]`)**:
     - Gerador inteligente de Slugs a partir do título.
     - Aba de **Pré-visualização em Tempo Real** do artigo formatado.
     - Vinculação de cursos para banner automático de conversão.

---

## 4. Artigos Reais Integrados no Blog (`src/data/blogPostsReal.ts`)
1. `/importancia-do-excel-no-mercado-de-trabalho/`
2. `/guia-definitivo-curso-auxiliar-veterinario-guarulhos/`
3. `/jovem-aprendiz-2026-guarulhos-idade-salario/`
4. `/como-ser-estagiario-pelo-ciee-guia-completo-e-dicas-essenciais/`
5. `/carreira-em-medicina-veterinaria-vale-a-pena/`
6. `/curso-de-informatica-basicadesvende-o-mundo-digital/`
7. `/o-que-se-faz-em-um-curso-de-informatica/`
8. `/auxiliar-de-farmacia/`
9. `/descubra-a-importancia-de-um-curso-de-informatica-basica/`

---

## 5. Arquitetura de Serviços (Pronta para Firestore)
- `src/services/blogService.ts`: Implementa métodos assíncronos (`getAllPosts`, `getPostBySlug`, `createPost`, `updatePost`, `deletePost`). Para plugar o Firebase Firestore no futuro, basta conectar o SDK aos métodos existentes sem alterar a camada visual.
- `src/services/authService.ts`: Gerencia autenticação de administradores com persistência em sessão/cookie.

---

## 6. Comandos e Execução
- Iniciar ambiente de desenvolvimento Next.js: `npm run dev` (porta `3000`).
- Validar build de produção Next.js: `npm run build` (Static Site Generation de 25+ rotas).
