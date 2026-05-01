/**
 * Firebase Cloud Messaging — gestión de tokens de notificación push.
 *
 * Requiere:
 *  - `public/firebase-messaging-sw.js` (service worker)
 *  - VITE_FIREBASE_VAPID_KEY en .env (clave VAPID del proyecto Firebase)
 */

import { getToken } from 'firebase/messaging';
import { getFirebaseMessaging } from '../firebase';
import { saveFcmTokenFs } from './firestoreService';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined;

/**
 * Solicita permiso de notificaciones al usuario y guarda el token FCM en Firestore.
 * Devuelve el token o null si el usuario rechazó el permiso o no hay soporte.
 */
export async function requestAndSaveFcmToken(uid: string): Promise<string | null> {
  try {
    const messaging = getFirebaseMessaging();
    if (!messaging) return null;

    if (!VAPID_KEY) {
      console.warn('[FCM] Falta VITE_FIREBASE_VAPID_KEY en .env — notificaciones deshabilitadas.');
      return null;
    }

    // Registrar el service worker manualmente para evitar conflictos con Vite
    const swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swReg,
    });

    if (token) {
      await saveFcmTokenFs(uid, token, 'web');
    }

    return token || null;
  } catch (err) {
    console.warn('[FCM] No se pudo obtener token:', err);
    return null;
  }
}

/**
 * Pide permiso de notificaciones solo si aún no fue concedido/denegado.
 * Llama a requestAndSaveFcmToken si el permiso es granted.
 */
export async function initFcmForUser(uid: string): Promise<void> {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission === 'denied') return;

  if (Notification.permission === 'granted') {
    await requestAndSaveFcmToken(uid);
    return;
  }

  // Si aún no fue pedido, pedir permiso (se llama cuando el usuario guarda su primer vuelo)
  const perm = await Notification.requestPermission();
  if (perm === 'granted') {
    await requestAndSaveFcmToken(uid);
  }
}
