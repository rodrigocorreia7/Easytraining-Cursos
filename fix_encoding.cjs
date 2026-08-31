const fs = require('fs');
const path = require('path');

const replacements = [
  // Specific phrases
  { search: /Ol[\uFFFD\?]!/g, replace: 'Olá!' },
  { search: /d[\uFFFD\?]vidas/gi, replace: (m) => m[0] === 'D' ? 'Dúvidas' : 'dúvidas' },
  { search: /D[\uFFFD\?]vidas\?/g, replace: 'Dúvidas?' },
  { search: /atrav[\uFFFD\?]s/gi, replace: (m) => m[0] === 'A' ? 'Através' : 'através' },
  { search: /pr[\uFFFD\?]tica/gi, replace: (m) => m[0] === 'P' ? 'Prática' : 'prática' },
  { search: /pr[\uFFFD\?]ticas/gi, replace: (m) => m[0] === 'P' ? 'Práticas' : 'práticas' },
  { search: /pr[\uFFFD\?]tico/gi, replace: (m) => m[0] === 'P' ? 'Prático' : 'prático' },
  { search: /pr[\uFFFD\?]ticos/gi, replace: (m) => m[0] === 'P' ? 'Práticos' : 'práticos' },
  { search: /pedag[\uFFFD\?]gica/gi, replace: 'pedagógica' },
  { search: /pedag[\uFFFD\?]gico/gi, replace: 'pedagógico' },
  { search: /hor[\uFFFD\?]rio/gi, replace: 'horário' },
  { search: /inform[\uFFFD\?]tica/gi, replace: 'informática' },
  { search: /voc[\uFFFD\?]/gi, replace: (m) => m[0] === 'V' ? 'Você' : 'você' },
  { search: /est[\uFFFD\?]/gi, replace: 'está' },
  { search: /n[\uFFFD\?]o/gi, replace: 'não' },
  { search: /s[\uFFFD\?]o/gi, replace: 'são' },
  { search: /avalia[\uFFFD\?][\uFFFD\?]es/gi, replace: 'avaliações' },
  { search: /avalia[\uFFFD\?][\uFFFD\?]o/gi, replace: 'avaliação' },
  { search: /qualifica[\uFFFD\?][\uFFFD\?]o/gi, replace: 'qualificação' },
  { search: /forma[\uFFFD\?][\uFFFD\?]o/gi, replace: 'formação' },
  { search: /conclus[\uFFFD\?]o/gi, replace: 'conclusão' },
  { search: /in[\uFFFD\?]cio/gi, replace: 'início' },
  { search: /experi[\uFFFD\?]ncia/gi, replace: 'experiência' },
  { search: /profiss[\uFFFD\?]es/gi, replace: 'profissões' },
  { search: /matr[\uFFFD\?]cula/gi, replace: 'matrícula' },
  { search: /matr[\uFFFD\?]culas/gi, replace: 'matrículas' },
  { search: /gradua[\uFFFD\?][\uFFFD\?]o/gi, replace: 'graduação' },
  { search: /atua[\uFFFD\?][\uFFFD\?]o/gi, replace: 'atuação' },
  { search: /balc[\uFFFD\?]o/gi, replace: 'balcão' },
  { search: /vis[\uFFFD\?]o/gi, replace: 'visão' },
  { search: /gest[\uFFFD\?]o/gi, replace: 'gestão' },
  { search: /m[\uFFFD\?]dio/gi, replace: 'médio' },
  { search: /m[\uFFFD\?]dica/gi, replace: 'médica' },
  { search: /m[\uFFFD\?]dico/gi, replace: 'médico' },
  { search: /sal[\uFFFD\?]rio/gi, replace: 'salário' },
  { search: /sal[\uFFFD\?]rios/gi, replace: 'salários' },
  { search: /curr[\uFFFD\?]culo/gi, replace: 'currículo' },
  { search: /relat[\uFFFD\?]rio/gi, replace: 'relatório' },
  { search: /relat[\uFFFD\?]rios/gi, replace: 'relatórios' },
  { search: /estagi[\uFFFD\?]rio/gi, replace: 'estagiário' },
  { search: /estagi[\uFFFD\?]rios/gi, replace: 'estagiários' }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== 'dist' && file !== '.git') {
        processDir(fullPath);
      }
    } else if (/\.(tsx|ts|jsx|js|html|css|json|md)$/i.test(file)) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;

      // Check if file has \uFFFD or 
      if (content.includes('\uFFFD') || content.includes('')) {
        console.log('Fixing encoding in:', fullPath);
        for (const item of replacements) {
          if (item.search.test(content)) {
            content = content.replace(item.search, item.replace);
            changed = true;
          }
        }
        // Direct manual cleanup for any remaining 
        content = content
          .replace(/Ol!/g, 'Olá!')
          .replace(/dvidas/g, 'dúvidas')
          .replace(/Dvidas/g, 'Dúvidas')
          .replace(//g, ''); // strip any orphan replacement char

        fs.writeFileSync(fullPath, content, 'utf-8');
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
processDir(path.join(__dirname, 'public'));
console.log('Encoding fix script completed.');
