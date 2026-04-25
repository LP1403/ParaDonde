/**
 * URL PNG 72×72 (Twemoji) — cdnjs (misma estructura que el paquete publicado).
 * Licencia: https://github.com/twitter/twemoji (código MIT, gráfica CC-BY-4.0).
 */
const TWEMOJI_CDN_PNG_72 = 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/';

/**
 * Nombre de archivo usado por Twemoji (p. ej. 2708-fe0f, 1f3d4-fe0f, 1f9ed).
 */
function emojiToTwemojiFileBasename(emoji: string): string {
  if (!emoji) return '';
  const parts: string[] = [];
  for (let i = 0; i < emoji.length; ) {
    const cp = emoji.codePointAt(i)!;
    parts.push(cp.toString(16).toLowerCase());
    i += cp > 0xffff ? 2 : 1;
  }
  return parts.join('-');
}

export function twemojiCdnPngUrl(emoji: string): string {
  const name = emojiToTwemojiFileBasename(emoji);
  if (!name) return '';
  return `${TWEMOJI_CDN_PNG_72}${name}.png`;
}
