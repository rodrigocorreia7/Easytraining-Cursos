import { isFirebaseAdminConfigured } from './firebaseConfigHelper';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { Course, BlogPost } from '../types';
import { getStoredCourses, getStoredPosts, getStoredSiteConfig, type SiteConfigType } from './db';

const COURSES_COLLECTION = 'courses';
const POSTS_COLLECTION = 'posts';
const CONFIG_COLLECTION = 'config';
const SITE_CONFIG_DOC = 'siteConfig';
export const PUBLIC_CONTENT_REVALIDATE_SECONDS = 300;
export const PUBLIC_COURSES_CACHE_TAG = 'public-courses';
export const PUBLIC_POSTS_CACHE_TAG = 'public-posts';

let isFirestoreOperational: boolean | null = null;

async function getAdminDb() {
  const { adminDb } = await import('./firebaseAdmin');
  return adminDb;
}

async function withTimeout<T>(promise: Promise<T>, ms = 8000): Promise<T> {
  let timer: any;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Firestore timeout')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

export interface FirestoreConnectionStatus {
  configured: boolean;
  connected: boolean;
  error?: string;
  reason?: 'quota_exceeded' | 'credentials' | 'unavailable';
}

/**
 * Executa uma leitura real no Firestore para distinguir configuração presente
 * de conexão realmente operacional no runtime (especialmente na Vercel).
 */
export async function checkFirestoreConnection(): Promise<FirestoreConnectionStatus> {
  if (!isFirebaseAdminConfigured()) {
    return {
      configured: false,
      connected: false,
      error: 'Firebase Admin não configurado no servidor. Adicione FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY na Vercel.',
      reason: 'credentials'
    };
  }

  try {
    const adminDb = await getAdminDb();
    await withTimeout(adminDb.collection(COURSES_COLLECTION).limit(1).get(), 10000);
    isFirestoreOperational = true;
    return { configured: true, connected: true };
  } catch (error: any) {
    isFirestoreOperational = false;
    return {
      configured: true,
      connected: false,
      error: error?.message || 'Falha ao conectar com o Firestore.',
      reason: error?.code === 8 || error?.message?.includes('RESOURCE_EXHAUSTED')
        ? 'quota_exceeded'
        : 'unavailable'
    };
  }
}

// ============================================================================
// 1. COURSES
// ============================================================================

export async function getCoursesFromFirestore(): Promise<Course[]> {
  const localCourses = getStoredCourses();

  if (!isFirebaseAdminConfigured()) {
    return localCourses;
  }

  try {
    const adminDb = await getAdminDb();
    const fetchPromise = adminDb.collection(COURSES_COLLECTION).get();
    const snapshot = await withTimeout(fetchPromise, 8000);

    isFirestoreOperational = true;

    if (snapshot.empty) {
      seedCoursesToFirestore(localCourses).catch(() => {});
      return localCourses;
    }

    const coursesMap = new Map<string, Course>();
    localCourses.forEach((c) => coursesMap.set(String(c.id), c));
    snapshot.forEach((d) => {
      const rawData = d.data() as Course;
      const data = {
        ...rawData,
        id: rawData.id ?? (Number.isFinite(Number(d.id)) ? Number(d.id) : d.id),
      } as Course;
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

function cleanFirestoreDoc<T extends Record<string, any>>(obj: T): T {
  const cleaned: any = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) {
      if (v !== null && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date)) {
        cleaned[k] = cleanFirestoreDoc(v);
      } else {
        cleaned[k] = v;
      }
    }
  }
  return cleaned;
}

function isServerlessProd(): boolean {
  return process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
}

export async function saveCourseToFirestore(course: Course): Promise<void> {
  if (!isFirebaseAdminConfigured()) {
    if (!isServerlessProd()) {
      console.warn('Firebase Admin não configurado localmente. Curso salvo no armazenamento local.');
      return;
    }
    throw new Error('Firebase Admin Firestore não configurado no servidor (adicione FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY nas variáveis de ambiente da Vercel).');
  }

  try {
    const adminDb = await getAdminDb();
    const docRef = adminDb.collection(COURSES_COLLECTION).doc(String(course.id));
    await withTimeout(docRef.set(cleanFirestoreDoc(course), { merge: true }), 10000);
    isFirestoreOperational = true;
  } catch (error: any) {
    console.error('Erro crítico ao salvar curso no Firestore via Admin SDK:', error?.message);
    throw new Error(`Falha ao persistir curso no Firestore: ${error?.message || 'Erro desconhecido'}`);
  }
}

export async function deleteCourseFromFirestore(id: string | number): Promise<void> {
  if (!isFirebaseAdminConfigured()) {
    if (!isServerlessProd()) {
      console.warn('Firebase Admin não configurado localmente. Curso excluído no armazenamento local.');
      return;
    }
    throw new Error('Firebase Admin Firestore não configurado no servidor (adicione FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY nas variáveis de ambiente da Vercel).');
  }

  try {
    const adminDb = await getAdminDb();
    const strVal = String(id).trim();

    await withTimeout(adminDb.collection(COURSES_COLLECTION).doc(strVal).delete(), 10000);

    const slugSnap = await withTimeout(
      adminDb.collection(COURSES_COLLECTION).where('slug', '==', strVal).get(),
      10000
    );
    for (const d of slugSnap.docs) {
      await withTimeout(d.ref.delete(), 10000);
    }

    const numVal = Number(strVal);
    if (!isNaN(numVal)) {
      const idSnap = await withTimeout(
        adminDb.collection(COURSES_COLLECTION).where('id', '==', numVal).get(),
        10000
      );
      for (const d of idSnap.docs) {
        await withTimeout(d.ref.delete(), 10000);
      }
    }

    isFirestoreOperational = true;
  } catch (error: any) {
    console.error('Erro crítico ao excluir curso no Firestore via Admin SDK:', error?.message);
    throw new Error(`Falha ao excluir curso no Firestore: ${error?.message || 'Erro desconhecido'}`);
  }
}

export async function seedCoursesToFirestore(coursesList: Course[]): Promise<void> {
  if (!isFirebaseAdminConfigured()) return;
  try {
    const adminDb = await getAdminDb();
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

/** Catálogo público cacheado por cinco minutos para reduzir leituras repetidas. */
export const getCachedCoursesFromFirestore = unstable_cache(
  () => getCoursesFromFirestore(),
  ['easytraining-public-courses'],
  { revalidate: PUBLIC_CONTENT_REVALIDATE_SECONDS, tags: [PUBLIC_COURSES_CACHE_TAG] }
);

export function getCachedCourseBySlugFromFirestore(slug: string): Promise<Course | null> {
  const cleanSlug = normalizePostSlug(slug);
  return unstable_cache(
    () => getCourseByIdFromFirestore(cleanSlug),
    ['easytraining-public-course', cleanSlug],
    { revalidate: PUBLIC_CONTENT_REVALIDATE_SECONDS, tags: [PUBLIC_COURSES_CACHE_TAG] }
  )();
}

// ============================================================================
// 2. BLOG POSTS
// ============================================================================

export function getCategoryFallbackImage(category?: string, title?: string): string {
  const combined = `${category || ''} ${title || ''}`.toLowerCase();
  if (combined.includes('excel') || combined.includes('planilha')) return '/images/courses/excel-avancado.webp';
  if (combined.includes('farm') || combined.includes('balcao') || combined.includes('medicamento')) return '/images/courses/ATENTENDE-FARMACIA.webp';
  if (combined.includes('pet') || combined.includes('veterin') || combined.includes('tosa') || combined.includes('banho') || combined.includes('animal')) return '/images/courses/happy-woman-playing-with-dog-in-grooming-studio.webp';
  if (combined.includes('jovem') || combined.includes('aprendiz') || combined.includes('estag') || combined.includes('primeiro emprego') || combined.includes('ciee')) return '/images/courses/jovem-aprendiz-Guarulhos-vagas-salario-idade.png';
  if (combined.includes('profiss') || combined.includes('mercado') || combined.includes('vaga') || combined.includes('carreira') || combined.includes('busca')) return '/images/courses/Especializacoes-Onde-a-Tecnologia-e-a-Demanda-Estao.png';
  if (combined.includes('gest') || combined.includes('adm') || combined.includes('neg') || combined.includes('escrit') || combined.includes('secretar')) return '/images/courses/assistente-administrativo.webp';
  if (combined.includes('log') || combined.includes('estoq') || combined.includes('armaz')) return '/images/courses/ASSISTENTE-LOGISTICA.webp';
  if (combined.includes('contab') || combined.includes('financ') || combined.includes('fiscal')) return '/images/courses/CONTABILIDADE.webp';
  if (combined.includes('rh') || combined.includes('recursos humanos') || combined.includes('departamento pessoal')) return '/images/courses/RECURSOS-HUMANOS.webp';
  if (combined.includes('design') || combined.includes('marketing') || combined.includes('midia')) return '/images/courses/crop-hand-drawing-digital-marketing-plan.webp';
  return '/images/courses/informatica-basica.webp';
}

function normalizePostSlug(slug: string): string {
  return slug.replace(/^\/+|\/+$/g, '').trim().toLowerCase();
}

function sanitizePostMedia(p: BlogPost): BlogPost {
  if (!p) return p;
  const cleanCategory = (p.category || 'Tecnologia & Informática').replace(/&amp;/g, '&').trim();
  let image = p.image || '';

  // Se a imagem for data:image/ mas for truncada (<= 5000 caracteres), descarta a corrompida
  if (image.startsWith('data:image/')) {
    if (image.length <= 5000 || !image.includes(',')) {
      image = getCategoryFallbackImage(cleanCategory, p.title);
    }
  } else if (image.includes('wp-content/uploads/')) {
    const filename = image.split('/').pop() || '';
    image = `/images/courses/${filename}`;
  } else if (!image || image === '/images/courses/Curso-de-informatica-basica-em-guarulhos.png') {
    image = getCategoryFallbackImage(cleanCategory, p.title);
  }

  let contentHtml = p.contentHtml || '';
  if (contentHtml.includes('wp-content/uploads/')) {
    contentHtml = contentHtml.replace(/https:\/\/(?:www\.)?easytraining\.com\.br\/wp-content\/uploads\/[^\s"'>]+/g, (m) => {
      const fn = m.split('/').pop() || '';
      return `/images/courses/${fn}`;
    });
  }

  return {
    ...p,
    category: cleanCategory,
    image: image || getCategoryFallbackImage(cleanCategory, p.title),
    contentHtml
  };
}

function getCourseFromSnapshot(snapshot: any): Course | null {
  if (!snapshot?.exists) return null;
  const rawData = snapshot.data() as Course;
  if (!rawData || (!rawData.id && !rawData.slug)) return null;
  return {
    ...rawData,
    id: rawData.id ?? (Number.isFinite(Number(snapshot.id)) ? Number(snapshot.id) : snapshot.id),
  } as Course;
}

function getPostFromSnapshot(snapshot: any): BlogPost | null {
  if (!snapshot?.exists) return null;
  const rawData = snapshot.data() as BlogPost;
  if (!rawData || !rawData.slug) return null;
  return sanitizePostMedia({
    ...rawData,
    id: rawData.id ?? snapshot.id,
  });
}

/** Busca um curso sem carregar a coleção inteira. */
export async function getCourseByIdFromFirestore(id: string | number): Promise<Course | null> {
  const cleanId = String(id).trim();
  const localCourse = getStoredCourses().find(
    (course) => String(course.id) === cleanId || course.slug.toLowerCase() === cleanId.toLowerCase()
  );

  if (!isFirebaseAdminConfigured()) return localCourse || null;

  try {
    const adminDb = await getAdminDb();
    const directSnapshot = await withTimeout(
      adminDb.collection(COURSES_COLLECTION).doc(cleanId).get(),
      4000
    );
    const directCourse = getCourseFromSnapshot(directSnapshot);
    if (directCourse) {
      isFirestoreOperational = true;
      return directCourse;
    }

    const idValue = /^\d+$/.test(cleanId) ? Number(cleanId) : cleanId;
    const idSnapshot = await withTimeout(
      adminDb.collection(COURSES_COLLECTION).where('id', '==', idValue).limit(1).get(),
      4000
    );
    if (!idSnapshot.empty) {
      isFirestoreOperational = true;
      return getCourseFromSnapshot(idSnapshot.docs[0]);
    }

    const slugSnapshot = await withTimeout(
      adminDb.collection(COURSES_COLLECTION).where('slug', '==', cleanId.toLowerCase()).limit(1).get(),
      4000
    );
    isFirestoreOperational = true;
    return slugSnapshot.empty ? (localCourse || null) : getCourseFromSnapshot(slugSnapshot.docs[0]);
  } catch (error: any) {
    console.warn('Fallback para curso local devido a erro no Firestore:', error?.message);
    return localCourse || null;
  }
}

/**
 * Busca somente o artigo solicitado. Isso evita ler a coleção inteira para
 * cada URL inválida ou para cada visita a um artigo individual.
 */
export async function getPostBySlugFromFirestore(slug: string): Promise<BlogPost | null> {
  const cleanSlug = normalizePostSlug(slug);
  if (!cleanSlug) return null;

  const localPost = getStoredPosts().find(
    (post) => normalizePostSlug(String(post.slug || '')) === cleanSlug
  );

  if (!isFirebaseAdminConfigured()) {
    return localPost ? sanitizePostMedia(localPost) : null;
  }

  try {
    const adminDb = await getAdminDb();
    const snapshot = await withTimeout(
      adminDb.collection(POSTS_COLLECTION).where('slug', '==', cleanSlug).limit(1).get(),
      4000
    );

    isFirestoreOperational = true;

    if (!snapshot.empty) {
      return sanitizePostMedia(snapshot.docs[0].data() as BlogPost);
    }

    return localPost ? sanitizePostMedia(localPost) : null;
  } catch (error: any) {
    console.warn('Fallback para artigo local devido a erro no Firestore:', error?.message);
    return localPost ? sanitizePostMedia(localPost) : null;
  }
}

/** Busca um artigo sem carregar a coleção inteira. */
export async function getPostByIdFromFirestore(id: string | number): Promise<BlogPost | null> {
  const cleanId = String(id).trim();
  const localPost = getStoredPosts().find(
    (post) => String(post.id) === cleanId || normalizePostSlug(String(post.slug || '')) === normalizePostSlug(cleanId)
  );

  if (!isFirebaseAdminConfigured()) return localPost ? sanitizePostMedia(localPost) : null;

  try {
    const adminDb = await getAdminDb();
    const directSnapshot = await withTimeout(
      adminDb.collection(POSTS_COLLECTION).doc(cleanId).get(),
      4000
    );
    const directPost = getPostFromSnapshot(directSnapshot);
    if (directPost) {
      isFirestoreOperational = true;
      return directPost;
    }

    const idValue = /^\d+$/.test(cleanId) ? Number(cleanId) : cleanId;
    const idSnapshot = await withTimeout(
      adminDb.collection(POSTS_COLLECTION).where('id', '==', idValue).limit(1).get(),
      4000
    );
    if (!idSnapshot.empty) {
      isFirestoreOperational = true;
      return getPostFromSnapshot(idSnapshot.docs[0]);
    }

    const slugSnapshot = await withTimeout(
      adminDb.collection(POSTS_COLLECTION).where('slug', '==', normalizePostSlug(cleanId)).limit(1).get(),
      4000
    );
    isFirestoreOperational = true;
    return slugSnapshot.empty ? (localPost ? sanitizePostMedia(localPost) : null) : getPostFromSnapshot(slugSnapshot.docs[0]);
  } catch (error: any) {
    console.warn('Fallback para artigo local devido a erro no Firestore:', error?.message);
    return localPost ? sanitizePostMedia(localPost) : null;
  }
}

export async function getPostsFromFirestore(): Promise<BlogPost[]> {
  const localPosts = getStoredPosts();

  if (!isFirebaseAdminConfigured()) {
    return localPosts.map(sanitizePostMedia);
  }

  try {
    const adminDb = await getAdminDb();
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
      const rawData = d.data() as BlogPost;
      const data = {
        ...rawData,
        id: rawData.id ?? d.id,
      } as BlogPost;
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
  if (!isFirebaseAdminConfigured()) {
    if (!isServerlessProd()) {
      console.warn('Firebase Admin não configurado localmente. Post salvo no armazenamento local.');
      return;
    }
    throw new Error('Firebase Admin Firestore não configurado no servidor (adicione FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY nas variáveis de ambiente da Vercel).');
  }

  try {
    const adminDb = await getAdminDb();
    const docRef = adminDb.collection(POSTS_COLLECTION).doc(String(post.slug || post.id));
    await withTimeout(docRef.set(cleanFirestoreDoc(post), { merge: true }), 10000);
    isFirestoreOperational = true;
  } catch (error: any) {
    console.error('Erro crítico ao salvar post no Firestore via Admin SDK:', error?.message);
    throw new Error(`Falha ao persistir artigo no Firestore: ${error?.message || 'Erro desconhecido'}`);
  }
}

export async function deletePostFromFirestore(idOrSlug: string | number): Promise<void> {
  if (!isFirebaseAdminConfigured()) {
    if (!isServerlessProd()) {
      console.warn('Firebase Admin não configurado localmente. Post excluído no armazenamento local.');
      return;
    }
    throw new Error('Firebase Admin Firestore não configurado no servidor (adicione FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY nas variáveis de ambiente da Vercel).');
  }

  try {
    const adminDb = await getAdminDb();
    const strVal = String(idOrSlug).trim();

    // 1. Deleta se o ID do documento for exatamente strVal
    await withTimeout(adminDb.collection(POSTS_COLLECTION).doc(strVal).delete(), 10000);

    // 2. Busca e deleta todos os documentos que tenham esse slug
    const slugSnap = await withTimeout(
      adminDb.collection(POSTS_COLLECTION).where('slug', '==', strVal).get(),
      10000
    );
    for (const d of slugSnap.docs) {
      await withTimeout(d.ref.delete(), 10000);
    }

    // 3. Se for numérico, busca e deleta todos os documentos que tenham esse id
    const numVal = Number(strVal);
    if (!isNaN(numVal)) {
      const idSnap = await withTimeout(
        adminDb.collection(POSTS_COLLECTION).where('id', '==', numVal).get(),
        10000
      );
      for (const d of idSnap.docs) {
        await withTimeout(d.ref.delete(), 10000);
      }
    }

    isFirestoreOperational = true;
  } catch (error: any) {
    console.error('Erro crítico ao excluir post no Firestore via Admin SDK:', error?.message);
    throw new Error(`Falha ao excluir artigo no Firestore: ${error?.message || 'Erro desconhecido'}`);
  }
}

export async function seedPostsToFirestore(postsList: BlogPost[]): Promise<void> {
  if (!isFirebaseAdminConfigured()) return;
  try {
    const adminDb = await getAdminDb();
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

export interface RecoveredPostsSyncResult {
  created: string[];
  existing: string[];
  errors: { slug: string; message: string }[];
}

/**
 * Migra somente os artigos recuperados que ainda não existem no Firestore.
 * Cada documento usa o slug como ID e é criado sem merge para impedir que uma
 * edição já existente seja substituída durante a recuperação.
 */
export async function syncRecoveredPostsToFirestore(postsList: BlogPost[]): Promise<RecoveredPostsSyncResult> {
  if (!isFirebaseAdminConfigured()) {
    throw new Error('Firebase Admin Firestore não configurado no servidor.');
  }

  const posts = postsList.filter((post) => post?.slug);
  const result: RecoveredPostsSyncResult = { created: [], existing: [], errors: [] };
  if (posts.length === 0) return result;
  const adminDb = await getAdminDb();

  const existingBySlug = new Set<string>();
  const slugSnapshot = await withTimeout(
    adminDb.collection(POSTS_COLLECTION).where('slug', 'in', posts.map((post) => normalizePostSlug(post.slug))).get(),
    10000
  );
  slugSnapshot.forEach((doc) => {
    const slug = normalizePostSlug(String(doc.data()?.slug || ''));
    if (slug) existingBySlug.add(slug);
  });

  // Também protege documentos legados cujo ID já seja o slug, mesmo sem o
  // campo slug corretamente preenchido.
  const directSnapshots = await Promise.all(
    posts.map((post) => withTimeout(adminDb.collection(POSTS_COLLECTION).doc(normalizePostSlug(post.slug)).get(), 10000))
  );
  directSnapshots.forEach((doc, index) => {
    if (doc.exists) existingBySlug.add(normalizePostSlug(posts[index].slug));
  });

  for (const post of posts) {
    const slug = normalizePostSlug(post.slug);
    if (existingBySlug.has(slug)) {
      result.existing.push(slug);
      continue;
    }

    try {
      await withTimeout(
        adminDb.collection(POSTS_COLLECTION).doc(slug).create(cleanFirestoreDoc(post)),
        10000
      );
      result.created.push(slug);
      existingBySlug.add(slug);
      isFirestoreOperational = true;
    } catch (error: any) {
      if (error?.code === 6 || error?.code === 'already-exists') {
        result.existing.push(slug);
        existingBySlug.add(slug);
      } else {
        result.errors.push({
          slug,
          message: error?.message || 'Erro desconhecido ao criar o documento.',
        });
      }
    }
  }

  if (result.errors.length === 0) isFirestoreOperational = true;
  return result;
}

/** Conteúdo público do blog cacheado por cinco minutos. */
export const getCachedPostsFromFirestore = unstable_cache(
  () => getPostsFromFirestore(),
  ['easytraining-public-posts'],
  { revalidate: PUBLIC_CONTENT_REVALIDATE_SECONDS, tags: [PUBLIC_POSTS_CACHE_TAG] }
);

export function getCachedPostBySlugFromFirestore(slug: string): Promise<BlogPost | null> {
  const cleanSlug = normalizePostSlug(slug);
  return unstable_cache(
    () => getPostBySlugFromFirestore(cleanSlug),
    // A versão evita reutilizar 404s gerados antes da recuperação dos artigos.
    ['easytraining-public-post-v2', cleanSlug],
    { revalidate: PUBLIC_CONTENT_REVALIDATE_SECONDS, tags: [PUBLIC_POSTS_CACHE_TAG] }
  )();
}

export function invalidatePublicContentCache(kind: 'courses' | 'posts' | 'all'): void {
  const invalidateCourses = kind === 'courses' || kind === 'all';
  const invalidatePosts = kind === 'posts' || kind === 'all';

  if (invalidateCourses) {
    revalidateTag(PUBLIC_COURSES_CACHE_TAG, 'max');
    revalidatePath('/cursos', 'page');
    revalidatePath('/curso/[slug]', 'page');
  }

  if (invalidatePosts) {
    revalidateTag(PUBLIC_POSTS_CACHE_TAG, 'max');
    revalidatePath('/blog', 'page');
    revalidatePath('/blog/[slug]', 'page');
  }

  revalidatePath('/', 'page');
  revalidatePath('/sitemap.xml');
}

// ============================================================================
// 3. SITE CONFIG
// ============================================================================

export async function getSiteConfigFromFirestore(): Promise<SiteConfigType> {
  const localConfig = getStoredSiteConfig();
  if (!isFirebaseAdminConfigured() || isFirestoreOperational === false) {
    return localConfig;
  }

  try {
    const adminDb = await getAdminDb();
    const doc = await withTimeout(adminDb.collection(CONFIG_COLLECTION).doc(SITE_CONFIG_DOC).get(), 5000);

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
  if (!isFirebaseAdminConfigured()) {
    if (!isServerlessProd()) {
      console.warn('Firebase Admin não configurado localmente. Configurações salvas no armazenamento local.');
      return;
    }
    throw new Error('Firebase Admin Firestore não configurado no servidor (adicione FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY nas variáveis de ambiente da Vercel).');
  }

  try {
    const adminDb = await getAdminDb();
    const docRef = adminDb.collection(CONFIG_COLLECTION).doc(SITE_CONFIG_DOC);
    await withTimeout(docRef.set(cleanFirestoreDoc(config), { merge: true }), 10000);
    isFirestoreOperational = true;
  } catch (error: any) {
    console.error('Erro crítico ao salvar siteConfig no Firestore via Admin SDK:', error?.message);
    throw new Error(`Falha ao persistir configurações no Firestore: ${error?.message || 'Erro desconhecido'}`);
  }
}
