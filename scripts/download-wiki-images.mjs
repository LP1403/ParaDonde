/**
 * download-wiki-images.mjs
 *
 * Downloads travel photos from Wikipedia for every destination in the app.
 * Images are saved to: public/images/destinos/{id}/1.jpg, 2.jpg, … (max 5 por destino)
 * A TypeScript lookup file is generated at: src/data/wikiImages.ts
 *
 * Usage:
 *   node scripts/download-wiki-images.mjs
 *
 * Requires: Node 18+ (native fetch).
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT       = join(__dirname, '..');
const IMG_DIR    = join(ROOT, 'public', 'images', 'destinos');
const TS_OUT     = join(ROOT, 'src', 'data', 'wikiImages.ts');
const BASE_API_EN = 'https://en.wikipedia.org/w/api.php';
const BASE_API_ES = 'https://es.wikipedia.org/w/api.php';
const IMG_WIDTH  = 1200; // thumbnail width requested from Wikimedia CDN
const MIN_PHOTO_WIDTH = 500;
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png']);
/** Máximo de fotos por destino (carousel + peso del repo). */
const MAX_IMAGES_PER_DEST = 5;

/* ── Destination → Wikipedia article title ─────────────────────────── */
/* Each entry can have multiple candidate article titles (tried in order). */
const WIKI_TITLES = {
  /* Argentina */
  'buenos-aires':     ['Buenos Aires'],
  'bariloche':        ['Bariloche', 'San Carlos de Bariloche'],
  'mar-del-plata':    ['Mar del Plata'],
  'cordoba':          ['Córdoba, Argentina', 'Cordoba, Argentina'],
  'villa-carlos-paz': ['Villa Carlos Paz'],
  'mendoza':          ['Mendoza, Argentina', 'Mendoza Province'],
  'puerto-iguazu':    ['Puerto Iguazú', 'Iguazu Falls'],
  'salta':            ['Salta', 'Salta, Argentina'],
  'termas-rio-hondo': ['Termas de Río Hondo'],
  'rosario':          ['Rosario, Argentina', 'Rosario, Santa Fe'],
  'el-calafate':      ['El Calafate', 'Los Glaciares National Park'],
  'ushuaia':          ['Ushuaia'],
  'jujuy':            ['Quebrada de Humahuaca', 'Jujuy Province'],
  'el-bolson':        ['El Bolsón', 'El Bolson'],
  /* Sudamérica */
  'rio-de-janeiro':   ['Rio de Janeiro'],
  'cusco':            ['Cusco', 'Machu Picchu'],
  'santiago-de-chile':['Santiago', 'Santiago, Chile'],
  /* Norteamérica */
  'miami':            ['Miami'],
  'nueva-york':       ['New York City', 'Manhattan'],
  /* Europa */
  'barcelona':        ['Barcelona'],
  'paris':            ['Paris'],
  'roma':             ['Rome'],
  /* Asia */
  'tokio':            ['Tokyo'],
};

/** Títulos en español (misma clave que WIKI_TITLES) si en inglés no hay fotos útiles. */
const WIKI_TITLES_ES = {
  'rosario':     ['Rosario (Argentina)', 'Rosario'],
  'el-bolson':   ['El Bolsón'],
  'salta':       ['Salta (Argentina)', 'Salta'],
};

/* ── Filters ────────────────────────────────────────────────────────── */
const EXCLUDE_KW = [
  'flag_', '_flag', 'map_', '_map', 'coat_of', 'location_',
  'locator', 'logo', 'icon', 'emblem', 'seal_', 'blank',
  'portrait', 'signature', 'drawing', 'sketch', 'watercolor',
  'symbol', 'shield', 'coa_', '_coa', 'escudo', 'bandera',
  'administrative', 'relief_map', 'topograph', 'panorama_map',
];

function isPhotoFile(title) {
  const t = title.toLowerCase();
  if (!t.endsWith('.jpg') && !t.endsWith('.jpeg') && !t.endsWith('.png')) return false;
  return !EXCLUDE_KW.some((kw) => t.includes(kw));
}

function extFromUrl(url) {
  const u = url.toLowerCase();
  if (u.includes('.png') || u.includes('/png/')) return '.png';
  return '.jpg';
}

