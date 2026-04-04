import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IonPage, IonContent } from '@ionic/react';
import { PdSubpageChrome } from '../components/PdSubpageChrome';
import { useAuth } from '../context/AuthContext';
import { useFloatingChromeScroll } from '../hooks/useFloatingChromeScroll';

export default function Cuenta() {
  const { chromeVisible, ionScrollProps } = useFloatingChromeScroll();
  const navigate = useNavigate();
  const { user, ready, logout, requestAccountDeletion } = useAuth();
  const [deletionMsg, setDeletionMsg] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Mi cuenta – Para Dónde?';
  }, []);

  useEffect(() => {
    if (ready && !user) navigate('/login', { replace: true });
  }, [ready, user, navigate]);

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
            <p className="pd-cuenta-label">ID interno</p>
            <p className="pd-cuenta-value pd-cuenta-mono">{user.uid}</p>
            <p className="pd-cuenta-hint">
              Con Firebase, acá veremos foto de perfil y método de inicio de sesión (Google, etc.).
            </p>
          </div>

          <button type="button" className="pd-auth-submit pd-auth-submit--outline" onClick={() => { logout(); navigate('/', { replace: true }); }}>
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
