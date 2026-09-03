import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || 'dummy-gemini-key';

export const ai = new GoogleGenAI({ apiKey });

// Modelo oficial mais recente da Google Gemini API
export const GEMINI_MODEL = 'gemini-3.6-flash';
export const GEMINI_FALLBACK_MODEL = 'gemini-2.5-flash';
