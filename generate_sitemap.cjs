const fs = require('fs');
const path = require('path');

const courses = [
  'auxiliar-de-farmacia',
  'curso-de-tosa-pet-geral-em-guarulhos-sp',
  'banho-e-tosa-higienica',
  'auxiliar-veterinario',
  'assistente-de-recursos-humanos',
  'assistente-administrativo',
  'assistente-de-logistica',
  'auxiliar-de-contabilidade',
  'gestao-comercial',
  'designer-grafico',
  'marketing-digital',
  'projetista-digital',
  'arte-finalista',
  'curso-de-informatica-basica',
  'excel-avancado',
  'informatica-empresarial',
  'informatica-avancada',
  'informatica-aplicada-aos-estudos',
  'informatica'
];

const blogSlugs = [
  'importancia-do-excel-no-mercado-de-trabalho',
  'guia-definitivo-curso-auxiliar-veterinario-guarulhos',
  'jovem-aprendiz-2026-guarulhos-idade-salario',
  'como-ser-estagiario-pelo-ciee-guia-completo-e-dicas-essenciais',
  'carreira-em-medicina-veterinaria-vale-a-pena',
  'curso-de-informatica-basicadesvende-o-mundo-digital',
  'o-que-se-faz-em-um-curso-de-informatica',
  'auxiliar-de-farmacia',
  'descubra-a-importancia-de-um-curso-de-informatica-basica',
  'a-importancia-da-educacao-profissionalizante-para-o-mercado-de-trabalho'
];

const today = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://easytraining.com.br/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://easytraining.com.br/contato</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://easytraining.com.br/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://easytraining.com.br/politica-de-privacidade</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://easytraining.com.br/termos-de-uso</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;

courses.forEach(slug => {
  xml += `  <url>
    <loc>https://easytraining.com.br/curso/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;
});

blogSlugs.forEach(slug => {
  xml += `  <url>
    <loc>https://easytraining.com.br/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
});

xml += `</urlset>\n`;

fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), xml, 'utf-8');
console.log('sitemap.xml updated with full courses, blog, and LGPD legal routes!');
