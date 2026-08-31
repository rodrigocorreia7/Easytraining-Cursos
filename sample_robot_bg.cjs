const sharp = require('sharp');
const path = require('path');

async function getFrameBgColor() {
  const imgPath = path.join(__dirname, 'public', 'images', 'robot', 'frames', 'frame_035.webp');
  const { data, info } = await sharp(imgPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Sample top-left corner (0,0), top-right (width-1, 0), bottom-left (0, height-1)
  const getPixel = (x, y) => {
    const idx = (y * info.width + x) * info.channels;
    return {
      r: data[idx],
      g: data[idx + 1],
      b: data[idx + 2],
      a: info.channels === 4 ? data[idx + 3] : 255
    };
  };

  const topLeft = getPixel(5, 5);
  const topRight = getPixel(info.width - 5, 5);
  const midTop = getPixel(Math.floor(info.width / 2), 5);
  const midLeft = getPixel(5, Math.floor(info.height / 2));

  console.log('TopLeft pixel:', topLeft, `#${topLeft.r.toString(16).padStart(2,'0')}${topLeft.g.toString(16).padStart(2,'0')}${topLeft.b.toString(16).padStart(2,'0')}`);
  console.log('TopRight pixel:', topRight, `#${topRight.r.toString(16).padStart(2,'0')}${topRight.g.toString(16).padStart(2,'0')}${topRight.b.toString(16).padStart(2,'0')}`);
  console.log('MidTop pixel:', midTop, `#${midTop.r.toString(16).padStart(2,'0')}${midTop.g.toString(16).padStart(2,'0')}${midTop.b.toString(16).padStart(2,'0')}`);
  console.log('MidLeft pixel:', midLeft, `#${midLeft.r.toString(16).padStart(2,'0')}${midLeft.g.toString(16).padStart(2,'0')}${midLeft.b.toString(16).padStart(2,'0')}`);
}

getFrameBgColor();
