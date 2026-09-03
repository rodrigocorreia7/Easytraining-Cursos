import fs from 'fs';
import path from 'path';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface AiInquiry {
  id: string;
  question: string;
  category: string;
  timestamp: string;
}

export interface AiMetricsData {
  articlesGenerated: number;
  chatQuestionsAnswered: number;
  topicCounts: Record<string, number>;
  recentInquiries: AiInquiry[];
}

const DEFAULT_METRICS: AiMetricsData = {
  articlesGenerated: 0,
  chatQuestionsAnswered: 0,
  topicCounts: {},
  recentInquiries: []
};

const DB_DIR = path.join(process.cwd(), 'src', 'data', 'db');
const METRICS_FILE = path.join(DB_DIR, 'aiMetrics.json');
const FIRESTORE_COLLECTION = 'metrics';
const FIRESTORE_DOC = 'aiOverview';

function ensureDbDir() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

export function resetAiMetrics(): AiMetricsData {
  const clean = { ...DEFAULT_METRICS };
  saveLocalMetrics(clean);
  const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC);
  setDoc(docRef, clean).catch(() => {});
  return clean;
}

function getLocalMetrics(): AiMetricsData {
  ensureDbDir();
  if (!fs.existsSync(METRICS_FILE)) {
    saveLocalMetrics(DEFAULT_METRICS);
    return DEFAULT_METRICS;
  }
  try {
    const raw = fs.readFileSync(METRICS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return DEFAULT_METRICS;
  }
}

function saveLocalMetrics(data: AiMetricsData) {
  ensureDbDir();
  try {
    fs.writeFileSync(METRICS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Erro ao salvar aiMetrics.json localmente:', err);
  }
}

export async function getAiMetrics(): Promise<AiMetricsData> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      const local = getLocalMetrics();
      await setDoc(docRef, local, { merge: true });
      return local;
    }

    return snap.data() as AiMetricsData;
  } catch (error) {
    console.warn('Falha ao ler métricas de IA do Firestore (usando cache local):', error);
    return getLocalMetrics();
  }
}

export function recordArticleGenerated(): void {
  try {
    const current = getLocalMetrics();
    current.articlesGenerated = (current.articlesGenerated || 0) + 1;
    saveLocalMetrics(current);

    const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC);
    setDoc(docRef, current, { merge: true }).catch(() => {});
  } catch (error) {
    console.error('Erro ao registrar geração de artigo:', error);
  }
}

export function recordChatMessage(question: string, category: string): void {
  try {
    const current = getLocalMetrics();
    current.chatQuestionsAnswered = (current.chatQuestionsAnswered || 0) + 1;

    if (!current.topicCounts) current.topicCounts = {};
    current.topicCounts[category] = (current.topicCounts[category] || 0) + 1;

    const newInquiry: AiInquiry = {
      id: `inq-${Date.now()}`,
      question: question.slice(0, 140),
      category,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    current.recentInquiries = [newInquiry, ...(current.recentInquiries || [])].slice(0, 8);
    saveLocalMetrics(current);

    const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC);
    setDoc(docRef, current, { merge: true }).catch(() => {});
  } catch (error) {
    console.error('Erro ao registrar mensagem do chat:', error);
  }
}
