import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type PdUser = {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
};

type AuthContextValue = {
  user: PdUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  /** Reservado para Firebase + backend; hoy solo muestra mensaje informativo */
  requestAccountDeletion: () => Promise<{ ok: boolean; message: string }>;
};

const STORAGE_KEY = 'paradonde_auth_user_v1';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PdUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PdUser;
        if (parsed?.uid && parsed?.email) setUser(parsed);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const persist = useCallback((u: PdUser | null) => {
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
    setUser(u);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const e = email.trim().toLowerCase();
      if (!e || !e.includes('@')) throw new Error('Ingresá un correo válido.');
      if (password.length < 4) throw new Error('La contraseña debe tener al menos 4 caracteres.');
      persist({
        uid: `mock_${Date.now().toString(36)}_${e.slice(0, 8)}`,
        displayName: e.split('@')[0] ?? 'Viajero',
        email: e,
      });
    },
    [persist],
  );

  const register = useCallback(
    async (email: string, password: string, displayName: string) => {
      const e = email.trim().toLowerCase();
      if (!e || !e.includes('@')) throw new Error('Ingresá un correo válido.');
      if (password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.');
      const name = displayName.trim() || (e.split('@')[0] ?? 'Viajero');
      persist({
        uid: `mock_${Date.now()}`,
        displayName: name,
        email: e,
      });
    },
    [persist],
  );

  const logout = useCallback(() => persist(null), [persist]);

  const requestAccountDeletion = useCallback(async () => {
    return {
      ok: false,
      message:
        'La baja definitiva de cuenta estará disponible cuando activemos la cuenta con Firebase y los requisitos de las tiendas oficiales. Por ahora podés cerrar sesión en cualquier momento.',
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      login,
      register,
      logout,
      requestAccountDeletion,
    }),
    [user, ready, login, register, logout, requestAccountDeletion],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
