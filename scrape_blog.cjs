const fs = require('fs');
const path = require('path');
const https = require('https');

const urls = [
  'https://easytraining.com.br/importancia-do-excel-no-mercado-de-trabalho/',
  'https://easytraining.com.br/guia-definitivo-curso-auxiliar-veterinario-guarulhos/',
  'https://easytraining.com.br/jovem-aprendiz-2026-guarulhos-idade-salario/',
  'https://easytraining.com.br/como-ser-estagiario-pelo-ciee-guia-completo-e-dicas-essenciais/',
  'https://easytraining.com.br/carreira-em-medicina-veterinaria-vale-a-pena/',
  'https://easytraining.com.br/curso-de-informatica-basicadesvende-o-mundo-digital/',
  'https://easytraining.com.br/o-que-se-faz-em-um-curso-de-informatica/',
  'https://easytraining.com.br/auxiliar-de-farmacia/',
  'https://easytraining.com.br/descubra-a-importancia-de-um-curso-de-informatica-basica/'
];

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function cleanHtml(html) {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
}

function extractPostData(html, url) {
  const urlObj = new URL(url);
  const slug = urlObj.pathname.replace(/^\/|\/$/g, '');

  let title = '';
  const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i);
  const titleTagMatch = html.match(/<title>(.*?)<\/title>/i);
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  
  if (h1Match && h1Match[1].trim()) {
    title = h1Match[1].replace(/<[^>]+>/g, '').trim();
  } else if (ogTitleMatch) {
    title = ogTitleMatch[1].split(' - ')[0].trim();
  } else if (titleTagMatch) {
    title = titleTagMatch[1].split(' - ')[0].trim();
  }

  let excerpt = '';
  const ogDescMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i);
  const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
  if (ogDescMatch) excerpt = ogDescMatch[1];
  else if (metaDescMatch) excerpt = metaDescMatch[1];

  let image = '';
  const ogImgMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i);
  if (ogImgMatch) image = ogImgMatch[1];

  let date = '2026-08-15';
  const dateMatch = html.match(/datePublished["']:\s*["'](\d{4}-\d{2}-\d{2})/i) || 
                    html.match(/article:published_time["']\s+content=["'](\d{4}-\d{2}-\d{2})/i);
  if (dateMatch) date = dateMatch[1];

  // Try to find elementor post content or entry-content or standard article
  let content = '';
  const postContentMatch = html.match(/<div[^>]*class="[^"]*elementor-widget-theme-post-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/i) ||
                           html.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                           html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);

  if (postContentMatch) {
    content = postContentMatch[1];
  } else {
    const pMatches = html.match(/<p[^>]*>[\s\S]*?<\/p>/gi);
    if (pMatches) {
      content = pMatches.join('\n');
    }
  }

  let category = 'Mercado de Trabalho';
  let relatedCourse = 'assistente-administrativo';
  if (slug.includes('veterinario') || slug.includes('veterinaria')) {
    category = 'Saúde & Pet';
    relatedCourse = 'auxiliar-veterinario';
  } else if (slug.includes('excel')) {
    category = 'Tecnologia & Informática';
    relatedCourse = 'excel-avancado';
  } else if (slug.includes('informatica')) {
    category = 'Tecnologia & Informática';
    relatedCourse = 'curso-de-informatica-basica';
  } else if (slug.includes('farmacia')) {
    category = 'Saúde & Farmácia';
    relatedCourse = 'auxiliar-de-farmacia';
  } else if (slug.includes('jovem-aprendiz') || slug.includes('ciee') || slug.includes('estagiario')) {
    category = 'Primeiro Emprego & Carreira';
    relatedCourse = 'assistente-administrativo';
  }

  return {
    slug,
    url,
    title,
    excerpt,
    date,
    category,
    image,
    relatedCourse,
    rawHtml: cleanHtml(content)
  };
}

async function run() {
  const results = [];
  for (const url of urls) {
    console.log('Fetching:', url);
    try {
      const html = await fetchUrl(url);
      const data = extractPostData(html, url);
      results.push(data);
      console.log('Done:', data.title, `(${data.slug})`);
    } catch (e) {
      console.error('Error fetching', url, e.message);
    }
  }

  const outPath = path.join(__dirname, 'extracted_posts.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`Successfully extracted ${results.length} posts to ${outPath}`);
}

run();
