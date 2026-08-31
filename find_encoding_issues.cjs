const fs = require('fs');
const path = require('path');

function scanDir(dir, results = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== 'dist' && file !== '.git') {
        scanDir(fullPath, results);
      }
    } else if (/\.(tsx|ts|jsx|js|html|css|json)$/i.test(file)) {
      const buffer = fs.readFileSync(fullPath);
      const content = buffer.toString('utf-8');
      
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        // Check for \uFFFD (diamond with question mark) or Latin1 mojibake sequences
        if (/[\uFFFD]|[\xC2-\xF4][\x80-\xBF]{0,1}(?=[A-Za-z0-9])|D\?vidas|Ol\?|d\?vidas|d\ufffdvidas|Ol\ufffd|D\ufffdvidas/i.test(line)) {
          results.push({
            file: fullPath.replace(/\\/g, '/'),
            line: index + 1,
            content: line.trim()
          });
        }
      });
    }
  }
  return results;
}

const found = scanDir(path.join(__dirname, 'src'));
console.log(`Found ${found.length} lines with encoding issues:`);
console.log(JSON.stringify(found, null, 2));
