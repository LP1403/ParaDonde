const RECENTS_KEY = 'paradonde_destinos_recientes_v1';
const LAST_SLUG_KEY = 'paradonde_last_destino_slug_v1';
const MAX_RECENTS = 8;

export function recordDestinoVisit(slug: string): void {
  if (!slug?.trim()) return;
  try {
    localStorage.setItem(LAST_SLUG_KEY, slug);
    const raw = localStorage.getItem(RECENTS_KEY);
    let list: string[] = [];
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) list = parsed.filter((s): s is string => typeof s === 'string');
    }
    list = [slug, ...list.filter((s) => s !== slug)].slice(0, MAX_RECENTS);
    localStorage.setItem(RECENTS_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export function getRecentDestinoSlugs(): string[] {
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is string => typeof s === 'string');
  } catch {
    return [];
  }
}

export function getLastDestinoSlug(): string | null {
  try {
    const s = localStorage.getItem(LAST_SLUG_KEY);
    return s?.trim() ? s : null;
  } catch {
    return null;
  }
}

/** Para estado “hub”: hubo al menos un destino guardado en recientes. */
export function hasRecentDestinoActivity(): boolean {
  return getRecentDestinoSlugs().length > 0;
}
