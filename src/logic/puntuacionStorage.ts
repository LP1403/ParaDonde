/**
 * Capa de acceso local + Firestore para el sistema de puntuación.
 *
 * Patrón:
 *  - localStorage como cache inmediato (lectura instantánea)
 *  - Firestore como fuente de verdad cuando el usuario está logueado
 *  - Al iniciar sesión, se sincroniza Firestore → localStorage
 */

import {
  getPuntuacionGlobalFs,
  initPuntuacionFs,
  completarMisionFs,
  getMisionesCompletadasFs,
  sumarPuntosVueloFs,
  buscarReferidoFs,
  aplicarCodigoReferidoFs,
  type PuntuacionGlobal,
  type MisionCompletadaFs,
} from '../services/firestoreService';
import {
  PUNTOS_REFERIDO_NUEVO,
  PUNTOS_VUELO,
} from '../data/reputacion';

// ── Helpers de código de referido ────────────────────────────────

export function generarCodigoReferido(uid: string): string {
  return uid
    .replace(/[^A-Za-z0-9]/g, '')
    .slice(0, 8)
    .toUpperCase()
    .padEnd(8, '0');
}

// ── LocalStorage keys ─────────────────────────────────────────────

const LS_KEY_PUNTUACION = 'pd_puntuacion_v1';
const LS_KEY_MISIONES = 'pd_misiones_completadas_v1';

function leerPuntuacionLocal(): PuntuacionGlobal | null {
  try {
    const raw = localStorage.getItem(LS_KEY_PUNTUACION);
    if (!raw) return null;
    return JSON.parse(raw) as PuntuacionGlobal;
  } catch {
    return null;
  }
}

function guardarPuntuacionLocal(data: PuntuacionGlobal): void {
  try {
    localStorage.setItem(LS_KEY_PUNTUACION, JSON.stringify(data));
    window.dispatchEvent(new Event('pd-puntuacion-changed'));
  } catch {
    // ignore storage errors
  }
}

function leerMisionesLocal(): Record<string, MisionCompletadaFs> {
  try {
    const raw = localStorage.getItem(LS_KEY_MISIONES);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, MisionCompletadaFs>;
  } catch {
    return {};
  }
}

function guardarMisionesLocal(data: Record<string, MisionCompletadaFs>): void {
  try {
    localStorage.setItem(LS_KEY_MISIONES, JSON.stringify(data));
    window.dispatchEvent(new Event('pd-misiones-changed'));
  } catch {
    // ignore storage errors
  }
}

// ── API pública ───────────────────────────────────────────────────

export function getPuntuacionLocal(): PuntuacionGlobal | null {
  return leerPuntuacionLocal();
}

export function getMisionesCompletadasLocal(): Record<string, MisionCompletadaFs> {
  return leerMisionesLocal();
}

export function esMisionCompletada(misionId: string): boolean {
  const misiones = leerMisionesLocal();
  return Boolean(misiones[misionId]);
}

/**
 * Sincroniza el estado de Firestore hacia localStorage al iniciar sesión.
 */
export async function syncPuntuacionDesdeFirestore(uid: string): Promise<void> {
  const codigo = generarCodigoReferido(uid);
  await initPuntuacionFs(uid, codigo);

  const [puntuacion, misiones] = await Promise.all([
    getPuntuacionGlobalFs(uid),
    getMisionesCompletadasFs(uid),
  ]);

  if (puntuacion) guardarPuntuacionLocal(puntuacion);

  const misionesMap: Record<string, MisionCompletadaFs> = {};
  for (const m of misiones) misionesMap[m.misionId] = m;
  guardarMisionesLocal(misionesMap);
}

/**
 * Limpia el cache local al cerrar sesión.
 */
export function limpiarPuntuacionLocal(): void {
  localStorage.removeItem(LS_KEY_PUNTUACION);
  localStorage.removeItem(LS_KEY_MISIONES);
  window.dispatchEvent(new Event('pd-puntuacion-changed'));
  window.dispatchEvent(new Event('pd-misiones-changed'));
}

/**
 * Completa una misión: actualiza localStorage y Firestore.
 */
export async function completarMision(
  uid: string | null,
  misionId: string,
  destinoSlug: string,
  puntosGanados: number,
  fotoThumb?: string,
): Promise<void> {
  const misionData: MisionCompletadaFs = {
    misionId,
    destinoSlug,
    puntosGanados,
    fotoThumb,
    completadaAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
  };

  // Actualizar localStorage inmediatamente
  const misiones = leerMisionesLocal();
  misiones[misionId] = misionData;
  guardarMisionesLocal(misiones);

  const actual = leerPuntuacionLocal();
  const nuevo: PuntuacionGlobal = actual ?? {
    totalPuntos: 0,
    porFuente: { misiones: 0, vuelos: 0, referidos: 0 },
    codigoReferido: uid ? generarCodigoReferido(uid) : '',
    referidosUids: [],
    codigosUsados: [],
  };
  nuevo.totalPuntos += puntosGanados;
  nuevo.porFuente.misiones += puntosGanados;
  guardarPuntuacionLocal(nuevo);

  // Sincronizar con Firestore
  if (uid) {
    void completarMisionFs(uid, { misionId, destinoSlug, puntosGanados, fotoThumb });
  }
}

/**
 * Registra que se agregó un vuelo y suma puntos.
 */
export async function registrarVuelo(uid: string | null): Promise<void> {
  const actual = leerPuntuacionLocal();
  const nuevo: PuntuacionGlobal = actual ?? {
    totalPuntos: 0,
    porFuente: { misiones: 0, vuelos: 0, referidos: 0 },
    codigoReferido: uid ? generarCodigoReferido(uid) : '',
    referidosUids: [],
    codigosUsados: [],
  };
  nuevo.totalPuntos += PUNTOS_VUELO;
  nuevo.porFuente.vuelos += PUNTOS_VUELO;
  guardarPuntuacionLocal(nuevo);

  if (uid) void sumarPuntosVueloFs(uid, PUNTOS_VUELO);
}

/**
 * Intenta aplicar un código de referido.
 */
export async function aplicarCodigoReferido(
  uid: string,
  displayName: string,
  codigoIngresado: string,
): Promise<{ ok: boolean; error?: string }> {
  const entrada = await buscarReferidoFs(codigoIngresado.toUpperCase().trim());
  if (!entrada) return { ok: false, error: 'Código no encontrado. Revisá y volvé a intentar.' };

  const res = await aplicarCodigoReferidoFs(
    uid,
    displayName,
    codigoIngresado.toUpperCase().trim(),
    entrada.uid,
    PUNTOS_REFERIDO_NUEVO,
  );

  if (res.ok) {
    // Refrescar local
    const puntuacion = await getPuntuacionGlobalFs(uid);
    if (puntuacion) guardarPuntuacionLocal(puntuacion);
  }

  return res;
}

/**
 * Comprime una imagen a un thumbnail base64 para guardar en Firestore.
 */
export function comprimirImagenAThumb(
  file: File,
  maxSize = 200,
  quality = 0.7,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('No se pudo cargar la imagen.'));
      img.onload = () => {
        const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas no disponible.'));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
