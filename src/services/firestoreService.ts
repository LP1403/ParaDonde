/**
 * Capa de acceso a Firestore.
 * Todas las funciones son puras (sin estado) y reciben uid explícito.
 *
 * Estructura:
 *   users/{uid}                              → perfil
 *   users/{uid}/destinosFavoritos/{slug}     → destinos favoritos
 *   users/{uid}/vuelos/{flightId}            → vuelos por destino
 *   users/{uid}/aventuraProgress/current     → progreso del quiz
 *   users/{uid}/fcmTokens/{token}            → tokens de notificación
 *   users/{uid}/puntuacion/global            → puntos acumulados y referidos
 *   users/{uid}/misionesCompletadas/{id}     → misiones completadas
 *   referidos/{codigo}                       → lookup público código → uid
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  increment,
  arrayUnion,
} from 'firebase/firestore';
import { getFirebaseDb } from '../firebase';
import type { AvatarChoice } from '../logic/avatarPreference';
import type { AventuraProgress } from '../logic/aventuraStorage';
import type { VueloFavoritoGuardado } from '../logic/vueloFavoritoStorage';

// ─── Tipos internos ───────────────────────────────────────────────

export type UserProfile = {
  displayName: string;
  email: string;
  photoURL?: string;
  avatarChoice?: AvatarChoice;
  origenPaisId?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

// ─── Helpers ─────────────────────────────────────────────────────

function userRef(uid: string) {
  return doc(getFirebaseDb(), 'users', uid);
}

function destinosCol(uid: string) {
  return collection(getFirebaseDb(), 'users', uid, 'destinosFavoritos');
}

function destinoRef(uid: string, slug: string) {
  return doc(getFirebaseDb(), 'users', uid, 'destinosFavoritos', slug);
}

function vuelosCol(uid: string) {
  return collection(getFirebaseDb(), 'users', uid, 'vuelos');
}

function vueloRef(uid: string, flightId: string) {
  return doc(getFirebaseDb(), 'users', uid, 'vuelos', flightId);
}

function aventuraRef(uid: string) {
  return doc(getFirebaseDb(), 'users', uid, 'aventuraProgress', 'current');
}

function fcmTokenRef(uid: string, token: string) {
  return doc(getFirebaseDb(), 'users', uid, 'fcmTokens', token);
}

// ─── Perfil ──────────────────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(userRef(uid));
    if (!snap.exists()) return null;
    return snap.data() as UserProfile;
  } catch (e) {
    console.error('[Firestore] getUserProfile error:', e);
    return null;
  }
}

export async function createUserProfile(
  uid: string,
  data: Pick<UserProfile, 'displayName' | 'email' | 'photoURL'>,
): Promise<void> {
  try {
    console.log('[Firestore] createUserProfile uid:', uid);
    await setDoc(userRef(uid), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log('[Firestore] createUserProfile OK');
  } catch (e) {
    console.error('[Firestore] createUserProfile error:', e);
  }
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<UserProfile, 'avatarChoice' | 'origenPaisId'>>,
): Promise<void> {
  try {
    await setDoc(userRef(uid), { ...data, updatedAt: serverTimestamp() }, { merge: true });
  } catch (e) {
    console.error('[Firestore] updateUserProfile error:', e);
  }
}

// ─── Destinos favoritos ──────────────────────────────────────────

export async function getDestinosFavoritos(uid: string): Promise<string[]> {
  try {
    const snap = await getDocs(destinosCol(uid));
    return snap.docs.map((d) => d.id);
  } catch (e) {
    console.error('[Firestore] getDestinosFavoritos error:', e);
    return [];
  }
}

export async function addDestinoFavoritoFs(uid: string, slug: string): Promise<void> {
  try {
    console.log('[Firestore] addDestinoFavorito uid:', uid, 'slug:', slug);
    await setDoc(destinoRef(uid, slug), { slug, addedAt: serverTimestamp() });
    console.log('[Firestore] addDestinoFavorito OK');
  } catch (e) {
    console.error('[Firestore] addDestinoFavorito error:', e);
  }
}

export async function removeDestinoFavoritoFs(uid: string, slug: string): Promise<void> {
  try {
    await deleteDoc(destinoRef(uid, slug));
  } catch (e) {
    console.error('[Firestore] removeDestinoFavorito error:', e);
  }
}

// ─── Vuelos ──────────────────────────────────────────────────────

export async function getAllVuelosFs(
  uid: string,
): Promise<Record<string, VueloFavoritoGuardado[]>> {
  try {
    const snap = await getDocs(vuelosCol(uid));
    const result: Record<string, VueloFavoritoGuardado[]> = {};
    for (const d of snap.docs) {
      const data = d.data() as VueloFavoritoGuardado & { destinoSlug: string };
      const slug = data.destinoSlug;
      if (!slug) continue;
      if (!result[slug]) result[slug] = [];
      result[slug].push({
        id: d.id,
        flightIata: data.flightIata,
        flightDate: data.flightDate,
        updatedAt: data.updatedAt,
        display: data.display,
      });
    }
    return result;
  } catch (e) {
    console.error('[Firestore] getAllVuelos error:', e);
    return {};
  }
}

export async function upsertVueloFs(
  uid: string,
  destinoSlug: string,
  vuelo: VueloFavoritoGuardado,
): Promise<void> {
  try {
    await setDoc(vueloRef(uid, vuelo.id), {
      destinoSlug,
      flightIata: vuelo.flightIata,
      flightDate: vuelo.flightDate,
      updatedAt: vuelo.updatedAt,
      display: vuelo.display,
      lastKnownStatus: vuelo.display.status,
    });
  } catch (e) {
    console.error('[Firestore] upsertVuelo error:', e);
  }
}

export async function removeVueloFs(uid: string, flightId: string): Promise<void> {
  try {
    await deleteDoc(vueloRef(uid, flightId));
  } catch (e) {
    console.error('[Firestore] removeVuelo error:', e);
  }
}

// ─── Progreso aventura ───────────────────────────────────────────

export async function getAventuraProgressFs(uid: string): Promise<AventuraProgress | null> {
  try {
    const snap = await getDoc(aventuraRef(uid));
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      respuestas: (data.respuestas as Record<string, string>) ?? {},
      pasoActual: (data.pasoActual as number) ?? 0,
      lastCoverUrl: data.lastCoverUrl as string | undefined,
    };
  } catch (e) {
    console.error('[Firestore] getAventuraProgress error:', e);
    return null;
  }
}

export async function saveAventuraProgressFs(
  uid: string,
  progress: AventuraProgress,
): Promise<void> {
  try {
    await setDoc(aventuraRef(uid), { ...progress, updatedAt: serverTimestamp() });
  } catch (e) {
    console.error('[Firestore] saveAventuraProgress error:', e);
  }
}

export async function clearAventuraProgressFs(uid: string): Promise<void> {
  try {
    await deleteDoc(aventuraRef(uid));
  } catch (e) {
    console.error('[Firestore] clearAventuraProgress error:', e);
  }
}

// ─── FCM Tokens ──────────────────────────────────────────────────

export async function saveFcmTokenFs(
  uid: string,
  token: string,
  platform: 'web' | 'android' | 'ios',
): Promise<void> {
  try {
    await setDoc(fcmTokenRef(uid, token), {
      token,
      platform,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.error('[Firestore] saveFcmToken error:', e);
  }
}

// ─── Puntuación & Referidos ──────────────────────────────────────

export interface PuntuacionGlobal {
  totalPuntos: number;
  porFuente: {
    misiones: number;
    vuelos: number;
    referidos: number;
  };
  codigoReferido: string;
  referidoPor?: string;
  referidosUids: string[];
  codigosUsados: string[];
  updatedAt?: Timestamp;
}

export interface MisionCompletadaFs {
  misionId: string;
  destinoSlug: string;
  puntosGanados: number;
  fotoThumb?: string;
  completadaAt: Timestamp;
}

export interface ReferidoEntry {
  uid: string;
  displayName: string;
  createdAt: Timestamp;
}

function puntuacionRef(uid: string) {
  return doc(getFirebaseDb(), 'users', uid, 'puntuacion', 'global');
}

function misionesCol(uid: string) {
  return collection(getFirebaseDb(), 'users', uid, 'misionesCompletadas');
}

function misionCompletadaRef(uid: string, misionId: string) {
  return doc(getFirebaseDb(), 'users', uid, 'misionesCompletadas', misionId);
}

function referidoRef(codigo: string) {
  return doc(getFirebaseDb(), 'referidos', codigo);
}

export async function getPuntuacionGlobalFs(uid: string): Promise<PuntuacionGlobal | null> {
  try {
    const snap = await getDoc(puntuacionRef(uid));
    if (!snap.exists()) return null;
    return snap.data() as PuntuacionGlobal;
  } catch (e) {
    console.error('[Firestore] getPuntuacion error:', e);
    return null;
  }
}

export async function initPuntuacionFs(uid: string, codigo: string): Promise<void> {
  try {
    const snap = await getDoc(puntuacionRef(uid));
    if (snap.exists()) return;
    await setDoc(puntuacionRef(uid), {
      totalPuntos: 0,
      porFuente: { misiones: 0, vuelos: 0, referidos: 0 },
      codigoReferido: codigo,
      referidosUids: [],
      codigosUsados: [],
      updatedAt: serverTimestamp(),
    });
    // Registrar el código en la colección pública
    await setDoc(referidoRef(codigo), {
      uid,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.error('[Firestore] initPuntuacion error:', e);
  }
}

export async function sumarPuntosVueloFs(uid: string, puntos: number): Promise<void> {
  try {
    await setDoc(
      puntuacionRef(uid),
      {
        totalPuntos: increment(puntos),
        porFuente: { vuelos: increment(puntos) },
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (e) {
    console.error('[Firestore] sumarPuntosVuelo error:', e);
  }
}

export async function completarMisionFs(
  uid: string,
  mision: Omit<MisionCompletadaFs, 'completadaAt'>,
): Promise<void> {
  try {
    await setDoc(misionCompletadaRef(uid, mision.misionId), {
      ...mision,
      completadaAt: serverTimestamp(),
    });
    await setDoc(
      puntuacionRef(uid),
      {
        totalPuntos: increment(mision.puntosGanados),
        porFuente: { misiones: increment(mision.puntosGanados) },
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (e) {
    console.error('[Firestore] completarMision error:', e);
  }
}

export async function getMisionesCompletadasFs(uid: string): Promise<MisionCompletadaFs[]> {
  try {
    const snap = await getDocs(misionesCol(uid));
    return snap.docs.map((d) => d.data() as MisionCompletadaFs);
  } catch (e) {
    console.error('[Firestore] getMisionesCompletadas error:', e);
    return [];
  }
}

export async function buscarReferidoFs(codigo: string): Promise<ReferidoEntry | null> {
  try {
    const snap = await getDoc(referidoRef(codigo));
    if (!snap.exists()) return null;
    return snap.data() as ReferidoEntry;
  } catch (e) {
    console.error('[Firestore] buscarReferido error:', e);
    return null;
  }
}

export async function aplicarCodigoReferidoFs(
  uid: string,
  displayName: string,
  codigoIngresado: string,
  uidReferente: string,
  puntosAmbos: number,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const mySnap = await getDoc(puntuacionRef(uid));
    const myData = mySnap.exists() ? (mySnap.data() as PuntuacionGlobal) : null;

    if (myData?.referidoPor) return { ok: false, error: 'Ya usaste un código de referido.' };
    if (myData?.codigosUsados?.includes(codigoIngresado))
      return { ok: false, error: 'Este código ya fue aplicado.' };
    if (uidReferente === uid) return { ok: false, error: 'No podés usar tu propio código.' };

    // Sumar puntos al nuevo usuario
    await setDoc(
      puntuacionRef(uid),
      {
        totalPuntos: increment(puntosAmbos),
        porFuente: { referidos: increment(puntosAmbos) },
        referidoPor: uidReferente,
        codigosUsados: arrayUnion(codigoIngresado),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    // Sumar puntos al referente y agregar uid al listado
    const referenteSnap = await getDoc(puntuacionRef(uidReferente));
    const referenteData = referenteSnap.exists()
      ? (referenteSnap.data() as PuntuacionGlobal)
      : null;
    const cantReferidos = referenteData?.referidosUids?.length ?? 0;
    const bonusExtra = cantReferidos >= 5 ? 100 : 0;

    await setDoc(
      puntuacionRef(uidReferente),
      {
        totalPuntos: increment(puntosAmbos + bonusExtra),
        porFuente: { referidos: increment(puntosAmbos + bonusExtra) },
        referidosUids: arrayUnion(uid),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    void displayName; // para uso futuro en notificaciones

    return { ok: true };
  } catch (e) {
    console.error('[Firestore] aplicarCodigoReferido error:', e);
    return { ok: false, error: 'Error al aplicar el código. Intentá de nuevo.' };
  }
}
