/**
 * En Capacitor + live reload, el WebView a veces reporta `http://localhost/ruta` sin puerto.
 * Firebase Auth guarda esa URL para el post-login; Google vuelve sin :5173 y el bundle no carga.
 * Forzamos `http://host:PUERTO/...` en desarrollo HTTP sin puerto explícito.
 */

const DEFAULT_HOSTS = ['localhost', '127.0.0.1', '10.0.2.2'];

function devHostsNeedingPort(): Set<string> {
  const raw = import.meta.env.VITE_DEV_ORIGIN_HOSTNAMES?.trim();
  if (!raw) return new Set(DEFAULT_HOSTS);
  return new Set(
    raw
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean),
  );
}

/** URL completa a la que hay que ir, o null si no aplica. */
export function getDevExplicitPortUrl(): string | null {
  if (!import.meta.env.DEV) return null;
  if (typeof window === 'undefined') return null;

  const { protocol, hostname, port, pathname, search, hash } = window.location;

  if (protocol !== 'http:') return null;
  if (port !== '') return null;
  if (!devHostsNeedingPort().has(hostname)) return null;

  const devPort = import.meta.env.VITE_DEV_CLIENT_PORT?.trim() || '5173';
  return `http://${hostname}:${devPort}${pathname}${search}${hash}`;
}

/** Si corresponde, hace location.replace y devuelve true (no inicializar app detrás). */
export function replaceDevLocalhostMissingPort(): boolean {
  const url = getDevExplicitPortUrl();
  if (!url) return false;
  window.location.replace(url);
  return true;
}
