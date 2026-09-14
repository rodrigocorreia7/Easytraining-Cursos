import { NextRequest, NextResponse } from 'next/server';
import type { FaqItem } from '@/types';

// ============================================================================
// 1. INPUT SANITIZATION & ANTI-INJECTION (SQLi, NoSQLi, XSS)
// ============================================================================

/**
 * Sanitiza strings gerais:
 * - Remove tags HTML perigosas (Anti-XSS)
 * - Remove operadores e caracteres de injeção NoSQL/SQL
 * - Trunca para o tamanho máximo permitido (Anti-DoS)
 */
export function sanitizeString(input: unknown, maxLength = 255): string {
  if (typeof input !== 'string') return '';

  return input
    .trim()
    .slice(0, maxLength)
    // Remove tags HTML e scripts
    .replace(/<[^>]*>/g, '')
    // Remove sequências perigosas de scripts e eventos inline
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    // Remove operadores de injeção NoSQL no estilo MongoDB
    .replace(/(\$where|\$gt|\$lt|\$ne|\$regex|\$or|\$and)/gi, '')
    // Normaliza caracteres de controle nulos
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, '');
}

/**
 * Sanitiza conteúdo HTML rico para artigos de blog e descrições completas:
 * - Filtra e neutraliza tags perigosas (<script>, <iframe>, <embed>, <object>, <svg>, <math>, etc.)
 * - Elimina manipuladores de eventos inline (onload, onclick, onerror, etc.) mesmo sem espaços
 * - Neutraliza protocolos perigosos (javascript:, vbscript:, data:text)
 * - 100% compativel com Edge e Serverless Functions (sem dependência de JSDOM)
 */
