/**
 * Utilitário de compressão de imagens no navegador.
 * Redimensiona e converte para WebP leve (40KB - 90KB) antes de salvar no Firestore.
 */
export async function compressImageClient(
  file: File,
  maxWidth = 1200,
  quality = 0.82
): Promise<{ file: File; dataUrl: string }> {
  return new Promise((resolve) => {
    if (file.type === 'image/gif') {
      const reader = new FileReader();
      reader.onload = () => resolve({ file, dataUrl: reader.result as string });
      reader.onerror = () => resolve({ file, dataUrl: '' });
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ file, dataUrl: e.target?.result as string });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/webp', quality);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File(
                [blob],
                file.name.replace(/\.[^.]+$/, '.webp'),
                { type: 'image/webp', lastModified: Date.now() }
              );
              resolve({ file: compressedFile, dataUrl });
            } else {
              resolve({ file, dataUrl });
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => resolve({ file, dataUrl: e.target?.result as string });
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve({ file, dataUrl: '' });
    reader.readAsDataURL(file);
  });
}
