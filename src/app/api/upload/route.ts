import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitizar nome do arquivo e adicionar timestamp único
    const originalName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, '-');
    const ext = path.extname(originalName) || '.webp';
    const baseName = path.basename(originalName, ext);
    const fileName = `${baseName}-${Date.now()}${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      fileName
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json({ error: 'Falha ao salvar arquivo.' }, { status: 500 });
  }
}
