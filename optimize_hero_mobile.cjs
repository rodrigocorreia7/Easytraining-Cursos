const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function optimizeHeroMobile() {
  const input = path.join(__dirname, 'public', 'images', 'robot', 'image-hero.webp');
  const buffer = fs.readFileSync(input);

  const optBuffer = await sharp(buffer)
    .resize({ width: 720, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toBuffer();

  fs.writeFileSync(input, optBuffer);
  console.log(`Mobile hero image compressed to ${(optBuffer.length / 1024).toFixed(1)} KB!`);
}

optimizeHeroMobile();
