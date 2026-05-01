import type { Destino } from '../data/destinos';
import { wikiImages } from '../data/wikiImages';

/**
 * Primera imagen sin async: mismas fotos locales que la ficha al entrar (antes de Wikipedia).
 * Si no hay carpeta local, cae en `imageUrl` del dato (como fallback de Destino sin API aún).
 */
export function primeraImagenDestinoLista(destino: Destino): string | undefined {
  const local = wikiImages[destino.id];
  if (local && local.length > 0) return local[0];
  const u = destino.imageUrl?.trim();
  return u || undefined;
}

/** Misma prioridad que la página destino: locales → API → imageUrl */
export function urlsImagenesDestino(destino: Destino, wikiApiUrls: string[]): string[] {
  const local = wikiImages[destino.id];
  if (local && local.length > 0) return local;
  if (wikiApiUrls.length > 0) return wikiApiUrls;
  return destino.imageUrl ? [destino.imageUrl] : [];
}
