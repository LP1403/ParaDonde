/**
 * Historial local de “copias” del resultado de aventura: cada carga con query
 * (elecciones del formulario) se guarda para poder revisar o reutilizar la URL.
 */

const STORAGE_KEY = 'paradonde_resultado_historial_v1';
const MAX_ENTRIES = 50;

export type AventuraResultadoHistorialEntry = {
  /** ms epoch */
  t: number;
  /** query string (sin `?` inicial), estable para rearmar /aventura/resultado? */
  q: string;
};

let lastDedupe: { q: string; t: number } | null = null;

/**
 * Ordena claves al serializar para comparar de forma estable (opcional).
 */
function stableQueryString(params: URLSearchParams): string {
  const entries = Array.from(params.entries());
  if (entries.length === 0) return '';
  entries.sort(([a], [b]) => a.localeCompare(b));
  return new URLSearchParams(entries).toString();
}

/**
 * Añade una entrada si hay parámetros. Evita duplicado inmediato (p. ej. React StrictMode).
 */
export function recordAventuraResultadoSnapshot(
  input: URLSearchParams | string,
): void {
  const q =
    typeof input === 'string'
      ? stableQueryString(new URLSearchParams(input))
      : stableQueryString(input);
  if (!q) return;

  const now = Date.now();
  if (lastDedupe && lastDedupe.q === q && now - lastDedupe.t < 900) return;
  lastDedupe = { q, t: now };

  let list: AventuraResultadoHistorialEntry[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        list = parsed.filter(
          (e): e is AventuraResultadoHistorialEntry =>
            e != null &&
            typeof e === 'object' &&
            typeof (e as { t?: unknown }).t === 'number' &&
            typeof (e as { q?: unknown }).q === 'string',
        );
      }
    }
  } catch {
    list = [];
  }

  list.unshift({ t: now, q });
  if (list.length > MAX_ENTRIES) list = list.slice(0, MAX_ENTRIES);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('pd-aventura-resultado-historial-changed'));
  } catch {
    /* lleno o private mode */
  }
}

export function getAventuraResultadoHistorial(): AventuraResultadoHistorialEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is AventuraResultadoHistorialEntry =>
        e != null &&
        typeof e === 'object' &&
        typeof (e as { t?: unknown }).t === 'number' &&
        typeof (e as { q?: unknown }).q === 'string',
    );
  } catch {
    return [];
  }
}

/** URL listo para copiar o abrir. */
export function aventuraResultadoUrlFromQueryString(q: string, origin?: string): string {
  const path = `/aventura/resultado?${q}`;
  if (typeof window !== 'undefined' && !origin) {
    return `${window.location.origin}${path}`;
  }
  if (origin) return `${origin.replace(/\/$/, '')}${path}`;
  return path;
}
