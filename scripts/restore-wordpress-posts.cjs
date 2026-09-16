#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const TARGET_SLUGS = [
  'curso-de-auxiliar-de-veterinario-tudo-que-voce-precisa-saber',
  'cursos-presenciais-ou-online-em-guarulhos',
  'qualificacao-profissional-em-guarulhos',
  'cursos-livres-em-guarulhos',
  'cursos-profissionalizantes-em-guarulhos',
];

const FALLBACK_IMAGE = '/images/courses/informatica-basica.webp';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function decodeHtml(value = '') {
  return String(value)
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number(decimal)))
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '…')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rsquo;/g, '’')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function stripHtml(value = '') {
  return decodeHtml(String(value).replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(value) {
  return stripHtml(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function localMediaPath(sourceUrl, publicImagesDir) {
  if (!sourceUrl) return FALLBACK_IMAGE;
  const rawFilename = decodeURIComponent(String(sourceUrl).split('/').pop().split('?')[0]);
  if (!rawFilename) return FALLBACK_IMAGE;
  return fs.existsSync(path.join(publicImagesDir, rawFilename))
    ? `/images/courses/${rawFilename}`
    : FALLBACK_IMAGE;
}

function rewriteInternalLinks(html) {
  return TARGET_SLUGS.reduce((result, slug) => {
    const escapedSlug = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return result
      .replace(new RegExp(`(href=["'])(?:https?:\\/\\/(?:www\\.)?easytraining\\.com\\.br)?\\/${escapedSlug}\\/?(["'])`, 'gi'), `$1/blog/${slug}$2`)
      .replace(new RegExp(`(href=["'])\\/${escapedSlug}\\/?(["'])`, 'gi'), `$1/blog/${slug}$2`);
  }, html);
}

function rewriteMediaUrls(html) {
  return String(html).replace(/https:\/\/(?:www\.)?easytraining\.com\.br\/wp-content\/uploads\/[^\s"'>]+/g, (url) => {
    const filename = decodeURIComponent(url.split('/').pop().split('?')[0]);
    if (!filename) return url;
    const resizedMatch = filename.match(/^(.*)-\d+x\d+(\.[^.]+)$/);
    const baseFilename = resizedMatch ? `${resizedMatch[1]}${resizedMatch[2]}` : filename;
    const usableFilename = fs.existsSync(path.join(publicImagesDir, filename))
      ? filename
      : fs.existsSync(path.join(publicImagesDir, baseFilename))
        ? baseFilename
        : filename;
    return `/images/courses/${usableFilename}`;
  });
}

function extractHeadings(contentHtml) {
  const headings = [];
  const usedIds = new Set();
  const pattern = /<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match;

  while ((match = pattern.exec(contentHtml)) !== null) {
    const text = stripHtml(match[2]);
    if (!text) continue;
    let id = slugify(text) || `secao-${headings.length + 1}`;
    let suffix = 2;
    while (usedIds.has(id)) id = `${slugify(text) || 'secao'}-${suffix++}`;
    usedIds.add(id);
    headings.push({ id, text, level: Number(match[1]) });
  }

  return headings;
}

function categoryForPost(post) {
  const title = stripHtml(post.title?.rendered || '').toLowerCase();
  if (title.includes('veterin')) return 'Saúde & Pet';
  if (title.includes('profissional') || title.includes('qualificação') || title.includes('qualificacao')) {
    return 'Carreira & Mercado';
  }
  return 'Educação Profissional';
}

function readTimeFor(contentHtml) {
  const words = stripHtml(contentHtml).split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 180))} min`;
}

function toBlogPost(post, mediaById, publicImagesDir) {
  const contentHtml = rewriteMediaUrls(rewriteInternalLinks(post.content?.rendered || ''));
  const title = decodeHtml(post.title?.rendered || '');
  const description = decodeHtml(post.yoast_head_json?.description || '');
  const excerpt = stripHtml(post.excerpt?.rendered || '').replace(/…$/, '').trim();
  const media = mediaById.get(Number(post.featured_media));

  return {
    id: post.id,
    slug: post.slug,
    title,
    excerpt: description || excerpt,
    contentHtml,
    date: post.date,
    author: 'EasyTraining Equipe Pedagógica',
    authorRole: 'Equipe pedagógica',
    category: categoryForPost(post),
    readTime: readTimeFor(contentHtml),
    image: localMediaPath(media?.source_url, publicImagesDir),
    headings: extractHeadings(contentHtml),
    faqs: [],
    tags: [],
    published: true,
  };
}

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    if (!argv[i].startsWith('--')) continue;
    args[argv[i].slice(2)] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
  }
  return args;
}

const args = parseArgs(process.argv);
const repoRoot = path.resolve(__dirname, '..');
const sourceDir = path.resolve(args.source || path.join(repoRoot, '..', 'Site Wordpress', 'extracted_data'));
const outputFile = path.resolve(args.output || path.join(repoRoot, 'src', 'data', 'legacyWordpressPosts.ts'));
const publicImagesDir = path.join(repoRoot, 'public', 'images', 'courses');

const posts = readJson(path.join(sourceDir, 'posts_raw.json'))
  .filter((post) => TARGET_SLUGS.includes(post.slug))
  .sort((a, b) => TARGET_SLUGS.indexOf(a.slug) - TARGET_SLUGS.indexOf(b.slug));
const media = readJson(path.join(sourceDir, 'media_raw.json'));
const mediaById = new Map(media.map((item) => [Number(item.id), item]));

const sourceMediaDir = path.join(sourceDir, 'media');
const referencedFilenames = new Set();
for (const post of posts) {
  const html = `${post.content?.rendered || ''} ${mediaById.get(Number(post.featured_media))?.source_url || ''}`;
  for (const url of html.match(/https:\/\/(?:www\.)?easytraining\.com\.br\/wp-content\/uploads\/[^\s"'>]+/g) || []) {
    const filename = decodeURIComponent(url.split('/').pop().split('?')[0]);
    if (filename) referencedFilenames.add(filename);
  }
}
fs.mkdirSync(publicImagesDir, { recursive: true });
for (const filename of referencedFilenames) {
  const sourceFile = path.join(sourceMediaDir, filename);
  const targetFile = path.join(publicImagesDir, filename);
  if (fs.existsSync(sourceFile) && !fs.existsSync(targetFile)) fs.copyFileSync(sourceFile, targetFile);
}

if (posts.length !== TARGET_SLUGS.length) {
  throw new Error(`Esperados ${TARGET_SLUGS.length} artigos, encontrados ${posts.length}.`);
}

const output = `import type { BlogPost } from '../types';\n\n/** Artigos recuperados do backup WordPress durante a migração para o Next.js. */\nexport const legacyWordpressPosts: BlogPost[] = ${JSON.stringify(posts.map((post) => toBlogPost(post, mediaById, publicImagesDir)), null, 2)};\n`;
fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, output, 'utf8');

console.log(`Artigos restaurados: ${posts.map((post) => post.slug).join(', ')}`);
console.log(`Arquivo gerado: ${outputFile}`);
