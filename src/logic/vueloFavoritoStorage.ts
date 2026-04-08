/**
 * Vuelos guardados por destino (Mis viajes), varios por slug (ida / vuelta, escalas).
 * Persistencia local; en el futuro se puede sincronizar con la cuenta.
 */

const STORAGE_KEY_V2 = 'paradonde_vuelo_favorito_por_slug_v2';
const LEGACY_STORAGE_KEY = 'paradonde_vuelo_favorito_por_slug_v1';

export type VueloFavoritoDisplay = {
  status: string;
  flightIata: string;
  flightDate: string;
  airlineName?: string;
  airlineIata?: string;
  depAirport?: string;
  depIata?: string;
  depScheduled?: string;
  depEstimated?: string;
  depActual?: string;
  depTerminal?: string;
  depGate?: string;
  depDelayMin?: number;
  arrAirport?: string;
  arrIata?: string;
  arrScheduled?: string;
  arrEstimated?: string;
  arrTerminal?: string;
  arrGate?: string;
  arrDelayMin?: number;
};

export type VueloFavoritoGuardado = {
  /** Estable por vuelo + fecha (actualiza en lugar de duplicar). */
  id: string;
  flightIata: string;
  flightDate: string;
  updatedAt: string;
  display: VueloFavoritoDisplay;
};

type StoreShape = Record<string, VueloFavoritoGuardado[]>;

function entryId(flightIata: string, flightDate: string): string {
  return `${flightIata.trim().toUpperCase()}|${flightDate.trim()}`;
}

function isGuardado(x: unknown): x is VueloFavoritoGuardado {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.flightIata === 'string' &&
    typeof o.flightDate === 'string' &&
    typeof o.updatedAt === 'string' &&
    o.display != null &&
    typeof o.display === 'object'
  );
}

function migrateLegacyV1(): StoreShape | null {
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as unknown;
    if (!p || typeof p !== 'object') return null;
    const out: StoreShape = {};
    for (const [slug, val] of Object.entries(p as Record<string, unknown>)) {
      if (!slug?.trim()) continue;
      if (val && typeof val === 'object' && !Array.isArray(val) && 'display' in val) {
        const o = val as Record<string, unknown>;
        const iata = typeof o.flightIata === 'string' ? o.flightIata : '';
        const date = typeof o.flightDate === 'string' ? o.flightDate : '';
        if (!iata || !date) continue;
        const id = entryId(iata, date);
        out[slug.trim()] = [
          {
            id,
            flightIata: iata.trim().toUpperCase(),
            flightDate: date,
            updatedAt: typeof o.updatedAt === 'string' ? o.updatedAt : new Date().toISOString(),
            display: o.display as VueloFavoritoDisplay,
          },
        ];
      }
    }
    return Object.keys(out).length ? out : null;
  } catch {
    return null;
  }
}

function readAll(): StoreShape {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_V2);
    if (raw) {
      const p = JSON.parse(raw) as unknown;
      if (p && typeof p === 'object' && !Array.isArray(p)) {
        const out: StoreShape = {};
        for (const [slug, arr] of Object.entries(p as Record<string, unknown>)) {
          if (!slug?.trim()) continue;
          if (!Array.isArray(arr)) continue;
          const list = arr.filter(isGuardado);
          if (list.length) out[slug.trim()] = list;
        }
        return out;
      }
    }
  } catch {
    /* ignore */
  }

  const migrated = migrateLegacyV1();
  if (migrated) {
    writeAll(migrated);
    try {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    return migrated;
  }

  return {};
}

function writeAll(data: StoreShape): void {
  try {
    localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('pd-vuelo-favorito-changed'));
  } catch {
    /* ignore */
  }
}

export function getVuelosFavoritos(slug: string): VueloFavoritoGuardado[] {
  if (!slug?.trim()) return [];
  const list = readAll()[slug.trim()];
  if (!list?.length) return [];
  return [...list].sort((a, b) => {
    const t = b.updatedAt.localeCompare(a.updatedAt);
    if (t !== 0) return t;
    return a.flightIata.localeCompare(b.flightIata);
  });
}

/** Compatibilidad: devuelve el vuelo actualizado más recientemente (no el primero en orden de fecha). */
export function getVueloFavorito(slug: string): VueloFavoritoGuardado | null {
  const list = getVuelosFavoritos(slug);
  if (!list.length) return null;
  return list.reduce((a, b) => (a.updatedAt > b.updatedAt ? a : b));
}

/**
 * Inserta o actualiza el vuelo con el mismo código + fecha.
 */
export function upsertVueloFavorito(
  slug: string,
  payload: Omit<VueloFavoritoGuardado, 'id'> & { id?: string },
): VueloFavoritoGuardado | null {
  if (!slug?.trim()) return null;
  const id = payload.id ?? entryId(payload.flightIata, payload.flightDate);
  const row: VueloFavoritoGuardado = {
    id,
    flightIata: payload.flightIata.trim().toUpperCase(),
    flightDate: payload.flightDate,
    updatedAt: payload.updatedAt,
    display: payload.display,
  };
  const all = readAll();
  const key = slug.trim();
  const prev = all[key] ?? [];
  const idx = prev.findIndex((x) => x.id === id);
  const next = idx === -1 ? [...prev, row] : prev.map((x, i) => (i === idx ? row : x));
  all[key] = next;
  writeAll(all);
  return row;
}

export function setVueloFavorito(slug: string, payload: Omit<VueloFavoritoGuardado, 'id'>): void {
  upsertVueloFavorito(slug, payload);
}

export function removeVueloFavorito(slug: string, id: string): void {
  if (!slug?.trim() || !id) return;
  const all = readAll();
  const key = slug.trim();
  const prev = all[key];
  if (!prev?.length) return;
  const next = prev.filter((x) => x.id !== id);
  if (next.length === 0) delete all[key];
  else all[key] = next;
  writeAll(all);
}

export function clearVuelosFavoritos(slug: string): void {
  if (!slug?.trim()) return;
  const all = readAll();
  delete all[slug.trim()];
  writeAll(all);
}

/** Quita todos los vuelos del destino (alias). */
export function clearVueloFavorito(slug: string): void {
  clearVuelosFavoritos(slug);
}
