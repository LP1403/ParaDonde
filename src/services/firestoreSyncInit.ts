/**
 * Inicialización de la sesión Firestore al hacer login.
 *
 * Al login:
 *   1. Crea el perfil en Firestore si es usuario nuevo.
 *   2. Carga los datos de Firestore y los escribe en localStorage
 *      (Firestore es la fuente de verdad cuando hay sesión).
 *
 * Al logout:
 *   1. Limpia los keys de localStorage gestionados por Firestore.
 */

import {
  createUserProfile,
  getUserProfile,
  getDestinosFavoritos,
  getAllVuelosFs,
  getAventuraProgressFs,
} from './firestoreService';
import type { PdUser } from '../context/AuthContext';

// Keys de localStorage que Firestore gestiona cuando hay sesión
const FAVORITES_KEY = 'paradonde_destinos_favoritos_v1';
const VUELOS_KEY = 'paradonde_vuelo_favorito_por_slug_v2';
const PROGRESS_KEY = 'paradonde_aventura_progress_v1';
const AVATAR_KEY = 'paradonde_avatar_choice_v1';
const ORIGEN_KEY = 'paradonde_origen_pais_preferido_v1';

export async function initUserFirestoreSession(uid: string, pdUser: PdUser): Promise<void> {
  // 1. Perfil: crear si no existe
  const profile = await getUserProfile(uid);
  if (!profile) {
    await createUserProfile(uid, {
      displayName: pdUser.displayName,
      email: pdUser.email,
      photoURL: pdUser.photoURL,
    });
  } else {
    // Restaurar preferencias del perfil guardado en Firestore
    if (profile.avatarChoice) {
      try {
        localStorage.setItem(AVATAR_KEY, JSON.stringify(profile.avatarChoice));
      } catch { /* ignore */ }
    }
    if (profile.origenPaisId) {
      try {
        localStorage.setItem(ORIGEN_KEY, profile.origenPaisId);
        window.dispatchEvent(new CustomEvent('pd-origen-pais-changed'));
      } catch { /* ignore */ }
    }
  }

  // 2. Destinos favoritos: cargar desde Firestore → localStorage
  const slugs = await getDestinosFavoritos(uid);
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(slugs));
    window.dispatchEvent(new CustomEvent('pd-favoritos-changed'));
  } catch { /* ignore */ }

  // 3. Vuelos: cargar desde Firestore → localStorage
  const vuelos = await getAllVuelosFs(uid);
  try {
    localStorage.setItem(VUELOS_KEY, JSON.stringify(vuelos));
    window.dispatchEvent(new CustomEvent('pd-vuelo-favorito-changed'));
  } catch { /* ignore */ }

  // 4. Progreso aventura: cargar desde Firestore → localStorage
  const progress = await getAventuraProgressFs(uid);
  if (progress) {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch { /* ignore */ }
  } else {
    // Usuario nuevo o sin progreso: limpiar localStorage
    try {
      localStorage.removeItem(PROGRESS_KEY);
    } catch { /* ignore */ }
  }
}

export function clearUserFirestoreSession(): void {
  // Al cerrar sesión, limpiar los datos sincronizados con Firestore
  // para que el dispositivo quede limpio para el próximo usuario
  try {
    localStorage.removeItem(FAVORITES_KEY);
    localStorage.removeItem(VUELOS_KEY);
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(AVATAR_KEY);
    localStorage.removeItem(ORIGEN_KEY);

    window.dispatchEvent(new CustomEvent('pd-favoritos-changed'));
    window.dispatchEvent(new CustomEvent('pd-vuelo-favorito-changed'));
    window.dispatchEvent(new CustomEvent('pd-origen-pais-changed'));
    window.dispatchEvent(new CustomEvent('pd-avatar-changed'));
  } catch { /* ignore */ }
}
