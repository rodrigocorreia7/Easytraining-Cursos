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
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

export function getLocalLeads(): Lead[] {
  ensureDbDir();
  if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), 'utf-8');
    return [];
  }
  try {
    const raw = fs.readFileSync(LEADS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    return [];
  }
}

export function saveLocalLeads(leads: Lead[]): void {
  ensureDbDir();
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
}

export async function getLeadsFromDb(): Promise<Lead[]> {
  try {
    const snap = await getDocs(collection(db, LEADS_COLLECTION));
    if (snap.empty) {
      return getLocalLeads();
    }
    const leads: Lead[] = [];
    snap.forEach(d => {
      leads.push(d.data() as Lead);
    });
    leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return leads;
  } catch (err) {
    return getLocalLeads();
  }
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
    createdAt: new Date().toISOString()
  };

  // 1. Salva localmente
  const local = getLocalLeads();
  local.unshift(newLead);
  saveLocalLeads(local);

  // 2. Salva no Firestore (background)
  try {
    const docRef = doc(db, LEADS_COLLECTION, newLead.id);
    setDoc(docRef, newLead, { merge: true }).catch(() => {});
  } catch (err) {
    console.warn('Erro ao salvar lead no Firestore:', err);
  }

  // 3. Dispara Webhook do N8N se configurado
  try {
    const config = getStoredSiteConfig();
    const webhookUrl = (config as any)?.n8nWebhookUrl || process.env.N8N_WEBHOOK_URL;
    if (webhookUrl && webhookUrl.startsWith('http')) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'novo_lead',
          timestamp: new Date().toISOString(),
          lead: newLead
        })
      }).catch(e => console.warn('Erro ao disparar Webhook N8N:', e.message));
    }
  } catch (e) {
    // Ignora erro de webhook para não travar o fluxo
  }

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

export async function deleteLead(id: string): Promise<boolean> {
  let local = getLocalLeads();
  local = local.filter(l => l.id !== id);
  saveLocalLeads(local);

  try {
    const docRef = doc(db, LEADS_COLLECTION, id);
    deleteDoc(docRef).catch(() => {});
  } catch (err) {}

  return true;
}
