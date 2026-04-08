/**
 * ISO 3166-1 alpha-2 para banderas (flagcdn). `otros` → sin imagen (globo).
 */
const ISO_BY_ORIGEN_ID: Record<string, string> = {
  ar: 'ar',
  br: 'br',
  uy: 'uy',
  cl: 'cl',
  py: 'py',
  bo: 'bo',
  us: 'us',
  mx: 'mx',
  es: 'es',
  europa_otros: 'eu',
};

/** URL PNG ancho fijo (nitidez en retina con CSS). */
export function flagImageUrlForOrigenPaisId(opcionId: string): string | null {
  const m = /^iso_([a-z]{2})$/i.exec(opcionId.trim());
  if (m) {
    return `https://flagcdn.com/w40/${m[1].toLowerCase()}.png`;
  }
  const code = ISO_BY_ORIGEN_ID[opcionId];
  if (!code) return null;
  return `https://flagcdn.com/w40/${code}.png`;
}
