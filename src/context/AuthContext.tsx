import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Capacitor } from '@capacitor/core';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from 'firebase/auth';
import { getFirebaseAuth } from '../firebase';
import { consumeFirebaseRedirectResult } from '../logic/authRedirect';
import { replaceDevLocalhostMissingPort } from '../utils/fixDevLocalhostOrigin';

export type PdUser = {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
};

function mapFirebaseUser(u: User): PdUser {
  return {
    uid: u.uid,
    displayName: u.displayName || u.email?.split('@')[0] || 'Viajero',
    email: u.email ?? '',
    photoURL: u.photoURL ?? undefined,
  };
}

type AuthContextValue = {
  user: PdUser | null;
  ready: boolean;
  /** Web: popup. Android/iOS (Capacitor): redirect al mismo dominio auth. */
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  requestAccountDeletion: () => Promise<{ ok: boolean; message: string }>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PdUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!import.meta.env.VITE_FIREBASE_API_KEY) {
      setReady(true);
      return;
    }

    const auth = getFirebaseAuth();
    void consumeFirebaseRedirectResult(auth);
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser ? mapFirebaseUser(fbUser) : null);
      setReady(true);
    });
    return () => unsub();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!import.meta.env.VITE_FIREBASE_API_KEY?.trim()) {
      throw new Error('Falta VITE_FIREBASE_API_KEY en .env (copiá la API key de Firebase → Configuración del proyecto).');
    }
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    provider.setCustomParameters({ prompt: 'select_account' });

    if (Capacitor.isNativePlatform()) {
      if (replaceDevLocalhostMissingPort()) {
        return;
      }
      await signInWithRedirect(auth, provider);
      return;
    }
    await signInWithPopup(auth, provider);
  }, []);

  const logout = useCallback(async () => {
    if (!import.meta.env.VITE_FIREBASE_API_KEY?.trim()) return;
    await signOut(getFirebaseAuth());
  }, []);

  const requestAccountDeletion = useCallback(async () => {
    return {
      ok: false,
      message:
        'La baja definitiva de cuenta la habilitaremos con Firebase y las políticas de las tiendas. Por ahora podés cerrar sesión.',
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      signInWithGoogle,
      logout,
      requestAccountDeletion,
    }),
    [user, ready, signInWithGoogle, logout, requestAccountDeletion],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
