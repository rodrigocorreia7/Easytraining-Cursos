export interface CourseModule {
  title: string;
  topics: string[];
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  category: string;
  categorySlug: string;
  shortDescription: string;
  fullDescription: string;
  duration: string;
  modality: string;
  certificate: boolean;
  image: string;
  featured?: boolean;
  modules: CourseModule[];
  targetAudience: string;
  careerOpportunities: string[];
  whatsappMessage: string;
}

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

export interface BlogPost {
  id: number | string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  contentHtml?: string;
  date: string;
  author?: string;
  authorRole?: string;
  category: string;
  readTime: string;
  image: string;
  headings?: HeadingItem[];
  faqs?: FaqItem[];
  relatedCourse?: RelatedCourseInfo;
  tags?: string[];
  published?: boolean;
  views?: number;
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor';
}
