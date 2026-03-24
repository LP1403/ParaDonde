import type { Destino } from '../data/destinos';
import { wikiImages } from '../data/wikiImages';

/** Misma prioridad que la página destino: locales → API → imageUrl */
export function urlsImagenesDestino(destino: Destino, wikiApiUrls: string[]): string[] {
  const local = wikiImages[destino.id];
  if (local && local.length > 0) return local;
  if (wikiApiUrls.length > 0) return wikiApiUrls;
  return destino.imageUrl ? [destino.imageUrl] : [];
}