/* ── Wikipedia API helpers ──────────────────────────────────────────── */
async function apiGet(baseApi, params) {
  const url = `${baseApi}?${new URLSearchParams({ ...params, format: 'json', origin: '*' })}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'ParaDondeApp/1.0 (travel guide; contact: edu)' },
  });
  if (!res.ok) throw new Error(`API HTTP ${res.status}`);
  return res.json();
}

/** @returns {{ url: string, ext: string }[]} */
async function getImageUrls(wikiTitle, baseApi) {
  /* Step 1 – main pageimage + image filename list */
  const d1 = await apiGet(baseApi, {
    action:  'query',
    titles:  wikiTitle,
    prop:    'pageimages|images',
    piprop:  'original',
    imlimit: '40',
  });

  const pages    = Object.values(d1.query?.pages ?? {});
  const page     = pages[0];
  if (!page || 'missing' in page) return [];

  const mainUrl  = page.original?.source ?? null;
  const candidates = (page.images ?? [])
    .map((img) => img.title)
    .filter(isPhotoFile)
    .slice(0, 18);

  /** @type {{ url: string, ext: string }[]} */
  const out = [];

  /* Ignorar pageimage si es SVG (escudos, etc.) */
  if (mainUrl && !mainUrl.toLowerCase().includes('.svg')) {
    out.push({ url: mainUrl, ext: extFromUrl(mainUrl) });
  }

  if (candidates.length === 0) {
    return dedupePhotoEntries(out).slice(0, MAX_IMAGES_PER_DEST);
  }

  /* Step 2 – resolve filenames → sized thumbnail URLs */
  const d2 = await apiGet(baseApi, {
    action:     'query',
    titles:     candidates.join('|'),
    prop:       'imageinfo',
    iiprop:     'url|size|mime',
    iiurlwidth: String(IMG_WIDTH),
    iilimit:    '1',
  });

  const photos = Object.values(d2.query?.pages ?? {})
    .filter((p) => {
      const info = p.imageinfo?.[0];
      return (
        info &&
        ALLOWED_MIME.has(info.mime) &&
        info.width >= MIN_PHOTO_WIDTH
      );
    })
    .map((p) => {
      const info = p.imageinfo[0];
      const url = info.thumburl ?? info.url;
      const ext = info.mime === 'image/png' ? '.png' : '.jpg';
      return { url, ext };
    })
    .filter((x) => x.url);

  for (const p of photos) out.push(p);

  return dedupePhotoEntries(out).slice(0, MAX_IMAGES_PER_DEST);
}

function dedupePhotoEntries(entries) {
  const seen = new Set();
  const res = [];
  for (const e of entries) {
    const key = e.url.split('?')[0];
    if (seen.has(key)) continue;
    seen.add(key);
    res.push(e);
  }
  return res;
}

/* ── Downloader with retry / backoff ────────────────────────────────── */
async function downloadBinary(url, destPath, attempt = 0) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'ParaDondeApp/1.0 (travel guide; contact: edu)' },
  });

  if (res.status === 429 && attempt < 4) {
    const delay = Math.pow(2, attempt + 1) * 3000; // 6s → 12s → 24s → 48s
    process.stdout.write(`  ⏳ 429 rate-limit, retrying in ${delay / 1000}s…\n`);
    await sleep(delay);
    return downloadBinary(url, destPath, attempt + 1);
  }

  if (!res.ok) throw new Error(`Image HTTP ${res.status}`);
  const buf = await res.arrayBuffer();
  writeFileSync(destPath, Buffer.from(buf));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function writeWikiImagesTs(resultObj) {
  const tsContent = [
    '// AUTO-GENERATED — do not edit manually.',
    '// Run:  node scripts/download-wiki-images.mjs',
    '',
    `export const wikiImages: Record<string, string[]> = ${JSON.stringify(resultObj, null, 2)};`,
    '',
  ].join('\n');
  writeFileSync(TS_OUT, tsContent);
}

/* ── Main ───────────────────────────────────────────────────────────── */
mkdirSync(IMG_DIR, { recursive: true });

/* Read any existing wikiImages.ts so we can preserve already-good entries */
let existing = {};
try {
  const raw = (await import(TS_OUT + '?t=' + Date.now())).wikiImages;
  existing = raw ?? {};
} catch { /* first run */ }

const result = { ...existing };
const entries = Object.entries(WIKI_TITLES);

for (let ei = 0; ei < entries.length; ei++) {
  const [id, candidates] = entries[ei];
  const prefix = `[${ei + 1}/${entries.length}]`;

  /* Skip destinations that already have images downloaded */
  const destDir = join(IMG_DIR, id);
  const existingPaths = (existing[id] ?? [])
    .filter((p) => existsSync(join(ROOT, 'public', p)))
    .slice(0, MAX_IMAGES_PER_DEST);
  if (existingPaths.length >= MAX_IMAGES_PER_DEST) {
    console.log(`\n${prefix} ${id}  ↩  skipped (${existingPaths.length} images, max ${MAX_IMAGES_PER_DEST})`);
    result[id] = existingPaths;
    continue;
  }

  mkdirSync(destDir, { recursive: true });

  /** @type {{ url: string, ext: string }[]} */
  let photoEntries = [];
  let usedLabel = '';

  for (const title of candidates) {
    console.log(`\n${prefix} ${id}  →  en "${title}"`);
    try {
      photoEntries = await getImageUrls(title, BASE_API_EN);
      if (photoEntries.length > 0) {
        usedLabel = `enwiki:"${title}"`;
        break;
      }
      console.log('  ⚠  No suitable photos — trying next candidate…');
    } catch (err) {
      console.error(`  ✗ API error: ${err.message}`);
    }
    await sleep(800);
  }

  if (photoEntries.length === 0 && WIKI_TITLES_ES[id]) {
    console.log(`  🌐  Trying Spanish Wikipedia…`);
    for (const title of WIKI_TITLES_ES[id]) {
      console.log(`\n${prefix} ${id}  →  es "${title}"`);
      try {
        photoEntries = await getImageUrls(title, BASE_API_ES);
        if (photoEntries.length > 0) {
          usedLabel = `eswiki:"${title}"`;
          break;
        }
        console.log('  ⚠  No suitable photos — trying next candidate…');
      } catch (err) {
        console.error(`  ✗ API error: ${err.message}`);
      }
      await sleep(800);
    }
  }

  if (photoEntries.length === 0) {
    console.log(`  ⚠  No photos found (en + es)`);
    result[id] = [];
    await sleep(1500);
    continue;
  }

  console.log(`  📷 Found ${photoEntries.length} photos via ${usedLabel}`);

  const localPaths = [];
  for (let i = 0; i < photoEntries.length; i++) {
    const { url, ext } = photoEntries[i];
    const filename = `${i + 1}${ext}`;
    const filePath = join(destDir, filename);

    /* Skip if already downloaded (re-run friendly) */
    if (existsSync(filePath)) {
      localPaths.push(`/images/destinos/${id}/${filename}`);
      process.stdout.write(`  ↩  ${filename} (exists)\n`);
      continue;
    }

    try {
      await downloadBinary(url, filePath);
      localPaths.push(`/images/destinos/${id}/${filename}`);
      process.stdout.write(`  ✓  ${filename}\n`);
    } catch (err) {
      process.stdout.write(`  ✗  ${filename}: ${err.message}\n`);
    }

    await sleep(1500); // 1.5s between images — polite to Wikimedia CDN
  }

  result[id] = localPaths.slice(0, MAX_IMAGES_PER_DEST);
  writeWikiImagesTs(result); // guardar tras cada destino (no perder progreso)
  await sleep(2000); // 2s between destinations
}

/* Asegurar tope global y rutas que existan en disco */
for (const id of Object.keys(result)) {
  const trimmed = (result[id] ?? [])
    .filter((p) => existsSync(join(ROOT, 'public', p)))
    .slice(0, MAX_IMAGES_PER_DEST);
  result[id] = trimmed;
}
writeWikiImagesTs(result);

const total = Object.values(result).reduce((s, arr) => s + arr.length, 0);
const missing = Object.entries(result).filter(([, v]) => v.length === 0).map(([k]) => k);

console.log(`\n${'─'.repeat(55)}`);
console.log(`✅  Done!  ${total} images downloaded across ${entries.length} destinations.`);
if (missing.length) console.log(`⚠   No images: ${missing.join(', ')}`);
console.log(`📄  Generated: src/data/wikiImages.ts`);
console.log(`🗂   Images in: public/images/destinos/`);
