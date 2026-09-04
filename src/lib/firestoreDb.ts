import { adminDb } from './firebaseAdmin';
import { Course, BlogPost } from '../types';
import { getStoredCourses, getStoredPosts, getStoredSiteConfig, type SiteConfigType } from './db';

const COURSES_COLLECTION = 'courses';
const POSTS_COLLECTION = 'posts';
const CONFIG_COLLECTION = 'config';
const SITE_CONFIG_DOC = 'siteConfig';

let isFirestoreOperational: boolean | null = null;

async function withTimeout<T>(promise: Promise<T>, ms = 4000): Promise<T> {
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
    const fetchPromise = adminDb.collection(COURSES_COLLECTION).get();
    const snapshot = await withTimeout(fetchPromise, 4000);

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
    const docRef = adminDb.collection(COURSES_COLLECTION).doc(String(course.id));
    await withTimeout(docRef.set(course, { merge: true }), 5000);
    isFirestoreOperational = true;
  } catch (error: any) {
    console.error('Erro crítico ao salvar curso no Firestore via Admin SDK:', error?.message);
    throw new Error(`Falha ao persistir curso no Firestore: ${error?.message || 'Erro desconhecido'}`);
  }
}

export async function deleteCourseFromFirestore(id: string | number): Promise<void> {
  try {
    const docRef = adminDb.collection(COURSES_COLLECTION).doc(String(id));
    await withTimeout(docRef.delete(), 5000);
    isFirestoreOperational = true;
  } catch (error: any) {
    console.error('Erro crítico ao excluir curso no Firestore via Admin SDK:', error?.message);
    throw new Error(`Falha ao excluir curso no Firestore: ${error?.message || 'Erro desconhecido'}`);
  }
}

export async function seedCoursesToFirestore(coursesList: Course[]): Promise<void> {
  try {
    const batch = adminDb.batch();
    for (const c of coursesList) {
      const docRef = adminDb.collection(COURSES_COLLECTION).doc(String(c.id));
      batch.set(docRef, c, { merge: true });
    }
    await batch.commit();
    isFirestoreOperational = true;
  } catch (error: any) {
    console.warn('Não foi possível semear cursos no Firestore:', error?.message);
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
    const fetchPromise = adminDb.collection(POSTS_COLLECTION).get();
    const snapshot = await withTimeout(fetchPromise, 4000);

    isFirestoreOperational = true;

    if (snapshot.empty) {
      seedPostsToFirestore(localPosts).catch(() => {});
      return localPosts.map(sanitizePostMedia);
    }

    const postsMap = new Map<string, BlogPost>();
    localPosts.forEach((p) => postsMap.set(String(p.slug).toLowerCase(), sanitizePostMedia(p)));
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
    const docRef = adminDb.collection(POSTS_COLLECTION).doc(String(post.slug || post.id));
    await withTimeout(docRef.set(post, { merge: true }), 5000);
    isFirestoreOperational = true;
  } catch (error: any) {
    console.error('Erro crítico ao salvar post no Firestore via Admin SDK:', error?.message);
    throw new Error(`Falha ao persistir artigo no Firestore: ${error?.message || 'Erro desconhecido'}`);
  }
}

export async function deletePostFromFirestore(idOrSlug: string | number): Promise<void> {
  try {
    const docRef = adminDb.collection(POSTS_COLLECTION).doc(String(idOrSlug));
    await withTimeout(docRef.delete(), 5000);
    isFirestoreOperational = true;
  } catch (error: any) {
    console.error('Erro crítico ao excluir post no Firestore via Admin SDK:', error?.message);
    throw new Error(`Falha ao excluir artigo no Firestore: ${error?.message || 'Erro desconhecido'}`);
  }
}

export async function seedPostsToFirestore(postsList: BlogPost[]): Promise<void> {
  try {
    const batch = adminDb.batch();
    for (const p of postsList) {
      const docRef = adminDb.collection(POSTS_COLLECTION).doc(String(p.slug || p.id));
      batch.set(docRef, p, { merge: true });
    }
    await batch.commit();
    isFirestoreOperational = true;
  } catch (error: any) {
    console.warn('Não foi possível semear posts no Firestore:', error?.message);
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
    const doc = await withTimeout(adminDb.collection(CONFIG_COLLECTION).doc(SITE_CONFIG_DOC).get(), 1500);

    if (!doc.exists) {
      saveSiteConfigToFirestore(localConfig).catch(() => {});
      return localConfig;
    }

    return (doc.data() as SiteConfigType) || localConfig;
  } catch (error) {
    isFirestoreOperational = false;
    return localConfig;
  }
}

export async function saveSiteConfigToFirestore(config: SiteConfigType): Promise<void> {
  try {
    const docRef = adminDb.collection(CONFIG_COLLECTION).doc(SITE_CONFIG_DOC);
    await withTimeout(docRef.set(config, { merge: true }), 4000);
    isFirestoreOperational = true;
  } catch (error: any) {
    console.error('Erro crítico ao salvar siteConfig no Firestore via Admin SDK:', error?.message);
    throw new Error(`Falha ao persistir configurações no Firestore: ${error?.message || 'Erro desconhecido'}`);
  }
}
