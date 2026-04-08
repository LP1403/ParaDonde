const FAVORITES_KEY = 'paradonde_destinos_favoritos_v1';
const MAX_FAVORITES = 40;

function dispatchChanged(): void {
  try {
    window.dispatchEvent(new CustomEvent('pd-favoritos-changed'));
  } catch {
    /* ignore */
  }
}

export function getFavoriteDestinoSlugs(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is string => typeof s === 'string' && s.trim().length > 0);
  } catch {
    return [];
  }
}

export function isFavoriteDestino(slug: string): boolean {
  if (!slug?.trim()) return false;
  return getFavoriteDestinoSlugs().includes(slug);
}

export function addFavoriteDestino(slug: string): void {
  if (!slug?.trim()) return;
  try {
    const s = slug.trim();
    const cur = getFavoriteDestinoSlugs().filter((x) => x !== s);
    const next = [s, ...cur].slice(0, MAX_FAVORITES);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    dispatchChanged();
  } catch {
    /* ignore */
  }
}

export function removeFavoriteDestino(slug: string): void {
  if (!slug?.trim()) return;
  try {
    const s = slug.trim();
    const next = getFavoriteDestinoSlugs().filter((x) => x !== s);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    dispatchChanged();
  } catch {
    /* ignore */
  }
}

/** Devuelve true si quedó marcado como favorito. */
export function toggleFavoriteDestino(slug: string): boolean {
  if (!slug?.trim()) return false;
  if (isFavoriteDestino(slug)) {
    removeFavoriteDestino(slug);
    return false;
  }
  addFavoriteDestino(slug);
  return true;
}

export function favoriteDestinoCount(): number {
  return getFavoriteDestinoSlugs().length;
}
