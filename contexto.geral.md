# Contexto Geral Atual — EasyTraining

Atualizado em: 21/09/2026
Projeto: EasyTraining — cursos profissionalizantes em Guarulhos/SP
Checkout: `I:\Works\Rod\Escola Profissionalizante\Easytrainning\Escola de Cursos\Site`
Branch: `main`
Último commit relevante: `3eae15a`

## Uso deste arquivo

Leia este arquivo antes de iniciar outra tarefa neste projeto. Ele é um resumo operacional atualizado. Não copie credenciais, senhas, tokens ou valores de `.env` para conversas. Os arquivos antigos `contexto-geral.md` e `contexto/contexto-geral.md` podem conter dados históricos desatualizados.

## Stack e publicação

- Next.js 16.3.3, App Router, React 19, TypeScript e Tailwind CSS v4.
- Firebase Admin/Firestore usado pelo servidor.
- Deploy automático pela Vercel após `git push origin main`.
- Domínio canônico: `https://www.easytraining.com.br`.
- Domínios Vercel atualmente conectados diretamente a `Production`: `easytraining.com.br`, `www.easytraining.com.br` e `easytraining-cursos-cokt.vercel.app`.
- O domínio raiz não deve ser configurado como “Redirect to Another Domain”; isso permite o `301` direto do middleware.

## SEO e migração WordPress → Next.js

- Artigos públicos: `/blog/<slug>`.
- Cursos públicos: `/curso/<slug>`.
- `src/middleware.ts` centraliza redirecionamentos legados com HTTP `301`.
- `next.config.mjs` usa `skipTrailingSlashRedirect: true` e não duplica esses redirects.
- Canonicals, sitemap e páginas públicas usam `https://www.easytraining.com.br`.
- Sitemap atual: 49 URLs — 7 institucionais, 23 cursos e 19 artigos.
- As 49 URLs do sitemap foram verificadas com `200 OK` e sem redirecionamento.
- `robots.txt` permite rastreamento público e bloqueia `/admin` e `/api`.

### Regra importante de Auxiliar de Farmácia

Existe um artigo e um curso com nomes semelhantes:

- `/auxiliar-de-farmacia/` → `/blog/auxiliar-de-farmacia`
- `/curso/auxiliar-de-farmacia/` → `/curso/auxiliar-de-farmacia`

Essa colisão foi corrigida no commit `3eae15a`. Não voltar a mapear `/auxiliar-de-farmacia` para o curso.

### Verificação de URL antiga

Para testar no PowerShell: `curl.exe -I "https://easytraining.com.br/carreira-em-medicina-veterinaria-vale-a-pena/"`.

Resultado esperado: primeiro status `301` com destino `https://www.easytraining.com.br/...`. Com `curl.exe -sS -L -o NUL -w "status=%{http_code} url=%{url_effective} redirects=%{num_redirects}`n" URL`, o resultado esperado é `status=200` e `redirects=1`.

## CRM, chatbot e leads

Publicados no commit `b18504e`:

- `src/lib/leadsDb.ts` lê `n8nWebhookUrl` do Firestore, com fallback opcional para variável de ambiente.
- O webhook do n8n é chamado pelo servidor, não diretamente pelo navegador.
- Nova rota protegida: `src/app/api/admin/lead-webhook/route.ts`.
- `/admin/leads` confirma o webhook relendo o Firestore e atualiza os leads automaticamente.
- Formulários de contato aguardam `/api/leads` e mostram falhas reais.
- Cada lead pode registrar `notificationStatus`: `sent`, `not_configured` ou `failed`.
- Abrir/conversar com o chatbot não cria lead. O cadastro ocorre quando o visitante envia nome e WhatsApp no formulário da Izzy ou nos formulários de contato.

### Ação manual do n8n/Telegram

No `/admin/leads`, abrir **N8N & Telegram**, informar a URL de produção do webhook (não `/webhook-test/`), salvar, confirmar a persistência no Firestore e clicar em **Testar Disparo**. Não inserir URL, token ou credencial nesta conversa.

## Firestore e conteúdo

- Coleções principais: `courses`, `posts`, `leads`, `config`, `metrics`.
- O conteúdo recuperado do WordPress foi sincronizado para o Firestore.
- Estado público validado: 23 cursos e 19 artigos.
- O sitemap usa a mesma leitura pública do Firestore/API.
- Não abrir regras públicas do Firestore para resolver problemas de SEO ou leads.

## Search Console — pendência operacional

1. Reenviar `https://www.easytraining.com.br/sitemap.xml`.
2. Inspecionar URLs antigas e novas.
3. Nas antigas, “Página com redirecionamento” é esperado.
4. Nas novas, verificar “URL está no Google” e a canonical escolhida.
5. Aguardar o novo rastreamento antes de comparar impressões.

## Comandos de continuidade

Executar no checkout: `git status --short --branch`, `git log -5 --oneline`, `npm.cmd run lint`, `npm.cmd run build` e, quando autorizado, `git push origin main`.

Executar lint e build sequencialmente. Nunca exibir `.env.local`, chaves Firebase, senhas ou tokens.

## Procedimento para o próximo agente

1. Ler este arquivo.
2. Executar `git status --short --branch`.
3. Conferir o código atual antes de editar.
4. Para SEO, verificar `src/middleware.ts`, `next.config.mjs` e `src/app/sitemap.ts`.
5. Para leads, verificar `src/lib/leadsDb.ts`, `/api/leads`, `/api/admin/lead-webhook` e `/admin/leads`.
6. Não repetir uma auditoria completa sem necessidade; a produção já foi validada.

## Histórico recente

- `eaecff2`: recuperação de artigos WordPress.
- `29f10bd`: invalidação de cache dos artigos recuperados.
- `b18504e`: correção de persistência CRM e entrega n8n.
- `329e457`: redirecionamentos canônicos 301 de salto único.
- `3eae15a`: correção do conflito artigo/curso de Auxiliar de Farmácia.
