import { useState, useEffect } from 'react';

const BASE_EN = 'https://en.wikipedia.org/w/api.php';
const BASE_ES = 'https://es.wikipedia.org/w/api.php';
const MIN_WIDTH = 500;
const MAX_IMAGES = 5;

/* ─────────────────────────────────────────────────────────────────────
   Wikipedia article titles per destino ID (inglés primero).
   ───────────────────────────────────────────────────────────────────── */
const WIKI_TITLES: Record<string, string> = {
  'buenos-aires':     'Buenos Aires',
  'bariloche':        'San Carlos de Bariloche',
  'mar-del-plata':    'Mar del Plata',
  'cordoba':          'Córdoba, Argentina',
  'villa-carlos-paz': 'Villa Carlos Paz',
  'mendoza':          'Mendoza, Argentina',
  'puerto-iguazu':    'Puerto Iguazú',
  'salta':            'Salta, Argentina',
  'termas-rio-hondo': 'Termas de Río Hondo',
  'rosario':          'Rosario, Santa Fe',
  'el-calafate':      'El Calafate',
  'ushuaia':          'Ushuaia',
  'jujuy':            'Quebrada de Humahuaca',
  'el-bolson':        'El Bolsón',
  'rio-de-janeiro':   'Rio de Janeiro',
  'cusco':            'Cusco',
  'santiago-de-chile':'Santiago',
  'miami':            'Miami',
  'nueva-york':       'New York City',
  'barcelona':        'Barcelona',
  'paris':            'Paris',
  'roma':             'Rome',
  'tokio':            'Tokyo',
};

/** Fallback español si enwiki no devuelve fotos (mismas claves que arriba). */
const WIKI_TITLES_ES: Record<string, string[]> = {
  'rosario':     ['Rosario (Argentina)', 'Rosario'],
  'el-bolson':   ['El Bolsón'],
  'salta':       ['Salta (Argentina)', 'Salta'],
};

const imageCache = new Map<string, string[]>();

function isPhotoFile(title: string): boolean {
  const t = title.toLowerCase();
  if (!t.endsWith('.jpg') && !t.endsWith('.jpeg') && !t.endsWith('.png')) return false;
  const EXCLUDE = [
    'flag_', '_flag', 'map_', '_map', 'coat_of', 'coat_of_arms',
    'location_', 'locator', 'logo', 'icon', 'emblem', 'seal_', 'blank',
    'portrait', 'signature', 'drawing', 'sketch', 'watercolor',
    'symbol', 'shield', 'panorama_map', 'relief_map', 'topograph',
    'administrative', 'coa_', '_coa', 'escudo', 'bandera',
  ];
  return !EXCLUDE.some((kw) => t.includes(kw));
}

async function fetchTimeout(url: string, ms = 8000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function mimeOk(mime: string): boolean {
  return mime === 'image/jpeg' || mime === 'image/png';
}

type ImgPage = {
  missing?: string;
  original?: { source: string };
  images?: Array<{ title: string }>;
  imageinfo?: Array<{ url: string; thumburl?: string; width: number; mime: string }>;
};

async function loadImages(wikiTitle: string, base: string): Promise<string[]> {
  const params1 = new URLSearchParams({
    action: 'query',
    titles: wikiTitle,
    prop: 'pageimages|images',
    piprop: 'original',
    imlimit: '40',
    format: 'json',
    origin: '*',
  });

  const res1 = await fetchTimeout(`${base}?${params1}`);
  const data1 = await res1.json() as { query?: { pages?: Record<string, ImgPage> } };

  const pages = Object.values(data1.query?.pages ?? {});
  const page = pages[0];
  if (!page || 'missing' in page) return [];

  const mainUrl = page.original?.source;
  const candidates = (page.images ?? [])
    .map((img) => img.title)
    .filter(isPhotoFile)
    .slice(0, 18);

  const out: string[] = [];
  if (mainUrl && !mainUrl.toLowerCase().includes('.svg')) out.push(mainUrl);

  if (candidates.length === 0) {
    return [...new Set(out)].slice(0, MAX_IMAGES);
  }

  const params2 = new URLSearchParams({
    action: 'query',
    titles: candidates.join('|'),
    prop: 'imageinfo',
    iiprop: 'url|size|mime',
    iiurlwidth: '1200',
    iilimit: '1',
    format: 'json',
    origin: '*',
  });

  const res2 = await fetchTimeout(`${base}?${params2}`);
  const data2 = await res2.json() as { query?: { pages?: Record<string, ImgPage> } };

  const photoUrls = Object.values(data2.query?.pages ?? {})
    .filter((p) => {
      const info = p.imageinfo?.[0];
      return info && mimeOk(info.mime) && info.width >= MIN_WIDTH;
    })
    .map((p) => {
      const info = p.imageinfo![0];
      return info.thumburl ?? info.url;
    });

  for (const u of photoUrls) out.push(u);

  return [...new Set(out)].slice(0, MAX_IMAGES);
}

async function loadImagesForDestino(destinoId: string): Promise<string[]> {
  const enTitle = WIKI_TITLES[destinoId];
  if (!enTitle) return [];

  let imgs = await loadImages(enTitle, BASE_EN);
  if (imgs.length > 0) return imgs;

  const esTitles = WIKI_TITLES_ES[destinoId];
  if (!esTitles) return [];

  for (const t of esTitles) {
    imgs = await loadImages(t, BASE_ES);
    if (imgs.length > 0) return imgs;
  }
  return [];
}

/* ─────────────────────────────────────────────────────────────────────
   Hook
   ───────────────────────────────────────────────────────────────────── */

export interface WikiImageResult {
  images: string[];
  loading: boolean;
}

export function useWikipediaImages(destinoId: string | undefined): WikiImageResult {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!destinoId || !WIKI_TITLES[destinoId]) return;

    const cached = imageCache.get(destinoId);
    if (cached) {
      setImages(cached);
      return;
    }

    let cancelled = false;
    setLoading(true);

    loadImagesForDestino(destinoId)
      .then((imgs) => {
        if (cancelled) return;
        imageCache.set(destinoId, imgs);
        setImages(imgs);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.warn('[useWikipediaImages] fetch failed:', err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [destinoId]);

  return { images, loading };
}
