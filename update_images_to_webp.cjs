const fs = require('fs');
const path = require('path');

function updateImagesInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fullPath = path.join(dir, f);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (f !== 'node_modules' && f !== '.next' && f !== 'dist' && f !== '.git') {
        updateImagesInDir(fullPath);
      }
    } else if (/\.(tsx|ts|jsx|js)$/i.test(f)) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      const original = content;

      // Replace /images/...png or /images/...jpg with .webp (except for svg or favicon/apple-touch-icon)
      content = content.replace(/\/images\/([^"'\s]+)\.(png|jpe?g)/gi, (match, p1, p2) => {
        return `/images/${p1}.webp`;
      });

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated images to WebP in: ${path.relative(__dirname, fullPath)}`);
      }
    }
  }
}

updateImagesInDir(path.join(__dirname, 'src'));
console.log('Finished updating source files to .webp references.');
