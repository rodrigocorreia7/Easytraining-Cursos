const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, 'public', 'images');

async function convertDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'frames') { // robot frames are already webp
        await convertDirectory(fullPath);
      }
    } else if (/\.(png|jpe?g)$/i.test(entry.name)) {
      const ext = path.extname(entry.name);
      const webpName = entry.name.replace(new RegExp(`\\${ext}$`, 'i'), '.webp');
      const webpPath = path.join(dir, webpName);

      try {
        const info = await sharp(fullPath)
          .webp({ quality: 85, effort: 6 })
          .toFile(webpPath);
        console.log(`Converted: ${path.relative(__dirname, fullPath)} -> ${webpName} (${info.size} bytes)`);
      } catch (err) {
        console.error(`Failed to convert ${fullPath}:`, err.message);
      }
    }
  }
}

(async () => {
  console.log('Starting batch WebP conversion...');
  await convertDirectory(imagesDir);
  console.log('All images converted to WebP successfully!');
})();
