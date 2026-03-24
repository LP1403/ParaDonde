import { useCallback, useEffect, useState } from 'react';

/**
 * Tema global: oscuro por defecto, `html.pd-light` para claro.
 * Misma clave que Home (`localStorage.pd-theme`).
 */
export function usePdTheme() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('pd-theme') !== 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('pd-light');
      localStorage.setItem('pd-theme', 'dark');
    } else {
      root.classList.add('pd-light');
      localStorage.setItem('pd-theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark((v) => !v);
  }, []);

  return { isDark, toggleTheme };
}
