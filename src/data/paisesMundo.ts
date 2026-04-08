import countries from 'i18n-iso-countries';
import es from 'i18n-iso-countries/langs/es.json';

countries.registerLocale(es);

const nombres = countries.getNames('es') as Record<string, string>;

export type PaisMundo = { iso2: string; nombre: string };

export const PAISES_MUNDO: PaisMundo[] = Object.keys(nombres)
  .filter((iso2) => iso2.length === 2 && countries.isValid(iso2))
  .map((iso2) => ({ iso2, nombre: nombres[iso2] }))
  .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

export function paisMundoPorIso(iso2: string): PaisMundo | undefined {
  const u = iso2.toUpperCase();
  if (!countries.isValid(u)) return undefined;
  const nombre = nombres[u];
  return nombre ? { iso2: u, nombre } : undefined;
}

export function buscarPaisesMundo(query: string, limit = 100): PaisMundo[] {
  const t = query.trim().toLocaleLowerCase('es');
  if (!t) return PAISES_MUNDO.slice(0, limit);
  return PAISES_MUNDO.filter(
    (p) =>
      p.nombre.toLocaleLowerCase('es').includes(t) ||
      p.iso2.toLowerCase().includes(t),
  ).slice(0, limit);
}

/** Bandera regional (Unicode) a partir de ISO 3166-1 alpha-2. */
export function banderaEmojiDesdeIso2(iso2: string): string {
  const c = iso2.toUpperCase();
  if (!/^[A-Z]{2}$/.test(c)) return '🌍';
  const base = 0x1f1e6;
  const cp = (ch: string) => base + (ch.charCodeAt(0) - 65);
  try {
    return String.fromCodePoint(cp(c[0]), cp(c[1]));
  } catch {
    return '🌍';
  }
}
