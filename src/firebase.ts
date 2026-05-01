import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getMessaging, type Messaging } from 'firebase/messaging';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
  authDomain: 'para-donde.firebaseapp.com',
  projectId: 'para-donde',
  storageBucket: 'para-donde.firebasestorage.app',
  messagingSenderId: '788473981937',
  appId: '1:788473981937:web:90c213f5b180c3a1a03250',
  measurementId: 'G-LKPVYQJETL',
};

let app: FirebaseApp;
let analytics: Analytics | null = null;
let auth: Auth | undefined;
let db: Firestore | undefined;
let messaging: Messaging | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = initializeApp(firebaseConfig);
    if (typeof window !== 'undefined' && firebaseConfig.apiKey) {
      try {
        analytics = getAnalytics(app);
      } catch {
        analytics = null;
      }
    }
  }
  return app;
}

export function getFirebaseAnalytics(): Analytics | null {
  if (!app) getFirebaseApp();
  return analytics;
}

/** Auth (Google, etc.). Requiere `VITE_FIREBASE_API_KEY` y proveedor habilitado en consola. */
export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

/** Firestore database. */
export function getFirebaseDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
}

/** Firebase Cloud Messaging. Solo disponible en navegadores con soporte de SW. */
export function getFirebaseMessaging(): Messaging | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!messaging) {
      messaging = getMessaging(getFirebaseApp());
    }
    return messaging;
  } catch {
    return null;
  }
}
