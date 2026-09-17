import fs from 'fs';
import path from 'path';
import type { Firestore } from 'firebase-admin/firestore';
import { isFirebaseAdminConfigured } from './firebaseConfigHelper';
import { Lead, LeadStatus } from '../types';
import { getSiteConfigFromFirestore } from './firestoreDb';

const DB_DIR = path.join(process.cwd(), 'src', 'data', 'db');
const LEADS_FILE = path.join(DB_DIR, 'leads.json');
const LEADS_COLLECTION = 'leads';

export type LeadWebhookStatus = 'sent' | 'not_configured' | 'failed';

export interface LeadWebhookResult {
  status: LeadWebhookStatus;
  httpStatus?: number;
}

function canUseLocalLeadStore(): boolean {
  return process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1';
}

export class LeadPersistenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LeadPersistenceError';
  }
}

async function getAdminDb(): Promise<Firestore> {
  const { getAdminDb: resolveAdminDb } = await import('./firebaseAdmin');
  const adminDb = resolveAdminDb();
  if (!adminDb) {
    throw new LeadPersistenceError('Firebase Admin Firestore não configurado para persistir leads.');
  }
  return adminDb;
}

function ensureDbDir() {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  } catch {
    // Sistema de arquivos somente-leitura na Vercel
  }
}

async function resolveLeadWebhookUrl(): Promise<string> {
  try {
    const config = await getSiteConfigFromFirestore();
    const firestoreUrl = String((config as any)?.n8nWebhookUrl || '').trim();
    if (firestoreUrl) return firestoreUrl;
  } catch (error: any) {
    console.warn('Não foi possível consultar o webhook salvo no Firestore:', error?.message);
  }

  return String(process.env.N8N_WEBHOOK_URL || '').trim();
}

export async function sendLeadWebhook(payload: Record<string, unknown>): Promise<LeadWebhookResult> {
  const webhookUrl = await resolveLeadWebhookUrl();

  if (!/^https?:\/\//i.test(webhookUrl)) {
    return { status: 'not_configured' };
  }

  try {
    const webhookRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    });

    if (!webhookRes.ok) {
      console.error(`Webhook N8N recusou o disparo com status ${webhookRes.status}.`);
      return { status: 'failed', httpStatus: webhookRes.status };
    }

    return { status: 'sent', httpStatus: webhookRes.status };
  } catch (error: any) {
    console.error('Erro ao disparar Webhook N8N:', error?.message);
    return { status: 'failed' };
  }
}

