import type { Destino } from '../data/destinos';
import type { AviationStackFlightRow } from '../services/aviationStack';

/**
 * IATA habituales por slug de destino (mayúsculas). Complementa el matcheo por nombre y aeropuerto.
 */
const IATA_POR_SLUG: Record<string, readonly string[]> = {
  'buenos-aires': ['AEP', 'EZE', 'EPA'],
  bariloche: ['BRC'],
  'mar-del-plata': ['MDQ'],
  cordoba: ['COR'],
  'villa-carlos-paz': ['COR'],
  mendoza: ['MDZ'],
  'puerto-iguazu': ['IGR', 'IGU'],
  salta: ['SLA'],
  'termas-rio-hondo': ['RHD', 'SDE'],
  rosario: ['ROS'],
  'el-calafate': ['FTE'],
  ushuaia: ['USH'],
  jujuy: ['JUJ'],
  'el-bolson': ['EHL'],
  'san-martin-de-los-andes': ['CPC'],
  'puerto-madryn': ['PMY'],
  'san-miguel-de-tucuman': ['TUC'],
  'villa-la-angostura': ['BRC', 'CPC'],
  'merlo-san-luis': ['RLO'],
  'tigre-delta': ['AEP', 'EZE'],
  'rio-de-janeiro': ['GIG', 'SDU'],
  cusco: ['CUZ'],
  'santiago-de-chile': ['SCL'],
  miami: ['MIA', 'FLL'],
  'nueva-york': ['JFK', 'LGA', 'EWR'],
  barcelona: ['BCN'],
  paris: ['CDG', 'ORY', 'BVA'],
  roma: ['FCO', 'CIA'],
  madrid: ['MAD'],
  londres: ['LHR', 'LGW', 'STN', 'LTN', 'LCY'],
  tokio: ['NRT', 'HND'],
  tulum: ['TQO', 'CUN'],
  cancun: ['CUN'],
  'punta-cana': ['PUJ'],
  'cartagena-colombia': ['CTG'],
  'san-andres': ['ADZ'],
  bali: ['DPS'],
  phuket: ['HKT'],
  dubai: ['DXB', 'DWC'],
  estambul: ['IST', 'SAW'],
  'ciudad-del-cabo': ['CPT'],
};

/** IATA de aeropuertos en Argentina (desempate: ida típica AR → exterior). */
const IATA_AEROPUERTOS_ARG = new Set<string>(
  [
    ...IATA_POR_SLUG['buenos-aires']!,
    ...IATA_POR_SLUG.bariloche!,
    ...IATA_POR_SLUG['mar-del-plata']!,
    ...IATA_POR_SLUG.cordoba!,
    ...IATA_POR_SLUG['villa-carlos-paz']!,
    ...IATA_POR_SLUG.mendoza!,
    ...IATA_POR_SLUG['puerto-iguazu']!,
    ...IATA_POR_SLUG.salta!,
    ...IATA_POR_SLUG['termas-rio-hondo']!,
    ...IATA_POR_SLUG.rosario!,
    ...IATA_POR_SLUG['el-calafate']!,
    ...IATA_POR_SLUG.ushuaia!,
    ...IATA_POR_SLUG.jujuy!,
    ...IATA_POR_SLUG['el-bolson']!,
    ...IATA_POR_SLUG['san-martin-de-los-andes']!,
    ...IATA_POR_SLUG['puerto-madryn']!,
    ...IATA_POR_SLUG['san-miguel-de-tucuman']!,
    ...IATA_POR_SLUG['villa-la-angostura']!,
    ...IATA_POR_SLUG['merlo-san-luis']!,
    ...IATA_POR_SLUG['tigre-delta']!,
  ].map((c) => c.trim().toUpperCase()),
);

