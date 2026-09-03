import { NextRequest, NextResponse } from 'next/server';

/**
 * Enterprise-Grade Security Utility for Next.js (EasyTraining)
 * Aligned with OWASP Top 10 (2025/2026) and OWASP Top 10 for LLM Applications.
 */

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
    // Remove operadores de injeção NoSQL e comandos SQL clássicos
    .replace(/(\$where|\$gt|\$lt|\$ne|\$regex|\$or|\$and)/gi, '')
    .replace(/(--|;|\/\*|\*\/)/g, '')
    // Normaliza caracteres de controle
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, '');
}

/**
 * Sanitiza números de telefone / WhatsApp
 */
export function sanitizePhone(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input.replace(/[^\d()+\s-]/g, '').slice(0, 20);
}

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
      clean[key] = sanitizeString(value, 2000);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      clean[key] = value;
    } else if (Array.isArray(value)) {
      clean[key] = value
        .filter(item => typeof item === 'string' || typeof item === 'number')
        .map(item => typeof item === 'string' ? sanitizeString(item, 500) : item);
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