export function sanitizeHtmlContent(input: unknown, maxLength = 500000): string {
  if (typeof input !== 'string') return '';
  let html = input.slice(0, maxLength);

  // 1. Remove blocos inteiros perigosos e seus conteúdos
  html = html.replace(/<\s*(script|style|iframe|object|embed|applet|svg|math|form|meta|link|base)\b[^>]*>([\s\S]*?<\s*\/\s*\1\s*>)?/gi, '');
  html = html.replace(/<\s*\/?\s*(script|style|iframe|object|embed|applet|svg|math|form|meta|link|base)\b[^>]*\/?>/gi, '');

  // 2. Remove manipuladores de evento inline como onload, onerror, onclick, on*, mesmo sem espaço (ex: <img/onerror=...)
  html = html.replace(/[\s\/]on[a-z0-9_]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');

  // 3. Desativa esquemas perigosos como javascript:, vbscript: e data: não-imagem
  html = html.replace(/(href|src)\s*=\s*(['"])\s*(?:javascript|vbscript|data(?!\s*:\s*image\/(?:png|jpeg|webp|gif))):[^'"]*\2/gi, '$1="#"');
  html = html.replace(/(href|src)\s*=\s*(?:javascript|vbscript|data(?!\s*:\s*image\/(?:png|jpeg|webp|gif))):[^\s>]*/gi, '$1="#"');

  // 4. Remove caracteres de controle nulos e perigosos
  html = html.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, '');

  return html;
}

/**
 * Sanitiza URLs e Data URIs de imagens:
 * - Permite URLs seguras (https://, http://, /images/...) até 2048 caracteres
 * - Permite Data URIs Base64 seguras (image/webp, image/png, image/jpeg, image/gif) até 2.500.000 caracteres
 * - Bloqueia scripts, esquemas javascript: e vetores de injeção
 */
export function sanitizeImageUrl(input: unknown): string {
  if (typeof input !== 'string') return '';
  const trimmed = input.trim();
  if (!trimmed) return '';

  // Data URI Base64 seguro para armazenamento inline no Firestore (até 2.5MB)
  if (trimmed.startsWith('data:image/')) {
    if (trimmed.length > 2500000) return '';
    const commaIndex = trimmed.indexOf(',');
    if (commaIndex > 10) {
      const header = trimmed.slice(0, commaIndex);
      if (/^data:image\/(webp|png|jpeg|jpg|gif);base64$/i.test(header)) {
        return trimmed;
      }
    }
    return '';
  }

  // Bloqueia esquemas perigosos
  if (trimmed.toLowerCase().startsWith('javascript:') || trimmed.toLowerCase().startsWith('vbscript:')) {
    return '';
  }

  return sanitizeString(trimmed, 2048);
}

/**
 * Sanitiza números de telefone / WhatsApp
 */
export function sanitizePhone(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input.replace(/[^\d()+\s-]/g, '').slice(0, 20);
}

/**
 * Normaliza FAQs antes de persistir ou expor os dados estruturados do artigo.
 */
export function sanitizeFaqs(input: unknown): FaqItem[] {
  if (!Array.isArray(input)) return [];

  return input
    .filter(item => item && typeof item === 'object')
    .map(item => {
      const faq = item as Record<string, unknown>;
      return {
        question: sanitizeString(faq.question, 240),
        answer: sanitizeString(faq.answer, 1200),
      };
    })
    .filter(faq => faq.question && faq.answer)
    .slice(0, 10);
}

/**
 * Chaves que contêm HTML rico ou textos extensos e não devem ser truncados nem ter tags removidas
 */
const IMAGE_KEYS = new Set([
  'image',
  'imageUrl',
  'avatar',
  'logo',
  'photo',
  'thumbnail',
  'cover'
]);

const RICH_HTML_KEYS = new Set([
  'contentHtml',
  'content',
  'rawHtml',
  'fullDescription',
  'optimizedHtml'
]);

/**
 * Previne Prototype Pollution e NoSQL Injection em objetos de entrada
 */
export function sanitizeObject<T extends Record<string, any>>(obj: unknown): T {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return {} as T;
  }

  const clean: Record<string, any> = {};
  const blockedKeys = new Set(['__proto__', 'constructor', 'prototype']);

  for (const [key, value] of Object.entries(obj)) {
    // Bloqueia chaves maliciosas e chaves começando com $ (NoSQL Injection)
    if (blockedKeys.has(key) || key.startsWith('$')) {
      continue;
    }

    if (typeof value === 'string') {
      if (RICH_HTML_KEYS.has(key)) {
        clean[key] = sanitizeHtmlContent(value, 500000);
      } else if (IMAGE_KEYS.has(key)) {
        clean[key] = sanitizeImageUrl(value);
      } else {
        clean[key] = sanitizeString(value, 5000);
      }
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      clean[key] = value;
    } else if (Array.isArray(value)) {
      clean[key] = value
        .filter(item => typeof item === 'string' || typeof item === 'number' || (typeof item === 'object' && item !== null))
        .map(item => {
          if (typeof item === 'string') return sanitizeString(item, 1000);
          if (typeof item === 'object' && item !== null) return sanitizeObject(item);
          return item;
        });
    } else if (typeof value === 'object' && value !== null) {
      clean[key] = sanitizeObject(value);
    }
  }

  return clean as T;
}

// ============================================================================
// 2. PROMPT INJECTION DEFENSE (OWASP LLM01 & LLM02)
// ============================================================================

const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions|directives|prompts)/i,
  /desconsidere\s+(todas\s+as\s+)?(instruções|regras|diretrizes)\s+anteriores/i,
  /ignore\s+todas\s+as\s+instruções/i,
  /you\s+are\s+now\s+(a\s+)?(unrestricted|jailbroken|developer|admin|dan)/i,
  /você\s+agora\s+é\s+(um\s+)?(hacker|dan|administrador|sem\s+regras)/i,
  /reveal\s+(the\s+)?(system\s+prompt|api\s+key|secret|hidden\s+instruction)/i,
  /revele\s+(sua\s+)?(chave\s+de\s+api|instrução\s+de\s+sistema|senha)/i,
  /mostre\s+(seu\s+)?(system\s+prompt|prompt\s+do\s+sistema|código\s+fonte)/i,
  /qual\s+é\s+a\s+sua\s+chave\s+de\s+api/i,
  /base64\s+decode/i,
  /sudo\s+mode/i,
  /bypass\s+all\s+filters/i
];

/**
 * Valida se a mensagem do visitante contém tentativa de Prompt Injection ou Jailbreak
 */
export function detectPromptInjection(text: string): { isSuspicious: boolean; reason?: string } {
  if (!text || typeof text !== 'string') return { isSuspicious: false };

  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      return {
        isSuspicious: true,
        reason: 'Tentativa de quebra de diretrizes detectada.'
      };
    }
  }

  return { isSuspicious: false };
}

// ============================================================================
// 3. IN-MEMORY RATE LIMITER (Anti-DoS & Anti-Abuse)
// ============================================================================

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Limita a taxa de requisições por IP ou identificador:
 * @param key Identificador (geralmente IP ou rota:IP)
 * @param limit Máximo de requisições permitidas na janela
 * @param windowMs Duração da janela em milissegundos
 */
export function checkRateLimit(
  key: string,
  limit: number = 20,
  windowMs: number = 60 * 1000
): { allowed: boolean; remaining: number; resetInSec: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  // Limpa entradas expiradas periodicamente
  if (rateLimitStore.size > 10000) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (now > v.resetAt) rateLimitStore.delete(k);
    }
  }

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetInSec: Math.ceil(windowMs / 1000) };
  }

  if (record.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetInSec: Math.ceil((record.resetAt - now) / 1000)
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: limit - record.count,
    resetInSec: Math.ceil((record.resetAt - now) / 1000)
  };
}

/**
 * Obtém o IP do cliente de forma segura em Next.js / Vercel
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}
