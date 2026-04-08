/**
 * Cliente Aviationstack (plan gratuito: límite bajo de requests/mes).
 * En desarrollo, Vite reenvía /api/aviationstack → api.aviationstack.com para evitar CORS.
 * En producción estática, si el navegador bloquea CORS, hace falta un proxy (p. ej. Cloud Function).
 */

import type { VueloFavoritoDisplay } from '../logic/vueloFavoritoStorage';

export type AviationStackFlightRow = {
  flight_date?: string;
  flight_status?: string | null;
  departure?: {
    airport?: string;
    iata?: string;
    scheduled?: string;
    estimated?: string;
    actual?: string;
    terminal?: string | null;
    gate?: string | null;
    delay?: number | null;
  };
  arrival?: {
    airport?: string;
    iata?: string;
    scheduled?: string;
    estimated?: string;
    actual?: string;
    terminal?: string | null;
    gate?: string | null;
    delay?: number | null;
  };
  airline?: { name?: string; iata?: string };
  flight?: { iata?: string; number?: string };
};

type ApiResponse = {
  success?: boolean;
  data?: AviationStackFlightRow[];
  error?: { type?: string; info?: string; code?: string };
  /** Algunos errores vienen planos en la raíz (p. ej. plan free + flight_date). */
  code?: string;
  message?: string;
};

function isFunctionAccessRestricted(json: unknown): boolean {
  if (!json || typeof json !== 'object') return false;
  const o = json as ApiResponse;
  return o.code === 'function_access_restricted' || o.error?.code === 'function_access_restricted';
}

export function getAviationStackAccessKey(): string {
  return (import.meta.env.VITE_AVIATIONSTACK_ACCESS_KEY as string | undefined)?.trim() ?? '';
}

/** Plan free suele rechazar `flight_date`; los planes pagos pueden filtrar por fecha en la API. */
function buildFlightsUrl(
  flightIata: string,
  accessKey: string,
  opts?: { flightDateYmd?: string },
): URL {
  if (import.meta.env.DEV) {
    const u = new URL('/api/aviationstack/v1/flights', typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173');
    u.searchParams.set('access_key', accessKey);
    u.searchParams.set('flight_iata', flightIata);
    if (opts?.flightDateYmd) u.searchParams.set('flight_date', opts.flightDateYmd);
    return u;
  }
  const u = new URL('https://api.aviationstack.com/v1/flights');
  u.searchParams.set('access_key', accessKey);
  u.searchParams.set('flight_iata', flightIata);
  if (opts?.flightDateYmd) u.searchParams.set('flight_date', opts.flightDateYmd);
  return u;
}

function pickRowForDate(rows: AviationStackFlightRow[] | undefined, flightDateYmd: string): AviationStackFlightRow | null {
  if (!rows?.length) return null;
  const exact = rows.filter((r) => (r.flight_date ?? '').slice(0, 10) === flightDateYmd);
  if (exact.length === 1) return exact[0];
  if (exact.length > 1) return exact[0];
  const byDep = rows.find((r) => {
    const s = r.departure?.scheduled;
    if (!s) return false;
    return s.slice(0, 10) === flightDateYmd;
  });
  return byDep ?? null;
}

export function normalizeFlightIata(raw: string): string | null {
  const s = raw.replace(/\s+/g, '').toUpperCase();
  if (!s) return null;
  if (/^[A-Z]{2}\d{1,4}$/.test(s)) return s;
  return null;
}

function delayMinutes(v: number | null | undefined): number | undefined {
  if (v == null || Number.isNaN(Number(v))) return undefined;
  const n = Math.round(Number(v));
  return n > 0 ? n : undefined;
}

export function rowToDisplay(
  row: AviationStackFlightRow,
  flightIata: string,
  flightDate: string,
): VueloFavoritoDisplay {
  const dep = row.departure;
  const arr = row.arrival;
  const st = (row.flight_status && String(row.flight_status).trim()) || 'unknown';
  return {
    status: st,
    flightIata: row.flight?.iata ?? flightIata,
    flightDate: row.flight_date ?? flightDate,
    airlineName: row.airline?.name,
    airlineIata: row.airline?.iata,
    depAirport: dep?.airport,
    depIata: dep?.iata,
    depScheduled: dep?.scheduled,
    depEstimated: dep?.estimated,
    depActual: dep?.actual,
    depTerminal: dep?.terminal ?? undefined,
    depGate: dep?.gate ?? undefined,
    depDelayMin: delayMinutes(dep?.delay),
    arrAirport: arr?.airport,
    arrIata: arr?.iata,
    arrScheduled: arr?.scheduled,
    arrEstimated: arr?.estimated,
    arrTerminal: arr?.terminal ?? undefined,
    arrGate: arr?.gate ?? undefined,
    arrDelayMin: delayMinutes(arr?.delay),
  };
}

export async function fetchFlightByIata(
  flightIata: string,
  flightDateYmd: string,
): Promise<{ row: AviationStackFlightRow | null; errorMessage?: string }> {
  const key = getAviationStackAccessKey();
  if (!key) {
    return { row: null, errorMessage: 'La consulta de vuelo no está disponible en este momento.' };
  }

  /**
   * Una sola petición sin `flight_date` en la URL: el plan gratuito suele bloquear ese parámetro
   * (evita dos requests por consulta). La fecha se aplica con `pickRowForDate` sobre la respuesta.
   */
  let res: Response;
  let json: ApiResponse;
  try {
    const url = buildFlightsUrl(flightIata, key);
    res = await fetch(url.toString());
    json = (await res.json()) as ApiResponse;
  } catch {
    return {
      row: null,
      errorMessage: 'No pudimos conectar. Revisá tu conexión e intentá de nuevo.',
    };
  }

  if (isFunctionAccessRestricted(json)) {
    return { row: null, errorMessage: 'No se pudo obtener información para este vuelo. Probá más tarde.' };
  }

  if (!res.ok) {
    return { row: null, errorMessage: 'No se pudo completar la consulta. Probá más tarde.' };
  }
  if (json.success === false && json.error?.info) {
    return { row: null, errorMessage: 'No se pudo completar la consulta. Probá más tarde.' };
  }
  if (json.error?.info && !json.data?.length) {
    return { row: null, errorMessage: 'No se pudo completar la consulta. Probá más tarde.' };
  }

  const rows = json.data ?? [];
  const row = pickRowForDate(rows, flightDateYmd);

  if (!row) {
    return {
      row: null,
      errorMessage: 'No encontramos información para ese vuelo y fecha. Revisá el código y la fecha.',
    };
  }

  return { row };
}
