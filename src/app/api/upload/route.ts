import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { verifyAdminSession } from '@/lib/authServer';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif'
]);

const ALLOWED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.svg',
  '.gif'
]);

/**
 * Validação de Magic Bytes (assinatura real do arquivo binário)
 * Impede que scripts maliciosos (PHP/JS/HTML) sejam renomeados para .jpg
 */
function isValidImageSignature(buffer: Buffer, ext: string): boolean {
  if (buffer.length < 4) return false;

  if (ext === '.png') {
    return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
  }
  if (ext === '.jpg' || ext === '.jpeg') {
    return buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
  }
  if (ext === '.webp') {
    // RIFF....WEBP
    return buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP';
  }
  if (ext === '.gif') {
    return buffer.subarray(0, 3).toString('ascii') === 'GIF';
  }
  if (ext === '.svg') {
    // Para SVG (texto XML), verificar se contém tags de script perigosas
    const content = buffer.toString('utf-8', 0, Math.min(buffer.length, 2048));
    if (/<script|javascript:|onload|onerror/i.test(content)) {
      return false; // Bloqueia SVG com vetores de XSS
    }
    return content.includes('<svg');
  }

  return false;
}

export async function POST(request: NextRequest) {
  try {
    const auth = verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: 'Acesso não autorizado. Faça login como administrador.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    // 1. Validação de Tamanho Máximo
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. O limite máximo permitido é de 5MB.' }, 
        { status: 413 }
      );
    }

    // 2. Validação do Tipo MIME
    if (!ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Apenas imagens (WebP, PNG, JPG, SVG) são aceitas.' }, 
        { status: 415 }
      );
    }

    // 3. Validação de Extensão
    const sanitizedOriginal = path.basename(file.name.toLowerCase()).replace(/[^a-z0-9.-]/g, '');
    const ext = path.extname(sanitizedOriginal);

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json({ error: 'Extensão de arquivo não permitida.' }, { status: 415 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Verificação de Integridade / Assinatura do Arquivo (Magic Bytes)
    if (!isValidImageSignature(buffer, ext)) {
      return NextResponse.json(
        { error: 'O conteúdo do arquivo é inválido ou não corresponde ao formato declarado.' }, 
        { status: 400 }
      );
    }

    // 5. Nome Seguro Criptográfico (Prevenção total de Path Traversal)
    const randomHash = crypto.randomBytes(16).toString('hex');
    const safeFileName = `upload-${randomHash}${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, safeFileName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeFileName}`;

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      fileName: safeFileName
    });
  } catch (error) {
    console.error('Erro de segurança no upload:', error);
    return NextResponse.json(
      { error: 'Não foi possível processar o envio do arquivo com segurança.' }, 
      { status: 500 }
    );
  }
}
