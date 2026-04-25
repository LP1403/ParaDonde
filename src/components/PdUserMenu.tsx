import { useEffect, useId, useReducer, useState } from 'react';
import { createPortal } from 'react-dom';
import { IonIcon } from '@ionic/react';
import { menuOutline } from 'ionicons/icons';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { favoriteDestinoCount } from '../logic/destinosFavoritosStorage';
import { PdThemeToggle } from './PdThemeToggle';

function lockBody(lock: boolean) {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = lock ? 'hidden' : '';
}

export function PdUserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const titleId = useId();
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
        <span className="pd-destino-floating-text">Menú</span>
      </button>

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
              aria-labelledby={titleId}
            >
              <div className="pd-user-menu-handle" aria-hidden />
              <p id={titleId} className="pd-user-menu-title">
                Menú
              </p>
              {user && (
                <p className="pd-user-menu-sub">
                  <strong>{user.displayName}</strong>
                  <br />
                  <span className="pd-user-menu-email">{user.email}</span>
                </p>
              )}

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
                {user ? (
                  <>
                    <Link to="/cuenta" className="pd-user-menu-link" onClick={close}>
                      Mi cuenta
                    </Link>
                    <button
                      type="button"
                      className="pd-user-menu-link pd-user-menu-link--btn"
                      onClick={() => {
                        void logout();
                        close();
                      }}
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="pd-user-menu-link" onClick={close}>
                      Iniciar sesión
                    </Link>
                    <Link to="/registro" className="pd-user-menu-link" onClick={close}>
                      Crear cuenta
                    </Link>
                  </>
                )}
                <div className="pd-user-menu-theme-row pd-user-menu-theme-row--minimal" role="group" aria-label="Tema de la app">
                  <PdThemeToggle className="pd-user-menu-theme-toggle pd-user-menu-theme-toggle--minimal" />
                </div>
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
