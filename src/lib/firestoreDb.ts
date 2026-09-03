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

async function withTimeout<T>(promise: Promise<T>, ms = 800): Promise<T> {
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

  if (isFirestoreOperational === false) {
    return localCourses;
  }

  try {
    const fetchPromise = getDocs(collection(db, COURSES_COLLECTION));
    const snapshot = await withTimeout(fetchPromise, 800);

    isFirestoreOperational = true;

    // Se o Firestore tiver menos cursos do que a base completa (ex: apenas 1 curso de teste),
    // usa a base completa e semeia o Firestore em background sem travar a requisição.
    if (snapshot.empty || snapshot.size < localCourses.length) {
      seedCoursesToFirestore(localCourses).catch(() => {});
      return localCourses;
    }

    const courses: Course[] = [];
    snapshot.forEach((d) => {
      courses.push(d.data() as Course);
    });

    courses.sort((a, b) => Number(a.id) - Number(b.id));
    return courses.length >= localCourses.length ? courses : localCourses;
  } catch (error: any) {
    isFirestoreOperational = false;
    return localCourses;
  }
}

export async function saveCourseToFirestore(course: Course): Promise<void> {
  if (isFirestoreOperational === false) return;
  try {
    const docRef = doc(db, COURSES_COLLECTION, String(course.id));
    await withTimeout(setDoc(docRef, course, { merge: true }), 800);
  } catch (error) {
    console.warn('Não foi possível sincronizar curso no Firestore:', error);
  }
}

export async function deleteCourseFromFirestore(id: string | number): Promise<void> {
  if (isFirestoreOperational === false) return;
  try {
    const docRef = doc(db, COURSES_COLLECTION, String(id));
    await withTimeout(deleteDoc(docRef), 800);
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

export async function getPostsFromFirestore(): Promise<BlogPost[]> {
  const localPosts = getStoredPosts();

  if (isFirestoreOperational === false) {
    return localPosts;
  }

  try {
    const fetchPromise = getDocs(collection(db, POSTS_COLLECTION));
    const snapshot = await withTimeout(fetchPromise, 800);

    isFirestoreOperational = true;

    if (snapshot.empty || snapshot.size < localPosts.length) {
      seedPostsToFirestore(localPosts).catch(() => {});
      return localPosts;
    }

    const posts: BlogPost[] = [];
    snapshot.forEach((d) => {
      posts.push(d.data() as BlogPost);
    });

    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return posts.length >= localPosts.length ? posts : localPosts;
  } catch (error: any) {
    isFirestoreOperational = false;
    return localPosts;
  }
}

export async function savePostToFirestore(post: BlogPost): Promise<void> {
  if (isFirestoreOperational === false) return;
  try {
    const docRef = doc(db, POSTS_COLLECTION, String(post.id));
    await withTimeout(setDoc(docRef, post, { merge: true }), 800);
  } catch (error) {
    console.warn('Não foi possível salvar post no Firestore:', error);
  }
}

export async function deletePostFromFirestore(id: string | number): Promise<void> {
  if (isFirestoreOperational === false) return;
  try {
    const docRef = doc(db, POSTS_COLLECTION, String(id));
    await withTimeout(deleteDoc(docRef), 800);
  } catch (error) {
    console.warn('Não foi possível excluir post no Firestore:', error);
  }
}

export async function seedPostsToFirestore(postsList: BlogPost[]): Promise<void> {
  try {
    for (const p of postsList) {
      const docRef = doc(db, POSTS_COLLECTION, String(p.id));
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
