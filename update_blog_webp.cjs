const fs = require('fs');
const p = 'src/data/blogPostsReal.ts';
let c = fs.readFileSync(p, 'utf-8');
c = c.replace(/\/images\/([^"'\s]+)\.(png|jpe?g)/gi, '/images/$1.webp');
fs.writeFileSync(p, c, 'utf-8');
console.log('blogPostsReal.ts updated successfully with .webp images');
