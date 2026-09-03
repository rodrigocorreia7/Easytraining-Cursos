import fs from 'fs';
import path from 'path';
import { Course, BlogPost } from '../types';
import { courses as defaultCourses } from '../data/coursesData';
import { realBlogPosts as defaultPosts } from '../data/blogPostsReal';
import { siteConfig as defaultSiteConfig } from '../data/siteConfig';

const DB_DIR = path.join(process.cwd(), 'src', 'data', 'db');
const COURSES_FILE = path.join(DB_DIR, 'courses.json');
const POSTS_FILE = path.join(DB_DIR, 'posts.json');
const CONFIG_FILE = path.join(DB_DIR, 'siteConfig.json');

function ensureDbDir() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

// ---------------------- COURSES ----------------------
export function getStoredCourses(): Course[] {
  ensureDbDir();
  if (!fs.existsSync(COURSES_FILE)) {
    saveStoredCourses(defaultCourses);
    return defaultCourses;
  }
  try {
    const raw = fs.readFileSync(COURSES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Erro ao ler courses.json:', error);
    return defaultCourses;
  }
}

export function saveStoredCourses(courses: Course[]): void {
  try {
    ensureDbDir();
    fs.writeFileSync(COURSES_FILE, JSON.stringify(courses, null, 2), 'utf-8');
  } catch {
    // Ambiente serverless somente-leitura
  }
}

export function resetStoredCourses(): Course[] {
  saveStoredCourses(defaultCourses);
  return defaultCourses;
}

// ---------------------- POSTS ----------------------
export function getStoredPosts(): BlogPost[] {
  try {
    ensureDbDir();
    if (!fs.existsSync(POSTS_FILE)) {
      saveStoredPosts(defaultPosts);
      return defaultPosts;
    }
    const raw = fs.readFileSync(POSTS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    return defaultPosts;
  }
}

export function saveStoredPosts(posts: BlogPost[]): void {
  try {
    ensureDbDir();
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf-8');
  } catch {
    // Ambiente serverless somente-leitura
  }
}

export function resetStoredPosts(): BlogPost[] {
  saveStoredPosts(defaultPosts);
  return defaultPosts;
}

// ---------------------- SITE CONFIG ----------------------
export type SiteConfigType = typeof defaultSiteConfig;

export function getStoredSiteConfig(): SiteConfigType {
  try {
    ensureDbDir();
    if (!fs.existsSync(CONFIG_FILE)) {
      saveStoredSiteConfig(defaultSiteConfig);
      return defaultSiteConfig;
    }
    const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    return defaultSiteConfig;
  }
}

export function saveStoredSiteConfig(config: SiteConfigType): void {
  try {
    ensureDbDir();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch {
    // Ambiente serverless somente-leitura
  }
}

export function resetStoredSiteConfig(): SiteConfigType {
  saveStoredSiteConfig(defaultSiteConfig);
  return defaultSiteConfig;
}
