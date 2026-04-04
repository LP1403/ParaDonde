import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Variant = 'home' | 'subpage';

type Props = {
  variant?: Variant;
};

function lockBody(lock: boolean) {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = lock ? 'hidden' : '';
}

export function PdUserMenu({ variant = 'home' }: Props) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const location = useLocation();

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
        className={`pd-user-menu-trigger${variant === 'subpage' ? ' pd-user-menu-trigger--subpage' : ''}`}
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={open ? 'pd-user-menu-panel' : undefined}
      >
        <span className="pd-user-menu-trigger-icon" aria-hidden>
          {user ? '✓' : '👤'}
        </span>
        <span className="pd-user-menu-trigger-label">Cuenta</span>
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
                Tu cuenta
              </p>
              {user && (
                <p className="pd-user-menu-sub">
                  <strong>{user.displayName}</strong>
                  <br />
                  <span className="pd-user-menu-email">{user.email}</span>
                </p>
              )}

              <nav className="pd-user-menu-links" aria-label="Cuenta y legal">
                {user ? (
                  <>
                    <Link to="/cuenta" className="pd-user-menu-link" onClick={close}>
                      Mis datos
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
