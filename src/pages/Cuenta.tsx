import { useEffect, useId, useReducer, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, Link } from 'react-router-dom';
import { IonPage, IonContent } from '@ionic/react';
import { PdSubpageChrome } from '../components/PdSubpageChrome';
import { PdThemeToggle } from '../components/PdThemeToggle';
import { OrigenPaisFlagMedia } from '../components/OrigenPaisFlagMedia';
import { PdUserMenuTriggerFace } from '../components/PdUserMenuTriggerFace';
import { useAuth } from '../context/AuthContext';
import { getPersistedOrigenPaisId } from '../logic/aventuraStorage';
import { getOrigenPaisOpcionById } from '../logic/origenPaisResolve';
import { useFloatingChromeScroll } from '../hooks/useFloatingChromeScroll';
import {
  AVATAR_PRESETS,
  getAvatarChoice,
  resolveMenuTriggerAvatar,
  setAvatarChoice,
  type AvatarChoice,
} from '../logic/avatarPreference';
import { twemojiCdnPngUrl } from '../utils/twemojiCdnUrl';

function lockBodyScroll(lock: boolean) {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = lock ? 'hidden' : '';
}

export default function Cuenta() {
  const { chromeVisible, ionScrollProps } = useFloatingChromeScroll();
  const navigate = useNavigate();
  const { user, ready, logout, requestAccountDeletion } = useAuth();
  const [deletionMsg, setDeletionMsg] = useState<string | null>(null);
  const [avatarPick, setAvatarPick] = useState<AvatarChoice | null>(() => getAvatarChoice());
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const avatarModalTitleId = useId();
  const [, bumpOrigen] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    document.title = 'Mi cuenta – Para Dónde?';
  }, []);

  useEffect(() => {
    const bump = () => bumpOrigen();
    window.addEventListener('pd-origen-pais-changed', bump);
    return () => window.removeEventListener('pd-origen-pais-changed', bump);
  }, []);

  useEffect(() => {
    if (user) setAvatarPick(getAvatarChoice());
  }, [user]);

  useEffect(() => {
    lockBodyScroll(avatarModalOpen);
    return () => lockBodyScroll(false);
  }, [avatarModalOpen]);

  useEffect(() => {
    if (!avatarModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAvatarModalOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [avatarModalOpen]);

  if (!ready) {
    return (
      <IonPage className="pd-cuenta-page">
        <PdSubpageChrome onBack={() => navigate('/')} chromeVisible={chromeVisible} />
        <IonContent className="ion-padding pd-cuenta-ion-content" {...ionScrollProps}>
          <div className="pd-content pd-subpage-inner">
            <p className="pd-auth-lead">Cargando…</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!user) {
    return (
      <IonPage className="pd-cuenta-page">
        <PdSubpageChrome onBack={() => navigate(-1)} chromeVisible={chromeVisible} />
        <IonContent className="ion-padding pd-cuenta-ion-content" {...ionScrollProps}>
          <div className="pd-content pd-subpage-inner">
            <h1 className="pd-auth-page-title">Mi cuenta</h1>
            <p className="pd-auth-lead">
              Iniciá sesión o creá una cuenta con Google para guardar tus viajes y preferencias.
            </p>
            <div className="pd-auth-form pd-cuenta-auth-choice">
              <Link to="/login" className="pd-auth-submit">
                Iniciar sesión
              </Link>
              <Link to="/registro" className="pd-auth-submit pd-auth-submit--outline">
                Crear cuenta
              </Link>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const googleFotoDisponible = Boolean(user.photoURL?.trim());
  const googleSeleccionado =
    googleFotoDisponible && (avatarPick === null || avatarPick.mode === 'google');

  const aplicarGoogle = () => {
    const c: AvatarChoice = { mode: 'google' };
    setAvatarChoice(c);
    setAvatarPick(c);
  };

  const aplicarEmoji = (emoji: string) => {
    const c: AvatarChoice = { mode: 'emoji', emoji };
    setAvatarChoice(c);
    setAvatarPick(c);
  };

  const vistaPreviaMenu = resolveMenuTriggerAvatar(user);
  const origenPaisId = getPersistedOrigenPaisId();
  const origenOpcion = origenPaisId ? getOrigenPaisOpcionById(origenPaisId) : undefined;

  const handleBaja = async () => {
    const ok = window.confirm(
      '¿Querés solicitar la baja de tu cuenta? Hoy es solo un aviso: en una versión futura podremos eliminar tus datos según la ley aplicable.',
    );
    if (!ok) return;
    const res = await requestAccountDeletion();
    setDeletionMsg(res.message);
  };

  const openAvatarModal = () => {
    setAvatarPick(getAvatarChoice());
    setAvatarModalOpen(true);
  };

  const avatarModal =
    avatarModalOpen &&
    typeof document !== 'undefined' &&
    createPortal(
      <div className="pd-cuenta-avatar-modal-root">
        <button
          type="button"
          className="pd-cuenta-avatar-modal-backdrop"
          aria-label="Cerrar"
          onClick={() => setAvatarModalOpen(false)}
        />
        <div
          className="pd-cuenta-avatar-modal-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby={avatarModalTitleId}
        >
          <div className="pd-cuenta-avatar-modal-handle" aria-hidden />
          <h2 id={avatarModalTitleId} className="pd-cuenta-avatar-modal-title">
            Foto o ícono
          </h2>
          <p className="pd-cuenta-avatar-modal-lead">Así te mostramos en la app.</p>
          {googleFotoDisponible ? (
            <button
              type="button"
              className={`pd-cuenta-avatar-option${googleSeleccionado ? ' pd-cuenta-avatar-option--selected' : ''}`}
              onClick={aplicarGoogle}
            >
              <span className="pd-cuenta-avatar-option-img-wrap">
                <img
                  src={user.photoURL!}
                  alt=""
                  className="pd-cuenta-avatar-option-img"
                  referrerPolicy="no-referrer"
                />
              </span>
              <span className="pd-cuenta-avatar-option-label">Foto de Google</span>
            </button>
          ) : null}
          <p className="pd-cuenta-avatar-grid-title">Íconos</p>
          <div className="pd-cuenta-avatar-grid" role="list">
            {AVATAR_PRESETS.map((em) => {
              const sel = avatarPick?.mode === 'emoji' && avatarPick.emoji === em;
              return (
                <button
                  key={em}
                  type="button"
                  role="listitem"
                  className={`pd-cuenta-avatar-emoji${sel ? ' pd-cuenta-avatar-emoji--selected' : ''}`}
                  onClick={() => aplicarEmoji(em)}
                  aria-label={`Elegir avatar ${em}`}
                >
                  <img
                    src={twemojiCdnPngUrl(em)}
                    alt=""
                    className="pd-cuenta-avatar-emoji-img pd-cuenta-avatar-emoji-img--twemoji"
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className="pd-auth-submit pd-cuenta-avatar-modal-done"
            onClick={() => setAvatarModalOpen(false)}
          >
            Listo
          </button>
        </div>
      </div>,
      document.body,
    );

  return (
    <IonPage className="pd-cuenta-page">
      {avatarModal}
      <PdSubpageChrome onBack={() => navigate(-1)} chromeVisible={chromeVisible} />
      <IonContent className="ion-padding pd-cuenta-ion-content" {...ionScrollProps}>
        <div className="pd-content pd-subpage-inner pd-cuenta-inner">
          <div className="pd-cuenta-hero">
            <PdUserMenuTriggerFace avatar={vistaPreviaMenu} className="pd-cuenta-hero-face" />
            <button
              type="button"
              className="pd-cuenta-change-avatar-btn"
              onClick={openAvatarModal}
              aria-label="Cambiar foto o ícono de perfil"
            >
              Cambiar
            </button>
          </div>

          <div className="pd-cuenta-card">
            <div className="pd-cuenta-field">
              <p className="pd-cuenta-label">Nombre</p>
              <p className="pd-cuenta-value">{user.displayName}</p>
            </div>
            <div className="pd-cuenta-field">
              <p className="pd-cuenta-label">Correo</p>
              <p className="pd-cuenta-value pd-cuenta-value--multiline">{user.email}</p>
            </div>
            <div className="pd-cuenta-field">
              <p className="pd-cuenta-label">País de residencia</p>
              {origenOpcion && origenPaisId ? (
                <div className="pd-cuenta-origen-row">
                  <OrigenPaisFlagMedia opcionId={origenPaisId} className="pd-origen-pais-resumen-flag" />
                  <span className="pd-cuenta-value pd-cuenta-origen-nombre">{origenOpcion.label}</span>
                </div>
              ) : (
                <p className="pd-cuenta-value pd-cuenta-origen-pending">Elegilo en inicio o en la aventura.</p>
              )}
            </div>
          </div>

          <div className="pd-cuenta-theme-row" role="group" aria-label="Tema de la app">
            <span className="pd-cuenta-theme-label">Modo claro u oscuro</span>
            <PdThemeToggle className="pd-cuenta-theme-toggle" />
          </div>

          <div className="pd-cuenta-below-card">
            <button
              type="button"
              className="pd-auth-submit pd-auth-submit--outline pd-cuenta-logout-btn"
              onClick={() => {
                void (async () => {
                  await logout();
                  navigate('/', { replace: true });
                })();
              }}
            >
              Cerrar sesión
            </button>

            <section className="pd-cuenta-danger" aria-label="Baja de cuenta">
              <button
                type="button"
                className="pd-cuenta-baja-btn"
                onClick={handleBaja}
                aria-describedby={deletionMsg ? 'pd-cuenta-deletion-msg' : undefined}
              >
                Dar de baja mi cuenta
              </button>
              {deletionMsg ? (
                <p id="pd-cuenta-deletion-msg" className="pd-cuenta-deletion-msg">
                  {deletionMsg}
                </p>
              ) : null}
            </section>

            <p className="pd-auth-footer-link pd-cuenta-footer-terms">
              <Link to="/terminos">Términos y condiciones</Link>
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
