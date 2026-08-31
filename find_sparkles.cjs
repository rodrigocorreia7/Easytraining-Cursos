const fs = require('fs');
const path = require('path');

function searchInDir(dir, pattern) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fullPath = path.join(dir, f);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (f !== 'node_modules' && f !== '.next' && f !== 'dist' && f !== '.git') {
        searchInDir(fullPath, pattern);
      }
    } else if (/\.(tsx|ts|jsx|js)$/i.test(f)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      if (pattern.test(content)) {
        console.log(`Found in: ${path.relative(path.join(__dirname, 'src'), fullPath)}`);
      }
    }
  }
}

searchInDir(path.join(__dirname, 'src'), /Sparkles/i);
