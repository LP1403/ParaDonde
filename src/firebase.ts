import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
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

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = initializeApp(firebaseConfig);
    if (typeof window !== 'undefined' && firebaseConfig.apiKey) {
      analytics = getAnalytics(app);
    }
  }
  return app;
}

export function getFirebaseAnalytics(): Analytics | null {
  if (!app) getFirebaseApp();
  return analytics;
}
