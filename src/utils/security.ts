/**
 * Utilitários de Segurança e Sanitização
 * Em conformidade com OWASP Top 10 (2025/2026) e Canonico Segurança.md
 */

/**
 * Sanitiza texto de entrada contra injeções de HTML/XSS
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitiza e normaliza slugs para URLs seguras (protege contra Directory Traversal)
 */
export function sanitizeSlug(slug: string): string {
  if (!slug || typeof slug !== 'string') return '';
  return slug
    .toLowerCase()
    .trim()
    .replace(/\.\./g, '') // remove directory traversal attempt
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Validação rigorosa de extensões e tipos MIME para uploads de imagens
 */
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif'
]);

const ALLOWED_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'png',
  'webp',
  'svg',
  'gif'
]);

export function validateImageUpload(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'Nenhum arquivo selecionado.' };
  }

  // Limite de 5MB por imagem
  const MAX_SIZE_BYTES = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE_BYTES) {
    return { valid: false, error: 'O tamanho da imagem excede o limite máximo permitido de 5MB.' };
  }

  // Validação de tipo MIME
  if (!ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
    return { valid: false, error: 'Tipo de arquivo não permitido. Apenas imagens WebP, PNG, JPG e SVG são aceitas.' };
  }

  // Validação de extensão real do nome do arquivo
  const parts = file.name.split('.');
  const ext = parts.length > 1 ? parts.pop()?.toLowerCase() : '';
  if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
    return { valid: false, error: 'Extensão de arquivo inválida ou não suportada.' };
  }

  return { valid: true };
}
