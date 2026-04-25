import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/** Misma clave que ya usaba el hook (`Home`, etc.). */
export const PD_THEME_STORAGE_KEY = 'pd-theme';

function readIsDarkFromStorage(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(PD_THEME_STORAGE_KEY) !== 'light';
}

function applyDomTheme(isDark: boolean) {
  const root = document.documentElement;
  if (isDark) {
    root.classList.remove('pd-light');
    localStorage.setItem(PD_THEME_STORAGE_KEY, 'dark');
  } else {
    root.classList.add('pd-light');
    localStorage.setItem(PD_THEME_STORAGE_KEY, 'light');
  }
}

export type PdThemeContextValue = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<PdThemeContextValue | null>(null);

export function PdThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(readIsDarkFromStorage);

  useEffect(() => {
    applyDomTheme(isDark);
  }, [isDark]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== PD_THEME_STORAGE_KEY || e.storageArea !== localStorage) return;
      setIsDark(readIsDarkFromStorage());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((v) => !v);
  }, []);

  const value = useMemo(() => ({ isDark, toggleTheme }), [isDark, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function usePdTheme(): PdThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('usePdTheme debe usarse dentro de PdThemeProvider');
  }
  return ctx;
}
