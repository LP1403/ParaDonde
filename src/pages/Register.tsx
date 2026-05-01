import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IonPage, IonContent } from '@ionic/react';
import { PdSubpageChrome } from '../components/PdSubpageChrome';
import { PdGoogleSignInButton } from '../components/PdGoogleSignInButton';
import { useFloatingChromeScroll } from '../hooks/useFloatingChromeScroll';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { chromeVisible, ionScrollProps } = useFloatingChromeScroll();
  const navigate = useNavigate();
  const { signInWithGoogle, user, ready } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Crear cuenta – Para Dónde?';
  }, []);

  useEffect(() => {
    if (ready && user) navigate('/', { replace: true });
  }, [ready, user, navigate]);

  const configured = Boolean(import.meta.env.VITE_FIREBASE_API_KEY?.trim());

  return (
    <IonPage>
      <PdSubpageChrome onBack={() => navigate(-1)} chromeVisible={chromeVisible} />
      <IonContent className="ion-padding" {...ionScrollProps}>
        <div className="pd-content pd-subpage-inner">
          <h1 className="pd-auth-page-title">Crear cuenta</h1>
          <p className="pd-auth-lead">
            Usamos Google para crear tu cuenta de forma segura. Si ya tenés sesión en el navegador, podés elegir otra cuenta con “Continuar con Google”.
          </p>

          <div className="pd-auth-form">
            {error ? <p className="pd-auth-error">{error}</p> : null}
            {!configured ? (
              <p className="pd-auth-error">
                Falta configurar <code className="pd-auth-code">VITE_FIREBASE_API_KEY</code> en{' '}
                <code className="pd-auth-code">.env</code>.
              </p>
            ) : null}
            <PdGoogleSignInButton
              signInWithGoogle={signInWithGoogle}
              onError={setError}
              disabled={!configured}
            />
          </div>

          <p className="pd-auth-footer-link">
            ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
}
