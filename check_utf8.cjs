const fs = require('fs');
const path = require('path');

function checkValidUtf8(dir) {
  const badFiles = [];
  function walk(current) {
    const files = fs.readdirSync(current);
    for (const f of files) {
      const p = path.join(current, f);
      const stat = fs.statSync(p);
      if (stat.isDirectory()) {
        if (f !== 'node_modules' && f !== '.next' && f !== 'dist' && f !== '.git') {
          walk(p);
        }
      } else if (/\.(tsx|ts|jsx|js|html|css|json)$/i.test(f)) {
        const buf = fs.readFileSync(p);
        const str = buf.toString('utf-8');
        // Check for replacement character \uFFFD
        if (str.indexOf('\uFFFD') !== -1 || str.indexOf('\u00ef\u00bf\u00bd') !== -1) {
          badFiles.push(p);
        }
      }
    }
  }
  walk(dir);
  return badFiles;
}

const bad = checkValidUtf8(path.join(__dirname, 'src'));
console.log('Bad files count:', bad.length);
console.log('Bad files:', bad);
