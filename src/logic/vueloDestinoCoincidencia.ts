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
