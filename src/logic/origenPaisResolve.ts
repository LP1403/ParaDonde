import type { OpcionAventura } from '../data/aventura';
import { preguntasAventura } from '../data/aventura';
import { banderaEmojiDesdeIso2, paisMundoPorIso } from '../data/paisesMundo';

const ISO_RE = /^iso_([a-z]{2})$/i;

export function makeOrigenPaisIsoId(iso2: string): string {
  return `iso_${iso2.toLowerCase()}`;
}

export function parseIsoFromOrigenPaisId(id: string): string | null {
  const m = ISO_RE.exec(id.trim());
  return m ? m[1].toUpperCase() : null;
}

export function isValidOrigenPaisId(id: string): boolean {
  const p0 = preguntasAventura[0];
  if (p0?.id === 'origen_pais' && p0.opciones.some((o) => o.id === id)) return true;
  const iso = parseIsoFromOrigenPaisId(id);
  return iso != null && paisMundoPorIso(iso) != null;
}

export function getOrigenPaisOpcionById(id: string): OpcionAventura | undefined {
  const p0 = preguntasAventura[0];
  if (p0?.id === 'origen_pais') {
    const preset = p0.opciones.find((o) => o.id === id);
    if (preset) return preset;
  }
  const iso = parseIsoFromOrigenPaisId(id);
  if (!iso) return undefined;
  const pm = paisMundoPorIso(iso);
  if (!pm) return undefined;
  return {
    id,
    label: pm.nombre,
    bandera: banderaEmojiDesdeIso2(iso),
  };
}
