import { preguntasAventura } from '../data/aventura';

/** Respuestas completas (flujo legacy en sessionStorage al terminar) */
export const SESSION_RESPUESTAS_KEY = 'paradonde_aventura_respuestas';

/** Progreso parcial en localStorage para hub y recuperación tras recargar */
const PROGRESS_KEY = 'paradonde_aventura_progress_v1';

export type AventuraProgress = {
  respuestas: Record<string, string>;
  pasoActual: number;
  lastCoverUrl?: string;
};

export function getAventuraProgress(): AventuraProgress | null {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as AventuraProgress;
    if (!p || typeof p.respuestas !== 'object' || typeof p.pasoActual !== 'number') return null;
    const n = preguntasAventura.length;
    if (p.pasoActual < 0 || p.pasoActual >= n) return null;
    return p;
  } catch {
    return null;
  }
}

export function setAventuraProgress(p: AventuraProgress): void {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}

export function clearAventuraProgress(): void {
  localStorage.removeItem(PROGRESS_KEY);
  try {
    sessionStorage.removeItem(SESSION_RESPUESTAS_KEY);
  } catch {
    /* ignore */
  }
}

/** Imagen de la última respuesta con `imageUrl` (para tarjeta del hub). */
export function lastCoverFromRespuestas(r: Record<string, string>): string | undefined {
  let last: string | undefined;
  for (const q of preguntasAventura) {
    const opId = r[q.id];
    if (!opId) break;
    last = q.opciones.find((o) => o.id === opId)?.imageUrl ?? last;
  }
  return last;
}

/** Hay al menos una respuesta guardada (flujo empezado). */
export function hasInProgressAventura(): boolean {
  const p = getAventuraProgress();
  return p != null && Object.keys(p.respuestas).length > 0;
}

export function getRespuestasFromStorage(): Record<string, string> {
  try {
    const s = sessionStorage.getItem(SESSION_RESPUESTAS_KEY);
    return s ? JSON.parse(s) : {};
  } catch {
    return {};
  }
}

export function setRespuestasInStorage(r: Record<string, string>) {
  sessionStorage.setItem(SESSION_RESPUESTAS_KEY, JSON.stringify(r));
}

/** País de residencia recordado entre sesiones (solo el id de opción `origen_pais`). */
const ORIGEN_PAIS_PREFERIDO_KEY = 'paradonde_origen_pais_preferido_v1';

export function getPersistedOrigenPaisId(): string | null {
  try {
    const v = localStorage.getItem(ORIGEN_PAIS_PREFERIDO_KEY)?.trim();
    return v || null;
  } catch {
    return null;
  }
}

export function setPersistedOrigenPaisId(id: string): void {
  try {
    if (id?.trim()) {
      localStorage.setItem(ORIGEN_PAIS_PREFERIDO_KEY, id.trim());
      window.dispatchEvent(new CustomEvent('pd-origen-pais-changed'));
    }
  } catch {
    /* ignore */
  }
}