export function getLocalLeads(): Lead[] {
  try {
    ensureDbDir();
    if (!fs.existsSync(LEADS_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(LEADS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    return [];
  }
}

export function saveLocalLeads(leads: Lead[]): void {
  try {
    ensureDbDir();
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
  } catch {
    // Em ambientes serverless (Vercel), ignora erro de disco somente-leitura
  }
}

export async function getLeadsFromDb(includeTrash = false): Promise<Lead[]> {
  let leads: Lead[] = [];
  if (!isFirebaseAdminConfigured()) {
    if (!canUseLocalLeadStore()) {
      throw new LeadPersistenceError('Firebase Admin Firestore não configurado para consultar leads.');
    }
    leads = getLocalLeads();
  } else {
    try {
      const adminDb = await getAdminDb();
      const snap = await adminDb.collection(LEADS_COLLECTION).get();
      if (snap.empty) {
        leads = canUseLocalLeadStore() ? getLocalLeads() : [];
      } else {
        leads = snap.docs.map((d) => d.data() as Lead);
      }
    } catch (err: any) {
      if (!canUseLocalLeadStore()) {
        console.error('Erro ao consultar leads no Firestore:', err?.message);
        throw new LeadPersistenceError('Não foi possível consultar os leads reais no Firestore.');
      }
      console.warn('Aviso: Leitura do Firestore falhou, usando base local:', err?.message);
      leads = getLocalLeads();
    }
  }

  // Filtra por lixeira ou ativos
  if (includeTrash) {
    return leads
      .filter((l) => l.isDeleted === true)
      .sort(
        (a, b) =>
          new Date(b.deletedAt || b.createdAt).getTime() -
          new Date(a.deletedAt || a.createdAt).getTime()
      );
  }

  return leads
    .filter((l) => !l.isDeleted)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createLead(
  leadData: Omit<Lead, 'id' | 'createdAt' | 'status'> & { status?: LeadStatus }
): Promise<Lead> {
  const newLead: Lead = {
    id: `lead-${Date.now()}`,
    name: leadData.name.trim(),
    phone: leadData.phone.trim(),
    email: leadData.email?.trim() || '',
    courseInterest: leadData.courseInterest || 'Interesse Geral',
    preferredShift: leadData.preferredShift || 'Qualquer',
    status: leadData.status || 'novo',
    source: leadData.source || 'Chatbot Izzy',
    notes: leadData.notes || '',
    isDeleted: false,
    createdAt: new Date().toISOString(),
    notificationStatus: 'pending',
  };

  let firestoreSaved = false;
  let localSaved = false;

  // 1. Salva no Firestore via Admin SDK se configurado
  if (isFirebaseAdminConfigured()) {
    try {
      const adminDb = await getAdminDb();
      await adminDb.collection(LEADS_COLLECTION).doc(newLead.id).set(newLead);
      firestoreSaved = true;
    } catch (err: any) {
      console.error('Erro ao persistir lead no Firestore:', err?.message);
    }
  } else if (canUseLocalLeadStore()) {
    const local = getLocalLeads();
    local.unshift(newLead);
    saveLocalLeads(local);
    localSaved = true;
  }

  // 2. Tenta notificar mesmo se o CRM oscilar, para que o Telegram ainda possa
  // servir como cópia de segurança. A API só confirma sucesso se o CRM salvou.
  const notification = await sendLeadWebhook({
    event: 'novo_lead',
    timestamp: new Date().toISOString(),
    lead: newLead,
  });
  newLead.notificationStatus = notification.status;
  newLead.notificationLastAttemptAt = new Date().toISOString();

  if (firestoreSaved) {
    try {
      const adminDb = await getAdminDb();
      await adminDb.collection(LEADS_COLLECTION).doc(newLead.id).set(
        {
          notificationStatus: newLead.notificationStatus,
          notificationLastAttemptAt: newLead.notificationLastAttemptAt,
        },
        { merge: true }
      );
    } catch (err: any) {
      console.warn('Lead salvo, mas o status da notificação não foi atualizado:', err?.message);
    }
  }

  if (!firestoreSaved && !localSaved) {
    throw new LeadPersistenceError('Não foi possível confirmar o lead no CRM.');
  }

  // 3. Cache local apenas depois de confirmar persistência real no Firestore.
  if (firestoreSaved && canUseLocalLeadStore()) {
    const local = getLocalLeads();
    local.unshift(newLead);
    saveLocalLeads(local);
  }

  return newLead;
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
  notes?: string
): Promise<Lead | null> {
  const local = getLocalLeads();
  const index = local.findIndex((l) => l.id === id);
  let lead = index >= 0 ? local[index] : null;

  if (!lead && isFirebaseAdminConfigured()) {
    const adminDb = await getAdminDb();
    const snap = await adminDb.collection(LEADS_COLLECTION).doc(id).get();
    if (snap.exists) {
      lead = snap.data() as Lead;
    }
  }

  if (!lead) return null;

  const adminDb = await getAdminDb();
  lead.status = status;
  if (notes !== undefined) lead.notes = notes;
  lead.lastContactAt = new Date().toISOString();

  try {
    await adminDb.collection(LEADS_COLLECTION).doc(id).set(lead, { merge: true });
  } catch (err: any) {
    console.error('Erro ao atualizar status no Firestore:', err?.message);
    throw new Error('Falha ao atualizar status do lead no banco de dados.');
  }

  if (index >= 0) {
    local[index] = lead;
  } else {
    local.unshift(lead);
  }
  saveLocalLeads(local);

  return lead;
}

export async function trashLead(id: string): Promise<boolean> {
  const local = getLocalLeads();
  const index = local.findIndex((l) => l.id === id);
  let lead = index >= 0 ? local[index] : null;

  if (!lead && isFirebaseAdminConfigured()) {
    const adminDb = await getAdminDb();
    const snap = await adminDb.collection(LEADS_COLLECTION).doc(id).get();
    if (snap.exists) {
      lead = snap.data() as Lead;
    }
  }

  if (!lead) return false;

  const adminDb = await getAdminDb();
  lead.isDeleted = true;
  lead.deletedAt = new Date().toISOString();

  try {
    await adminDb.collection(LEADS_COLLECTION).doc(id).set(lead, { merge: true });
  } catch (err: any) {
    console.error('Erro ao mover lead para lixeira no Firestore:', err?.message);
    throw new Error('Falha ao mover lead para lixeira.');
  }

  if (index >= 0) {
    local[index] = lead;
  } else {
    local.unshift(lead);
  }
  saveLocalLeads(local);

  return true;
}

export async function restoreLead(id: string): Promise<Lead | null> {
  const local = getLocalLeads();
  const index = local.findIndex((l) => l.id === id);
  let lead = index >= 0 ? local[index] : null;

  if (!lead && isFirebaseAdminConfigured()) {
    const adminDb = await getAdminDb();
    const snap = await adminDb.collection(LEADS_COLLECTION).doc(id).get();
    if (snap.exists) {
      lead = snap.data() as Lead;
    }
  }

  if (!lead) return null;

  const adminDb = await getAdminDb();
  lead.isDeleted = false;
  delete lead.deletedAt;

  try {
    await adminDb.collection(LEADS_COLLECTION).doc(id).set(lead, { merge: true });
  } catch (err: any) {
    console.error('Erro ao restaurar lead no Firestore:', err?.message);
    throw new Error('Falha ao restaurar lead.');
  }

  if (index >= 0) {
    local[index] = lead;
  } else {
    local.unshift(lead);
  }
  saveLocalLeads(local);

  return lead;
}

export async function permanentDeleteLead(id: string): Promise<boolean> {
  const adminDb = await getAdminDb();
  let local = getLocalLeads();

  try {
    await adminDb.collection(LEADS_COLLECTION).doc(id).delete();
  } catch (err: any) {
    console.error('Erro ao excluir lead permanentemente no Firestore:', err?.message);
    throw new Error('Falha ao excluir lead permanentemente.');
  }

  local = local.filter((l) => l.id !== id);
  saveLocalLeads(local);

  return true;
}

export async function emptyTrash(): Promise<boolean> {
  const adminDb = await getAdminDb();
  let local = getLocalLeads();
  const trashed = local.filter((l) => l.isDeleted);

  try {
    const batch = adminDb.batch();
    if (trashed.length > 0) {
      trashed.forEach((l) => {
        batch.delete(adminDb.collection(LEADS_COLLECTION).doc(l.id));
      });
    } else {
      const snap = await adminDb.collection(LEADS_COLLECTION).where('isDeleted', '==', true).get();
      snap.docs.forEach((doc) => batch.delete(doc.ref));
    }
    await batch.commit();
  } catch (err: any) {
    console.error('Erro ao esvaziar lixeira no Firestore:', err?.message);
    throw new Error('Falha ao esvaziar lixeira.');
  }

  local = local.filter((l) => !l.isDeleted);
  saveLocalLeads(local);

  return true;
}
