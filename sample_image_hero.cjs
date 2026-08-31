const sharp = require('sharp');
const path = require('path');

async function sampleImageHero() {
  const imgPath = path.join(__dirname, 'public', 'images', 'robot', 'image-hero.webp');
  const { data, info } = await sharp(imgPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const getPixel = (x, y) => {
    const idx = (y * info.width + x) * info.channels;
    return {
      r: data[idx],
      g: data[idx + 1],
      b: data[idx + 2],
      a: info.channels === 4 ? data[idx + 3] : 255
    };
  };

  console.log('image-hero pixel (5,5):', getPixel(5, 5));
}

sampleImageHero();
