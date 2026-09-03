import fs from 'fs';
import path from 'path';
import { db } from './firebase';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { Lead, LeadStatus } from '../types';
import { getStoredSiteConfig } from './db';

const DB_DIR = path.join(process.cwd(), 'src', 'data', 'db');
const LEADS_FILE = path.join(DB_DIR, 'leads.json');
const LEADS_COLLECTION = 'leads';

function ensureDbDir() {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  } catch {
    // Sistema de arquivos somente-leitura na Vercel
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
    // pois a persistência oficial é o Google Cloud Firestore
  }
}

export async function getLeadsFromDb(includeTrash = false): Promise<Lead[]> {
  let leads: Lead[] = [];
  try {
    const snap = await getDocs(collection(db, LEADS_COLLECTION));
    if (snap.empty) {
      leads = getLocalLeads();
    } else {
      snap.forEach(d => {
        leads.push(d.data() as Lead);
      });
    }
  } catch (err) {
    leads = getLocalLeads();
  }

  // Filtra por lixeira ou ativos
  if (includeTrash) {
    return leads.filter(l => l.isDeleted === true).sort((a, b) => 
      new Date(b.deletedAt || b.createdAt).getTime() - new Date(a.deletedAt || a.createdAt).getTime()
    );
  }

  return leads.filter(l => !l.isDeleted).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'status'> & { status?: LeadStatus }): Promise<Lead> {
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
    createdAt: new Date().toISOString()
  };

  // 1. Salva localmente
  const local = getLocalLeads();
  local.unshift(newLead);
  saveLocalLeads(local);

  // 2. Salva no Firestore (Create para regras de segurança)
  try {
    const docRef = doc(db, LEADS_COLLECTION, newLead.id);
    await setDoc(docRef, newLead);
  } catch (err: any) {
    console.warn('Aviso: Firestore offline ou em validação, salvo localmente:', err.message);
  }

  // 3. Dispara Webhook do N8N se configurado
  try {
    const config = getStoredSiteConfig();
    const webhookUrl = (config as any)?.n8nWebhookUrl || process.env.N8N_WEBHOOK_URL || 'https://n8n.eterion.online/webhook/easytraining-leads';
    if (webhookUrl && webhookUrl.startsWith('http')) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'novo_lead',
          timestamp: new Date().toISOString(),
          lead: newLead
        }),
        signal: AbortSignal.timeout(5000)
      }).catch(e => console.warn('Erro ao disparar Webhook N8N:', e.message));
    }
  } catch (e) {}

  return newLead;
}

export async function updateLeadStatus(id: string, status: LeadStatus, notes?: string): Promise<Lead | null> {
  const local = getLocalLeads();
  const index = local.findIndex(l => l.id === id);
  if (index === -1) return null;

  local[index].status = status;
  if (notes !== undefined) local[index].notes = notes;
  local[index].lastContactAt = new Date().toISOString();

  saveLocalLeads(local);

  try {
    const docRef = doc(db, LEADS_COLLECTION, id);
    setDoc(docRef, local[index], { merge: true }).catch(() => {});
  } catch (err) {
    console.warn('Erro ao atualizar status no Firestore:', err);
  }

  return local[index];
}

/**
 * Envia o lead para a Lixeira (Soft Delete no Firestore e local)
 */
export async function trashLead(id: string): Promise<boolean> {
  const local = getLocalLeads();
  const index = local.findIndex(l => l.id === id);
  if (index === -1) return false;

  local[index].isDeleted = true;
  local[index].deletedAt = new Date().toISOString();
  saveLocalLeads(local);

  try {
    const docRef = doc(db, LEADS_COLLECTION, id);
    setDoc(docRef, local[index], { merge: true }).catch(() => {});
  } catch (err) {
    console.warn('Erro ao mover lead para lixeira no Firestore:', err);
  }

  return true;
}

/**
 * Restaura o lead da Lixeira de volta para o Kanban
 */
export async function restoreLead(id: string): Promise<Lead | null> {
  const local = getLocalLeads();
  const index = local.findIndex(l => l.id === id);
  if (index === -1) return null;

  local[index].isDeleted = false;
  delete local[index].deletedAt;
  saveLocalLeads(local);

  try {
    const docRef = doc(db, LEADS_COLLECTION, id);
    setDoc(docRef, local[index], { merge: true }).catch(() => {});
  } catch (err) {
    console.warn('Erro ao restaurar lead no Firestore:', err);
  }

  return local[index];
}

/**
 * Exclui definitivamente o lead do Firestore e do arquivo local
 */
export async function permanentDeleteLead(id: string): Promise<boolean> {
  let local = getLocalLeads();
  local = local.filter(l => l.id !== id);
  saveLocalLeads(local);

  try {
    const docRef = doc(db, LEADS_COLLECTION, id);
    deleteDoc(docRef).catch(() => {});
  } catch (err) {}

  return true;
}

/**
 * Esvazia toda a lixeira definitivamente
 */
export async function emptyTrash(): Promise<boolean> {
  let local = getLocalLeads();
  const trashed = local.filter(l => l.isDeleted);
  local = local.filter(l => !l.isDeleted);
  saveLocalLeads(local);

  try {
    for (const l of trashed) {
      const docRef = doc(db, LEADS_COLLECTION, l.id);
      deleteDoc(docRef).catch(() => {});
    }
  } catch (err) {}

  return true;
}
