import { useEffect, useReducer, useState } from 'react';
import { createPortal } from 'react-dom';
import { IonIcon } from '@ionic/react';
import { logOutOutline, menuOutline } from 'ionicons/icons';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { favoriteDestinoCount } from '../logic/destinosFavoritosStorage';
import { PdThemeToggle } from './PdThemeToggle';
import { getPuntuacionLocal } from '../logic/puntuacionStorage';
import { getNivelParaPuntos } from '../data/reputacion';
import { usePdTheme } from '../hooks/usePdTheme';

function lockBody(lock: boolean) {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = lock ? 'hidden' : '';
}

function MenuRepSection({ uid, onClose }: { uid: string; onClose: () => void }) {
  const [, bump] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    const h = () => bump();
    window.addEventListener('pd-puntuacion-changed', h);
    return () => window.removeEventListener('pd-puntuacion-changed', h);
  }, []);

  const puntuacion = getPuntuacionLocal();
  const totalPuntos = puntuacion?.totalPuntos ?? 0;
  const nivel = getNivelParaPuntos(totalPuntos);

  return (
    <div className="pd-user-menu-rep">
      <Link to="/reputacion" className="pd-user-menu-rep-nivel" onClick={onClose}>
        <span className="pd-user-menu-rep-emoji" aria-hidden
          style={{ filter: `drop-shadow(0 0 4px ${nivel.color})` }}>
          {nivel.emoji}
        </span>
        <div className="pd-user-menu-rep-info">
          <span className="pd-user-menu-rep-nombre" style={{ color: nivel.color }}>
            {nivel.nombre}
          </span>
          <span className="pd-user-menu-rep-pts">{totalPuntos} pts</span>
        </div>
        <span className="pd-user-menu-rep-arrow" aria-hidden>›</span>
      </Link>
    </div>
  );
}

export function PdUserMenu() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = usePdTheme();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [, bumpFavs] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    const bump = () => bumpFavs();
    window.addEventListener('pd-favoritos-changed', bump);
    return () => {
      window.removeEventListener('pd-favoritos-changed', bump);
    };
  }, []);

  const nViajes = favoriteDestinoCount();

  useEffect(() => {
    lockBody(open);
    return () => lockBody(false);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const close = () => setOpen(false);

  return (
    <>
      <div className="pd-user-menu-cluster">
        <button
          type="button"
          className="pd-user-menu-theme-btn"
          onClick={toggleTheme}
          aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
        {user ? (
          <button
            type="button"
            className="pd-destino-floating-btn pd-destino-floating-btn--icon-only pd-user-menu-logout-btn"
            onClick={() => void logout()}
            aria-label="Cerrar sesión"
          >
            <IonIcon icon={logOutOutline} aria-hidden="true" />
          </button>
        ) : null}
        <button
          type="button"
          className="pd-destino-floating-btn pd-destino-floating-menu pd-destino-floating-btn--icon-only"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-controls={open ? 'pd-user-menu-panel' : undefined}
        >
          <IonIcon icon={menuOutline} />
        </button>
      </div>

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="pd-user-menu-portal-root">
            <button
              type="button"
              className="pd-user-menu-backdrop"
              aria-label="Cerrar menú"
              onClick={close}
            />
            <div
              id="pd-user-menu-panel"
              className="pd-user-menu-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Navegación y cuenta"
            >
              <div className="pd-user-menu-handle" aria-hidden />
              {user && (
                <p className="pd-user-menu-sub">
                  <strong>{user.displayName}</strong>
                  <br />
                  <span className="pd-user-menu-email">{user.email}</span>
                </p>
              )}

              {user && <MenuRepSection uid={user.uid} onClose={close} />}

              <nav className="pd-user-menu-links" aria-label="Opciones del menú">
                <Link to="/" className="pd-user-menu-link" onClick={close}>
                  Inicio
                </Link>
                <Link to="/viajes" className="pd-user-menu-link pd-user-menu-link--viajes" onClick={close}>
                  Mis viajes
                  {nViajes > 0 ? (
                    <span className="pd-user-menu-link-badge" aria-hidden>
                      {nViajes > 99 ? '99+' : nViajes}
                    </span>
                  ) : null}
                </Link>
                {user && (
                  <Link to="/reputacion" className="pd-user-menu-link" onClick={close}>
                    Mi reputación
                  </Link>
                )}
                <Link to="/cuenta" className="pd-user-menu-link" onClick={close}>
                  Mi cuenta
                </Link>
                <Link to="/terminos" className="pd-user-menu-link" onClick={close}>
                  Términos y condiciones
                </Link>
              </nav>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
