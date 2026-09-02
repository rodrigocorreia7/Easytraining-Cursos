import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { Course, BlogPost } from '../types';
import { getStoredCourses, getStoredPosts, getStoredSiteConfig, type SiteConfigType } from './db';

const COURSES_COLLECTION = 'courses';
const POSTS_COLLECTION = 'posts';
const CONFIG_COLLECTION = 'config';
const SITE_CONFIG_DOC = 'siteConfig';

// ============================================================================
// 1. COURSES
// ============================================================================

export async function getCoursesFromFirestore(): Promise<Course[]> {
  try {
    const q = query(collection(db, COURSES_COLLECTION), orderBy('id', 'asc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Se o Firestore ainda estiver vazio, inicializa com os dados locais
      const localCourses = getStoredCourses();
      await seedCoursesToFirestore(localCourses);
      return localCourses;
    }

    const courses: Course[] = [];
    snapshot.forEach((d) => {
      courses.push(d.data() as Course);
    });
    return courses;
  } catch (error) {
    console.warn('Falha ao buscar cursos no Firestore (usando fallback local):', error);
    return getStoredCourses();
  }
}

export async function saveCourseToFirestore(course: Course): Promise<void> {
  try {
    const docRef = doc(db, COURSES_COLLECTION, String(course.id));
    await setDoc(docRef, course, { merge: true });
  } catch (error) {
    console.error('Erro ao salvar curso no Firestore:', error);
    throw error;
  }
}

export async function deleteCourseFromFirestore(id: string | number): Promise<void> {
  try {
    const docRef = doc(db, COURSES_COLLECTION, String(id));
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Erro ao deletar curso no Firestore:', error);
    throw error;
  }
}

export async function seedCoursesToFirestore(coursesList?: Course[]): Promise<void> {
  const list = coursesList || getStoredCourses();
  for (const c of list) {
    await saveCourseToFirestore(c);
  }
}

// ============================================================================
// 2. BLOG POSTS
// ============================================================================

export async function getPostsFromFirestore(): Promise<BlogPost[]> {
  try {
    const snapshot = await getDocs(collection(db, POSTS_COLLECTION));

    if (snapshot.empty) {
      const localPosts = getStoredPosts();
      await seedPostsToFirestore(localPosts);
      return localPosts;
    }

    const posts: BlogPost[] = [];
    snapshot.forEach((d) => {
      posts.push(d.data() as BlogPost);
    });

    // Ordena por data decrescente
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return posts;
  } catch (error) {
    console.warn('Falha ao buscar posts no Firestore (usando fallback local):', error);
    return getStoredPosts();
  }
}

export async function savePostToFirestore(post: BlogPost): Promise<void> {
  try {
    const docRef = doc(db, POSTS_COLLECTION, String(post.id));
    await setDoc(docRef, post, { merge: true });
  } catch (error) {
    console.error('Erro ao salvar post no Firestore:', error);
    throw error;
  }
}

export async function deletePostFromFirestore(id: string | number): Promise<void> {
  try {
    const docRef = doc(db, POSTS_COLLECTION, String(id));
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Erro ao excluir post no Firestore:', error);
    throw error;
  }
}

export async function seedPostsToFirestore(postsList?: BlogPost[]): Promise<void> {
  const list = postsList || getStoredPosts();
  for (const p of list) {
    await savePostToFirestore(p);
  }
}

// ============================================================================
// 3. SITE CONFIG
// ============================================================================

export async function getSiteConfigFromFirestore(): Promise<SiteConfigType> {
  try {
    const docRef = doc(db, CONFIG_COLLECTION, SITE_CONFIG_DOC);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      const localConfig = getStoredSiteConfig();
      await saveSiteConfigToFirestore(localConfig);
      return localConfig;
    }

    return snapshot.data() as SiteConfigType;
  } catch (error) {
    console.warn('Falha ao buscar siteConfig no Firestore (usando fallback local):', error);
    return getStoredSiteConfig();
  }
}

export async function saveSiteConfigToFirestore(config: SiteConfigType): Promise<void> {
  try {
    const docRef = doc(db, CONFIG_COLLECTION, SITE_CONFIG_DOC);
    await setDoc(docRef, config, { merge: true });
  } catch (error) {
    console.error('Erro ao salvar siteConfig no Firestore:', error);
    throw error;
  }
}
