import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc
} from 'firebase/firestore';
import { Course, BlogPost } from '../types';
import { getStoredCourses, getStoredPosts, getStoredSiteConfig, type SiteConfigType } from './db';

const COURSES_COLLECTION = 'courses';
const POSTS_COLLECTION = 'posts';
const CONFIG_COLLECTION = 'config';
const SITE_CONFIG_DOC = 'siteConfig';

let isFirestoreOperational: boolean | null = null;

async function withTimeout<T>(promise: Promise<T>, ms = 3000): Promise<T> {
  let timer: any;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Firestore timeout')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// ============================================================================
// 1. COURSES
// ============================================================================

export async function getCoursesFromFirestore(): Promise<Course[]> {
  const localCourses = getStoredCourses();

  try {
    const fetchPromise = getDocs(collection(db, COURSES_COLLECTION));
    const snapshot = await withTimeout(fetchPromise, 3000);

    isFirestoreOperational = true;

    if (snapshot.empty) {
      seedCoursesToFirestore(localCourses).catch(() => {});
      return localCourses;
    }

    const coursesMap = new Map<string, Course>();
    localCourses.forEach((c) => coursesMap.set(String(c.id), c));
    snapshot.forEach((d) => {
      const data = d.data() as Course;
      if (data && (data.id || data.slug)) {
        coursesMap.set(String(data.id), data);
      }
    });

    const courses = Array.from(coursesMap.values());
    courses.sort((a, b) => Number(a.id) - Number(b.id));
    return courses;
  } catch (error: any) {
    console.warn('Fallback para cursos locais devido a erro no Firestore:', error?.message);
    return localCourses;
  }
}

export async function saveCourseToFirestore(course: Course): Promise<void> {
  try {
    const docRef = doc(db, COURSES_COLLECTION, String(course.id));
    await withTimeout(setDoc(docRef, course, { merge: true }), 4000);
    isFirestoreOperational = true;
  } catch (error) {
    console.warn('Não foi possível sincronizar curso no Firestore:', error);
  }
}

export async function deleteCourseFromFirestore(id: string | number): Promise<void> {
  try {
    const docRef = doc(db, COURSES_COLLECTION, String(id));
    await withTimeout(deleteDoc(docRef), 4000);
    isFirestoreOperational = true;
  } catch (error) {
    console.warn('Não foi possível deletar curso no Firestore:', error);
  }
}

export async function seedCoursesToFirestore(coursesList: Course[]): Promise<void> {
  try {
    for (const c of coursesList) {
      const docRef = doc(db, COURSES_COLLECTION, String(c.id));
      await setDoc(docRef, c, { merge: true });
    }
    isFirestoreOperational = true;
  } catch (error) {
    console.warn('Não foi possível semear cursos no Firestore:', error);
  }
}

// ============================================================================
// 2. BLOG POSTS
// ============================================================================

function sanitizePostMedia(p: BlogPost): BlogPost {
  if (!p) return p;
  let image = p.image || '';
  if (image.includes('wp-content/uploads/')) {
    const filename = image.split('/').pop() || '';
    image = `/images/courses/${filename}`;
  }
  let contentHtml = p.contentHtml || '';
  if (contentHtml.includes('wp-content/uploads/')) {
    contentHtml = contentHtml.replace(/https:\/\/easytraining\.com\.br\/wp-content\/uploads\/[^\s"'>]+/g, (m) => {
      const fn = m.split('/').pop() || '';
      return `/images/courses/${fn}`;
    });
  }
  return {
    ...p,
    image: image || '/images/courses/Curso-de-informatica-basica-em-guarulhos.png',
    contentHtml
  };
}

export async function getPostsFromFirestore(): Promise<BlogPost[]> {
  const localPosts = getStoredPosts();

  try {
    const fetchPromise = getDocs(collection(db, POSTS_COLLECTION));
    const snapshot = await withTimeout(fetchPromise, 3000);

    isFirestoreOperational = true;

    if (snapshot.empty) {
      seedPostsToFirestore(localPosts).catch(() => {});
      return localPosts.map(sanitizePostMedia);
    }

    const postsMap = new Map<string, BlogPost>();
    // 1. Base prévia local
    localPosts.forEach((p) => postsMap.set(String(p.slug).toLowerCase(), sanitizePostMedia(p)));
    // 2. Mescla e prioriza novos posts e edições vindos do Firestore
    snapshot.forEach((d) => {
      const data = d.data() as BlogPost;
      if (data && data.slug) {
        postsMap.set(String(data.slug).toLowerCase(), sanitizePostMedia(data));
      }
    });

    const posts = Array.from(postsMap.values());
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return posts;
  } catch (error: any) {
    console.warn('Fallback para posts locais devido a erro no Firestore:', error?.message);
    return localPosts.map(sanitizePostMedia);
  }
}

export async function savePostToFirestore(post: BlogPost): Promise<void> {
  try {
    const docRef = doc(db, POSTS_COLLECTION, String(post.slug || post.id));
    await withTimeout(setDoc(docRef, post, { merge: true }), 4000);
    isFirestoreOperational = true;
  } catch (error) {
    console.warn('Não foi possível salvar post no Firestore:', error);
  }
}

export async function deletePostFromFirestore(id: string | number): Promise<void> {
  try {
    const docRef = doc(db, POSTS_COLLECTION, String(id));
    await withTimeout(deleteDoc(docRef), 4000);
    isFirestoreOperational = true;
  } catch (error) {
    console.warn('Não foi possível excluir post no Firestore:', error);
  }
}

export async function seedPostsToFirestore(postsList: BlogPost[]): Promise<void> {
  try {
    for (const p of postsList) {
      const docRef = doc(db, POSTS_COLLECTION, String(p.slug || p.id));
      await setDoc(docRef, p, { merge: true });
    }
    isFirestoreOperational = true;
  } catch (error) {
    console.warn('Não foi possível semear posts no Firestore:', error);
  }
}

// ============================================================================
// 3. SITE CONFIG
// ============================================================================

export async function getSiteConfigFromFirestore(): Promise<SiteConfigType> {
  const localConfig = getStoredSiteConfig();
  if (isFirestoreOperational === false) {
    return localConfig;
  }

  try {
    const snap = await withTimeout(getDocs(collection(db, CONFIG_COLLECTION)), 800);

    if (snap.empty) {
      saveSiteConfigToFirestore(localConfig).catch(() => {});
      return localConfig;
    }

    let found: SiteConfigType | null = null;
    snap.forEach(d => {
      if (d.id === SITE_CONFIG_DOC) {
        found = d.data() as SiteConfigType;
      }
    });

    return found || localConfig;
  } catch (error) {
    isFirestoreOperational = false;
    return localConfig;
  }
}

export async function saveSiteConfigToFirestore(config: SiteConfigType): Promise<void> {
  if (isFirestoreOperational === false) return;
  try {
    const docRef = doc(db, CONFIG_COLLECTION, SITE_CONFIG_DOC);
    await withTimeout(setDoc(docRef, config, { merge: true }), 800);
  } catch (error) {
    console.warn('Não foi possível salvar siteConfig no Firestore:', error);
  }
}
