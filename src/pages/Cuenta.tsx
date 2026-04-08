import { useEffect, useReducer, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IonPage, IonContent } from '@ionic/react';
import { PdSubpageChrome } from '../components/PdSubpageChrome';
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

export default function Cuenta() {
  const { chromeVisible, ionScrollProps } = useFloatingChromeScroll();
  const navigate = useNavigate();
  const { user, ready, logout, requestAccountDeletion } = useAuth();
  const [deletionMsg, setDeletionMsg] = useState<string | null>(null);
  const [avatarPick, setAvatarPick] = useState<AvatarChoice | null>(() => getAvatarChoice());
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
    if (ready && !user) navigate('/login', { replace: true });
  }, [ready, user, navigate]);

  useEffect(() => {
    if (user) setAvatarPick(getAvatarChoice());
  }, [user]);

  if (!ready || !user) {
    return (
      <IonPage>
        <PdSubpageChrome onBack={() => navigate('/')} chromeVisible={chromeVisible} />
        <IonContent className="ion-padding" {...ionScrollProps}>
          <div className="pd-content pd-subpage-inner">
            <p className="pd-auth-lead">Cargando…</p>
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

  return (
    <IonPage>
      <PdSubpageChrome onBack={() => navigate(-1)} chromeVisible={chromeVisible} />
      <IonContent className="ion-padding" {...ionScrollProps}>
        <div className="pd-content pd-subpage-inner">
          <h1 className="pd-auth-page-title">Mi cuenta</h1>

          <div className="pd-cuenta-card">
            <p className="pd-cuenta-label">Nombre</p>
            <p className="pd-cuenta-value">{user.displayName}</p>
            <p className="pd-cuenta-label">Correo</p>
            <p className="pd-cuenta-value">{user.email}</p>
            <p className="pd-cuenta-label">País de residencia</p>
            {origenOpcion && origenPaisId ? (
              <div className="pd-cuenta-origen-row">
                <OrigenPaisFlagMedia opcionId={origenPaisId} className="pd-origen-pais-resumen-flag" />
                <span className="pd-cuenta-value pd-cuenta-origen-nombre">{origenOpcion.label}</span>
              </div>
            ) : (
              <p className="pd-cuenta-value pd-cuenta-origen-pending">
                Lo definís en la aventura o en el inicio, al elegir desde dónde viajás.
              </p>
            )}
          </div>

          <section className="pd-cuenta-avatar" aria-labelledby="pd-cuenta-avatar-title">
            <h2 id="pd-cuenta-avatar-title" className="pd-cuenta-avatar-title">
              Tu foto o ícono de perfil
            </h2>
            <p className="pd-auth-lead pd-cuenta-avatar-lead">
              Lo guardamos para tu cuenta. El botón del menú en la barra superior solo muestra el ícono de menú; si entraste
              con Google y tenés foto, podés usarla acá o elegí un ícono.
            </p>
            <div className="pd-cuenta-avatar-preview">
              <span className="pd-cuenta-avatar-preview-label">Vista previa</span>
              <PdUserMenuTriggerFace avatar={vistaPreviaMenu} className="pd-cuenta-avatar-preview-face" />
            </div>
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
                    aria-label={`Avatar ${em}`}
                  >
                    {em}
                  </button>
                );
              })}
            </div>
          </section>

          <button
            type="button"
            className="pd-auth-submit pd-auth-submit--outline"
            onClick={() => {
              void (async () => {
                await logout();
                navigate('/', { replace: true });
              })();
            }}
          >
            Cerrar sesión
          </button>

          <section className="pd-cuenta-danger" aria-labelledby="pd-cuenta-baja-title">
            <h2 id="pd-cuenta-baja-title" className="pd-cuenta-danger-title">
              Zona sensible
            </h2>
            <p className="pd-auth-lead">
              Las tiendas oficiales suelen exigir una forma clara de dar de baja la cuenta. Reservamos este botón para cuando tengamos backend y borrado acorde a la normativa.
            </p>
            <button type="button" className="pd-cuenta-baja-btn" onClick={handleBaja}>
              Dar de baja mi cuenta
            </button>
            {deletionMsg ? <p className="pd-cuenta-deletion-msg">{deletionMsg}</p> : null}
          </section>

          <p className="pd-auth-footer-link">
            <Link to="/terminos">Términos y condiciones</Link>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
}
