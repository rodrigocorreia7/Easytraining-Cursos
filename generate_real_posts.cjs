const fs = require('fs');
const path = require('path');

const rawPosts = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted_posts.json'), 'utf-8'));

function estimateReadTime(text) {
  const words = text.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 180));
  return `${minutes} min`;
}

function extractHeadings(html) {
  const headings = [];
  const regex = /<h([23])[^>]*>(.*?)<\/h\1>/gi;
  let match;
  let index = 0;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&#8211;/g, '-').replace(/&#8220;/g, '"').replace(/&#8221;/g, '"').trim();
    if (text && !text.toLowerCase().includes('veja outras') && !text.toLowerCase().includes('compartilhar') && text.length > 2) {
      const id = `heading-${index++}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)}`;
      headings.push({ level, text, id });
    }
  }
  return headings;
}

function cleanPostHtml(html) {
  if (!html) return '';
  let cleaned = html
    // Fix lazy loaded images: replace dummy SVG data src with real data-src
    .replace(/<img[^>]*data-src=["']([^"']+)["'][^>]*>/gi, (imgTag, realSrc) => {
      // Extract alt if available
      const altMatch = imgTag.match(/alt=["'](.*?)["']/i);
      const alt = altMatch ? altMatch[1] : '';
      return `<img src="${realSrc}" alt="${alt}" class="w-full h-auto rounded-2xl my-6 shadow-md object-cover max-h-[500px]" loading="lazy" />`;
    })
    // Remove unwanted Yoast / social / empty tags
    .replace(/<div class="elementor-widget-theme-post-content">/gi, '')
    .replace(/<ul class="wp-block-social-links[\s\S]*?<\/ul>/gi, '')
    .replace(/<section class="elementor-section[\s\S]*?<\/section>/gi, '')
    .replace(/<div class="schema-faq[\s\S]*?<\/div>\s*<\/div>/gi, '') // FAQs can be extracted separately
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8211;/g, '–')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8217;/g, "'")
    .replace(/&#038;/g, '&')
    .trim();

  return cleaned;
}

function extractFaqs(html) {
  const faqs = [];
  const regex = /<div class="schema-faq-section"[^>]*>[\s\S]*?<strong class="schema-faq-question"><strong>(.*?)<\/strong><\/strong>\s*<p class="schema-faq-answer">(.*?)<\/p>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const question = match[1].replace(/<[^>]+>/g, '').trim();
    const answer = match[2].replace(/<[^>]+>/g, '').trim();
    if (question && answer) {
      faqs.push({ question, answer });
    }
  }
  return faqs;
}

const coursesMap = {
  'excel-avancado': {
    name: 'Excel Avançado com Dashboards',
    tagline: 'Domine planilhas, automações e relatórios visuais que as empresas exigem.',
    duration: '40 Horas',
    category: 'Tecnologia & Informática',
    link: '#cursos'
  },
  'auxiliar-veterinario': {
    name: 'Auxiliar Veterinário',
    tagline: 'Aprenda procedimentos clínicos, primeiros socorros e cuidados com animais.',
    duration: '80 Horas',
    category: 'Saúde & Pet',
    link: '#cursos'
  },
  'curso-de-informatica-basica': {
    name: 'Informática Fundamental & Pacote Office',
    tagline: 'O curso essencial para entrar no mercado de trabalho e dominar o computador.',
    duration: '60 Horas',
    category: 'Tecnologia & Informática',
    link: '#cursos'
  },
  'auxiliar-de-farmacia': {
    name: 'Auxiliar de Farmácia & Drogaria',
    tagline: 'Capacitação completa para atendimento, leitura de receitas e balcão.',
    duration: '60 Horas',
    category: 'Saúde & Farmácia',
    link: '#cursos'
  },
  'assistente-administrativo': {
    name: 'Assistente Administrativo Completo',
    tagline: 'Rotinas de escritório, finanças, atendimento corporativo e comunicação.',
    duration: '70 Horas',
    category: 'Gestão & Negócios',
    link: '#cursos'
  }
};

const formattedPosts = rawPosts.map((post, idx) => {
  const readTime = estimateReadTime(post.rawHtml || post.excerpt);
  const headings = extractHeadings(post.rawHtml || '');
  const faqs = extractFaqs(post.rawHtml || '');
  const cleanedHtml = cleanPostHtml(post.rawHtml || `<p>${post.excerpt}</p>`);
  const courseInfo = coursesMap[post.relatedCourse] || coursesMap['assistente-administrativo'];

  return {
    id: idx + 1,
    slug: post.slug,
    title: post.title.replace(/&#8211;/g, '–').replace(/&#8220;/g, '“').replace(/&#8221;/g, '”').replace(/&#8217;/g, "'").replace(/&nbsp;/g, ' ').trim(),
    excerpt: post.excerpt.replace(/&#8211;/g, '–').replace(/&#8220;/g, '“').replace(/&#8221;/g, '”').replace(/&#8217;/g, "'").replace(/&nbsp;/g, ' ').trim(),
    date: post.date || '2026-08-15',
    author: 'EasyTraining Equipe Pedagógica',
    authorRole: 'Especialistas em Carreira e Qualificação',
    category: post.category,
    readTime,
    image: post.image || '/images/wordpress/diverse-work-team-working-in-the-office-ZD9JBTU.jpg',
    headings,
    faqs,
    relatedCourse: {
      slug: post.relatedCourse,
      name: courseInfo.name,
      tagline: courseInfo.tagline,
      duration: courseInfo.duration,
      category: courseInfo.category
    },
    contentHtml: cleanedHtml,
    tags: [post.category, 'Guarulhos', 'Cursos Profissionalizantes', 'Mercado de Trabalho', 'Certificado']
  };
});

const tsOutput = `// Base de dados integral dos artigos reais do blog da EasyTraining
export interface HeadingItem {
  level: number;
  text: string;
  id: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedCourseInfo {
  slug: string;
  name: string;
  tagline: string;
  duration: string;
  category: string;
}

export interface RealBlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  authorRole: string;
  category: string;
  readTime: string;
  image: string;
  headings: HeadingItem[];
  faqs: FaqItem[];
  relatedCourse: RelatedCourseInfo;
  contentHtml: string;
  tags: string[];
}

export const realBlogPosts: RealBlogPost[] = ${JSON.stringify(formattedPosts, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, 'src', 'data', 'blogPostsReal.ts'), tsOutput, 'utf-8');
console.log(`Generated src/data/blogPostsReal.ts with ${formattedPosts.length} rich real posts!`);
