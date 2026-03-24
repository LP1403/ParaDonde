import { usePdTheme } from '../hooks/usePdTheme';

/** Mismo control que Home (track + thumb), sin posición fija. */
export function PdThemeToggle({ className = '' }: { className?: string }) {
  const { isDark, toggleTheme } = usePdTheme();

  return (
    <button
      type="button"
      className={`pd-toggle-btn pd-subpage-theme-toggle ${className}`.trim()}
      onClick={toggleTheme}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <span className="pd-toggle-icon">{isDark ? '🌙' : '☀️'}</span>
      <span className={`pd-toggle-track${isDark ? ' pd-toggle-track--dark' : ''}`}>
        <span className="pd-toggle-thumb" />
      </span>
      <span className="pd-toggle-icon">{isDark ? '☀️' : '🌙'}</span>
    </button>
  );
}