function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function normalize(s: string): string {
  return stripAccents(s)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function collectVueloHaystack(row: AviationStackFlightRow): { text: string; iatas: string[] } {
  const dep = row.departure;
  const arr = row.arrival;
  const iatas = [dep?.iata, arr?.iata]
    .filter((x): x is string => Boolean(x && String(x).trim()))
    .map((x) => x.trim().toUpperCase());
  const text = normalize([dep?.iata, dep?.airport, arr?.iata, arr?.airport].filter(Boolean).join(' '));
  return { text, iatas };
}

/**
 * True si el origen o la llegada del vuelo se relacionan con el destino (nombre, slug o IATA conocido).
 */
export function vueloCoincideConDestino(destino: Destino, row: AviationStackFlightRow): boolean {
  const { text, iatas } = collectVueloHaystack(row);
  if (!text && iatas.length === 0) return false;

  const known = IATA_POR_SLUG[destino.slug];
  if (known?.length && iatas.some((code) => known.includes(code))) return true;

  const nombreNorm = normalize(destino.nombre);
  if (nombreNorm.length >= 3 && text.includes(nombreNorm)) return true;

  const slugParts = destino.slug
    .split('-')
    .map(normalize)
    .filter((w) => w.length >= 3);
  for (const w of slugParts) {
    if (text.includes(w)) return true;
  }

  const stop = new Set([
    'ciudad',
    'nueva',
    'san',
    'los',
    'las',
    'del',
    'de',
    'la',
    'el',
    'rio',
    'von',
    'der',
  ]);
  const words = nombreNorm
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 4 && !stop.has(w));

  if (words.length === 0) {
    return slugParts.some((w) => w.length >= 4 && text.includes(w));
  }

  const hits = words.filter((w) => text.includes(w));
  if (words.length === 1) return hits.length === 1;
  return hits.length >= 1;
}

function rowsMatchingFlightDateYmd(
  rows: AviationStackFlightRow[],
  flightDateYmd: string,
): AviationStackFlightRow[] {
  if (!rows.length) return [];
  const exact = rows.filter((r) => (r.flight_date ?? '').slice(0, 10) === flightDateYmd);
  if (exact.length) return exact;
  return rows.filter((r) => {
    const s = r.departure?.scheduled;
    return Boolean(s && s.slice(0, 10) === flightDateYmd);
  });
}

/**
 * Puntuación para elegir un leg cuando la API devuelve varios con el mismo número y fecha
 * (p. ej. misma aeronave en tramo GIG→LHR y otro EZE→GIG).
 * Prioridad: llegada al destino de la ficha > salida desde ese destino > salida desde Argentina.
 */
function rowScoreForDestinoPage(row: AviationStackFlightRow, destino: Destino): number {
  const known = IATA_POR_SLUG[destino.slug];
  if (!known?.length) return 0;
  const arr = row.arrival?.iata?.trim().toUpperCase();
  const dep = row.departure?.iata?.trim().toUpperCase();
  let score = 0;
  if (arr && known.includes(arr)) score += 200;
  if (dep && known.includes(dep)) score += 50;
  if (dep && IATA_AEROPUERTOS_ARG.has(dep)) score += 25;
  return score;
}

/**
 * Elige la fila de Aviationstack que corresponde a la fecha y, si hay varias, a la ficha de destino.
 */
export function pickFlightRowForDateAndDestino(
  rows: AviationStackFlightRow[],
  flightDateYmd: string,
  destino: Destino | null | undefined,
): AviationStackFlightRow | null {
  const candidates = rowsMatchingFlightDateYmd(rows, flightDateYmd);
  if (!candidates.length) return null;

  if (!destino) {
    return candidates[0] ?? null;
  }

  const coincide = candidates.filter((r) => vueloCoincideConDestino(destino, r));
  const pool = coincide.length ? coincide : candidates;

  const scored = pool.map((row, idx) => ({ row, idx, score: rowScoreForDestinoPage(row, destino) }));
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.idx - b.idx;
  });

  return scored[0]?.row ?? null;
}
